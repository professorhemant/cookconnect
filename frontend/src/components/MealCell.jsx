import React from 'react';
import { Flame, RefreshCw } from 'lucide-react';

const MEALS = [
  {
    key: 'breakfast',
    icon: '🌅',
    label: 'Breakfast',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    cal: 'text-orange-500',
    headerBg: 'bg-gradient-to-br from-amber-50 to-orange-100',
    dot: 'bg-orange-400',
    divider: 'border-orange-100',
    trackColor: 'bg-orange-400',
  },
  {
    key: 'lunch',
    icon: '☀️',
    label: 'Lunch',
    gradient: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    cal: 'text-sky-500',
    headerBg: 'bg-gradient-to-br from-sky-50 to-blue-100',
    dot: 'bg-sky-400',
    divider: 'border-sky-100',
    trackColor: 'bg-sky-400',
  },
  {
    key: 'dinner',
    icon: '🌙',
    label: 'Dinner',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    cal: 'text-violet-500',
    headerBg: 'bg-gradient-to-br from-violet-50 to-purple-100',
    dot: 'bg-violet-500',
    divider: 'border-violet-100',
    trackColor: 'bg-violet-500',
  },
];

export default function MealCell({ day, onSwap, requiredCalories, familyMembers = 1 }) {
  if (!day) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 h-28 flex items-center justify-center text-sm text-gray-300">
        No plan
      </div>
    );
  }

  const date = new Date(day.day_date + 'T00:00:00');
  const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
  const dateNum = date.getDate();
  const monthName = date.toLocaleDateString('en-IN', { month: 'short' });

  const itemsByMeal = { breakfast: [], lunch: [], dinner: [] };
  if (day.mealItems && day.mealItems.length > 0) {
    day.mealItems.forEach(mi => {
      if (mi.meal_type && itemsByMeal[mi.meal_type] !== undefined && mi.menuItem) {
        itemsByMeal[mi.meal_type].push(mi.menuItem);
      }
    });
  }
  if (itemsByMeal.breakfast.length === 0 && day.breakfast) itemsByMeal.breakfast = [day.breakfast];
  if (itemsByMeal.lunch.length === 0 && day.lunch) itemsByMeal.lunch = [day.lunch];
  if (itemsByMeal.dinner.length === 0 && day.dinner) itemsByMeal.dinner = [day.dinner];

  const mealCals = {
    breakfast: itemsByMeal.breakfast.reduce((s, i) => s + (i.calories_per_serving || 0), 0) * familyMembers,
    lunch:     itemsByMeal.lunch.reduce((s, i) => s + (i.calories_per_serving || 0), 0) * familyMembers,
    dinner:    itemsByMeal.dinner.reduce((s, i) => s + (i.calories_per_serving || 0), 0) * familyMembers,
  };

  const totalCal = mealCals.breakfast + mealCals.lunch + mealCals.dinner;
  const pct = requiredCalories > 0 ? Math.min(100, Math.round((totalCal / requiredCalories) * 100)) : 0;
  const isGood = requiredCalories ? totalCal >= requiredCalories * 0.85 : totalCal > 0;
  const isOver = requiredCalories ? totalCal > requiredCalories * 1.05 : false;
  const barColor = isOver ? 'bg-rose-400' : isGood ? 'bg-emerald-500' : 'bg-amber-400';
  const calColor = isOver ? 'text-rose-600' : isGood ? 'text-emerald-600' : 'text-gray-500';
  const statusLabel = isOver ? '▲ Over target' : isGood ? '✓ On track' : requiredCalories > 0 ? `${(requiredCalories - totalCal).toLocaleString()} kcal remaining` : '';
  const statusColor = isOver ? 'text-rose-500' : isGood ? 'text-emerald-500' : 'text-amber-500';

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col">

      {/* Top: kcal tracker bar */}
      <div className="flex items-center gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
        {/* Day label */}
        <div className="shrink-0 flex items-center gap-3 w-32">
          <div className="bg-gradient-to-b from-gray-800 to-gray-700 rounded-xl px-3 py-2 text-center min-w-[56px]">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-none">{dayName}</p>
            <p className="text-white font-extrabold text-xl leading-tight">{dateNum}</p>
            <p className="text-white/50 text-[10px] font-semibold leading-none">{monthName}</p>
          </div>
        </div>

        {/* Progress bar + stats */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={15} className={isOver ? 'text-rose-400' : isGood ? 'text-emerald-500' : 'text-amber-400'} />
              <span className={`text-base font-extrabold ${calColor}`}>{totalCal.toLocaleString()} kcal</span>
              {requiredCalories > 0 && (
                <span className="text-sm text-gray-400 font-medium">/ {requiredCalories.toLocaleString()} kcal target</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {familyMembers > 1 && totalCal > 0 && (
                <span className="text-xs text-gray-400 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">
                  ~{Math.round(totalCal / familyMembers).toLocaleString()} kcal/person
                </span>
              )}
              {statusLabel && (
                <span className={`text-xs font-bold ${statusColor}`}>{statusLabel}</span>
              )}
              {requiredCalories > 0 && (
                <span className="text-xs font-bold text-gray-400">{pct}%</span>
              )}
            </div>
          </div>

          {/* Segmented progress bar */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
            {requiredCalories > 0 ? (
              <>
                {/* Breakfast segment */}
                <div
                  className="h-full bg-orange-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (mealCals.breakfast / requiredCalories) * 100)}%` }}
                />
                {/* Lunch segment */}
                <div
                  className="h-full bg-sky-400 transition-all duration-500"
                  style={{ width: `${Math.min(100 - Math.min(100, (mealCals.breakfast / requiredCalories) * 100), (mealCals.lunch / requiredCalories) * 100)}%` }}
                />
                {/* Dinner segment */}
                <div
                  className={`h-full ${isOver ? 'bg-rose-400' : 'bg-violet-500'} transition-all duration-500`}
                  style={{ width: `${Math.min(100 - Math.min(100, ((mealCals.breakfast + mealCals.lunch) / requiredCalories) * 100), (mealCals.dinner / requiredCalories) * 100)}%` }}
                />
              </>
            ) : (
              <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: totalCal > 0 ? '100%' : '0%' }} />
            )}
          </div>

          {/* Per-meal micro labels */}
          {requiredCalories > 0 && (
            <div className="flex gap-3">
              {MEALS.map(({ key, icon, trackColor }) => (
                <span key={key} className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                  <span className={`inline-block w-2 h-2 rounded-full ${trackColor}`} />
                  {icon} {mealCals[key] > 0 ? `${mealCals[key]} kcal` : '—'}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Meal columns */}
      <div className="flex flex-1 divide-x divide-gray-100">
        {MEALS.map(({ key, icon, label, gradient, bg, text, cal, headerBg, dot, divider }) => {
          const items = itemsByMeal[key];
          const mealTotal = mealCals[key];
          const hasMeal = items.length > 0;

          return (
            <div key={key} className={`flex-1 flex flex-col ${hasMeal ? bg : 'bg-white'}`}>
              <button
                onClick={() => onSwap && onSwap(key)}
                className={`flex items-center justify-between px-4 py-2.5 ${headerBg} hover:brightness-95 transition-all border-b ${divider}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-sm shadow-sm`}>
                    {icon}
                  </div>
                  <span className={`text-sm font-bold ${text} uppercase tracking-wide`}>{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {mealTotal > 0 && (
                    <span className={`text-sm font-extrabold ${cal}`}>{mealTotal} kcal</span>
                  )}
                  <RefreshCw size={12} className="text-gray-300" />
                </div>
              </button>

              <div className="flex-1 px-4 py-3">
                {hasMeal ? (
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div key={item.id || idx} className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full ${dot} shrink-0 mt-1.5`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 leading-snug">{item.name}</p>
                          <p className="text-xs text-gray-400">
                            {item.cuisine_type} · {familyMembers > 1 ? (item.calories_per_serving || 0) * familyMembers : item.calories_per_serving} kcal
                            {familyMembers > 1 && <span className="text-gray-300"> ({item.calories_per_serving}/person)</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-300 mt-1">tap header to add</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
