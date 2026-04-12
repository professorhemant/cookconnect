import React, { useEffect, useState, useRef } from 'react';
import { Search, Filter, Plus, X, RefreshCw, Sparkles } from 'lucide-react';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, estimateNutrition, getFamilyMembers } from '../api';
import MenuCard from '../components/MenuCard';
import { useApp } from '../context/AppContext';

const TABS = [
  { key: 'all', label: 'All', mealType: null },
  { key: 'breakfast', label: 'Breakfast', mealType: 'breakfast' },
  { key: 'lunch', label: 'Lunch', mealType: 'lunch' },
  { key: 'dinner', label: 'Dinner', mealType: 'dinner' },
  { key: 'breakfastAddon', label: 'Add Ons for Breakfast', mealType: 'snack' },
  { key: 'lunchAddon', label: 'Add Ons for Lunch', mealType: 'snack' },
  { key: 'dinnerAddon', label: 'Add Ons for Dinner', mealType: 'snack' },
];
const CUISINES = ['Indian', 'North Indian', 'South Indian', 'Punjabi', 'Gujarati', 'Mughal', 'International'];

const emptyForm = {
  name: '', meal_type: 'breakfast', description: '', cuisine_type: 'Indian',
  prep_time_minutes: '', cook_time_minutes: '', servings: 1,
  calories_per_serving: '', protein_g: '', carbs_g: '', fat_g: '', fiber_g: '',
  kitchen_equipment: '', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
  ingredients: []
};

