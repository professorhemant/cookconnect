import React, { useEffect, useState } from 'react';
import { Bell, Send, Phone, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  sendTodayMenu, sendWeekMenu, getNotificationHistory, updateProfile, getProfile
} from '../api';

export default function Notifications() {
  const { currentUser, saveUser, token } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingToday, setSendingToday] = useState(false);
  const [sendingWeek, setSendingWeek] = useState(false);
  const [msg, setMsg] = useState('');
  const [settings, setSettings] = useState({
    sms_enabled: currentUser?.sms_enabled || false,
    phone: currentUser?.phone || '',
    cook_phone: currentUser?.cook_phone || '',
    plan_type: currentUser?.plan_type || 'weekly'
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadHistory();
      setSettings({
        sms_enabled: currentUser.sms_enabled || false,
        phone: currentUser.phone || '',
        cook_phone: currentUser.cook_phone || '',
        plan_type: currentUser.plan_type || 'weekly'
      });
    }
  }, [currentUser]);

  async function loadHistory() {
    setLoading(true);
    try {
      const res = await getNotificationHistory(currentUser.id);
      setHistory(res.data);
    } catch {}
    finally { setLoading(false); }
  }

  async function handleSendToday() {
    setSendingToday(true);
    setMsg('');
    try {
      await sendTodayMenu(currentUser.id);
      setMsg("Today's menu sent successfully!");
      loadHistory();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to send');
    } finally {
      setSendingToday(false);
      setTimeout(() => setMsg(''), 5000);
    }
  }

  async function handleSendWeek() {
    setSendingWeek(true);
    setMsg('');
    try {
      await sendWeekMenu(currentUser.id);
      setMsg('Weekly plan sent successfully!');
      loadHistory();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to send');
    } finally {
      setSendingWeek(false);
      setTimeout(() => setMsg(''), 5000);
    }
  }

  async function handleSaveSettings() {
    setSavingSettings(true);
    try {
      await updateProfile(currentUser.id, settings);
      const refreshed = await getProfile(currentUser.id);
      saveUser(refreshed.data, token);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch {}
    finally { setSavingSettings(false); }
  }

  const statusIcon = (status) => {
    if (status === 'sent') return <CheckCircle size={14} className="text-emerald-500" />;
    if (status === 'failed') return <XCircle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-yellow-500" />;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage SMS notifications to you and your cook</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Send Notifications</h2>

            {msg && (
              <div className={`mb-4 px-4 py-2.5 text-sm rounded-lg border ${
                msg.includes('success') || msg.includes('sent')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}>
                {msg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Today's Menu</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Send today's breakfast, lunch, and dinner to you and your cook via SMS.
                </p>
                <button
                  onClick={handleSendToday}
                  disabled={sendingToday || !currentUser?.sms_enabled}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  <Send size={14} />
                  {sendingToday ? 'Sending...' : "Send Today's Menu"}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Weekly Plan</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Send the complete weekly meal plan to you and your cook for planning ahead.
                </p>
                <button
                  onClick={handleSendWeek}
                  disabled={sendingWeek || !currentUser?.sms_enabled}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  <Send size={14} />
                  {sendingWeek ? 'Sending...' : 'Send Weekly Plan'}
                </button>
              </div>
            </div>

            {!currentUser?.sms_enabled && (
              <p className="text-xs text-amber-600 mt-3 text-center">
                Enable SMS notifications in Settings panel to use these buttons.
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Notification History</h2>
              <button onClick={loadHistory} className="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:underline">
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8"><RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" /></div>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No notifications sent yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 pb-2">Type</th>
                      <th className="text-left text-xs font-semibold text-gray-500 pb-2">Sent To</th>
                      <th className="text-left text-xs font-semibold text-gray-500 pb-2">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 pb-2">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.map(log => (
                      <tr key={log.id} className="text-sm">
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            log.type === 'today_menu' ? 'bg-orange-100 text-orange-700' :
                            log.type === 'weekly_plan' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {log.type === 'today_menu' ? "Today's Menu" : log.type === 'weekly_plan' ? 'Weekly Plan' : 'Manual'}
                          </span>
                        </td>
                        <td className="py-2.5 text-xs text-gray-500">{log.recipient_phone || '—'}</td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1">
                            {statusIcon(log.status)}
                            <span className={`text-xs capitalize ${
                              log.status === 'sent' ? 'text-emerald-600' :
                              log.status === 'failed' ? 'text-red-500' : 'text-yellow-600'
                            }`}>{log.status}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-6">
            <h2 className="font-semibold text-gray-900 mb-4">SMS Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Enable SMS</p>
                  <p className="text-xs text-gray-500">Send daily and weekly reminders</p>
                </div>
                <div
                  onClick={() => setSettings(s => ({ ...s, sms_enabled: !s.sms_enabled }))}
                  className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative ${settings.sms_enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${settings.sms_enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone size={12} className="inline mr-1" /> Your Phone
                </label>
                <input
                  value={settings.phone}
                  onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone size={12} className="inline mr-1" /> Cook's Phone
                </label>
                <input
                  value={settings.cook_phone}
                  onChange={e => setSettings(s => ({ ...s, cook_phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="+91 9876543211"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['weekly', 'monthly'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSettings(s => ({ ...s, plan_type: type }))}
                      className={`py-2 rounded-lg text-sm font-medium capitalize border transition-all ${
                        settings.plan_type === type
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
                <p className="font-medium text-gray-700">Automated Schedule</p>
                <p>Daily menu SMS at 7:00 AM IST</p>
                <p>Weekly plan SMS every Sunday at 8:00 AM IST</p>
                <p className="text-amber-600 mt-1">Requires Twilio credentials in backend .env</p>
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors"
              >
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>

              {settingsSaved && (
                <p className="text-xs text-emerald-600 text-center font-medium">Settings saved!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
