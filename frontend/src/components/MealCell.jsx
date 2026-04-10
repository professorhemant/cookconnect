import React from 'react';
import { Flame, RefreshCw } from 'lucide-react';

const MEALS = [
  {
    key: 'breakfast',
    icon: '🌅',
    label: 'Breakfast',
    gradient: 'from-amber-400 to-orange-500',
    lightBg: 'bg-orange-50',
    border: 'border-orange-100',
    text: 'text-orange-700',
    calColor: 'text-orange-400',
  },
  {
    key: 'lunch',
    icon: '☀️',
    label: 'Lunch',
    gradient: 'from-sky-400 to-blue-500',
    lightBg: 'bg-sky-50',
    border: 'border-sky-100',
    text: 'text-sky-700',
    calColor: 'text-sky-400',
  },
  {
    key: 'dinner',
    icon: '🌙',
    label: 'Dinner',
    gradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50',
    border: 'border-violet-100',
    text: 'text-violet-700',
    calColor: 'text-violet-400',
  },
];

export default function MealCell({ day, onSwap, requiredCalories }) {
  if (!day) {
    return (
      <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-3 text-center text-xs text-gray-400 min-h-40 flex items-center justify-center">
        No plan
      </div>
    );
  }

  const date = new Date(day.day_date + 'T00:00:00');
  const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
  const dateNum = date.getDate();
  const monthName = date.toLocaleDateString('en-IN', { month: 'short' });

  // Calculate from actual meal items to avoid stale DB total
  const totalCal =
    (day.breakfast?.calories_per_serving || 0) +
    (day.lunch?.calories_per_serving || 0) +
    (day.dinner?.calories_per_serving || 0);

  const isLow = requiredCalories && totalCal < requiredCalories * 0.7;
  const isGood = requiredCalories ? totalCal >= requiredCalories * 0.9 : totalCal > 0;

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        isLow ? 'border-amber-200' : 'border-gray-100 hover:border-emerald-200'
      } bg-white`}
    >
      {/* Day header */}
      <div
        className={`px-3 py-2.5 text-center ${
          isLow
            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
            : 'bg-gradient-to-r from-emerald-500 to-teal-500'
        }`}
      >
        <p className="text-white font-extrabold text-sm leading-none tracking-wide">{dayName}</p>
        <p className="text-white/75 text-[10px] font-semibold mt-0.5 uppercase tracking-wide">
          {dateNum} {monthName}
        </p>
      </div>

      {/* Meal rows */}
      <div className="p-2 space-y-1.5">
        {MEALS.map(({ key, icon, label, gradient, lightBg, border, text, calColor }) => {
          const item = day[key];
          return (
            <button
              key={key}
              onClick={() => onSwap && onSwap(key)}
              title={`Swap ${label}`}
              className={`w-full text-left rounded-xl border transition-all duration-150 group/meal ${
                item
                  ? `${lightBg} ${border} hover:shadow-sm hover:brightness-95`
                  : 'bg-gray-50 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40'
              }`}
            >
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div
                  className={`w-6 h-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}
                  style={{ fontSize: '11px' }}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  {item ? (
                    <>
                      <p className={`text-[10px] font-bold ${text} truncate leading-tight`}>{item.name}</p>
                      <p className={`text-[9px] ${calColor} font-semibold mt-0.5`}>{item.calories_per_serving} kcal</p>
                    </>
                  ) : (
                    <p className="text-[10px] text-gray-300 italic">tap to add</p>
                  )}
                </div>
                {item && (
                  <RefreshCw
                    size={8}
                    className="text-gray-300 opacity-0 group-hover/meal:opacity-70 shrink-0 transition-opacity"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Total calories footer */}
      <div className="px-2 pb-2.5">
        <div
          className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 ${
            isLow ? 'bg-amber-50' : isGood ? 'bg-emerald-50' : 'bg-gray-50'
          }`}
        >
          <Flame
            size={10}
            className={isLow ? 'text-amber-500' : isGood ? 'text-emerald-500' : 'text-gray-400'}
          />
          <span
            className={`text-[11px] font-extrabold tracking-tight ${
              isLow ? 'text-amber-600' : isGood ? 'text-emerald-600' : 'text-gray-500'
            }`}
          >
            {totalCal} kcal
          </span>
        </div>
      </div>
    </div>
  );
}
