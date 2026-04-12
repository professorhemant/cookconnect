import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shuffle, Check, Flame, RefreshCw,
  ArrowLeft, Sparkles, X, Info,
  ChevronLeft, ChevronRight, Plus, Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getThaliOptions, generateDietPlan, getFamilySummary, getMenuItems } from '../api';

const NIN_RATIOS = { breakfast: 0.30, lunch: 0.30, snack: 0.10, dinner: 0.30 };

const MEAL_CONFIG = [
  {
    key: 'breakfast', label: 'Breakfast', icon: '🌅', ninPct: 30,
    gradient: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50', headerBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    selectedRing: 'ring-2 ring-amber-400 border-amber-400',
    barColor: 'bg-amber-400', chipBg: 'bg-amber-100 text-amber-800',
    accent: 'text-amber-600', accentBg: 'bg-amber-600',
  },
  {
    key: 'lunch', label: 'Lunch', icon: '☀️', ninPct: 30,
    gradient: 'from-sky-500 to-blue-600',
    lightBg: 'bg-sky-50', headerBg: 'bg-gradient-to-r from-sky-500 to-blue-600',
    selectedRing: 'ring-2 ring-sky-400 border-sky-400',
    barColor: 'bg-sky-400', chipBg: 'bg-sky-100 text-sky-800',
    accent: 'text-sky-600', accentBg: 'bg-sky-600',
  },
  {
    key: 'snack', label: 'Evening Snacks', icon: '🌇', ninPct: 10,
    gradient: 'from-rose-400 to-pink-500',
    lightBg: 'bg-rose-50', headerBg: 'bg-gradient-to-r from-rose-400 to-pink-500',
    selectedRing: 'ring-2 ring-rose-400 border-rose-400',
    barColor: 'bg-rose-400', chipBg: 'bg-rose-100 text-rose-800',
    accent: 'text-rose-600', accentBg: 'bg-rose-600',
  },
  {
    key: 'dinner', label: 'Dinner', icon: '🌙', ninPct: 30,
    gradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50', headerBg: 'bg-gradient-to-r from-violet-500 to-purple-600',
    selectedRing: 'ring-2 ring-violet-400 border-violet-400',
    barColor: 'bg-violet-500', chipBg: 'bg-violet-100 text-violet-800',
    accent: 'text-violet-600', accentBg: 'bg-violet-600',
  },
];

