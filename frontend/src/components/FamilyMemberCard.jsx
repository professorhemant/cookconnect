import React from 'react';
import { Edit2, Trash2, Activity } from 'lucide-react';

const activityColors = {
  sedentary: 'bg-gray-100 text-gray-600',
  moderate: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700'
};

const avatarColors = [
  'bg-emerald-500', 'bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'
];

export default function FamilyMemberCard({ member, nutrition, index, onEdit, onDelete }) {
  const bgColor = avatarColors[index % avatarColors.length];
  const conditions = member.health_conditions
    ? member.health_conditions.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
            <span className="text-lg font-bold text-white">
              {member.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-500">
              {member.age} yrs • {member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(member)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activityColors[member.activity_level]}`}>
          <Activity size={10} className="inline mr-1" />
          {member.activity_level}
        </span>
      </div>

      {conditions.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1.5">Health conditions</p>
          <div className="flex flex-wrap gap-1">
            {conditions.map(c => (
              <span key={c} className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full">
                {c.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {nutrition && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-600 mb-2">Daily calorie target</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-600">
              {nutrition.calories_min.toLocaleString()}–{nutrition.calories_max.toLocaleString()} kcal
            </span>
            <span className="text-xs text-gray-500">Protein: {nutrition.protein_g}g</span>
          </div>
          <div className="mt-1.5 bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(100, (nutrition.calories_min / 3000) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
