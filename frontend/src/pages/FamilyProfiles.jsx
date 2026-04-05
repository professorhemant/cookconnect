import React, { useEffect, useState } from 'react';
import { Plus, X, RefreshCw, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import {
  getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember,
  getFamilyNutrition, getFamilySummary
} from '../api';
import FamilyMemberCard from '../components/FamilyMemberCard';

const HEALTH_CONDITIONS = ['diabetes', 'hypertension', 'obesity', 'lactose_intolerant', 'gluten_free'];
const emptyForm = { name: '', age: '', gender: 'male', health_conditions: '', dietary_restrictions: '', activity_level: 'moderate' };

export default function FamilyProfiles() {
  const { currentUser } = useApp();
  const [members, setMembers] = useState([]);
  const [nutritionMap, setNutritionMap] = useState({});
  const [familySummary, setFamilySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState([]);

  useEffect(() => { if (currentUser) loadAll(); }, [currentUser]);

  async function loadAll() {
    setLoading(true);
    try {
      const res = await getFamilyMembers(currentUser.id);
      const mems = res.data;
      setMembers(mems);

      const nutritionResults = await Promise.allSettled(
        mems.map(m => getFamilyNutrition(m.id))
      );
      const nMap = {};
      nutritionResults.forEach((r, i) => {
        if (r.status === 'fulfilled') nMap[mems[i].id] = r.value.data.nutrition;
      });
      setNutritionMap(nMap);

      try {
        const summaryRes = await getFamilySummary(currentUser.id);
        setFamilySummary(summaryRes.data);
      } catch {}
    } catch {}
    finally { setLoading(false); }
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setSelectedConditions([]);
    setShowModal(true);
  }

  function openEdit(member) {
    setEditing(member);
    const conditions = member.health_conditions
      ? member.health_conditions.split(',').map(c => c.trim()).filter(Boolean)
      : [];
    setSelectedConditions(conditions);
    setForm({
      name: member.name, age: member.age, gender: member.gender,
      health_conditions: member.health_conditions || '',
      dietary_restrictions: member.dietary_restrictions || '',
      activity_level: member.activity_level
    });
    setShowModal(true);
  }

  function toggleCondition(cond) {
    setSelectedConditions(prev => {
      const next = prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond];
      setForm(f => ({ ...f, health_conditions: next.join(',') }));
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const data = { ...form, user_id: currentUser.id };
      if (editing) {
        await updateFamilyMember(editing.id, data);
      } else {
        await addFamilyMember(data);
      }
      setShowModal(false);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this family member?')) return;
    try {
      await deleteFamilyMember(id);
      loadAll();
    } catch {}
  }

  const chartData = familySummary?.members?.map(({ member, nutrition }) => ({
    name: member.name,
    calories: nutrition ? Math.round((nutrition.calories_min + nutrition.calories_max) / 2) : 0,
    protein: nutrition?.protein_g || 0
  })) || [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Profiles</h1>
          <p className="text-gray-500 text-sm mt-0.5">{members.length} members in {currentUser?.family_name || 'your family'}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" /></div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No family members yet</p>
          <p className="text-gray-400 text-sm mt-1">Add family members to get personalized nutrition recommendations</p>
          <button onClick={openAdd} className="mt-4 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700">
            Add First Member
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {members.map((member, i) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                nutrition={nutritionMap[member.id]}
                index={i}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {chartData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Family Nutrition Summary</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Daily Calorie Needs</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} barSize={28}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => [`${v.toLocaleString()} kcal`]} />
                      <Bar dataKey="calories" name="Calories" fill="#059669" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Protein Requirements (g/day)</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} barSize={28}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => [`${v}g`]} />
                      <Bar dataKey="protein" name="Protein" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {familySummary?.familyTotals && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-700 mb-3">Family Daily Totals</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Calories', value: `${familySummary.familyTotals.calories_min.toLocaleString()}–${familySummary.familyTotals.calories_max.toLocaleString()}`, unit: 'kcal' },
                      { label: 'Protein', value: Math.round(familySummary.familyTotals.protein_g), unit: 'g' },
                      { label: 'Carbs', value: Math.round(familySummary.familyTotals.carbs_g), unit: 'g' },
                      { label: 'Fat', value: Math.round(familySummary.familyTotals.fat_g), unit: 'g' }
                    ].map(({ label, value, unit }) => (
                      <div key={label} className="bg-emerald-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="text-lg font-bold text-emerald-700 mt-0.5">{value}</p>
                        <p className="text-xs text-emerald-500">{unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Member' : 'Add Family Member'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Priya" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="35" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['sedentary', 'moderate', 'active'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, activity_level: level }))}
                      className={`py-2 rounded-lg border text-sm font-medium capitalize transition-all ${
                        form.activity_level === level
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Conditions</label>
                <div className="flex flex-wrap gap-2">
                  {HEALTH_CONDITIONS.map(cond => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedConditions.includes(cond)
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-red-300'
                      }`}
                    >
                      {cond.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
                <input value={form.dietary_restrictions} onChange={e => setForm(f => ({ ...f, dietary_restrictions: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., no onion, no garlic" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving || !form.name || !form.age}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
