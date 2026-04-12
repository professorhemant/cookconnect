import React, { useEffect, useState } from 'react';
import { Calendar, RefreshCw, Trash2, X, ChevronLeft, ChevronRight, Check, Flame } from 'lucide-react';

import { useApp } from '../context/AppContext';
import {
  getPlans, generateDietPlan, getFullPlan, deletePlan,
  updatePlanDay, getMenuItems, getFamilySummary
} from '../api';
import MealCell from '../components/MealCell';
import MenuCard from '../components/MenuCard';

const CUISINES = ['Indian', 'North Indian', 'South Indian', 'Punjabi', 'Gujarati', 'Mughal', 'International'];
const MEAL_RATIOS = { breakfast: 0.25, lunch: 0.35, snack: 0.10, dinner: 0.30 };
const MEAL_META = [
  { key: 'breakfast', label: 'Breakfast', icon: '🌅', pct: 25, color: 'bg-orange-400' },
  { key: 'lunch',     label: 'Lunch',     icon: '☀️', pct: 35, color: 'bg-blue-400'   },
  { key: 'dinner',    label: 'Dinner',    icon: '🌙', pct: 30, color: 'bg-rose-400'   },
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
  const [allMenuItems, setAllMenuItems] = useState({ breakfast: [], lunch: [], dinner: [] });
  const [loadingMenuItems, setLoadingMenuItems] = useState(false);
  const [selectedBreakfast, setSelectedBreakfast] = useState([]);
  const [selectedLunch, setSelectedLunch] = useState([]);
  const [selectedDinner, setSelectedDinner] = useState([]);
  const [activeMealTab, setActiveMealTab] = useState('breakfast');
  const [dailyMeals, setDailyMeals] = useState({});
  const [activeDay, setActiveDay] = useState(0);
  const [showSwap, setShowSwap] = useState(false);
  const [swapDay, setSwapDay] = useState(null);
  const [swapMealType, setSwapMealType] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [requiredCalories, setRequiredCalories] = useState(0);
  const [familyMembers, setFamilyMembers] = useState(1);
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
      getFamilySummary(currentUser.id).then(summaryRes => {
        const total = summaryRes.data?.members?.reduce((s, { nutrition }) => s + (nutrition?.calories_min || 0), 0) || 0;
        setRequiredCalories(total);
        if (total > 0) setGenForm(f => ({ ...f, maxCaloriesPerDay: total }));
        const count = summaryRes.data?.members?.length || 1;
        setFamilyMembers(count);
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
      const [bRes, lRes, dRes] = await Promise.all([
        getMenuItems({ meal_type: 'breakfast' }),
        getMenuItems({ meal_type: 'lunch' }),
        getMenuItems({ meal_type: 'dinner' }),
      ]);
      setAllMenuItems({
        breakfast: bRes.data || [],
        lunch: lRes.data || [],
        dinner: dRes.data || [],
      });
    } catch {}
    finally { setLoadingMenuItems(false); }
  }

  const selectionMap = {
    breakfast: [selectedBreakfast, setSelectedBreakfast],
    lunch: [selectedLunch, setSelectedLunch],
    dinner: [selectedDinner, setSelectedDinner],
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


  const weekStart = weekOffset * 7;
  const weekDays = planDays.slice(weekStart, weekStart + 7);
  const totalWeeks = Math.ceil(planDays.length / 7);

  function toggleCuisine(c) {
    setGenForm(f => ({
      ...f,
      cuisineTypes: f.cuisineTypes.includes(c) ? f.cuisineTypes.filter(x => x !== c) : [...f.cuisineTypes, c]
    }));
  }

  const dailyTarget = requiredCalories > 0 ? requiredCalories : genForm.maxCaloriesPerDay * familyMembers;

  function getMealTarget(mealType) {
    return Math.round(dailyTarget * (MEAL_RATIOS[mealType] || 0));
  }

  function getMealCalories(dayIdx, mealType) {
    return (dailyMeals[dayIdx]?.[mealType] || []).reduce((s, i) => s + (i.calories_per_serving || 0), 0) * familyMembers;
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
      {/* Hero header */}
      <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 shadow-xl">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative flex items-center justify-between px-10 py-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={28} className="text-white/80" />
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Diet Plans</h1>
            </div>
            <p className="text-white/70 text-base mt-1">
              {activePlan
                ? `${activePlan.plan_type.charAt(0).toUpperCase() + activePlan.plan_type.slice(1)} plan · ${activePlan.start_date} → ${activePlan.end_date}`
                : 'No active plan — generate one to get started'}
            </p>
            {dailyTarget > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5">
                <Flame size={14} className="text-amber-300" />
                <span className="text-white text-sm font-bold">
                  {familyMembers} member{familyMembers !== 1 ? 's' : ''} · {dailyTarget.toLocaleString()} kcal/day
                  {familyMembers > 1 && <span className="opacity-70"> (~{Math.round(dailyTarget / familyMembers).toLocaleString()}/person)</span>}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activePlan && (
              <button
                onClick={() => handleDeletePlan(activePlan.id)}
                className="p-3 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={() => setShowGenForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 text-sm font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
            >
              <Calendar size={18} /> Custom Plan
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" /></div>
      ) : !activePlan ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-md">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-gray-700 font-bold text-xl">No diet plan yet</p>
          <p className="text-gray-400 text-base mt-2 max-w-sm mx-auto">Generate a weekly or monthly plan based on your family's nutrition needs</p>
          <button onClick={() => setShowGenForm(true)} className="mt-6 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md text-base">
            Generate First Plan
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Week {weekOffset + 1} <span className="text-gray-400 font-normal">of {totalWeeks}</span>
                </h2>
                <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Tap any meal to swap</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
                  disabled={weekOffset === 0}
                  className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-semibold text-gray-500 min-w-[3rem] text-center">{weekOffset + 1} / {totalWeeks}</span>
                <button
                  onClick={() => setWeekOffset(w => Math.min(totalWeeks - 1, w + 1))}
                  disabled={weekOffset >= totalWeeks - 1}
                  className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {weekDays.map((day, i) => (
                <MealCell
                  key={day.id || i}
                  day={day}
                  requiredCalories={dailyTarget}
                  familyMembers={familyMembers}
                  onSwap={(mealType) => openSwap(day, mealType)}
                />
              ))}
            </div>
          </div>
        </>
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
                    Max Calories/Day (family total): <span className="text-emerald-600">{genForm.maxCaloriesPerDay.toLocaleString()} kcal</span>
                    {familyMembers > 1 && <span className="text-xs text-gray-400 ml-2">(~{Math.round(genForm.maxCaloriesPerDay / familyMembers).toLocaleString()} kcal/person × {familyMembers} members)</span>}
                  </label>
                  <input type="range" min={0} max={dailyTarget > 0 ? dailyTarget : 3500 * familyMembers} step={50} value={genForm.maxCaloriesPerDay}
                    onChange={e => setGenForm(f => ({ ...f, maxCaloriesPerDay: Number(e.target.value) }))}
                    className="w-full accent-emerald-600" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>{dailyTarget > 0 ? dailyTarget.toLocaleString() : (3500 * familyMembers).toLocaleString()} kcal</span>
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
                      const over = dailyTarget > 0 && cal > dailyTarget * 1.05;
                      const done = cal >= dailyTarget && !over;
                      const isActive = activeDay === i;
                      return (
                        <button
                          key={i}
                          onClick={() => setActiveDay(i)}
                          className={`shrink-0 flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all min-w-[52px] ${
                            isActive
                              ? over  ? 'bg-rose-500 border-rose-500 text-white'
                              : done  ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'bg-blue-600 border-blue-600 text-white'
                              : over  ? 'bg-rose-50 border-rose-300 text-rose-700'
                              : done  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          <span>Day {i + 1}</span>
                          {over
                            ? <span className="text-[9px] mt-0.5">▲over</span>
                            : done
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

                          {cal > 0 && (
                            <div className={`mt-2 flex items-center justify-between gap-2 px-3 py-2 rounded-xl border ${
                              cal > dailyTarget * 1.05
                                ? 'bg-rose-50 border-rose-300'
                                : limitReached
                                  ? 'bg-emerald-50 border-emerald-300'
                                  : 'bg-amber-50 border-amber-200'
                            }`}>
                              <div className="flex items-center gap-2">
                                {cal > dailyTarget * 1.05
                                  ? <span className="text-xs font-bold text-rose-700">⚠ {cal - dailyTarget} kcal over target — deselect items to reduce</span>
                                  : limitReached
                                    ? <span className="text-xs font-bold text-emerald-700"><Check size={12} className="inline mr-1" />Day {activeDay + 1} on target — you can still edit selections</span>
                                    : <span className="text-xs font-bold text-amber-700">{dailyTarget - cal} kcal remaining for Day {activeDay + 1}</span>
                                }
                              </div>
                              {limitReached && activeDay < numDays - 1 && (
                                <button
                                  onClick={() => setActiveDay(d => d + 1)}
                                  className="shrink-0 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                  Day {activeDay + 2} →
                                </button>
                              )}
                            </div>
                          )}
                        </div>

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
                                          <p className="text-xs text-gray-400">
                                            {item.cuisine_type} · P:{familyMembers > 1 ? Math.round(item.protein_g * familyMembers * 10) / 10 : item.protein_g}g C:{familyMembers > 1 ? Math.round(item.carbs_g * familyMembers * 10) / 10 : item.carbs_g}g F:{familyMembers > 1 ? Math.round(item.fat_g * familyMembers * 10) / 10 : item.fat_g}g
                                            {familyMembers > 1 && <span className="text-gray-300 ml-1">(×{familyMembers})</span>}
                                          </p>
                                        </div>
                                        <div className="shrink-0 flex flex-col items-end gap-0.5 text-orange-500">
                                          <div className="flex items-center gap-1">
                                            <Flame size={12} />
                                            <span className="text-xs font-bold">{familyMembers > 1 ? (item.calories_per_serving || 0) * familyMembers : item.calories_per_serving} kcal</span>
                                          </div>
                                          {familyMembers > 1 && <span className="text-[10px] text-gray-400">{item.calories_per_serving}/person</span>}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </>
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
