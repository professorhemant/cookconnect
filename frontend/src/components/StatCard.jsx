import React from 'react';

export default function StatCard({ icon: Icon, label, value, sub, color = 'emerald', trend }) {
  const colorMap = {
    emerald: { grad: 'from-emerald-500 to-green-400', shadow: 'shadow-emerald-200' },
    teal:    { grad: 'from-teal-500 to-cyan-400',     shadow: 'shadow-teal-200' },
    blue:    { grad: 'from-blue-500 to-indigo-400',   shadow: 'shadow-blue-200' },
    orange:  { grad: 'from-orange-500 to-amber-400',  shadow: 'shadow-orange-200' },
    purple:  { grad: 'from-purple-500 to-violet-400', shadow: 'shadow-purple-200' },
  };
  const c = colorMap[color] || colorMap.emerald;

  return (
    <div className={`bg-gradient-to-br ${c.grad} rounded-2xl p-5 shadow-lg ${c.shadow} text-white relative overflow-hidden`}>
      {/* Decorative circle */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -right-2 w-28 h-28 rounded-full bg-white/10" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{label}</p>
          <p className="text-3xl font-extrabold mt-1 drop-shadow">{value}</p>
          {sub && <p className="text-xs text-white/80 mt-0.5">{sub}</p>}
          {trend && (
            <span className="text-xs font-semibold mt-1 inline-block bg-white/20 px-2 py-0.5 rounded-full">
              {trend.label}
            </span>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
