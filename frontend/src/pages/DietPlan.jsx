import React, { useEffect, useState, useRef } from 'react';
import { Calendar, RefreshCw, Trash2, X, Printer, Send, ChevronLeft, ChevronRight, Check, Coffee, Sun, Moon, Salad, UtensilsCrossed, AlertTriangle, Plus, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getPlans, generateDietPlan, getFullPlan, deletePlan,
  updatePlanDay, getMenuItems, sendWeekMenu, getFamilySummary
} from '../api';
import MealCell from '../components/MealCell';
import MenuCard from '../components/MenuCard';

const CUISINES = ['Indian', 'North Indian', 'South Indian', 'Punjabi', 'Gujarati', 'Mughal', 'International'];
const MEAL_RATIOS = { breakfast: 0.25, lunch: 0.35, snack: 0.10, dinner: 0.30 };
const MEAL_META = [
  { key: 'breakfast', label: 'Breakfast',      icon: '🌅', pct: 25, color: 'bg-orange-400' },
  { key: 'lunch',     label: 'Lunch',           icon: '☀️', pct: 35, color: 'bg-blue-400'   },
  { key: 'snack',     label: 'Snacks/Add-Ons',  icon: '🥗', pct: 10, color: 'bg-purple-400' },
  { key: 'dinner',    label: 'Dinner',           icon: '🌙', pct: 30, color: 'bg-rose-400'   },
];

