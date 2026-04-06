import React, { useEffect, useState } from 'react';
import { Calendar, RefreshCw, Trash2, X, Printer, Send, ChevronLeft, ChevronRight, Check, Coffee, Sun, Moon, Salad, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getPlans, generateDietPlan, getFullPlan, deletePlan,
  updatePlanDay, getMenuItems, sendWeekMenu
} from '../api';
import MealCell from '../components/MealCell';
import MenuCard from '../components/MenuCard';

const CUISINES = ['Indian', 'North Indian', 'South Indian', 'Punjabi', 'Gujarati', 'Mughal', 'International'];

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
  const [allMenuItems, setAllMenuItems] = useState({ breakfast: [], lunch: [], dinner: [], lunchAddon: [], dinnerAddon: [] });
  const [loadingMenuItems, setLoadingMenuItems] = useState(false);
  const [selectedBreakfast, setSelectedBreakfast] = useState([]);
  const [selectedLunch, setSelectedLunch] = useState([]);
  const [selectedDinner, setSelectedDinner] = useState([]);
  const [selectedLunchAddon, setSelectedLunchAddon] = useState([]);
  const [selectedDinnerAddon, setSelectedDinnerAddon] = useState([]);
  const [activeMealTab, setActiveMealTab] = useState('breakfast');
  const [showSwap, setShowSwap] = useState(false);
  const [swapDay, setSwapDay] = useState(null);
  const [swapMealType, setSwapMealType] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState('');
  const [genForm, setGenForm] = useState({
    planType: 'weekly',
    startDate: new Date().toISOString().split('T')[0],
    isVegetarian: false,
    maxCaloriesPerDay: 2000,
    cuisineTypes: []
  });

  useEffect(() => { if (currentUser) loadPlans(); }, [currentUser]);

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
      setPlanDays(res.data.days || []);
    } catch {}
  }

  async function goToMealSelection() {
    setLoadingMenuItems(true);
    setGenStep(2);
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

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await generateDietPlan({
        userId: currentUser.id,
        planType: genForm.planType,
        startDate: genForm.startDate,
        preferences: {
          isVegetarian: genForm.isVegetarian,
          maxCaloriesPerDay: genForm.maxCaloriesPerDay,
          cuisineTypes: genForm.cuisineTypes.length > 0 ? genForm.cuisineTypes : undefined,
          preferredBreakfastIds: selectedBreakfast.length > 0 ? selectedBreakfast : undefined,
          preferredLunchIds: selectedLunch.length > 0 ? selectedLunch : undefined,
          preferredDinnerIds: selectedDinner.length > 0 ? selectedDinner : undefined,
        }
      });
      setActivePlan(res.data);
      setPlanDays(res.data.days || []);
      setShowGenForm(false);
      setGenStep(1);
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

  async function handleSendSms() {
    setSending(true);
    setSendMsg('');
    try {
      await sendWeekMenu(currentUser.id);
      setSendMsg('Weekly plan sent to cook!');
    } catch (err) {
      setSendMsg(err.response?.data?.error || 'Failed to send');
    } finally {
      setSending(false);
      setTimeout(() => setSendMsg(''), 4000);
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
                onClick={handleSendSms} disabled={sending}
                className="flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-700 text-sm font-semibold rounded-lg hover:bg-emerald-50 disabled:opacity-60 transition-colors"
              >
                <Send size={14} /> {sending ? 'Sending...' : 'Send to Cook'}
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
              <button onClick={() => { setShowGenForm(false); setGenStep(1); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Calories/Day: <span className="text-emerald-600">{genForm.maxCaloriesPerDay.toLocaleString()} kcal</span></label>
                  <input type="range" min={1200} max={3500} step={100} value={genForm.maxCaloriesPerDay}
                    onChange={e => setGenForm(f => ({ ...f, maxCaloriesPerDay: Number(e.target.value) }))}
                    className="w-full accent-emerald-600" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1,200</span><span>3,500</span></div>
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
                  <button onClick={() => { setShowGenForm(false); setGenStep(1); }}
                    className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
                  <button onClick={goToMealSelection}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-md">
                    Next: Choose Meals →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Meal Item Selection */}
            {genStep === 2 && (
              <div className="flex flex-col overflow-hidden flex-1">
                <div className="px-6 pt-4 pb-2 shrink-0">
                  <p className="text-sm text-gray-500 mb-3">Select items you want in your plan. Leave all unchecked to use all available items.</p>
                  {/* Meal type tabs */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'breakfast',  label: 'Breakfast',          icon: Coffee,          activeClass: 'bg-orange-500 border-orange-500 text-white',  count: selectedBreakfast.length },
                      { key: 'lunch',      label: 'Lunch',              icon: Sun,             activeClass: 'bg-blue-500 border-blue-500 text-white',      count: selectedLunch.length },
                      { key: 'dinner',     label: 'Dinner',             icon: Moon,            activeClass: 'bg-purple-500 border-purple-500 text-white',  count: selectedDinner.length },
                      { key: 'lunchAddon', label: 'Add Ons for Lunch',  icon: Salad,           activeClass: 'bg-teal-500 border-teal-500 text-white',      count: selectedLunchAddon.length },
                      { key: 'dinnerAddon',label: 'Add Ons for Dinner', icon: UtensilsCrossed, activeClass: 'bg-rose-500 border-rose-500 text-white',      count: selectedDinnerAddon.length },
                    ].map(({ key, label, icon: Icon, activeClass, count }) => (
                      <button key={key} onClick={() => setActiveMealTab(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          activeMealTab === key ? activeClass : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>
                        <Icon size={14} /> {label}
                        {count > 0 && <span className="bg-white/30 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{count}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Item list */}
                <div className="overflow-y-auto flex-1 px-6 pb-4">
                  {loadingMenuItems ? (
                    <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" /></div>
                  ) : (() => {
                    const items = allMenuItems[activeMealTab] || [];
                    const [selected] = selectionMap[activeMealTab] || [[]];
                    return (
                      <>
                        <div className="flex items-center justify-between py-2 sticky top-0 bg-white">
                          <span className="text-xs text-gray-400">{items.length} items · {selected.length} selected</span>
                          <button onClick={() => selectAll(activeMealTab)}
                            className="text-xs text-emerald-600 font-bold hover:underline">
                            {selected.length === items.length ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {items.map(item => {
                            const isSelected = selected.includes(item.id);
                            return (
                              <button key={item.id} onClick={() => toggleItem(item.id, activeMealTab)}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200 bg-gray-50'}`}>
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'}`}>
                                  {isSelected && <Check size={13} className="text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-400">{item.cuisine_type} · {item.calories_per_serving} kcal · P:{item.protein_g}g C:{item.carbs_g}g F:{item.fat_g}g</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
                  <button onClick={() => setGenStep(1)}
                    className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50">← Back</button>
                  <button onClick={handleGenerate} disabled={generating}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-60 shadow-md">
                    {generating ? 'Generating...' : '✨ Generate Plan'}
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
