import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Flame, UtensilsCrossed, Send, RefreshCw, AlertCircle, AlertTriangle, Sparkles, ChefHat, TrendingUp, Heart, Leaf, Brain, Shield, Zap, Apple, Plus } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import {
  getFamilyMembers, getTodayMenu, getPlans, getFullPlan, getFamilySummary, sendTodayMenu
} from '../api';
import StatCard from '../components/StatCard';
import MealCell from '../components/MealCell';

const COLORS = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];

const MEAL_CONFIG = [
  {
    key: 'breakfast', label: 'Breakfast', emoji: '🌅',
    grad: 'from-orange-400 to-amber-300',
    badge: 'bg-orange-500 text-white',
    bg: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
  },
  {
    key: 'lunch', label: 'Lunch', emoji: '☀️',
    grad: 'from-blue-500 to-cyan-400',
    badge: 'bg-blue-600 text-white',
    bg: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200',
  },
  {
    key: 'dinner', label: 'Dinner', emoji: '🌙',
    grad: 'from-purple-500 to-violet-400',
    badge: 'bg-purple-600 text-white',
    bg: 'from-purple-50 to-violet-50',
    border: 'border-purple-200',
  },
];

export default function Dashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ members: 0, activePlan: null, todayCalories: 0, mealsPlanned: 0 });
  const [todayData, setTodayData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [familySummary, setFamilySummary] = useState(null);
  const [weekDays, setWeekDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState('');

  useEffect(() => {
    if (currentUser) loadAll();
  }, [currentUser]);

  async function loadAll() {
    setLoading(true);
    try {
      const [membersRes, plansRes] = await Promise.allSettled([
        getFamilyMembers(currentUser.id),
        getPlans(currentUser.id)
      ]);

      const members = membersRes.status === 'fulfilled' ? membersRes.value.data : [];
      const allPlans = plansRes.status === 'fulfilled' ? plansRes.value.data : [];
      const activePlan = allPlans.find(p => p.status === 'active') || allPlans[0] || null;

      let todayDay = null;
      let weekDaysData = [];
      try {
        const todayRes = await getTodayMenu(currentUser.id);
        todayDay = todayRes.data?.day || null;
      } catch {}

      if (activePlan) {
        try {
          const fullRes = await getFullPlan(activePlan.id);
          weekDaysData = (fullRes.data?.days || [])
            .slice()
            .sort((a, b) => a.day_number - b.day_number)
            .slice(0, 7);
        } catch {}
      }

      let summary = null;
      try {
        const summaryRes = await getFamilySummary(currentUser.id);
        summary = summaryRes.data;
      } catch {}

      setStats({
        members: members.length,
        activePlan,
        todayCalories: todayDay?.total_calories || 0,
        mealsPlanned: allPlans.length
      });
      setTodayData(todayDay);
      setPlans(allPlans.slice(0, 5));
      setFamilySummary(summary);
      setWeekDays(weekDaysData);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendSms() {
    setSending(true);
    setSendMsg('');
    try {
      await sendTodayMenu(currentUser.id);
      setSendMsg('SMS sent successfully!');
    } catch (err) {
      setSendMsg(err.response?.data?.error || 'Failed to send SMS');
    } finally {
      setSending(false);
      setTimeout(() => setSendMsg(''), 4000);
    }
  }

  const chartData = familySummary?.members?.map(({ member, nutrition }) => ({
    name: member.name,
    min: nutrition?.calories_min || 0,
    max: nutrition?.calories_max || 0
  })) || [];

  const pieData = familySummary?.members?.map(({ member, nutrition }) => ({
    name: member.name,
    value: nutrition ? Math.round((nutrition.calories_min + nutrition.calories_max) / 2) : 0
  })).filter(d => d.value > 0) || [];

  // Total required calories for the whole family (sum of each member's min)
  const totalRequiredCalories = familySummary?.members?.reduce(
    (sum, { nutrition }) => sum + (nutrition?.calories_min || 0), 0
  ) || 0;
  const calorieDeficit = totalRequiredCalories > 0 && stats.todayCalories > 0 && stats.todayCalories < totalRequiredCalories;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-emerald-700 font-semibold">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-1">Fetching today's meal plan</p>
        </div>
      </div>
    );
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 p-6 lg:p-8">

      {/* ── Hero Header ── */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-7 mb-8 overflow-hidden shadow-xl shadow-emerald-200">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-emerald-200 text-sm font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow">
              {greeting()}, Surabhi! 👋
            </h1>
            <p className="text-emerald-100 text-sm mt-1 font-medium">
              {currentUser?.family_name || 'Your family'} · Diet & Nutrition Overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/40 shadow-lg">
              <img src="/hemant.jpg" alt="Hemant" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users}          label="Family Members"  value={stats.members}                                                             sub="profiles added"     color="emerald" />
        <StatCard icon={Calendar}       label="Active Plan"     value={stats.activePlan ? stats.activePlan.plan_type : 'None'}                    sub={stats.activePlan ? `Since ${stats.activePlan.start_date}` : 'Generate a plan'} color="teal" />
        <StatCard icon={Flame}          label="Today's Calories" value={stats.todayCalories ? stats.todayCalories.toLocaleString() : '—'}         sub="kcal planned"       color="orange" />
        <StatCard icon={UtensilsCrossed} label="Plans Created"  value={stats.mealsPlanned}                                                        sub="total plans"        color="purple" />
      </div>

      {/* ── Calorie Alert Banner ── */}
      {calorieDeficit && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-2xl px-5 py-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-900 text-sm">More Calories needed — go to Add Ons</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Today's plan: <strong>{stats.todayCalories.toLocaleString()} kcal</strong> · Family needs: <strong>{totalRequiredCalories.toLocaleString()} kcal</strong> · Deficit: <strong>{(totalRequiredCalories - stats.todayCalories).toLocaleString()} kcal</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/plans')}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition-colors shrink-0 ml-4"
          >
            <Plus size={13} /> Add Ons
          </button>
        </div>
      )}

      {/* ── Today's Menu + Pie chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Today's Menu */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-white" />
              <h2 className="font-bold text-white text-base">Today's Menu</h2>
            </div>
            <span className="text-xs text-emerald-100 font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
          </div>

          <div className="p-5">
            {todayData ? (
              <div className="grid grid-cols-3 gap-3">
                {MEAL_CONFIG.map(({ key, label, emoji, badge, bg, border, grad }) => {
                  const meal = todayData[key];
                  return (
                    <div key={key} className={`rounded-xl border ${border} bg-gradient-to-br ${bg} p-4 relative overflow-hidden`}>
                      <div className="absolute top-2 right-2 text-2xl opacity-20">{emoji}</div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge}`}>{label}</span>
                      {meal ? (
                        <>
                          <p className="text-sm font-bold text-gray-900 mt-3 leading-snug">{meal.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">{meal.cuisine_type}</p>
                          <div className="flex items-center gap-1 mt-2 bg-white/60 rounded-full px-2 py-0.5 w-fit">
                            <Flame size={11} className="text-orange-500" />
                            <span className="text-xs font-bold text-gray-700">
                              {stats.members > 1 ? (meal.calories_per_serving || 0) * stats.members : meal.calories_per_serving} kcal
                              {stats.members > 1 && <span className="font-normal text-gray-400 ml-1">({meal.calories_per_serving}/person)</span>}
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 mt-3 italic">Not planned</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                  <AlertCircle className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-600 font-semibold">No meal plan for today</p>
                <p className="text-gray-400 text-xs mt-1">Generate a diet plan to see today's menu</p>
                <button onClick={() => navigate('/plans')}
                  className="mt-4 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-200 hover:opacity-90 transition-opacity">
                  Generate Plan
                </button>
              </div>
            )}

            {todayData && (
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                <button onClick={() => navigate('/plans')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-xl shadow shadow-emerald-200 hover:opacity-90 transition-opacity">
                  <Calendar size={13} /> View Full Plan
                </button>
                <button onClick={handleSendSms} disabled={sending}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-500 text-emerald-600 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors disabled:opacity-60">
                  <Send size={13} /> {sending ? 'Sending...' : 'Send to Cook'}
                </button>
                {sendMsg && <span className="text-xs text-emerald-600 font-bold">{sendMsg}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-violet-500 px-6 py-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-white" />
            <h2 className="font-bold text-white text-base">Family Calorie Needs</h2>
          </div>
          <div className="p-4">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={82} dataKey="value" paddingAngle={4}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v.toLocaleString()} kcal`]} />
                  <Legend iconSize={10} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-3">
                  <Users className="w-7 h-7 text-purple-300" />
                </div>
                <p className="text-xs text-gray-400 max-w-[140px]">Add family members to see nutrition overview</p>
                <button onClick={() => navigate('/family')} className="mt-3 text-xs text-purple-600 font-bold hover:underline">
                  Add members →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bar Chart ── */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-white" />
            <h2 className="font-bold text-white text-base">Family Nutrition Comparison</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={22}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(1)}k`} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v.toLocaleString()} kcal`]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="min" name="Min Calories" fill="#6ee7b7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="max" name="Max Calories" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Week Plan ── */}
      {weekDays.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-white" />
              <h2 className="font-bold text-white text-base">This Week's Plan</h2>
            </div>
            <button onClick={() => navigate('/plans')} className="text-xs text-white/80 font-semibold hover:text-white">
              View full plan →
            </button>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, i) => (
                <MealCell key={day.id || i} day={day} onEdit={() => navigate('/plans')} requiredCalories={totalRequiredCalories} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Recent Plans ── */}
      {plans.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-white" />
              <h2 className="font-bold text-white text-base">Recent Plans</h2>
            </div>
            <button onClick={() => navigate('/plans')} className="text-xs text-white/80 font-semibold hover:text-white">
              View all →
            </button>
          </div>
          <div className="p-4 divide-y divide-gray-50">
            {plans.map(plan => (
              <div key={plan.id} className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-800 capitalize">{plan.plan_type} Plan</p>
                  <p className="text-xs text-gray-400 mt-0.5">{plan.start_date} → {plan.end_date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  plan.status === 'active'     ? 'bg-emerald-100 text-emerald-700' :
                  plan.status === 'completed'  ? 'bg-gray-100 text-gray-500' :
                                                 'bg-amber-100 text-amber-700'
                }`}>
                  {plan.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ── Why We Need a Healthy Diet ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-white" />
          <h2 className="font-bold text-white text-base">Why We Need a Healthy Diet</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            In today's fast-paced modern lifestyle — filled with processed food, screen time, stress, and sedentary habits —
            a balanced diet is no longer optional. It is the foundation of your energy, immunity, mood, and longevity.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Zap,    color: 'from-amber-400 to-orange-400', bg: 'bg-amber-50', border: 'border-amber-100', title: 'Sustained Energy',   desc: 'Whole foods fuel your body steadily — no sugar crashes or mid-day fatigue from junk food.' },
              { icon: Shield, color: 'from-blue-400 to-indigo-400',  bg: 'bg-blue-50',  border: 'border-blue-100',  title: 'Stronger Immunity',  desc: 'Vitamins C, D, zinc and antioxidants from fresh produce help your body fight infections.' },
              { icon: Brain,  color: 'from-purple-400 to-violet-400',bg: 'bg-purple-50',border: 'border-purple-100',title: 'Mental Clarity',     desc: 'Omega-3s, B-vitamins and magnesium support focus, memory and emotional well-being.' },
              { icon: Heart,  color: 'from-rose-400 to-pink-400',    bg: 'bg-rose-50',  border: 'border-rose-100',  title: 'Heart Health',       desc: 'Low saturated fat, high fibre diets reduce cholesterol and lower risk of heart disease.' },
              { icon: Leaf,   color: 'from-emerald-400 to-green-400',bg: 'bg-emerald-50',border:'border-emerald-100',title: 'Healthy Weight',    desc: 'Nutrient-dense, low-calorie foods prevent obesity and reduce risk of type-2 diabetes.' },
              { icon: Apple,  color: 'from-teal-400 to-cyan-400',    bg: 'bg-teal-50',  border: 'border-teal-100',  title: 'Longer Life',        desc: 'Research shows Mediterranean and plant-rich diets add healthy years to your lifespan.' },
            ].map(({ icon: Icon, color, bg, border, title, desc }) => (
              <div key={title} className={`rounded-xl border ${border} ${bg} p-4`}>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── What's In It — Nutrition per 100g ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-lime-500 to-green-500 px-6 py-4 flex items-center gap-2">
          <Apple className="w-5 h-5 text-white" />
          <h2 className="font-bold text-white text-base">What's In It — Nutrition per 100g</h2>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 rounded-xl">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Food Item</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-orange-500 uppercase tracking-wide">Calories</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-blue-500 uppercase tracking-wide">Protein (g)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-amber-500 uppercase tracking-wide">Carbs (g)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-rose-500 uppercase tracking-wide">Fat (g)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-emerald-500 uppercase tracking-wide">Fiber (g)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-purple-500 uppercase tracking-wide">Sugar (g)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: 'Chicken Breast',    emoji: '🍗', cal: 165, protein: 31.0, carbs: 0,    fat: 3.6,  fiber: 0,   sugar: 0   },
                { name: 'Eggs (whole)',       emoji: '🥚', cal: 155, protein: 13.0, carbs: 1.1,  fat: 11.0, fiber: 0,   sugar: 1.1 },
                { name: 'Paneer',            emoji: '🧀', cal: 265, protein: 18.3, carbs: 3.4,  fat: 20.8, fiber: 0,   sugar: 0   },
                { name: 'Moong Dal (cooked)',emoji: '🫘', cal: 105, protein: 7.0,  carbs: 19.0, fat: 0.4,  fiber: 7.6, sugar: 2.0 },
                { name: 'Brown Rice',        emoji: '🍚', cal: 216, protein: 5.0,  carbs: 45.0, fat: 1.8,  fiber: 3.5, sugar: 0.7 },
                { name: 'Oats',              emoji: '🥣', cal: 389, protein: 17.0, carbs: 66.0, fat: 7.0,  fiber: 10.6,sugar: 0   },
                { name: 'Banana',            emoji: '🍌', cal: 89,  protein: 1.1,  carbs: 23.0, fat: 0.3,  fiber: 2.6, sugar: 12.2},
                { name: 'Apple',             emoji: '🍎', cal: 52,  protein: 0.3,  carbs: 14.0, fat: 0.2,  fiber: 2.4, sugar: 10.4},
                { name: 'Spinach (palak)',   emoji: '🥬', cal: 23,  protein: 2.9,  carbs: 3.6,  fat: 0.4,  fiber: 2.2, sugar: 0.4 },
                { name: 'Potato',            emoji: '🥔', cal: 77,  protein: 2.0,  carbs: 17.0, fat: 0.1,  fiber: 2.2, sugar: 0.8 },
                { name: 'Whole Wheat Roti',  emoji: '🫓', cal: 264, protein: 9.0,  carbs: 54.0, fat: 2.4,  fiber: 7.0, sugar: 0.5 },
                { name: 'Milk (full fat)',   emoji: '🥛', cal: 61,  protein: 3.2,  carbs: 4.8,  fat: 3.3,  fiber: 0,   sugar: 5.0 },
                { name: 'Curd (Dahi)',       emoji: '🥣', cal: 61,  protein: 3.5,  carbs: 4.7,  fat: 3.3,  fiber: 0,   sugar: 4.7 },
                { name: 'Almonds',           emoji: '🌰', cal: 579, protein: 21.0, carbs: 22.0, fat: 50.0, fiber: 12.5,sugar: 4.4 },
                { name: 'Tomato',            emoji: '🍅', cal: 18,  protein: 0.9,  carbs: 3.9,  fat: 0.2,  fiber: 1.2, sugar: 2.6 },
                { name: 'Onion',             emoji: '🧅', cal: 40,  protein: 1.1,  carbs: 9.3,  fat: 0.1,  fiber: 1.7, sugar: 4.2 },
              ].map((item, i) => (
                <tr key={item.name} className={`hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    <span className="mr-2">{item.emoji}</span>{item.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-orange-100 text-orange-700 font-bold text-xs px-2 py-1 rounded-full">{item.cal}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-700 font-semibold text-xs px-2 py-1 rounded-full">{item.protein}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-amber-100 text-amber-700 font-semibold text-xs px-2 py-1 rounded-full">{item.carbs}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-rose-100 text-rose-700 font-semibold text-xs px-2 py-1 rounded-full">{item.fat}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-emerald-100 text-emerald-700 font-semibold text-xs px-2 py-1 rounded-full">{item.fiber}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-purple-100 text-purple-700 font-semibold text-xs px-2 py-1 rounded-full">{item.sugar}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
