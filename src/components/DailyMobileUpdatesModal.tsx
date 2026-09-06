import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  CloudSun,
  Sprout,
  ShieldCheck,
  AlertTriangle,
  Settings,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  X,
  Calendar,
  Check,
  Droplets,
  Wind
} from 'lucide-react';
import { Farm, Crop, User, WeatherData, MobileNotificationSettings, MobileDispatchLog } from '../types';
import { api } from '../lib/api';

interface DailyMobileUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  activeFarm: Farm | null;
  activeCrop?: Crop | null;
  weather?: WeatherData | null;
  language: string;
}

export const DailyMobileUpdatesModal: React.FC<DailyMobileUpdatesModalProps> = ({
  isOpen,
  onClose,
  user,
  activeFarm,
  activeCrop,
  weather,
  language
}) => {
  const [settings, setSettings] = useState<MobileNotificationSettings | null>(null);
  const [logs, setLogs] = useState<MobileDispatchLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [latestPreview, setLatestPreview] = useState<string>('');
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [smsUrl, setSmsUrl] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [activeTab, setActiveTab] = useState<'preview' | 'settings' | 'logs'>('preview');

  useEffect(() => {
    if (user?.phone) {
      setPhoneInput(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, activeFarm?.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, logsRes] = await Promise.all([
        api.getMobileSettings().catch(() => ({ settings: null })),
        api.getMobileLogs().catch(() => ({ logs: [] }))
      ]);

      if (settingsRes.settings) {
        setSettings(settingsRes.settings);
        if (settingsRes.settings.phone) {
          setPhoneInput(settingsRes.settings.phone);
        }
      } else if (user?.phone) {
        setSettings({
          userId: user.id,
          phone: user.phone,
          dailyUpdatesEnabled: true,
          dispatchTime: '06:00 AM',
          channels: ['sms', 'whatsapp'],
          language: language || 'en',
          includeWeather: true,
          includeCropAdvisory: true,
          includeIrrigationAlert: true,
          includePestWarnings: true
        });
      }

      if (logsRes.logs) {
        setLogs(logsRes.logs);
      }
    } catch (err) {
      console.error('Error loading mobile settings/logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (updates: Partial<MobileNotificationSettings>) => {
    if (!settings) return;
    const newSettings = { ...settings, ...updates, phone: phoneInput.trim() || settings.phone };
    setSettings(newSettings);
    try {
      await api.updateMobileSettings(newSettings);
    } catch (err) {
      console.error('Failed to update mobile settings:', err);
    }
  };

  const handleSendNow = async (channel: 'sms' | 'whatsapp') => {
    if (!activeFarm) return;
    setSending(true);
    setSendSuccessMessage(null);
    try {
      const targetPhone = phoneInput.trim() || user?.phone || '+91 98234 56789';
      const res = await api.sendMobileUpdate({
        farmId: activeFarm.id,
        channel,
        targetPhone
      });

      if (res.success) {
        setLatestPreview(res.previewText);
        setWhatsappUrl(res.whatsappUrl);
        setSmsUrl(res.smsUrl);
        setSendSuccessMessage(
          `Daily farm & weather update sent via ${channel.toUpperCase()} to ${targetPhone}!`
        );
        // Refresh logs
        const updatedLogs = await api.getMobileLogs();
        setLogs(updatedLogs.logs || []);
      }
    } catch (err) {
      console.error('Failed to send mobile update:', err);
      setSendSuccessMessage('Failed to deliver update. Please check connection.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const farmLocation = activeFarm ? `${activeFarm.district}, ${activeFarm.state}` : (user?.district ? `${user.district}, ${user.state}` : 'Registered Field Location');
  const tempMin = weather?.forecast[0]?.tempMin ?? 22;
  const tempMax = weather?.forecast[0]?.tempMax ?? 31;
  const rainProb = weather?.forecast[0]?.rainProbabilityPct ?? 35;
  const weatherDesc = weather?.current.weatherDescription || 'Partly Cloudy';
  const displayPhone = phoneInput.trim() || user?.phone || 'No phone registered';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner">
                <Smartphone className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-black tracking-tight">Daily Mobile Farm &amp; Weather Updates</h2>
                  <span className="px-2 py-0.5 bg-emerald-500/40 text-emerald-100 text-[10px] font-bold rounded-full uppercase tracking-wider border border-emerald-400/40">
                    Automated SMS &amp; WhatsApp
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  Automated morning farm advisory and local weather forecast delivered to your mobile.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location & Farm Identification Banner */}
          <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
              <div>
                <span className="font-bold text-white">
                  {activeFarm?.name || 'Registered Farm'}
                </span>
                <span className="text-emerald-200 ml-1.5">
                  ({farmLocation} • {activeFarm?.areaAcres || user?.landHoldingAcres || 4.5} Acres)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-100 bg-black/20 px-2.5 py-1 rounded-lg self-start sm:self-auto font-mono text-[11px]">
              <span>📱 Registered:</span>
              <span className="font-bold text-white">{displayPhone}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-5 pt-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2.5 text-xs font-bold transition flex items-center space-x-1.5 border-b-2 cursor-pointer ${
              activeTab === 'preview'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Today's Message Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs font-bold transition flex items-center space-x-1.5 border-b-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Automatic Delivery Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 text-xs font-bold transition flex items-center space-x-1.5 border-b-2 cursor-pointer ${
              activeTab === 'logs'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Delivery History ({logs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {sendSuccessMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-semibold animate-in fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{sendSuccessMessage}</span>
              </div>
              <div className="flex space-x-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1"
                  >
                    <span>Open in WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {smsUrl && (
                  <a
                    href={smsUrl}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1"
                  >
                    <span>Open SMS</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: Today's Message Preview & Instant Dispatch */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Context Summary card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Daily Update Context for Registered Location
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">Registered Farm</div>
                    <div className="font-bold text-slate-800 truncate">{activeFarm?.name || 'Primary Farm'}</div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">{farmLocation}</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">Active Crop &amp; Stage</div>
                    <div className="font-bold text-slate-800 truncate">{activeCrop?.name || 'Crop'}</div>
                    <div className="text-[10px] text-slate-500 truncate">{activeCrop?.currentStage || 'Vegetative'}</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">Weather Forecast</div>
                    <div className="font-bold text-slate-800">{tempMin}°C - {tempMax}°C</div>
                    <div className="text-[10px] text-sky-700">{weatherDesc} ({rainProb}% rain)</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">Recipient Mobile</div>
                    <div className="font-bold text-slate-800 font-mono truncate">{displayPhone}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">● Status: Active</div>
                  </div>
                </div>
              </div>

              {/* Mobile Screen Mockup */}
              <div className="border border-slate-300 rounded-2xl p-4 bg-slate-900 text-slate-100 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>SMS / WhatsApp Message Dispatch</span>
                  </span>
                  <span>To: {displayPhone}</span>
                </div>

                <div className="mt-3 text-xs font-mono whitespace-pre-wrap leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-emerald-300">
                  {latestPreview || (
                    `🌾 KRISHIAI DAILY FARM & WEATHER UPDATE
👨‍🌾 Farmer: ${user?.name || 'Valued Farmer'} | Mob: ${displayPhone}
📍 Farm: ${activeFarm?.name || 'My Registered Farm'} (${farmLocation} • ${activeFarm?.areaAcres || user?.landHoldingAcres || 4.5} Acres)

⛅ WEATHER TODAY IN ${activeFarm?.district?.toUpperCase() || 'DISTRICT'}:
• Temp: ${tempMin}°C - ${tempMax}°C | ${weatherDesc}
• Rain Chance: ${rainProb}% | Wind: 14 km/h
• Spraying: ${rainProb >= 50 ? '⚠️ Delay chemical spray (Rain expected)' : '✅ Safe for morning foliar spray'}

🌱 CROP & FIELD STATUS:
• Crop: ${activeCrop?.name || 'Soybean'} (${activeCrop?.variety || 'Regional Hybrid'})
• Stage: ${activeCrop?.currentStage || 'Flowering & Pod Formation'}
• Soil Moisture: 34% (Optimal root zone)
• Irrigation: ${rainProb >= 50 ? '⏸️ POSTPONE 24h (Rain probability 65%)' : '💧 Normal early morning irrigation'}
• Key Advisory: Scout lower canopy for early pest symptoms.

📲 Live Field Portal: https://ais-pre-qegihqivlnxp5vnk353qsa-176504132664.asia-east1.run.app
📞 Kisan Helpline: 1800-180-1551 (Toll-Free)`
                  )}
                </div>
              </div>

              {/* Dispatch Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  disabled={sending}
                  onClick={() => handleSendNow('sms')}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Dispatching Message...' : 'Send Today\'s SMS to Mobile'}</span>
                </button>
                <button
                  disabled={sending}
                  onClick={() => handleSendNow('whatsapp')}
                  className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 active:scale-98 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via WhatsApp (+91)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Automated Schedule Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-bold text-emerald-950">
                      Automated Daily Morning Message (SMS &amp; WhatsApp)
                    </div>
                    <div className="text-xs text-emerald-800 mt-0.5">
                      KrishiAI automatically pulls live satellite &amp; weather telemetry every morning and dispatches a concise message to your mobile.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings?.dailyUpdatesEnabled ?? true}
                      onChange={(e) => handleSaveSettings({ dailyUpdatesEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Delivery Settings Form */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Mobile Number for Daily SMS &amp; WhatsApp
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+91 98234 56789"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                    />
                    <button
                      onClick={() => handleSaveSettings({ phone: phoneInput.trim() })}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition cursor-pointer"
                    >
                      Save Number
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Preferred Dispatch Time
                    </label>
                    <select
                      value={settings?.dispatchTime || '06:00 AM'}
                      onChange={(e) => handleSaveSettings({ dispatchTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="05:30 AM">05:30 AM (Early Sunrise)</option>
                      <option value="06:00 AM">06:00 AM (Recommended Morning Routine)</option>
                      <option value="06:30 AM">06:30 AM</option>
                      <option value="07:00 AM">07:00 AM</option>
                      <option value="07:30 AM">07:30 AM</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Message Language
                    </label>
                    <select
                      value={settings?.language || language || 'en'}
                      onChange={(e) => handleSaveSettings({ language: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="mr">मराठी (Marathi)</option>
                      <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                      <option value="gu">ગુજરાતી (Gujarati)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    </select>
                  </div>
                </div>

                {/* Content Inclusions */}
                <div className="pt-2">
                  <div className="font-bold text-slate-700 mb-2">Message Content Inclusions:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: 'includeWeather', label: '⛅ Live Weather & Rain Chance %' },
                      { key: 'includeCropAdvisory', label: '🌱 Active Crop Stage & Growth Advisory' },
                      { key: 'includeIrrigationAlert', label: '💧 Irrigation Advice (Delay/Irrigate)' },
                      { key: 'includePestWarnings', label: '⚠️ Disease & Spray Warnings' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center space-x-2 p-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(settings?.[item.key as keyof MobileNotificationSettings] ?? true)}
                          onChange={(e) => handleSaveSettings({ [item.key]: e.target.checked })}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-slate-800 text-xs">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Delivery Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Recent Mobile Dispatches for Registered Farm</span>
                <button
                  onClick={fetchData}
                  className="flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                  No previous mobile updates logged yet. Click "Send Today's SMS to Mobile" to test your first delivery!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {logs.map((log) => (
                    <div key={log.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            log.channel === 'whatsapp' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {log.channel}
                          </span>
                          <span className="font-bold text-slate-800">{log.farmName}</span>
                          <span className="text-slate-400 text-[11px] font-mono">({log.phone})</span>
                        </div>
                        <span className="flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <span className="font-semibold">Weather:</span> {log.weatherSummary} | <span className="font-semibold">Crop:</span> {log.cropSummary}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>Time: {new Date(log.timestamp).toLocaleString()}</span>
                        <span className="font-mono">ID: {log.gatewayResponseId || log.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official KrishiAI Kisan Mobile Delivery Gateway</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
