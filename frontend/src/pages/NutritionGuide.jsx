import React, { useEffect, useState } from 'react';
import { Heart, RefreshCw, Search } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis
} from 'recharts';
import { getNutritionRequirements, getNutritionForProfile, getFamilySummary } from '../api';
import { useApp } from '../context/AppContext';
import NutritionBar from '../components/NutritionBar';

const AGE_GROUPS = [
  { label: 'Toddler', range: '1–3 years', min: 1 },
  { label: 'Child', range: '4–8 years', min: 4 },
  { label: 'Pre-teen', range: '9–13 years', min: 9 },
  { label: 'Teenager', range: '14–18 years', min: 14 },
  { label: 'Young Adult', range: '19–30 years', min: 19 },
  { label: 'Adult', range: '31–50 years', min: 31 },
  { label: 'Senior', range: '51+ years', min: 51 }
];

export default function NutritionGuide() {
  const { currentUser } = useApp();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [familySummary, setFamilySummary] = useState(null);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [profileAge, setProfileAge] = useState('');
  const [profileGender, setProfileGender] = useState('male');
  const [profileActivity, setProfileActivity] = useState('moderate');
  const [profileResult, setProfileResult] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await getNutritionRequirements();
      setRequirements(res.data);

      if (currentUser) {
        const summaryRes = await getFamilySummary(currentUser.id);
        setFamilySummary(summaryRes.data);
      }
    } catch {}
    finally { setLoading(false); }
  }

  async function lookupProfile() {
    if (!profileAge) return;
    setProfileLoading(true);
    setProfileResult(null);
    try {
      const res = await getNutritionForProfile(profileAge, profileGender, profileActivity);
      setProfileResult(res.data);
    } catch (err) {
      setProfileResult({ error: 'No data found for this profile' });
    } finally {
      setProfileLoading(false);
    }
  }

  function getGroupRequirements(ageMin) {
    return requirements.filter(r => r.age_min === ageMin);
  }

  const radarData = profileResult && !profileResult.error ? [
    { subject: 'Calories', A: profileResult.calories_min, fullMark: 3000 },
    { subject: 'Protein', A: profileResult.protein_g * 10, fullMark: 700 },
    { subject: 'Carbs', A: profileResult.carbs_g, fullMark: 400 },
    { subject: 'Fat', A: profileResult.fat_g * 3, fullMark: 300 },
    { subject: 'Fiber', A: profileResult.fiber_g * 10, fullMark: 350 }
  ] : [];

  const familyChartData = familySummary?.members?.map(({ member, nutrition }) => ({
    name: member.name,
    calories: nutrition ? Math.round((nutrition.calories_min + nutrition.calories_max) / 2) : 0,
    protein: nutrition?.protein_g || 0,
    carbs: nutrition?.carbs_g || 0,
    fat: nutrition?.fat_g || 0
  })) || [];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nutrition Guide</h1>
        <p className="text-gray-500 text-sm mt-0.5">Age-based daily nutrition requirements for Indian families</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-7">
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Nutrition Requirements by Age Group</h2>
            {loading ? (
              <div className="flex justify-center py-8"><RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" /></div>
            ) : (
              <div className="space-y-2">
                {AGE_GROUPS.map(group => {
                  const groupReqs = getGroupRequirements(group.min);
                  const isExpanded = expandedGroup === group.min;
                  const baseReq = groupReqs.find(r => r.activity_level === 'moderate') || groupReqs[0];

                  return (
                    <div key={group.min} className="border border-gray-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedGroup(isExpanded ? null : group.min)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Heart size={16} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{group.label}</p>
                            <p className="text-xs text-gray-500">{group.range}</p>
                          </div>
                        </div>
                        {baseReq && (
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-600">
                              {baseReq.calories_min}–{baseReq.calories_max} kcal
                            </p>
                            <p className="text-xs text-gray-400">moderate activity</p>
                          </div>
                        )}
                        <span className="text-gray-400 ml-4">{isExpanded ? '▲' : '▼'}</span>
                      </button>

                      {isExpanded && groupReqs.length > 0 && (
                        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            {groupReqs.map(req => (
                              <div key={req.id} className="bg-white rounded-lg p-3 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-gray-700 capitalize">{req.activity_level}</span>
                                  {req.gender !== 'both' && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full capitalize">
                                      {req.gender}
                                    </span>
                                  )}
                                </div>
                                <p className="text-base font-bold text-emerald-600">{req.calories_min}–{req.calories_max}</p>
                                <p className="text-xs text-gray-400 mb-2">kcal/day</p>
                                <div className="space-y-1">
                                  <NutritionBar label="Protein" value={req.protein_g} max={80} unit="g" color="bg-blue-500" />
                                  <NutritionBar label="Carbs" value={req.carbs_g} max={400} unit="g" color="bg-yellow-400" />
                                  <NutritionBar label="Fat" value={req.fat_g} max={100} unit="g" color="bg-orange-400" />
                                  <NutritionBar label="Fiber" value={req.fiber_g} max={35} unit="g" color="bg-emerald-500" />
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
                                  <div className="flex justify-between"><span>Calcium</span><span className="font-medium">{req.calcium_mg}mg</span></div>
                                  <div className="flex justify-between"><span>Iron</span><span className="font-medium">{req.iron_mg}mg</span></div>
                                  <div className="flex justify-between"><span>Vit D</span><span className="font-medium">{req.vitamin_d_iu}IU</span></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Personalised Lookup</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Age</label>
                <input
                  type="number" value={profileAge} onChange={e => setProfileAge(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 35"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['male', 'female'].map(g => (
                    <button key={g} onClick={() => setProfileGender(g)}
                      className={`py-2 rounded-lg text-xs font-medium capitalize border transition-all ${profileGender === g ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 text-gray-600'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Activity Level</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['sedentary', 'moderate', 'active'].map(a => (
                    <button key={a} onClick={() => setProfileActivity(a)}
                      className={`py-2 rounded-lg text-xs font-medium capitalize border transition-all ${profileActivity === a ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 text-gray-600'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={lookupProfile} disabled={!profileAge || profileLoading}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {profileLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                Get Recommendation
              </button>
            </div>

            {profileResult && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                {profileResult.error ? (
                  <p className="text-sm text-red-500">{profileResult.error}</p>
                ) : (
                  <>
                    <p className="text-xs font-medium text-gray-600 mb-2">{profileResult.description}</p>
                    <div className="bg-emerald-50 rounded-lg p-3 mb-3 text-center">
                      <p className="text-xl font-bold text-emerald-700">
                        {profileResult.calories_min}–{profileResult.calories_max}
                      </p>
                      <p className="text-xs text-emerald-500">kcal per day</p>
                    </div>
                    <div className="space-y-1.5">
                      <NutritionBar label="Protein" value={profileResult.protein_g} max={80} unit="g" color="bg-blue-500" />
                      <NutritionBar label="Carbs" value={profileResult.carbs_g} max={400} unit="g" color="bg-yellow-400" />
                      <NutritionBar label="Fat" value={profileResult.fat_g} max={100} unit="g" color="bg-orange-400" />
                      <NutritionBar label="Fiber" value={profileResult.fiber_g} max={35} unit="g" color="bg-emerald-500" />
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: 'Calcium', value: `${profileResult.calcium_mg}mg` },
                        { label: 'Iron', value: `${profileResult.iron_mg}mg` },
                        { label: 'Vit D', value: `${profileResult.vitamin_d_iu}IU` }
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded p-1.5">
                          <p className="text-xs text-gray-500">{label}</p>
                          <p className="text-xs font-bold text-gray-800">{value}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {radarData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-3 text-sm">Nutrition Profile</h2>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="Nutrition" dataKey="A" stroke="#059669" fill="#059669" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {familyChartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Family vs Recommended Intake</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={familyChartData} barSize={22}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="calories" name="Calories (kcal)" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="protein" name="Protein (g)" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
