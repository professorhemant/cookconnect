import React from 'react';
import { Flame, AlertTriangle } from 'lucide-react';

const MEAL_COLORS = {
  breakfast: 'bg-orange-50 text-orange-700',
  lunch:     'bg-blue-50 text-blue-700',
  dinner:    'bg-purple-50 text-purple-700',
  snack:     'bg-teal-50 text-teal-700',
};
const MEAL_PREFIX = { breakfast: 'B', lunch: 'L', dinner: 'D', snack: 'S' };

export default function MealCell({ day, onEdit, requiredCalories, familyMembers = 1 }) {
  if (!day) {
    return (
      <div className="bg-gray-50 rounded-lg border border-dashed border-gray-200 p-2 text-center text-xs text-gray-400 min-h-24">
        No plan
      </div>
    );
  }

  const date = new Date(day.day_date + 'T00:00:00');
  const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
  const dateNum = date.getDate();
  const displayCalories = day.total_calories * familyMembers;
  const isLow = requiredCalories && displayCalories < requiredCalories;

  // Use mealItems (multiple per meal) if available, else fall back to single-item fields
  const hasMealItems = day.mealItems && day.mealItems.length > 0;

  return (
    <div
      className={`bg-white rounded-lg border p-2 cursor-pointer hover:shadow-sm transition-all ${
        isLow ? 'border-amber-400 ring-1 ring-amber-300' : 'border-gray-100 hover:border-emerald-300'
      }`}
      onClick={() => onEdit && onEdit(day)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-gray-700">{dayName} {dateNum}</span>
        <div className={`flex items-center gap-0.5 ${isLow ? 'text-amber-500' : 'text-orange-500'}`}>
          <Flame size={10} />
          <span className="text-xs font-medium">{displayCalories}</span>
        </div>
      </div>

      <div className="space-y-1">
        {hasMealItems ? (
          ['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
            const items = day.mealItems.filter(mi => mi.meal_type === type);
            if (!items.length) return null;
            return items.map((mi, idx) => (
              <div key={mi.id || idx} className={`text-xs px-1.5 py-0.5 rounded truncate ${MEAL_COLORS[type]}`}>
                {MEAL_PREFIX[type]}: {mi.menuItem?.name || '—'}
              </div>
            ));
          })
        ) : (
          <>
            {day.breakfast && (
              <div className="text-xs bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded truncate">
                B: {day.breakfast.name}
              </div>
            )}
            {day.lunch && (
              <div className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded truncate">
                L: {day.lunch.name}
              </div>
            )}
            {day.dinner && (
              <div className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded truncate">
                D: {day.dinner.name}
              </div>
            )}
          </>
        )}

        {/* Add-ons always from single fields */}
        {day.breakfastAddon && (
          <div className="text-xs bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded truncate">
            +B: {day.breakfastAddon.name}
          </div>
        )}
        {day.morningSnack && (
          <div className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded truncate">
            +L: {day.morningSnack.name}
          </div>
        )}
        {day.eveningSnack && (
          <div className="text-xs bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded truncate">
            +D: {day.eveningSnack.name}
          </div>
        )}
      </div>

      {isLow && (
        <div className="flex items-center gap-1 mt-1.5 bg-amber-50 rounded px-1.5 py-0.5">
          <AlertTriangle size={9} className="text-amber-500 shrink-0" />
          <span className="text-xs text-amber-600 font-semibold truncate">Low cal</span>
        </div>
      )}
    </div>
  );
}
