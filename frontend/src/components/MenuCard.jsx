import React, { useState } from 'react';
import { Clock, ChefHat, Flame, Leaf, ChevronDown, ChevronUp } from 'lucide-react';
import NutritionBar from './NutritionBar';

const difficultyColor = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700'
};

const mealTypeColor = {
  breakfast: 'bg-orange-100 text-orange-700',
  lunch: 'bg-blue-100 text-blue-700',
  dinner: 'bg-purple-100 text-purple-700',
  snack: 'bg-pink-100 text-pink-700'
};

export default function MenuCard({ item, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${mealTypeColor[item.meal_type] || 'bg-gray-100 text-gray-700'}`}>
                {item.meal_type}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor[item.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                {item.difficulty}
              </span>
              {item.is_vegetarian && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-0.5">
                  <Leaf size={10} /> Veg
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{item.cuisine_type}</p>
          </div>
          <div className="flex items-center gap-1 ml-3 bg-orange-50 px-2 py-1 rounded-lg">
            <Flame size={13} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-700">{item.calories_per_serving}</span>
            <span className="text-xs text-orange-500">kcal</span>
          </div>
        </div>

        {item.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {(item.prep_time_minutes || 0) + (item.cook_time_minutes || 0)} min
          </span>
          <span className="flex items-center gap-1">
            <ChefHat size={12} />
            1 serving
          </span>
        </div>

        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-emerald-600 font-medium py-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          {expanded ? <><ChevronUp size={14} /> Less details</> : <><ChevronDown size={14} /> More details</>}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Nutrition per serving</p>
              <div className="space-y-1.5">
                <NutritionBar label="Protein" value={item.protein_g} max={60} unit="g" color="bg-blue-500" />
                <NutritionBar label="Carbs" value={item.carbs_g} max={120} unit="g" color="bg-yellow-400" />
                <NutritionBar label="Fat" value={item.fat_g} max={50} unit="g" color="bg-orange-400" />
                <NutritionBar label="Fiber" value={item.fiber_g} max={30} unit="g" color="bg-emerald-500" />
              </div>
            </div>

            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1.5">Ingredients</p>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.map(ing => (
                    <span key={ing.id} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {ing.quantity} {ing.unit} {ing.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.kitchen_equipment && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Equipment needed</p>
                <div className="flex flex-wrap gap-1">
                  {item.kitchen_equipment.split(',').map(eq => (
                    <span key={eq} className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full">
                      {eq.trim().replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {onSelect && (
              <button
                onClick={() => onSelect(item)}
                className="w-full py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Select this item
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
