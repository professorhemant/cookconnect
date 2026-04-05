const { MenuItem, NutritionRequirement, FamilyMember, DietPlan, DietPlanDay } = require('../models');
const { Op } = require('sequelize');

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
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
  const { isVegetarian, maxCaloriesPerDay, cuisineTypes, preferredBreakfastIds, preferredLunchIds, preferredDinnerIds } = preferences;

  const numDays = planType === 'monthly' ? 30 : 7;
  const endDate = addDays(startDate, numDays - 1);

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

  const lunchItems = (preferredLunchIds && preferredLunchIds.length > 0)
    ? allItems.filter(i => i.meal_type === 'lunch' && preferredLunchIds.includes(i.id))
    : allItems.filter(i => i.meal_type === 'lunch');

  const dinnerItems = (preferredDinnerIds && preferredDinnerIds.length > 0)
    ? allItems.filter(i => i.meal_type === 'dinner' && preferredDinnerIds.includes(i.id))
    : allItems.filter(i => i.meal_type === 'dinner');

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
  for (let i = 0; i < numDays; i++) {
    const dayDate = addDays(startDate, i);

    if (i >= 3) {
      const removeIdx = i - 3;
      if (days[removeIdx]) {
        recentBreakfast.delete(days[removeIdx].breakfast_item_id);
        recentLunch.delete(days[removeIdx].lunch_item_id);
        recentDinner.delete(days[removeIdx].dinner_item_id);
      }
    }

    const breakfast = pickItem(breakfastItems, recentBreakfast);
    const lunch = pickItem(lunchItems, recentLunch);
    const dinner = pickItem(dinnerItems, recentDinner);

    recentBreakfast.add(breakfast.id);
    recentLunch.add(lunch.id);
    recentDinner.add(dinner.id);

    const totalCalories = breakfast.calories_per_serving + lunch.calories_per_serving + dinner.calories_per_serving;
    const totalProtein = breakfast.protein_g + lunch.protein_g + dinner.protein_g;
    const totalCarbs = breakfast.carbs_g + lunch.carbs_g + dinner.carbs_g;
    const totalFat = breakfast.fat_g + lunch.fat_g + dinner.fat_g;

    const day = await DietPlanDay.create({
      diet_plan_id: plan.id,
      day_date: dayDate,
      day_number: i + 1,
      breakfast_item_id: breakfast.id,
      lunch_item_id: lunch.id,
      dinner_item_id: dinner.id,
      total_calories: totalCalories,
      total_protein: totalProtein,
      total_carbs: totalCarbs,
      total_fat: totalFat
    });

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
