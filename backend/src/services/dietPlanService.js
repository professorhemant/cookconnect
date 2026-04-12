const { MenuItem, NutritionRequirement, FamilyMember, DietPlan, DietPlanDay, DietPlanDayItem } = require('../models');
const { Op } = require('sequelize');

function addDays(dateStr, days) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
}

async function getFamilyCalorieTarget(userId) {
  const members = await FamilyMember.findAll({ where: { user_id: userId } });
  if (!members.length) return { min: 1800, max: 2200 };

  let totalMin = 0, totalMax = 0;
  for (const member of members) {
    const req = await NutritionRequirement.findOne({
      where: {
        age_min: { [Op.lte]: member.age },
        age_max: { [Op.gte]: member.age },
        [Op.or]: [{ gender: member.gender }, { gender: 'both' }],
        activity_level: member.activity_level
      }
    });
    if (req) {
      totalMin += req.calories_min;
      totalMax += req.calories_max;
    } else {
      totalMin += 1800;
      totalMax += 2200;
    }
  }

  const count = members.length;
  return {
    min: Math.round(totalMin / count),
    max: Math.round(totalMax / count)
  };
}

function pickNonRepeating(items, recentIds, mealType) {
  const available = items.filter(i => i.meal_type === mealType && !recentIds.has(i.id));
  if (available.length === 0) {
    const fallback = items.filter(i => i.meal_type === mealType);
    return fallback[Math.floor(Math.random() * fallback.length)] || null;
  }
  return available[Math.floor(Math.random() * available.length)];
}