export default function DietPlan() {
  const { currentUser } = useApp();
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [planDays, setPlanDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showGenForm, setShowGenForm] = useState(false);
  const [genStep, setGenStep] = useState(1); // 1 = settings, 2 = meal selection
  const [allMenuItems, setAllMenuItems] = useState({ breakfast: [], lunch: [], dinner: [], snack: [], lunchAddon: [], dinnerAddon: [] });
  const [loadingMenuItems, setLoadingMenuItems] = useState(false);
  const [selectedBreakfast, setSelectedBreakfast] = useState([]);
  const [selectedLunch, setSelectedLunch] = useState([]);
  const [selectedDinner, setSelectedDinner] = useState([]);
  const [selectedLunchAddon, setSelectedLunchAddon] = useState([]);
  const [selectedDinnerAddon, setSelectedDinnerAddon] = useState([]);
  const [activeMealTab, setActiveMealTab] = useState('breakfast');
  const [dailyMeals, setDailyMeals] = useState({});
  const [activeDay, setActiveDay] = useState(0);
  const [showSwap, setShowSwap] = useState(false);
  const [swapDay, setSwapDay] = useState(null);
  const [swapMealType, setSwapMealType] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState('');
  const [requiredCalories, setRequiredCalories] = useState(0);
  const [familyMembers, setFamilyMembers] = useState(1);
  const [addonItems, setAddonItems] = useState({ breakfast: [], lunch: [], dinner: [] });
  const [addonModal, setAddonModal] = useState(null); // { item, type: 'lunch'|'dinner' }
  const addonsRef = useRef(null);
  const [genForm, setGenForm] = useState({
    planType: 'weekly',
    startDate: new Date().toISOString().split('T')[0],
    isVegetarian: false,
    maxCaloriesPerDay: 2000,
    cuisineTypes: []
  });

  useEffect(() => {
    if (currentUser) {
      loadPlans();
      Promise.all([
        getFamilySummary(currentUser.id),
        getMenuItems({ meal_type: 'snack' })
      ]).then(([summaryRes, snacksRes]) => {
        const total = summaryRes.data?.members?.reduce((s, { nutrition }) => s + (nutrition?.calories_min || 0), 0) || 0;
        setRequiredCalories(total);
        if (total > 0) setGenForm(f => ({ ...f, maxCaloriesPerDay: total }));
        const count = summaryRes.data?.members?.length || 1;
        setFamilyMembers(count);
        const snacks = snacksRes.data || [];
        setAddonItems({ breakfast: snacks, lunch: snacks, dinner: snacks });
      }).catch(() => {});
    }
  }, [currentUser]);

  async function loadPlans() {
    setLoading(true);
    try {
      const res = await getPlans(currentUser.id);
      const all = res.data;
      setPlans(all);
      const active = all.find(p => p.status === 'active') || all[0] || null;
      if (active) await loadFullPlan(active.id);
    } catch {}
    finally { setLoading(false); }
  }

  async function loadFullPlan(planId) {
    try {
      const res = await getFullPlan(planId);
      setActivePlan(res.data);
      const sorted = (res.data.days || []).slice().sort((a, b) => a.day_number - b.day_number);
      setPlanDays(sorted);
    } catch {}
  }

  async function goToMealSelection() {
    setLoadingMenuItems(true);
    setGenStep(2);
    setActiveDay(0);
    try {
      const [bRes, lRes, dRes, sRes] = await Promise.all([
        getMenuItems({ meal_type: 'breakfast' }),
        getMenuItems({ meal_type: 'lunch' }),
        getMenuItems({ meal_type: 'dinner' }),
        getMenuItems({ meal_type: 'snack' }),
      ]);
      setAllMenuItems({
        breakfast: bRes.data || [],
        lunch: lRes.data || [],
        dinner: dRes.data || [],
        snack: sRes.data || [],
        lunchAddon: sRes.data || [],
        dinnerAddon: sRes.data || [],
      });
    } catch {}
    finally { setLoadingMenuItems(false); }
  }

  const selectionMap = {
    breakfast: [selectedBreakfast, setSelectedBreakfast],
    lunch: [selectedLunch, setSelectedLunch],
    dinner: [selectedDinner, setSelectedDinner],
    lunchAddon: [selectedLunchAddon, setSelectedLunchAddon],
    dinnerAddon: [selectedDinnerAddon, setSelectedDinnerAddon],
  };

  function toggleItem(id, type) {
    const [, setFn] = selectionMap[type];
    setFn(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function selectAll(type) {
    const items = allMenuItems[type];
    const [selected, setFn] = selectionMap[type];
    setFn(selected.length === items.length ? [] : items.map(i => i.id));
  }

  async function handleGenerate(mode = 'selected') {
    setGenerating(true);
    try {
      const basePreferences = {
        isVegetarian: genForm.isVegetarian,
        maxCaloriesPerDay: genForm.maxCaloriesPerDay,
        cuisineTypes: genForm.cuisineTypes.length > 0 ? genForm.cuisineTypes : undefined,
      };

      let mealPreferences = mode === 'selected' ? (() => {
        const dailyAssignmentsPayload = Object.entries(dailyMeals)
          .map(([dayIdx, meals]) => ({
            dayIndex: parseInt(dayIdx),
            breakfastIds: (meals.breakfast || []).map(i => i.id),
            lunchIds:     (meals.lunch     || []).map(i => i.id),
            snackIds:     (meals.snack     || []).map(i => i.id),
            dinnerIds:    (meals.dinner    || []).map(i => i.id),
          }))
          .filter(a => a.breakfastIds.length || a.lunchIds.length || a.snackIds.length || a.dinnerIds.length);

        if (dailyAssignmentsPayload.length === 0) {
          alert('Please select meals for at least one day before using "Create Selected Meal Plan".');
          return null;
        }

        return {
          selectedOnly: true,
          dailyAssignments: dailyAssignmentsPayload,
        };
      })() : {};

      if (mealPreferences === null) { setGenerating(false); return; }

      const res = await generateDietPlan({
        userId: currentUser.id,
        planType: genForm.planType,
        startDate: genForm.startDate,
        preferences: { ...basePreferences, ...mealPreferences }
      });
      setActivePlan(res.data);
      setPlanDays(res.data.days || []);
      setShowGenForm(false);
      setGenStep(1);
      setDailyMeals({}); setActiveDay(0);
      setSelectedBreakfast([]); setSelectedLunch([]); setSelectedDinner([]);
      setSelectedLunchAddon([]); setSelectedDinnerAddon([]);
      loadPlans();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate plan');
    } finally {
      setGenerating(false);
    }
  }

  async function handleDeletePlan(planId) {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await deletePlan(planId);
      setActivePlan(null);
      setPlanDays([]);
      loadPlans();
    } catch {}
  }

  async function openSwap(day, mealType) {
    setSwapDay(day);
    setSwapMealType(mealType);
    setShowSwap(true);
    setLoadingMenu(true);
    try {
      const res = await getMenuItems({ meal_type: mealType });
      setMenuItems(res.data);
    } catch {}
    finally { setLoadingMenu(false); }
  }

  async function handleSwap(menuItem) {
    if (!swapDay || !activePlan) return;
    const fieldMap = { breakfast: 'breakfast_item_id', lunch: 'lunch_item_id', dinner: 'dinner_item_id' };
    const field = fieldMap[swapMealType];
    if (!field) return;

    const currentBreakfast = swapDay.breakfast?.calories_per_serving || 0;
    const currentLunch = swapDay.lunch?.calories_per_serving || 0;
    const currentDinner = swapDay.dinner?.calories_per_serving || 0;

    let newCalories = swapDay.total_calories;
    if (swapMealType === 'breakfast') newCalories = menuItem.calories_per_serving + currentLunch + currentDinner;
    else if (swapMealType === 'lunch') newCalories = currentBreakfast + menuItem.calories_per_serving + currentDinner;
    else newCalories = currentBreakfast + currentLunch + menuItem.calories_per_serving;

    try {
      await updatePlanDay(activePlan.id, swapDay.id, {
        [field]: menuItem.id,
        total_calories: newCalories
      });
      await loadFullPlan(activePlan.id);
      setShowSwap(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update');
    }
  }

  async function handleAssignAddon(day, item, type) {
    const fieldMap = { breakfast: 'breakfast_addon_id', lunch: 'morning_snack_id', dinner: 'evening_snack_id' };
    const snackKeyMap = { breakfast: 'breakfastAddon', lunch: 'morningSnack', dinner: 'eveningSnack' };
    const field = fieldMap[type];
    const existingCal = day[snackKeyMap[type]]?.calories_per_serving || 0;
    const newTotal = day.total_calories - existingCal + item.calories_per_serving;
    try {
      await updatePlanDay(activePlan.id, day.id, { [field]: item.id, total_calories: newTotal });
      await loadFullPlan(activePlan.id);
      setAddonModal(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign add-on');
    }
  }

  function handleSendWhatsApp() {
    const cookPhone = currentUser.cook_phone || '9462933363';
    const days = planDays.slice(weekOffset * 7, weekOffset * 7 + 7);
    if (!days.length) { setSendMsg('No plan days to send.'); setTimeout(() => setSendMsg(''), 3000); return; }

    const lines = [`🍽️ *Weekly Diet Plan*`, `📅 ${activePlan.start_date} to ${activePlan.end_date}`, ``];
    days.forEach(day => {
      const date = new Date(day.day_date);
      const label = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      lines.push(`*${label}* 🔥${day.total_calories} kcal`);
      if (day.breakfast) lines.push(`  🌅 B: ${day.breakfast.name}`);
      if (day.lunch)     lines.push(`  ☀️ L: ${day.lunch.name}`);
      if (day.dinner)    lines.push(`  🌙 D: ${day.dinner.name}`);
      lines.push(``);
    });
    lines.push(`Sent via CookConnect 🥗`);

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/91${cookPhone}?text=${text}`, '_blank');
    setSendMsg('WhatsApp opened with weekly plan!');
    setTimeout(() => setSendMsg(''), 4000);
  }

  const weekStart = weekOffset * 7;
  const weekDays = planDays.slice(weekStart, weekStart + 7);
  const totalWeeks = Math.ceil(planDays.length / 7);

  function toggleCuisine(c) {
    setGenForm(f => ({
      ...f,
      cuisineTypes: f.cuisineTypes.includes(c) ? f.cuisineTypes.filter(x => x !== c) : [...f.cuisineTypes, c]
    }));
  }

  const dailyTarget = requiredCalories > 0 ? requiredCalories : genForm.maxCaloriesPerDay;

  function getMealTarget(mealType) {
    return Math.round(dailyTarget * (MEAL_RATIOS[mealType] || 0));
  }

  function getMealCalories(dayIdx, mealType) {
    return (dailyMeals[dayIdx]?.[mealType] || []).reduce((s, i) => s + (i.calories_per_serving || 0), 0);
  }

  function getDayCalories(dayIdx) {
    return ['breakfast', 'lunch', 'snack', 'dinner'].reduce((sum, type) => sum + getMealCalories(dayIdx, type), 0);
  }

  function selectMealForDay(dayIdx, mealType, item) {
    const current = dailyMeals[dayIdx]?.[mealType] || [];
    const isSelected = current.some(i => i.id === item.id);
    setDailyMeals(prev => ({
      ...prev,
      [dayIdx]: {
        ...prev[dayIdx],
        [mealType]: isSelected ? current.filter(i => i.id !== item.id) : [...current, item]
      }
    }));
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diet Plans</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {activePlan ? `${activePlan.plan_type} plan • ${activePlan.start_date} to ${activePlan.end_date}` : 'No active plan'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activePlan && (
            <>
              <button
                onClick={handleSendWhatsApp}
                className="flex items-center gap-2 px-4 py-2 border border-green-500 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.522 5.858L0 24l6.336-1.49A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.006-1.374l-.36-.214-3.728.878.939-3.618-.234-.372A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                Send to Cook
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer size={14} /> Print
              </button>
              <button
                onClick={() => handleDeletePlan(activePlan.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => setShowGenForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Calendar size={16} /> Generate Plan
          </button>
        </div>
      </div>

      {sendMsg && (
        <div className="mb-4 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">
          {sendMsg}
        </div>
      )}

      {/* ── Per-week calorie deficit alerts ── */}
      {requiredCalories > 0 && weekDays.some(d => d.total_calories * familyMembers < requiredCalories) && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-xl px-5 py-3 mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold text-amber-900 text-sm">More Calories needed — go to Add Ons</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {weekDays.filter(d => d.total_calories * familyMembers < requiredCalories).length} day(s) this week are below the required {requiredCalories.toLocaleString()} kcal for your family.
                Swap meals or add snacks to meet the target.
              </p>
            </div>
          </div>
          <button
            onClick={() => addonsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shrink-0 ml-4 transition-colors"
          >
            <Plus size={12} /> Add Ons below
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" /></div>
      ) : !activePlan ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No diet plan yet</p>
          <p className="text-gray-400 text-sm mt-1">Generate a weekly or monthly plan based on your family's nutrition needs</p>
          <button onClick={() => setShowGenForm(true)} className="mt-4 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700">
            Generate First Plan
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-gray-900">
                  Week {weekOffset + 1} of {totalWeeks}
                </h2>
                <span className="text-xs text-gray-500">Click any meal to swap</span>
                <div className="flex items-center gap-1.5 ml-2 bg-gray-100 rounded-lg px-2 py-1">
                  <span className="text-xs text-gray-500 font-medium">Family:</span>
                  <button onClick={() => setFamilyMembers(m => Math.max(1, m - 1))} className="w-5 h-5 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-400 text-sm font-bold">−</button>
                  <span className="text-xs font-bold text-gray-800 w-4 text-center">{familyMembers}</span>
                  <button onClick={() => setFamilyMembers(m => m + 1)} className="w-5 h-5 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-400 text-sm font-bold">+</button>
                  <span className="text-xs text-gray-400 ml-0.5">{familyMembers === 1 ? 'member' : 'members'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
                  disabled={weekOffset === 0}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setWeekOffset(w => Math.min(totalWeeks - 1, w + 1))}
                  disabled={weekOffset >= totalWeeks - 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, i) => (
                <div key={day.id || i}>
                  <MealCell
                    day={day}
                    requiredCalories={requiredCalories}
                    familyMembers={familyMembers}
                    onEdit={(d) => {
                      const mealType = window.prompt('Which meal to swap? (breakfast/lunch/dinner)', 'breakfast');
                      if (['breakfast', 'lunch', 'dinner'].includes(mealType)) {
                        openSwap(d, mealType);
                      }
                    }}
                  />
                  <div className="mt-1 flex flex-col gap-0.5">
                    {['breakfast', 'lunch', 'dinner'].map(type => (
                      <button
                        key={type}
                        onClick={() => openSwap(day, type)}
                        className="text-xs text-gray-400 hover:text-emerald-600 text-center py-0.5 capitalize"
                      >
                        swap {type[0].toUpperCase() + type.slice(1, 1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Add Ons Section ── */}
          <div ref={addonsRef} className="space-y-4 mb-5">
            {[
              { key: 'breakfast', label: 'Add Ons For Breakfast', snackKey: 'breakfastAddon', headerClass: 'from-orange-500 to-amber-500', badge: 'bg-orange-100 text-orange-700' },
              { key: 'lunch',     label: 'Add Ons For Lunch',     snackKey: 'morningSnack',   headerClass: 'from-teal-500 to-cyan-500',   badge: 'bg-teal-100 text-teal-700'   },
              { key: 'dinner',    label: 'Add Ons For Dinner',    snackKey: 'eveningSnack',   headerClass: 'from-rose-500 to-pink-500',   badge: 'bg-rose-100 text-rose-700'   },
            ].map(({ key, label, snackKey, headerClass, badge }) => (
              <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`bg-gradient-to-r ${headerClass} px-5 py-3 flex items-center gap-2`}>
                  <Salad className="w-4 h-4 text-white" />
                  <h2 className="font-bold text-white text-sm">{label}</h2>
                  <span className="text-white/70 text-xs ml-1">— click any item to assign it to a day</span>
                </div>
                <div className="p-4">
                  {addonItems[key].length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No snack items found. Add some in Menu Library → Snack.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-3">
                      {addonItems[key].map(item => (
                        <div key={item.id} className="border border-gray-100 rounded-xl p-3 hover:border-emerald-300 hover:shadow-sm transition-all">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>snack</span>
                            <div className="flex items-center gap-0.5 text-orange-500">
                              <Flame size={11} />
                              <span className="text-xs font-bold">{item.calories_per_serving}</span>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-800 leading-snug mt-1">{item.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.cuisine_type}</p>
                          <button
                            onClick={() => setAddonModal({ item, type: key })}
                            className="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            + Add to Day
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Show current assignments for this week */}
                  {weekDays.some(d => d[snackKey]) && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Assigned this week:</p>
                      <div className="flex flex-wrap gap-2">
                        {weekDays.filter(d => d[snackKey]).map(d => {
                          const date = new Date(d.day_date + 'T00:00:00');
                          const dayLabel = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
                          return (
                            <span key={d.id} className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge}`}>
                              {dayLabel}: {d[snackKey].name} ({d[snackKey].calories_per_serving} kcal)
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">All Plans</h2>
            <div className="space-y-2">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    activePlan?.id === plan.id ? 'bg-emerald-50 border border-emerald-200' : 'border border-gray-100 hover:bg-gray-50'
                  }`}
                  onClick={() => loadFullPlan(plan.id)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 capitalize">{plan.plan_type} Plan</p>
                    <p className="text-xs text-gray-500">{plan.start_date} → {plan.end_date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      plan.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {plan.status}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Assign Add-On Modal ── */}
      {addonModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">Add to Day</h3>
                <p className="text-xs text-gray-500 mt-0.5">{addonModal.item.name} · {addonModal.item.calories_per_serving} kcal</p>
              </div>
              <button onClick={() => setAddonModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-500 mb-3">Select which day to assign this {
                addonModal.type === 'breakfast' ? 'breakfast add-on' :
                addonModal.type === 'lunch' ? 'lunch add-on' : 'dinner add-on'
              }:</p>
              <div className="space-y-2">
                {weekDays.map(day => {
                  const date = new Date(day.day_date + 'T00:00:00');
                  const dayLabel = date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
                  const existing = { breakfast: day.breakfastAddon, lunch: day.morningSnack, dinner: day.eveningSnack }[addonModal.type];
                  return (
                    <button
                      key={day.id}
                      onClick={() => handleAssignAddon(day, addonModal.item, addonModal.type)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                    >
                      <span className="text-sm font-semibold text-gray-800">{dayLabel}</span>
                      {existing ? (
                        <span className="text-xs text-amber-600 font-medium truncate ml-2">replaces: {existing.name}</span>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">empty slot</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showGenForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col" style={{ maxWidth: genStep === 2 ? 720 : 460, maxHeight: '92vh' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-gray-900">Generate Diet Plan</h2>
                <div className="flex items-center gap-1.5">
                  {[1, 2].map(s => (
                    <div key={s} className={`h-2 rounded-full transition-all ${genStep === s ? 'w-6 bg-emerald-500' : 'w-2 bg-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-400">Step {genStep} of 2</span>
              </div>
              <button onClick={() => { setShowGenForm(false); setGenStep(1); setDailyMeals({}); setActiveDay(0); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            {/* Step 1 — Settings */}
            {genStep === 1 && (
              <div className="p-6 space-y-5 overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['weekly', 'monthly'].map(type => (
                      <button key={type} onClick={() => setGenForm(f => ({ ...f, planType: type }))}
                        className={`py-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${genForm.planType === type ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
                        {type === 'weekly' ? '📅 Weekly (7 days)' : '🗓️ Monthly (30 days)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={genForm.startDate}
                    onChange={e => setGenForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Calories/Day: <span className="text-emerald-600">{genForm.maxCaloriesPerDay.toLocaleString()} kcal</span>
                    {requiredCalories > 0 && <span className="text-xs text-gray-400 ml-2">(family required: {requiredCalories.toLocaleString()} kcal)</span>}
                  </label>
                  <input type="range" min={0} max={requiredCalories > 0 ? requiredCalories : 3500} step={50} value={genForm.maxCaloriesPerDay}
                    onChange={e => setGenForm(f => ({ ...f, maxCaloriesPerDay: Number(e.target.value) }))}
                    className="w-full accent-emerald-600" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>{requiredCalories > 0 ? requiredCalories.toLocaleString() : '3,500'} kcal</span>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setGenForm(f => ({ ...f, isVegetarian: !f.isVegetarian }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${genForm.isVegetarian ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${genForm.isVegetarian ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">🥦 Vegetarian only</span>
                </label>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Cuisines (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {CUISINES.map(c => (
                      <button key={c} onClick={() => toggleCuisine(c)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all ${genForm.cuisineTypes.includes(c) ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setShowGenForm(false); setGenStep(1); setDailyMeals({}); setActiveDay(0); }}
                    className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
                  <button onClick={goToMealSelection}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-md">
                    Next: Choose Meals →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Day-by-day meal selection */}
            {genStep === 2 && (
              <div className="flex flex-col overflow-hidden flex-1">
                {/* Top: target banner + day tabs */}
                <div className="px-6 pt-4 pb-3 shrink-0 border-b border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                      <Flame size={15} className="text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-800">
                        Family Daily Target: {dailyTarget.toLocaleString()} kcal
                      </span>
                      <span className="text-xs text-emerald-600 ml-1">· {familyMembers} member{familyMembers !== 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-xs text-gray-400">Select meals per day until target is reached</span>
                  </div>

                  {/* Day tabs */}
                  <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                    {Array.from({ length: genForm.planType === 'monthly' ? 30 : 7 }, (_, i) => {
                      const cal = getDayCalories(i);
                      const done = cal >= dailyTarget;
                      const isActive = activeDay === i;
                      return (
                        <button
                          key={i}
                          onClick={() => setActiveDay(i)}
                          className={`shrink-0 flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all min-w-[52px] ${
                            isActive
                              ? done ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-blue-600 border-blue-600 text-white'
                              : done ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          <span>Day {i + 1}</span>
                          {done
                            ? <Check size={10} className="mt-0.5" />
                            : cal > 0
                              ? <span className="text-[9px] opacity-70 mt-0.5">{cal}k</span>
                              : <span className="text-[9px] opacity-40 mt-0.5">empty</span>
                          }
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Day content */}
                <div className="flex flex-col flex-1 overflow-hidden px-6 py-4">
                  {(() => {
                    const cal = getDayCalories(activeDay);
                    const dayMeals = dailyMeals[activeDay] || {};
                    const limitReached = cal >= dailyTarget;
                    const numDays = genForm.planType === 'monthly' ? 30 : 7;

                    return (
                      <>
                        {/* 4 separate kcal trackers */}
                        <div className="mb-4 shrink-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-700">Day {activeDay + 1} — Kcal Breakdown</span>
                            <span className={`text-sm font-bold ${limitReached ? 'text-emerald-600' : 'text-gray-500'}`}>
                              Total: {cal} / {dailyTarget.toLocaleString()} kcal
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            {MEAL_META.map(({ key, label, icon, pct, color }) => {
                              const target = getMealTarget(key);
                              const mealCal = getMealCalories(activeDay, key);
                              const items = dayMeals[key] || [];
                              const mealPct = Math.min(100, target > 0 ? (mealCal / target) * 100 : 0);
                              const done = mealCal >= target && target > 0;
                              const isActive = activeMealTab === key;
                              return (
                                <div key={key}
                                  className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer ${isActive ? 'border-emerald-400 bg-emerald-50' : done ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-100 bg-gray-50'}`}
                                  onClick={() => setActiveMealTab(key)}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[11px] font-bold text-gray-600 truncate">{icon} {label.split('/')[0]}</span>
                                    <span className="text-[10px] text-gray-400 font-semibold shrink-0 ml-1">{pct}%</span>
                                  </div>
                                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                                    <div className={`h-full rounded-full transition-all duration-300 ${done ? 'bg-emerald-500' : color}`} style={{ width: `${mealPct}%` }} />
                                  </div>
                                  <div className="text-[10px] font-semibold">
                                    {mealCal > 0
                                      ? <span className={done ? 'text-emerald-600' : 'text-gray-600'}>{mealCal}/{target} kcal{done ? ' ✓' : ''}</span>
                                      : <span className="text-gray-400">{target} kcal</span>
                                    }
                                  </div>
                                  {items.length > 0 && (
                                    <p className="text-[9px] text-gray-400 truncate mt-0.5">{items.length} dish{items.length > 1 ? 'es' : ''}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {limitReached && (
                            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-xl">
                              <Check size={14} className="text-emerald-600 shrink-0" />
                              <span className="text-xs font-bold text-emerald-700">Required family kcalorie limit reached for Day {activeDay + 1}</span>
                            </div>
                          )}
                        </div>

                        {limitReached ? (
                          /* Day complete state */
                          <div className="flex flex-col items-center justify-center flex-1 text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                              <Check size={28} className="text-emerald-600" />
                            </div>
                            <p className="font-bold text-emerald-700 text-lg">Day {activeDay + 1} Complete!</p>
                            <p className="text-sm text-gray-500 mt-1">Daily kcal target reached. Move to the next day or generate the plan.</p>
                            {activeDay < numDays - 1 && (
                              <button
                                onClick={() => setActiveDay(d => d + 1)}
                                className="mt-4 px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors"
                              >
                                Go to Day {activeDay + 2} →
                              </button>
                            )}
                          </div>
                        ) : (
                          <>
                            {/* Meal type tabs */}
                            <div className="flex gap-2 mb-3 shrink-0 flex-wrap">
                              {MEAL_META.map(({ key, label, icon }) => {
                                const items = dayMeals[key] || [];
                                const mealCal = getMealCalories(activeDay, key);
                                const mealDone = mealCal >= getMealTarget(key) && getMealTarget(key) > 0;
                                return (
                                  <button
                                    key={key}
                                    onClick={() => setActiveMealTab(key)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                                      activeMealTab === key
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : mealDone
                                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                          : items.length > 0
                                            ? 'border-blue-300 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                                  >
                                    {icon} {label}
                                    {items.length > 0 && <span className="text-[10px] font-semibold opacity-80">({mealCal}k · {items.length})</span>}
                                    {mealDone && <Check size={11} />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Items list */}
                            <div className="overflow-y-auto flex-1">
                              {loadingMenuItems ? (
                                <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" /></div>
                              ) : (
                                <div className="grid grid-cols-1 gap-2">
                                  {(allMenuItems[activeMealTab] || []).map(item => {
                                    const isSelected = (dayMeals[activeMealTab] || []).some(i => i.id === item.id);
                                    return (
                                      <button
                                        key={item.id}
                                        onClick={() => selectMealForDay(activeDay, activeMealTab, item)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                                          isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                                        }`}
                                      >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                          isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'
                                        }`}>
                                          {isSelected && <Check size={12} className="text-white" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                          <p className="text-xs text-gray-400">{item.cuisine_type} · P:{item.protein_g}g C:{item.carbs_g}g F:{item.fat_g}g</p>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-1 text-orange-500">
                                          <Flame size={12} />
                                          <span className="text-xs font-bold">{item.calories_per_serving}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
                  <button onClick={() => setGenStep(1)}
                    className="py-2.5 px-4 border-2 border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 shrink-0">← Back</button>
                  <button onClick={() => handleGenerate('selected')} disabled={generating}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-60 shadow-md">
                    {generating ? 'Generating...' : '✅ Create Selected Meal Plan'}
                  </button>
                  <button onClick={() => handleGenerate('auto')} disabled={generating}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 shadow-md">
                    {generating ? 'Generating...' : '✨ Create Auto Meal Plan'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSwap && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="font-bold text-gray-900 capitalize">Swap {swapMealType}</h2>
              <button onClick={() => setShowSwap(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto p-5">
              {loadingMenu ? (
                <div className="flex justify-center py-8"><RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" /></div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {menuItems.map(item => (
                    <MenuCard key={item.id} item={item} onSelect={handleSwap} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
