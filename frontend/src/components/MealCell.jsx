import React from 'react';
import { Flame } from 'lucide-react';

export default function MealCell({ day, onEdit }) {
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

  return (
    <div
      className="bg-white rounded-lg border border-gray-100 p-2 cursor-pointer hover:border-emerald-300 hover:shadow-sm transition-all"
      onClick={() => onEdit && onEdit(day)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-gray-700">{dayName} {dateNum}</span>
        <div className="flex items-center gap-0.5 text-orange-500">
          <Flame size={10} />
          <span className="text-xs font-medium">{day.total_calories}</span>
        </div>
      </div>
      <div className="space-y-1">
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
      </div>
    </div>
  );
}