async function generatePlan(userId, planType, startDate, preferences = {}) {
  const { isVegetarian, maxCaloriesPerDay, cuisineTypes, preferredBreakfastIds, preferredLunchIds, preferredDinnerIds, dailyAssignments, selectedOnly } = preferences;

  console.log('[generatePlan] selectedOnly:', selectedOnly, '| dailyAssignments count:', dailyAssignments?.length ?? 0);

  // selectedOnly: only create days that have explicit assignments, no auto-fill
  const selectedDayIndices = selectedOnly && dailyAssignments && dailyAssignments.length > 0
    ? [...new Set(dailyAssignments.map(a => a.dayIndex))].sort((a, b) => a - b)
    : null;

  console.log('[generatePlan] selectedDayIndices:', selectedDayIndices);

  const numDays = selectedDayIndices ? selectedDayIndices.length : (planType === 'monthly' ? 30 : 7);
  const endDate = selectedDayIndices
    ? addDays(startDate, selectedDayIndices[selectedDayIndices.length - 1])
    : addDays(startDate, numDays - 1);

  console.log('[generatePlan] numDays:', numDays, '| endDate:', endDate);

  const calorieTarget = await getFamilyCalorieTarget(userId);
  const effectiveMax = maxCaloriesPerDay || calorieTarget.max;

  const where = {};
  if (isVegetarian) where.is_vegetarian = true;
  if (cuisineTypes && cuisineTypes.length > 0) {
    where.cuisine_type = { [Op.in]: cuisineTypes };
  }

  const allItems = await MenuItem.findAll({ where });

  if (allItems.length < 3) {
    throw new Error('Not enough menu items match the preferences. Please broaden your criteria.');
  }

  // Use preferred selections if provided, else use all items of that type
  const breakfastItems = (preferredBreakfastIds && preferredBreakfastIds.length > 0)
    ? allItems.filter(i => i.meal_type === 'breakfast' && preferredBreakfastIds.includes(i.id))
    : allItems.filter(i => i.meal_type === 'breakfast');

  // Salad pools — fetched without cuisine filter so they always appear
  const allSalads = await MenuItem.findAll({ where: { sub_category: 'Salad' } });
  const lunchSalads  = allSalads.filter(i => i.meal_type === 'lunch');
  const dinnerSalads = allSalads.filter(i => i.meal_type === 'dinner');

  const lunchItems = (preferredLunchIds && preferredLunchIds.length > 0)
    ? allItems.filter(i => i.meal_type === 'lunch' && i.sub_category !== 'Salad' && preferredLunchIds.includes(i.id))
    : allItems.filter(i => i.meal_type === 'lunch' && i.sub_category !== 'Salad');

  const dinnerItems = (preferredDinnerIds && preferredDinnerIds.length > 0)
    ? allItems.filter(i => i.meal_type === 'dinner' && i.sub_category !== 'Salad' && preferredDinnerIds.includes(i.id))
    : allItems.filter(i => i.meal_type === 'dinner' && i.sub_category !== 'Salad');

  if (!breakfastItems.length || !lunchItems.length || !dinnerItems.length) {
    throw new Error('Insufficient menu items for all meal types.');
  }

  const plan = await DietPlan.create({
    user_id: userId,
    plan_type: planType,
    start_date: startDate,
    end_date: endDate,
    status: 'active'
  });

  const recentBreakfast = new Set();
  const recentLunch = new Set();
  const recentDinner = new Set();

  const days = [];
  const dayIndicesToProcess = selectedDayIndices || Array.from({ length: numDays }, (_, i) => i);

  for (let loopIdx = 0; loopIdx < dayIndicesToProcess.length; loopIdx++) {
    const i = dayIndicesToProcess[loopIdx];
    const dayDate = addDays(startDate, i);

    if (loopIdx >= 3) {
      const removeIdx = loopIdx - 3;
      if (days[removeIdx]) {
        recentBreakfast.delete(days[removeIdx].breakfast_item_id);
        recentLunch.delete(days[removeIdx].lunch_item_id);
        recentDinner.delete(days[removeIdx].dinner_item_id);
      }
    }

    const assignment = dailyAssignments?.find(a => a.dayIndex === i);

    // Resolve all selected IDs for each meal type (multiple allowed)
    const resolveIds = (ids) =>
      ids && ids.length > 0
        ? ids.map(id => allItems.find(x => x.id === id)).filter(Boolean)
        : null;

    const pickFromIds = (ids, pool, recentSet) => {
      if (ids && ids.length > 0) {
        const available = ids.map(id => allItems.find(x => x.id === id)).filter(Boolean);
        if (available.length > 0) {
          const nonRecent = available.filter(x => !recentSet.has(x.id));
          const finalPool = nonRecent.length > 0 ? nonRecent : available;
          return finalPool[Math.floor(Math.random() * finalPool.length)];
        }
      }
      return pickItem(pool, recentSet);
    };

    // For selectedOnly mode: use ALL selected items per meal; for auto: pick one
    const breakfastSelected = selectedOnly ? resolveIds(assignment?.breakfastIds) : null;
    const lunchSelected     = selectedOnly ? resolveIds(assignment?.lunchIds)     : null;
    const dinnerSelected    = selectedOnly ? resolveIds(assignment?.dinnerIds)     : null;
    const snackSelected     = selectedOnly ? resolveIds(assignment?.snackIds)      : null;

    const breakfast = breakfastSelected?.[0] || pickFromIds(assignment?.breakfastIds, breakfastItems, recentBreakfast);
    const lunch     = lunchSelected?.[0]     || pickFromIds(assignment?.lunchIds,     lunchItems,     recentLunch);
    const dinner    = dinnerSelected?.[0]    || pickFromIds(assignment?.dinnerIds,    dinnerItems,    recentDinner);

    recentBreakfast.add(breakfast.id);
    recentLunch.add(lunch.id);
    recentDinner.add(dinner.id);

    // Auto-pick a seasonal salad for lunch and dinner (non-repeating where possible)
    const lunchSalad  = !selectedOnly && lunchSalads.length  > 0 ? pickItem(lunchSalads,  new Set()) : null;
    const dinnerSalad = !selectedOnly && dinnerSalads.length > 0 ? pickItem(dinnerSalads, new Set()) : null;

    // Sum calories from primary 3 meals only (one per slot)
    const primaryItems = [breakfast, lunch, dinner].filter(Boolean);
    const allSelectedItems = [
      ...(breakfastSelected || [breakfast]),
      ...(lunchSelected     || [lunch]),
      ...(dinnerSelected    || [dinner]),
      ...(snackSelected     || []),
      ...(lunchSalad  ? [lunchSalad]  : []),
      ...(dinnerSalad ? [dinnerSalad] : []),
    ];
    const totalCalories = primaryItems.reduce((s, x) => s + (x.calories_per_serving || 0), 0);
    const totalProtein  = allSelectedItems.reduce((s, x) => s + (x.protein_g || 0), 0);
    const totalCarbs    = allSelectedItems.reduce((s, x) => s + (x.carbs_g   || 0), 0);
    const totalFat      = allSelectedItems.reduce((s, x) => s + (x.fat_g     || 0), 0);

    const day = await DietPlanDay.create({
      diet_plan_id: plan.id,
      day_date: dayDate,
      day_number: loopIdx + 1,
      breakfast_item_id: breakfast.id,
      lunch_item_id: lunch.id,
      dinner_item_id: dinner.id,
      total_calories: totalCalories,
      total_protein: totalProtein,
      total_carbs: totalCarbs,
      total_fat: totalFat
    });

    // Create DietPlanDayItem records for all items
    const itemsToCreate = [
      ...(breakfastSelected || [breakfast]).map(x => ({ diet_plan_day_id: day.id, menu_item_id: x.id, meal_type: 'breakfast' })),
      ...(lunchSelected     || [lunch]    ).map(x => ({ diet_plan_day_id: day.id, menu_item_id: x.id, meal_type: 'lunch'     })),
      ...(dinnerSelected    || [dinner]   ).map(x => ({ diet_plan_day_id: day.id, menu_item_id: x.id, meal_type: 'dinner'    })),
      ...(snackSelected     || []         ).map(x => ({ diet_plan_day_id: day.id, menu_item_id: x.id, meal_type: 'snack'     })),
      ...(lunchSalad  ? [{ diet_plan_day_id: day.id, menu_item_id: lunchSalad.id,  meal_type: 'lunch'  }] : []),
      ...(dinnerSalad ? [{ diet_plan_day_id: day.id, menu_item_id: dinnerSalad.id, meal_type: 'dinner' }] : []),
    ];
    await DietPlanDayItem.bulkCreate(itemsToCreate);

    days.push(day);
  }

  return plan;
}

function pickItem(items, recentSet) {
  const available = items.filter(i => !recentSet.has(i.id));
  const pool = available.length > 0 ? available : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

module.exports = { generatePlan, getFamilyCalorieTarget };
