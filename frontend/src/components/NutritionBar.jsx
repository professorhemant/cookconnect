import React from 'react';

export default function NutritionBar({ label, value, max, unit, color = 'bg-emerald-500' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-12 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-700 w-12 text-right flex-shrink-0">
        {value}{unit}
      </span>
    </div>
  );
}