const SLOT_COLORS = {
  'Main Dish':       'bg-orange-100 text-orange-700 border-orange-200',
  'Sabzi':           'bg-green-100 text-green-700 border-green-200',
  'Dahi / Raita':    'bg-blue-100 text-blue-700 border-blue-200',
  'Raita / Dahi':    'bg-blue-100 text-blue-700 border-blue-200',
  'Dal':             'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Rice / Biryani':  'bg-amber-100 text-amber-700 border-amber-200',
  'Roti':            'bg-stone-100 text-stone-700 border-stone-200',
  'Light Snack':     'bg-pink-100 text-pink-700 border-pink-200',
  'Beverage / Dahi': 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

function recalcOption(option) {
  const components = option.components;
  return {
    ...option,
    totalKcal:    Math.round(components.reduce((s, c) => s + (c.item.calories_per_serving || 0), 0)),
    totalProtein: Math.round(components.reduce((s, c) => s + (c.item.protein_g || 0), 0) * 10) / 10,
    totalCarbs:   Math.round(components.reduce((s, c) => s + (c.item.carbs_g || 0), 0) * 10) / 10,
    totalFat:     Math.round(components.reduce((s, c) => s + (c.item.fat_g || 0), 0) * 10) / 10,
  };
}

export default function ThaliPlanner() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const [planType, setPlanType]         = useState('weekly');
  const [startDate, setStartDate]       = useState(new Date().toISOString().split('T')[0]);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [familyTarget, setFamilyTarget] = useState(0);
  const [familyMembers, setFamilyMembers] = useState(1);

  // thaliData[meal].options = array of options; currentIdx[meal] = which option is shown
  const [thaliData, setThaliData]   = useState({ breakfast: null, lunch: null, snack: null, dinner: null });
  const [loading, setLoading]       = useState({ breakfast: false, lunch: false, snack: false, dinner: false });
  const [currentIdx, setCurrentIdx] = useState({ breakfast: 0, lunch: 0, snack: 0, dinner: 0 });
  // which meals are "confirmed" (saved & selected)
  const [confirmed, setConfirmed]   = useState({ breakfast: false, lunch: false, snack: false, dinner: false });

  const [swapModal, setSwapModal] = useState(null); // { meal, optionIdx, componentIdx, slot, mealCfg }
  const [addModal, setAddModal]   = useState(null); // { meal, optionIdx, mealType }
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    getFamilySummary(currentUser.id).then(res => {
      const total = res.data?.members?.reduce((s, { nutrition }) => s + (nutrition?.calories_min || 0), 0) || 0;
      const count = res.data?.members?.length || 1;
      setFamilyMembers(count);
      setFamilyTarget(total > 0 ? total : 2000 * count);
    }).catch(() => {});
  }, [currentUser]);

  const fetchOptions = useCallback(async (meal_type) => {
    setLoading(prev => ({ ...prev, [meal_type]: true }));
    setConfirmed(prev => ({ ...prev, [meal_type]: false }));
    try {
      const res = await getThaliOptions({ meal_type, isVegetarian, numOptions: 3 });
      setThaliData(prev => ({ ...prev, [meal_type]: res.data }));
      setCurrentIdx(prev => ({ ...prev, [meal_type]: 0 }));
    } catch (err) {
      console.error('fetchOptions error', err);
    } finally {
      setLoading(prev => ({ ...prev, [meal_type]: false }));
    }
  }, [isVegetarian]);

  useEffect(() => {
    ['breakfast', 'lunch', 'snack', 'dinner'].forEach(m => fetchOptions(m));
  }, [fetchOptions]);

  function goNext(mealKey) {
    const total = thaliData[mealKey]?.options?.length || 1;
    setCurrentIdx(prev => ({ ...prev, [mealKey]: (prev[mealKey] + 1) % total }));
    setConfirmed(prev => ({ ...prev, [mealKey]: false }));
  }

  function goPrev(mealKey) {
    const total = thaliData[mealKey]?.options?.length || 1;
    setCurrentIdx(prev => ({ ...prev, [mealKey]: (prev[mealKey] - 1 + total) % total }));
    setConfirmed(prev => ({ ...prev, [mealKey]: false }));
  }

  function confirmThali(mealKey) {
    setConfirmed(prev => ({ ...prev, [mealKey]: true }));
  }

  function swapComponent(meal, optionIdx, componentIdx, newItem) {
    setThaliData(prev => {
      const options = prev[meal].options.map((opt, oi) => {
        if (oi !== optionIdx) return opt;
        const components = opt.components.map((comp, ci) =>
          ci !== componentIdx ? comp : { ...comp, item: newItem }
        );
        return recalcOption({ ...opt, components });
      });
      return { ...prev, [meal]: { ...prev[meal], options } };
    });
    setSwapModal(null);
    setConfirmed(prev => ({ ...prev, [meal]: false }));
  }

  function deleteComponent(meal, optionIdx, componentIdx) {
    setThaliData(prev => {
      const options = prev[meal].options.map((opt, oi) => {
        if (oi !== optionIdx) return opt;
        const components = opt.components.filter((_, ci) => ci !== componentIdx);
        return recalcOption({ ...opt, components });
      });
      return { ...prev, [meal]: { ...prev[meal], options } };
    });
    setConfirmed(prev => ({ ...prev, [meal]: false }));
  }

  function addComponent(meal, optionIdx, newItem) {
    setThaliData(prev => {
      const options = prev[meal].options.map((opt, oi) => {
        if (oi !== optionIdx) return opt;
        const components = [...opt.components, {
          role: newItem.sub_category || 'Main Dish',
          emoji: '🍽️',
          item: newItem,
        }];
        return recalcOption({ ...opt, components });
      });
      return { ...prev, [meal]: { ...prev[meal], options } };
    });
    setAddModal(null);
    setConfirmed(prev => ({ ...prev, [meal]: false }));
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const numDays = planType === 'weekly' ? 7 : 30;

      const getIds = (mealKey) => {
        const idx = currentIdx[mealKey];
        return thaliData[mealKey]?.options?.[idx]?.components.map(c => c.item.id) || [];
      };

      const dailyAssignments = Array.from({ length: numDays }, (_, i) => ({
        dayIndex: i,
        breakfastIds: getIds('breakfast'),
        lunchIds:     getIds('lunch'),
        snackIds:     getIds('snack'),
        dinnerIds:    getIds('dinner'),
      }));

      await generateDietPlan({
        userId: currentUser.id,
        planType,
        startDate,
        preferences: {
          isVegetarian,
          maxCaloriesPerDay: familyTarget,
          selectedOnly: true,
          dailyAssignments,
        },
      });
      navigate('/plans');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate plan');
    } finally {
      setGenerating(false);
    }
  }

  const mealTarget = (key) => Math.round(familyTarget * (NIN_RATIOS[key] || 0));

  const totalSelected = MEAL_CONFIG.reduce((sum, m) => {
    const idx = currentIdx[m.key];
    const components = thaliData[m.key]?.options?.[idx]?.components || [];
    const kcal = components.reduce((s, c) => s + (c.item?.calories_per_serving || 0), 0);
    return sum + kcal * familyMembers;
  }, 0);

  const pctOfTarget   = familyTarget > 0 ? Math.round((totalSelected / familyTarget) * 100) : 0;
  const isOverTarget  = familyTarget > 0 && totalSelected > familyTarget * 1.05;
  const isOnTrack     = familyTarget > 0 && totalSelected >= familyTarget * 0.85;
  const allConfirmed  = MEAL_CONFIG.every(m => confirmed[m.key]);

  return (
    <div className="p-8 max-w-4xl mx-auto">

      {/* Hero header */}
      <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 shadow-xl">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative px-10 py-7">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/plans')}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white">
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Sparkles size={26} className="text-yellow-300" />
                  <h1 className="text-3xl font-extrabold text-white">Smart Thali Planner</h1>
                </div>
                <p className="text-white/60 text-sm flex items-center gap-1.5">
                  <Info size={13} />
                  NIN-standard · Breakfast 30% · Lunch 30% · Snacks 10% · Dinner 30%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {familyTarget > 0 && (
                <div className="bg-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[130px]">
                  <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wide">Family Target</p>
                  <p className="text-white font-extrabold text-xl">{familyTarget.toLocaleString()}</p>
                  <p className="text-white/50 text-xs">kcal/day · {familyMembers} member{familyMembers !== 1 ? 's' : ''}</p>
                </div>
              )}
              <div className={`rounded-2xl px-5 py-3 text-center min-w-[130px] ${isOverTarget ? 'bg-rose-500/80' : isOnTrack ? 'bg-emerald-500/80' : 'bg-white/20'}`}>
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-wide">Selected Total</p>
                <p className="text-white font-extrabold text-xl">{totalSelected.toLocaleString()}</p>
                <p className="text-white/70 text-xs">
                  {isOverTarget ? '▲ over target' : isOnTrack ? '✓ on track' : `${pctOfTarget}% of target`}
                </p>
              </div>
            </div>
          </div>

          {/* NIN distribution bar */}
          {familyTarget > 0 && (
            <div>
              <div className="flex rounded-xl overflow-hidden h-5 bg-white/10">
                {MEAL_CONFIG.map(m => {
                  const target = mealTarget(m.key);
                  const idx    = currentIdx[m.key];
                  const comps  = thaliData[m.key]?.options?.[idx]?.components || [];
                  const actual = comps.reduce((s, c) => s + (c.item?.calories_per_serving || 0), 0) * familyMembers;
                  return (
                    <div key={m.key} className="relative flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ width: `${m.ninPct}%` }}>
                      <div className="absolute inset-0 bg-white/10 border-r border-white/20" />
                      <div className="absolute inset-y-0 left-0 bg-white/30 transition-all duration-500"
                        style={{ width: `${Math.min(100, target > 0 ? (actual / target) * 100 : 0)}%` }} />
                      <span className="relative z-10 truncate px-1">{m.icon} {m.ninPct}%</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex mt-1">
                {MEAL_CONFIG.map(m => {
                  const target = mealTarget(m.key);
                  const idx    = currentIdx[m.key];
                  const comps  = thaliData[m.key]?.options?.[idx]?.components || [];
                  const actual = comps.reduce((s, c) => s + (c.item?.calories_per_serving || 0), 0) * familyMembers;
                  return (
                    <div key={m.key} className="text-center text-[10px] text-white/50 font-semibold"
                      style={{ width: `${m.ninPct}%` }}>
                      {actual > 0 ? `${actual}/${target}` : `${target} kcal`}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings bar */}
      <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-8 flex-wrap">
        <div className="flex gap-2">
          {['weekly', 'monthly'].map(t => (
            <button key={t} onClick={() => setPlanType(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${planType === t ? 'bg-violet-600 border-violet-600 text-white' : 'border-gray-200 text-gray-600 hover:border-violet-300'}`}>
              {t === 'weekly' ? '📅 Weekly (7 days)' : '🗓️ Monthly (30 days)'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-600">Start:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer ml-auto">
          <div onClick={() => setIsVegetarian(v => !v)}
            className={`w-11 h-6 rounded-full transition-colors relative ${isVegetarian ? 'bg-green-500' : 'bg-gray-200'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${isVegetarian ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-sm font-semibold text-gray-700">🥦 Veg only</span>
        </label>
      </div>

      {/* Meal sections */}
      <div className="space-y-8">
        {MEAL_CONFIG.map(meal => {
          const data       = thaliData[meal.key];
          const isLoading  = loading[meal.key];
          const options    = data?.options || [];
          const idx        = currentIdx[meal.key];
          const option     = options[idx] || null;
          const total      = options.length;
          const ninTarget  = mealTarget(meal.key);
          const isConfirmed = confirmed[meal.key];

          return (
            <div key={meal.key} className={`rounded-2xl overflow-hidden border-2 transition-all ${isConfirmed ? 'border-emerald-400 shadow-lg shadow-emerald-100' : 'border-gray-100 shadow-md'}`}>

              {/* Meal header */}
              <div className={`flex items-center justify-between px-6 py-4 ${meal.headerBg}`}>
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{meal.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-white">{meal.label}</h2>
                      {isConfirmed && (
                        <span className="flex items-center gap-1 bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          <Check size={11} /> Selected
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-white/90 text-sm font-bold">
                        {ninTarget.toLocaleString()} kcal
                        {familyMembers > 1 && <span className="text-white/60 text-xs ml-1">(for {familyMembers} members)</span>}
                      </span>
                      {familyMembers > 1 && (
                        <span className="text-white/60 text-xs bg-white/15 px-2 py-0.5 rounded-full">
                          ~{Math.round(ninTarget / familyMembers).toLocaleString()} kcal/person
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => fetchOptions(meal.key)} disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all text-sm disabled:opacity-50">
                  {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Shuffle size={16} />}
                  Shuffle
                </button>
              </div>

              {/* Thali card area */}
              {isLoading ? (
                <div className="flex justify-center py-14 bg-white">
                  <RefreshCw size={30} className="animate-spin text-violet-400" />
                </div>
              ) : !option ? (
                <div className="text-center py-10 text-gray-400 bg-white">
                  No dishes found. Add items to Menu Library first.
                </div>
              ) : (
                <div className="bg-white">
                  {/* Navigation bar */}
                  <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50">
                    <button onClick={() => goPrev(meal.key)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-semibold disabled:opacity-40 transition-all"
                      disabled={total <= 1}>
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <span className="text-sm font-bold text-gray-500">
                      Combination {idx + 1} of {total}
                    </span>
                    <button onClick={() => goNext(meal.key)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-semibold disabled:opacity-40 transition-all"
                      disabled={total <= 1}>
                      Next <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Kcal summary */}
                  <div className="px-6 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Flame size={16} className="text-orange-400" />
                        <span className="text-lg font-extrabold text-gray-800">
                          {(option.totalKcal * familyMembers).toLocaleString()} kcal
                        </span>
                        {familyMembers > 1 && (
                          <span className="text-sm text-gray-400">({option.totalKcal} kcal/person)</span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-400">
                        target: {ninTarget.toLocaleString()} kcal
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          (option.totalKcal * familyMembers) > ninTarget * 1.1 ? 'bg-rose-400' :
                          (option.totalKcal * familyMembers) >= ninTarget * 0.85 ? 'bg-emerald-400' :
                          meal.barColor
                        }`}
                        style={{ width: `${Math.min(100, ninTarget > 0 ? ((option.totalKcal * familyMembers) / ninTarget) * 100 : 0)}%` }}
                      />
                    </div>
                    {(() => {
                      const diff = (option.totalKcal * familyMembers) - ninTarget;
                      const isOver = diff > ninTarget * 0.1;
                      const isGood = (option.totalKcal * familyMembers) >= ninTarget * 0.85;
                      return (
                        <p className={`text-xs font-semibold ${isOver ? 'text-rose-500' : isGood ? 'text-emerald-600' : 'text-amber-500'}`}>
                          {isOver ? `▲ ${diff} kcal over target` : isGood ? '✓ On target' : `▼ ${Math.abs(diff)} kcal below target`}
                        </p>
                      );
                    })()}
                  </div>

                  {/* Dish components */}
                  <div className="px-6 py-3 space-y-2">
                    {option.components.map((comp, ci) => {
                      const chipClass = SLOT_COLORS[comp.role] || 'bg-gray-100 text-gray-600 border-gray-200';
                      const dishKcal = familyMembers > 1
                        ? (comp.item.calories_per_serving || 0) * familyMembers
                        : (comp.item.calories_per_serving || 0);
                      return (
                        <div key={ci} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50 hover:bg-white transition-all group">
                          <span className="text-xl shrink-0">{comp.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide ${chipClass}`}>
                              {comp.role}
                            </span>
                            <p className="text-sm font-semibold text-gray-800 leading-snug mt-0.5">{comp.item.name}</p>
                            <p className="text-xs text-gray-400">
                              {comp.item.cuisine_type} ·{' '}
                              <span className="font-semibold text-orange-500">{dishKcal} kcal</span>
                              {familyMembers > 1 && <span className="text-gray-300 ml-1">({comp.item.calories_per_serving}/person)</span>}
                            </p>
                          </div>
                          {/* Macros inline */}
                          <div className="hidden sm:flex gap-2 shrink-0">
                            {[
                              { label: 'P', val: Math.round((comp.item.protein_g || 0) * familyMembers * 10) / 10, color: 'text-blue-600 bg-blue-50' },
                              { label: 'C', val: Math.round((comp.item.carbs_g || 0) * familyMembers * 10) / 10, color: 'text-amber-600 bg-amber-50' },
                              { label: 'F', val: Math.round((comp.item.fat_g || 0) * familyMembers * 10) / 10, color: 'text-rose-600 bg-rose-50' },
                            ].map(({ label, val, color }) => (
                              <div key={label} className={`text-center rounded-lg px-2 py-1 ${color}`}>
                                <p className="text-[11px] font-extrabold">{val}g</p>
                                <p className="text-[9px] font-semibold opacity-60">{label}</p>
                              </div>
                            ))}
                          </div>
                          {/* Action buttons */}
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              title="Swap dish"
                              onClick={() => setSwapModal({ meal: meal.key, optionIdx: idx, componentIdx: ci, slot: comp.role, mealCfg: meal })}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all">
                              <RefreshCw size={14} />
                            </button>
                            <button
                              title="Remove dish"
                              onClick={() => deleteComponent(meal.key, idx, ci)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add dish button */}
                    <button
                      onClick={() => setAddModal({ meal: meal.key, optionIdx: idx, mealType: meal.key })}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all text-sm font-semibold">
                      <Plus size={16} /> Add Dish
                    </button>
                  </div>

                  {/* Macros total */}
                  <div className="px-6 pb-4">
                    <div className="flex gap-3">
                      {[
                        { label: 'Protein', val: Math.round(option.totalProtein * familyMembers * 10) / 10, color: 'text-blue-600 bg-blue-50', unit: 'g' },
                        { label: 'Carbs',   val: Math.round(option.totalCarbs * familyMembers * 10) / 10,   color: 'text-amber-600 bg-amber-50', unit: 'g' },
                        { label: 'Fat',     val: Math.round(option.totalFat * familyMembers * 10) / 10,     color: 'text-rose-600 bg-rose-50', unit: 'g' },
                      ].map(({ label, val, color, unit }) => (
                        <div key={label} className={`flex-1 text-center rounded-xl py-2 ${color}`}>
                          <p className="text-sm font-extrabold">{val}{unit}</p>
                          <p className="text-[10px] font-semibold opacity-60">{label}{familyMembers > 1 ? ` ×${familyMembers}` : ''}</p>
                        </div>
                      ))}
                    </div>
                    {familyMembers > 1 && (
                      <p className="text-center text-[10px] text-gray-400 mt-2">
                        Per person — P:{option.totalProtein}g · C:{option.totalCarbs}g · F:{option.totalFat}g · {option.totalKcal} kcal
                      </p>
                    )}
                  </div>

                  {/* Save & Select button */}
                  <div className="px-6 pb-5">
                    <button
                      onClick={() => confirmThali(meal.key)}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isConfirmed
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100'
                          : `${meal.accentBg} text-white hover:opacity-90 shadow-md`
                      }`}>
                      {isConfirmed ? (
                        <><Check size={16} /> {meal.label} Thali Selected</>
                      ) : (
                        <><Check size={16} /> Save & Select This Thali</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Generate button */}
      <div className="mt-8 flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-md px-8 py-5">
        <div>
          <p className="text-lg font-bold text-gray-800">Generate your {planType} plan</p>
          <p className="text-sm text-gray-400 mt-0.5">
            {allConfirmed
              ? `All meals selected — NIN-balanced thalis across all ${planType === 'weekly' ? '7' : '30'} days`
              : `${MEAL_CONFIG.filter(m => confirmed[m.key]).length} of 4 meals selected`}
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating || Object.values(thaliData).some(d => !d)}
          className={`flex items-center gap-3 px-8 py-4 font-bold rounded-xl text-white text-base transition-all shadow-lg disabled:opacity-60 ${
            allConfirmed
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-200'
              : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700'
          }`}>
          {generating ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} />}
          {generating ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {/* Swap Modal */}
      {swapModal && (
        <ItemPickerModal
          title={`Swap: ${swapModal.slot}`}
          subtitle={`${swapModal.mealCfg?.label} · Combination ${swapModal.optionIdx + 1}`}
          mealType={swapModal.meal}
          familyMembers={familyMembers}
          onPick={(item) => swapComponent(swapModal.meal, swapModal.optionIdx, swapModal.componentIdx, item)}
          onClose={() => setSwapModal(null)}
          slotCandidates={thaliData[swapModal.meal]?.slotCandidates || []}
          filterBySlot={swapModal.slot}
        />
      )}

      {/* Add Modal */}
      {addModal && (
        <ItemPickerModal
          title="Add Dish"
          subtitle={`${MEAL_CONFIG.find(m => m.key === addModal.meal)?.label} · Combination ${addModal.optionIdx + 1}`}
          mealType={addModal.mealType}
          familyMembers={familyMembers}
          onPick={(item) => addComponent(addModal.meal, addModal.optionIdx, item)}
          onClose={() => setAddModal(null)}
          slotCandidates={[]}
          filterBySlot={null}
        />
      )}
    </div>
  );
}

/* ─── ItemPickerModal ─────────────────────────────────────────────────────── */
function ItemPickerModal({ title, subtitle, mealType, familyMembers, onPick, onClose, slotCandidates, filterBySlot }) {
  const [search, setSearch]   = useState('');
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If slot candidates available and filtering by slot, use them; otherwise fetch all
    if (filterBySlot && slotCandidates.length > 0) {
      const slotData = slotCandidates.find(s => s.role === filterBySlot);
      setItems(slotData?.items || []);
    } else {
      setLoading(true);
      getMenuItems({ meal_type: mealType })
        .then(res => setItems(res.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [mealType, filterBySlot, slotCandidates]);

  const filtered = items.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>

        <div className="px-6 py-3 border-b border-gray-100">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search dishes..." autoFocus
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-violet-400" />
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {loading && (
            <div className="flex justify-center py-8"><RefreshCw size={24} className="animate-spin text-violet-400" /></div>
          )}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No dishes found</p>
          )}
          {filtered.map(item => {
            const displayKcal = familyMembers > 1
              ? (item.calories_per_serving || 0) * familyMembers
              : (item.calories_per_serving || 0);
            return (
              <button key={item.id} onClick={() => onPick(item)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 hover:border-violet-300 hover:bg-violet-50 text-left transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.cuisine_type} · {item.sub_category}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="flex items-center gap-1 text-orange-500 justify-end">
                    <Flame size={13} />
                    <span className="text-sm font-bold">{displayKcal} kcal</span>
                  </div>
                  {familyMembers > 1 && (
                    <p className="text-[10px] text-gray-400">{item.calories_per_serving}/person</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