export default function MenuLibrary() {
  const { currentUser } = useApp();
  const [familyCount, setFamilyCount] = useState(4);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [maxCal, setMaxCal] = useState(1000);
  const [cuisine, setCuisine] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [ingLine, setIngLine] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFilledFields, setAiFilledFields] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiRetryIn, setAiRetryIn] = useState(0);
  const retryTimerRef = useRef(null);
  const [aiBaseNutrition, setAiBaseNutrition] = useState(null);
  const [aiBaseServings, setAiBaseServings] = useState(1);
  const [editItem, setEditItem] = useState(null); // item being edited (null = add mode)

  useEffect(() => { loadItems(); }, [tab, vegOnly, cuisine]);

  useEffect(() => {
    if (currentUser?.id) {
      getFamilyMembers(currentUser.id)
        .then(res => { if (res.data?.length > 0) setFamilyCount(res.data.length); })
        .catch(() => {});
    }
  }, [currentUser]);

  useEffect(() => {
    if (form.name.trim().length < 3 || aiFilledFields) return;
    const timer = setTimeout(() => { handleAutoFill(); }, 1800);
    return () => clearTimeout(timer);
  }, [form.name]);

  async function loadItems() {
    setLoading(true);
    try {
      const params = {};
      const activeTab = TABS.find(t => t.key === tab);
      if (activeTab?.mealType) params.meal_type = activeTab.mealType;
      if (vegOnly) params.is_vegetarian = true;
      if (cuisine) params.cuisine_type = cuisine;
      const res = await getMenuItems(params);
      setItems(res.data);
    } catch {}
    finally { setLoading(false); }
  }

  const filtered = items.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchCal = item.calories_per_serving <= maxCal;
    return matchSearch && matchCal;
  });

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function addIngredient() {
    const parts = ingLine.trim().split(',');
    if (parts.length < 2) return;
    const [name, quantity, unit = '', notes = ''] = parts.map(p => p.trim());
    setForm(f => ({ ...f, ingredients: [...f.ingredients, { name, quantity, unit, notes }] }));
    setIngLine('');
  }

  function removeIngredient(idx) {
    setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, i) => i !== idx) }));
  }

  async function handleAutoFill() {
    if (!form.name.trim()) return;
    setAiLoading(true);
    try {
      const currentServings = parseFloat(form.servings) || 1;
      const res = await estimateNutrition({
        name: form.name,
        cuisine_type: form.cuisine_type,
        description: form.description,
        ingredients: form.ingredients,
        servings: currentServings
      });
      const { ingredients: aiIngredients, ...rest } = res.data;
      setAiBaseNutrition({
        calories_per_serving: rest.calories_per_serving,
        protein_g: rest.protein_g,
        carbs_g: rest.carbs_g,
        fat_g: rest.fat_g,
        fiber_g: rest.fiber_g,
      });
      setAiBaseServings(currentServings);
      setForm(f => ({
        ...f,
        ...rest,
        ingredients: aiIngredients && aiIngredients.length > 0 ? aiIngredients : f.ingredients
      }));
      setAiFilledFields(true);
    } catch (err) {
      const retryAfter = err.response?.data?.retryAfter;
      if (retryAfter) {
        setAiRetryIn(retryAfter);
        setAiError(`AI quota limit hit — auto-retrying in ${retryAfter}s`);
        clearInterval(retryTimerRef.current);
        retryTimerRef.current = setInterval(() => {
          setAiRetryIn(prev => {
            if (prev <= 1) {
              clearInterval(retryTimerRef.current);
              setAiError('');
              handleAutoFill();
              return 0;
            }
            setAiError(`AI quota limit hit — auto-retrying in ${prev - 1}s`);
            return prev - 1;
          });
        }, 1000);
      } else {
        setAiError('Auto-fill failed — enter nutrition manually.');
      }
    } finally {
      setAiLoading(false);
    }
  }

  function handleEdit(item) {
    setEditItem(item);
    setForm({
      name: item.name || '',
      meal_type: item.meal_type || 'breakfast',
      description: item.description || '',
      cuisine_type: item.cuisine_type || 'Indian',
      prep_time_minutes: item.prep_time_minutes ?? '',
      cook_time_minutes: item.cook_time_minutes ?? '',
      servings: item.servings ?? 1,
      calories_per_serving: item.calories_per_serving ?? '',
      protein_g: item.protein_g ?? '',
      carbs_g: item.carbs_g ?? '',
      fat_g: item.fat_g ?? '',
      fiber_g: item.fiber_g ?? '',
      kitchen_equipment: item.kitchen_equipment || '',
      difficulty: item.difficulty || 'easy',
      is_vegetarian: item.is_vegetarian ?? true,
      is_vegan: item.is_vegan ?? false,
      sub_category: item.sub_category || '',
      ingredients: item.ingredients?.map(i => ({ name: i.name, quantity: i.quantity, unit: i.unit || '', notes: i.notes || '' })) || []
    });
    setAiFilledFields(false);
    setAiBaseNutrition(null);
    setAiBaseServings(item.servings ?? 1);
    setAiError('');
    setShowAdd(true);
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await deleteMenuItem(item.id);
      loadItems();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete item');
    }
  }

  function handleServingsChange(e) {
    const raw = e.target.value;
    const newServings = parseFloat(raw) || 1;
    setForm(f => {
      const updated = { ...f, servings: raw };
      if (aiFilledFields && aiBaseNutrition && aiBaseServings) {
        const ratio = aiBaseServings / newServings;
        if (aiBaseNutrition.calories_per_serving) updated.calories_per_serving = Math.round(aiBaseNutrition.calories_per_serving * ratio);
        if (aiBaseNutrition.protein_g) updated.protein_g = Math.round(aiBaseNutrition.protein_g * ratio * 10) / 10;
        if (aiBaseNutrition.carbs_g) updated.carbs_g = Math.round(aiBaseNutrition.carbs_g * ratio * 10) / 10;
        if (aiBaseNutrition.fat_g) updated.fat_g = Math.round(aiBaseNutrition.fat_g * ratio * 10) / 10;
        if (aiBaseNutrition.fiber_g) updated.fiber_g = Math.round(aiBaseNutrition.fiber_g * ratio * 10) / 10;
      }
      return updated;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editItem) {
        await updateMenuItem(editItem.id, form);
      } else {
        await createMenuItem(form);
      }
      setShowAdd(false);
      setEditItem(null);
      setForm(emptyForm);
      setAiFilledFields(false);
      setAiBaseNutrition(null);
      setAiBaseServings(1);
      loadItems();
    } catch (err) {
      alert(err.response?.data?.error || `Failed to ${editItem ? 'update' : 'create'} item`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Library</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} items available</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setAiFilledFields(false); setAiBaseNutrition(null); setAiBaseServings(1); setAiError(""); setShowAdd(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Dish
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap bg-gray-100 rounded-lg p-1 gap-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={cuisine} onChange={e => setCuisine(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All cuisines</option>
            {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500">Max {maxCal} kcal</span>
            <input
              type="range" min={200} max={1000} step={50} value={maxCal}
              onChange={e => setMaxCal(Number(e.target.value))}
              className="w-28 accent-emerald-600"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setVegOnly(v => !v)}
              className={`w-10 h-5 rounded-full transition-colors relative ${vegOnly ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow ${vegOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-gray-600">Veg only</span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400">No dishes found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(item => <MenuCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />)}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editItem ? `Edit: ${editItem.name}` : 'Add New Dish'}</h2>
              <button onClick={() => { setShowAdd(false); setEditItem(null); setAiFilledFields(false); setAiError(""); setAiBaseNutrition(null); setAiBaseServings(1); setForm(emptyForm); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name</label>
                  <input name="name" value={form.name} onChange={e => { handleFormChange(e); setAiFilledFields(false); setAiLoading(false); setAiError(''); setAiRetryIn(0); clearInterval(retryTimerRef.current); setAiBaseNutrition(null); setAiBaseServings(1); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., Dal Makhani" />
                </div>
                {form.name.trim() && (
                  <div className="col-span-2 flex items-center gap-3">
                    {aiLoading ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">
                        <RefreshCw size={13} className="animate-spin" /> Analyzing nutrition...
                      </span>
                    ) : aiFilledFields ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg">
                        <Sparkles size={13} /> Nutrition auto-filled by AI
                      </span>
                    ) : aiError ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg">
                        ⚠ {aiError}
                      </span>
                    ) : null}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                  <select name="meal_type" value={form.meal_type} onChange={handleFormChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                  <select name="cuisine_type" value={form.cuisine_type} onChange={handleFormChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange}
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Brief description..." />
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 italic">These fields are optional — nutrition &amp; details are auto-filled by AI as you type the dish name</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <input type="number" name="prep_time_minutes" value={form.prep_time_minutes} onChange={handleFormChange}
                    placeholder="e.g., 15"
                    className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${aiFilledFields ? 'bg-emerald-50' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
                  <input type="number" name="cook_time_minutes" value={form.cook_time_minutes} onChange={handleFormChange}
                    placeholder="e.g., 25"
                    className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${aiFilledFields ? 'bg-emerald-50' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories/serving</label>
                  <input type="number" name="calories_per_serving" value={form.calories_per_serving} onChange={handleFormChange}
                    placeholder="e.g., 350"
                    className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${aiFilledFields ? 'bg-emerald-50' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
                  <input type="number" name="servings" value={form.servings} onChange={handleServingsChange}
                    min="1" step="1"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                  <input type="number" name="protein_g" value={form.protein_g} onChange={handleFormChange}
                    placeholder="e.g., 12.5"
                    className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${aiFilledFields ? 'bg-emerald-50' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                  <input type="number" name="carbs_g" value={form.carbs_g} onChange={handleFormChange}
                    placeholder="e.g., 45"
                    className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${aiFilledFields ? 'bg-emerald-50' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                  <input type="number" name="fat_g" value={form.fat_g} onChange={handleFormChange}
                    placeholder="e.g., 8.5"
                    className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${aiFilledFields ? 'bg-emerald-50' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fiber (g)</label>
                  <input type="number" name="fiber_g" value={form.fiber_g} onChange={handleFormChange}
                    placeholder="e.g., 4"
                    className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${aiFilledFields ? 'bg-emerald-50' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select name="difficulty" value={form.difficulty} onChange={handleFormChange}
                    className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${aiFilledFields ? 'bg-emerald-50' : ''}`}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kitchen Equipment (comma-separated)</label>
                  <input name="kitchen_equipment" value={form.kitchen_equipment} onChange={handleFormChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="kadai, tawa, pressure_cooker" />
                </div>
                <div className={`flex items-center gap-6 ${aiFilledFields ? 'p-2 bg-emerald-50 rounded-lg' : ''}`}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="is_vegetarian" checked={form.is_vegetarian} onChange={handleFormChange} className="accent-emerald-600" />
                    <span className="text-sm">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="is_vegan" checked={form.is_vegan} onChange={handleFormChange} className="accent-emerald-600" />
                    <span className="text-sm">Vegan</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Ingredient (name, qty, unit, notes)</label>
                <div className="flex gap-2">
                  <input value={ingLine} onChange={e => setIngLine(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addIngredient()}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., Rice, 1, cup, soaked" />
                  <button onClick={addIngredient} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                    Add
                  </button>
                </div>
                {form.ingredients.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.ingredients.map((ing, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                        {ing.quantity} {ing.unit} {ing.name}
                        <button onClick={() => removeIngredient(i)} className="ml-1 text-emerald-500 hover:text-red-500">
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowAdd(false); setEditItem(null); setAiFilledFields(false); setAiError(""); setAiBaseNutrition(null); setAiBaseServings(1); setForm(emptyForm); }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving || !form.name}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
                  {saving ? 'Saving...' : editItem ? 'Save Changes' : 'Add Dish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
