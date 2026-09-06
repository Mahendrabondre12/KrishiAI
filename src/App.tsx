import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Sparkles,
  MapPin,
  Stethoscope,
  MessageSquare,
  FlaskConical,
  Satellite,
  BookOpen,
  Server,
  Bell,
  Wifi,
  WifiOff,
  User as UserIcon,
  PlusCircle,
  Mic,
  MicOff,
  AlertTriangle,
  Layers,
  ChevronDown,
  CheckCircle2,
  LogIn,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import {
  AiChatMessage,
  AiRecommendation,
  AppLanguage,
  Crop,
  DiseaseAnalysisResult,
  ExpertCase,
  Farm,
  FarmActivity,
  FarmAlert,
  NotificationItem,
  SatelliteHealthData,
  SoilRecord,
  User,
  WeatherData
} from './types';
import { api, setCurrentUserId } from './lib/api';
import { TRANSLATIONS } from './lib/translations';

import { DashboardView } from './components/DashboardView';
import { CropDoctorView } from './components/CropDoctorView';
import { AiChatView } from './components/AiChatView';
import { FarmsView } from './components/FarmsView';
import { SoilIntelligenceView } from './components/SoilIntelligenceView';
import { SatelliteView } from './components/SatelliteView';
import { ExpertDeskView } from './components/ExpertDeskView';
import { AgronomyLibraryView } from './components/AgronomyLibraryView';
import { AdminView } from './components/AdminView';
import { StateMapTrackerView } from './components/StateMapTrackerView';
import { AddFarmModal, RecordActivityModal } from './components/Modals';
import { AuthView } from './components/AuthView';
import { DailyMobileUpdatesModal } from './components/DailyMobileUpdatesModal';
import { MobileNav } from './components/MobileNav';
import {
  auth,
  getLocalUserProfile,
  saveLocalUserProfile,
  signOutIndividualUser,
  buildKrishiUser
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  // App state
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [user, setUser] = useState<User | null>(() => {
    return getLocalUserProfile();
  });
  const [activeView, setActiveView] = useState<string>(() => {
    return getLocalUserProfile() ? 'dashboard' : 'auth';
  });

  const [farms, setFarms] = useState<Farm[]>([]);
  const [activeFarm, setActiveFarm] = useState<Farm | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [activeCrop, setActiveCrop] = useState<Crop | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soilRecords, setSoilRecords] = useState<SoilRecord[]>([]);
  const [latestSoil, setLatestSoil] = useState<SoilRecord | null>(null);
  const [activities, setActivities] = useState<FarmActivity[]>([]);
  const [recommendation, setRecommendation] = useState<AiRecommendation | null>(null);
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [satelliteData, setSatelliteData] = useState<SatelliteHealthData | null>(null);
  const [expertCases, setExpertCases] = useState<ExpertCase[]>([]);
  const [chatMessages, setChatMessages] = useState<AiChatMessage[]>([]);

  // UI state
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [showAddFarmModal, setShowAddFarmModal] = useState<boolean>(false);
  const [showRecordActivityModal, setShowRecordActivityModal] = useState<boolean>(false);
  const [showMobileUpdatesModal, setShowMobileUpdatesModal] = useState<boolean>(false);
  const [activityDefaultTitle, setActivityDefaultTitle] = useState<string>('');
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const [showFarmSelectDropdown, setShowFarmSelectDropdown] = useState<boolean>(false);
  const [statusFreshness, setStatusFreshness] = useState<string>('Just now');

  // Black Color / Dark Theme State (defaults to 'dark' for sleek black color UI)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('krishi_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('krishi_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const t = TRANSLATIONS[language];

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const local = getLocalUserProfile(fbUser.uid) || getLocalUserProfile(fbUser.email || undefined);
        const resolved = local || buildKrishiUser(fbUser);
        setUser(resolved);
        setCurrentUserId(resolved.id);
      }
    });
    return () => unsub();
  }, []);

  // Initial Data Load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const local = getLocalUserProfile();
      if (local) {
        setUser(local);
        setCurrentUserId(local.id);
      }

      const { farms: userFarms } = await api.getFarms();
      setFarms(userFarms);

      if (userFarms.length > 0) {
        const initialFarm = userFarms[0];
        setActiveFarm(initialFarm);
        await loadFarmContext(initialFarm.id);
      }

      const { notifications: notifs } = await api.getNotifications();
      setNotifications(notifs);

      const { cases } = await api.getExpertCases();
      setExpertCases(cases);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const loadFarmContext = async (farmId: string) => {
    try {
      const details = await api.getFarm(farmId);
      if (details.crops) {
        setCrops(details.crops);
        const current = details.crops.find((c) => c.id === details.farm.activeCropId) || details.crops[0] || null;
        setActiveCrop(current);
      }
      setLatestSoil(details.latestSoil);
      setActivities(details.recentActivities || []);
      setRecommendation(details.latestRecommendation);
      setAlerts(details.alerts || []);
      setSatelliteData(details.satellite);

      // Fetch live weather
      const weatherRes = await api.getWeather(farmId);
      if (weatherRes.weather) {
        setWeather(weatherRes.weather);
      }

      // Fetch soil records
      const soilRes = await api.getSoil(farmId);
      setSoilRecords(soilRes.records || []);

      // Fetch chat messages
      const chatRes = await api.getChatHistory(farmId);
      setChatMessages(chatRes.history || []);

      setStatusFreshness('Synced');
    } catch (err) {
      console.error('Error loading farm context:', err);
    }
  };

  const handleSelectFarm = (farm: Farm) => {
    setActiveFarm(farm);
    loadFarmContext(farm.id);
  };

  const handleGenerateAdvice = async () => {
    if (!activeFarm) return;
    setLoadingAdvice(true);
    try {
      const res = await api.generateFarmingAdvice(activeFarm.id, language);
      if (res.recommendation) {
        setRecommendation(res.recommendation);
      }
    } catch (err) {
      console.error('Error generating advice:', err);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setChatLoading(true);
    try {
      const history = chatMessages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await api.sendChatMessage({
        message: text,
        farmId: activeFarm?.id,
        conversationHistory: history,
        language
      });

      if (res.message) {
        setChatMessages((prev) => [...prev, { id: `u_${Date.now()}`, sender: 'user', text, timestamp: new Date().toISOString() }, res.message]);
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAnalyzeImage = async (params: {
    imageBase64: string;
    mimeType: string;
    cropNameHint?: string;
    symptomsHint?: string;
  }) => {
    const res = await api.analyzeCropDisease({
      ...params,
      language
    });
    return res.analysis;
  };

  const handleEscalateToExpert = async (analysis: DiseaseAnalysisResult, imagePreview?: string) => {
    try {
      const res = await api.submitExpertCase({
        farmId: activeFarm?.id || 'general',
        farmerName: user.name,
        farmerPhone: user.phone || '+91 98220 12345',
        cropName: analysis.cropName,
        location: activeFarm ? `${activeFarm.village}, ${activeFarm.district}` : 'Ahmednagar, MH',
        title: `Escalated Case: ${analysis.possibleIssue}`,
        description: `Visual symptoms detected: ${analysis.visibleSymptoms.join(', ')}. Farmer requests verified prescription from Dr. Sunita Deshmukh.`,
        imageUrl: imagePreview,
        aiAnalysisSummary: `${analysis.possibleIssue} (${analysis.severity} severity). Causes: ${analysis.causesAndConditions}`
      });

      if (res.case) {
        setExpertCases((prev) => [res.case, ...prev]);
        setActiveView('expert');
      }
    } catch (err) {
      console.error('Error escalating to expert:', err);
    }
  };

  const handleResolveCase = async (
    caseId: string,
    data: { expertName: string; diagnosis: string; prescription: string }
  ) => {
    const res = await api.resolveExpertCase(caseId, data);
    if (res.case) {
      setExpertCases((prev) => prev.map((c) => (c.id === caseId ? res.case : c)));
    }
  };

  const handleRecordSoil = async (soilData: Partial<SoilRecord>) => {
    if (!activeFarm) return;
    const res = await api.recordSoil(activeFarm.id, soilData);
    if (res.record) {
      setSoilRecords((prev) => [res.record, ...prev]);
      setLatestSoil(res.record);
    }
  };

  const handleCreateFarm = async (farmData: any) => {
    const res = await api.createFarm(farmData);
    if (res.farm) {
      setFarms((prev) => [...prev, res.farm]);
      setActiveFarm(res.farm);
      loadFarmContext(res.farm.id);
    }
  };

  const handleCreateActivity = async (actData: any) => {
    const res = await api.recordActivity({
      ...actData,
      userId: user.id
    });
    if (res.activity) {
      setActivities((prev) => [res.activity, ...prev]);
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    await api.dismissAlert(alertId);
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleAdoptCrop = async (cropData: {
    name: string;
    variety: string;
    season: 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
    durationDays: number;
    expectedYieldQuintals?: number;
  }) => {
    if (!activeFarm) return;
    try {
      const res = await api.createCrop({
        farmId: activeFarm.id,
        name: cropData.name,
        variety: cropData.variety,
        sowingDate: new Date().toISOString().split('T')[0],
        currentStage: 'Stage 1: Sowing & Germination (Days 0-15)',
        season: cropData.season,
        durationDays: cropData.durationDays,
        expectedYieldQuintals: cropData.expectedYieldQuintals || 22
      });
      if (res.crop) {
        setCrops((prev) => [res.crop, ...prev]);
        setActiveCrop(res.crop);
        setActiveFarm((prev) => (prev ? { ...prev, activeCropId: res.crop.id } : null));

        // Create initial log
        await handleCreateActivity({
          farmId: activeFarm.id,
          activityType: 'sowing',
          title: `Adopted & Sown: ${res.crop.name} (${res.crop.variety})`,
          date: new Date().toISOString().split('T')[0],
          notes: `Selected from Location-Based High Yield Harvest Guide for ${activeFarm.district}, ${activeFarm.state}.`
        });
      }
    } catch (err) {
      console.error('Error adopting crop:', err);
    }
  };

  const handleUpdateCropStage = async (stageNumber: 1 | 2 | 3 | 4, stageName: string) => {
    if (!activeCrop) return;
    const updatedStageString = `Stage ${stageNumber}: ${stageName}`;
    const updatedCrop: Crop = {
      ...activeCrop,
      currentStage: updatedStageString
    };
    setActiveCrop(updatedCrop);
    setCrops((prev) => prev.map((c) => (c.id === activeCrop.id ? updatedCrop : c)));

    if (activeFarm) {
      handleCreateActivity({
        farmId: activeFarm.id,
        activityType: 'other',
        title: `Growth Stage Advanced to Stage ${stageNumber}: ${stageName}`,
        date: new Date().toISOString().split('T')[0],
        notes: `Growth stage verified for ${activeCrop.name}. Stage ${stageNumber} nutrient and watering advisory activated.`
      });
    }
  };

  const handleSignInProfile = (newUser: User) => {
    setUser(newUser);
    setCurrentUserId(newUser.id);
    saveLocalUserProfile(newUser);
    if (newUser.language) {
      setLanguage(newUser.language);
    }
    // Sync with backend API
    api.register({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      language: newUser.language,
      state: newUser.state,
      district: newUser.district
    }).catch((err) => console.warn('Sync user to backend warning:', err));

    // Filter/align farms if applicable
    const matchedFarm = farms.find(
      (f) => f.state.toLowerCase() === (newUser.state || '').toLowerCase()
    );
    if (matchedFarm) {
      handleSelectFarm(matchedFarm);
    }
  };

  const handleSignOut = async () => {
    await signOutIndividualUser();
    setUser(null);
    setCurrentUserId('');
    setShowRoleDropdown(false);
    setActiveView('auth');
  };

  const handleUpdateProfile = (updated: User) => {
    setUser(updated);
    saveLocalUserProfile(updated);
  };

  const handleSwitchRole = (role: 'farmer' | 'agronomist' | 'admin') => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      saveLocalUserProfile(updated);
    }
    if (role === 'agronomist') setActiveView('expert');
    if (role === 'admin') setActiveView('admin');
    if (role === 'farmer') setActiveView('dashboard');
  };

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden ${theme === 'dark' ? 'dark bg-black text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* ------------------------------------------------------------- */}
      {/* 1. PROFESSIONAL POLISH SIDEBAR (Desktop)                       */}
      {/* ------------------------------------------------------------- */}
      <aside className={`w-64 hidden md:flex flex-col shrink-0 select-none ${
        theme === 'dark'
          ? 'bg-[#05080e] border-r border-slate-800 text-white shadow-2xl'
          : 'bg-emerald-900 text-white shadow-lg'
      }`}>
        {/* Brand Header */}
        <div
          onClick={() => setActiveView('dashboard')}
          className={`p-6 flex items-center gap-3 border-b cursor-pointer transition ${
            theme === 'dark' ? 'border-slate-800/80 hover:bg-slate-900/60' : 'border-emerald-800'
          }`}
        >
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-black shadow-md">
            K
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">{t.appName}</h1>
            <span className="text-[10px] text-emerald-400 font-medium block -mt-0.5">
              Agricultural AI Platform
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 text-sm font-medium overflow-y-auto">
          {[
            { id: 'dashboard', label: t.navHome, icon: '🏠' },
            { id: 'auth', label: user ? `👤 ${user.name ? user.name.split(' ')[0] : 'Profile'}` : '🔑 Sign In / Sign Up', icon: '👤' },
            { id: 'farms', label: t.navFarms, icon: '🚜' },
            { id: 'map-tracking', label: t.navMapTracking || 'State Map & Seeds', icon: '🗺️' },
            { id: 'advisor', label: t.navAdvisor, icon: '✨' },
            { id: 'crop-doctor', label: t.navCropDoctor, icon: '🩺' },
            { id: 'chat', label: t.navChat, icon: '💬' },
            { id: 'satellite', label: t.navSatellite, icon: '📡' },
            { id: 'soil', label: t.navSoil, icon: '🧪' },
            {
              id: 'expert',
              label: t.navExpert,
              icon: '👨‍🔬',
              badge: expertCases.filter((c) => c.status !== 'Resolved').length
            },
            { id: 'knowledge', label: t.navKnowledge, icon: '📖' },
            { id: 'admin', label: t.navAdmin, icon: '⚙️' }
          ].map((item) => {
            const isActive = activeView === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-emerald-950/70 text-emerald-300 font-bold border border-emerald-700/60 shadow-inner'
                      : 'bg-emerald-800 text-white font-bold shadow-inner'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                      : 'text-emerald-100 hover:bg-emerald-800/50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-amber-500 text-amber-950 font-bold text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* System Telemetry & Theme Option in Sidebar Footer */}
        <div className={`p-4 border-t text-xs space-y-2.5 ${
          theme === 'dark' ? 'border-slate-800/80 text-slate-400' : 'border-emerald-800 text-emerald-300'
        }`}>
          {/* Theme Option: Choice between Dark and Light */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[11px] uppercase tracking-wider">Theme:</span>
            <div className={`flex items-center p-0.5 rounded-lg border ${
              theme === 'dark' ? 'bg-[#0b0f17] border-slate-700/80' : 'bg-emerald-950/60 border-emerald-700/60'
            }`}>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                  theme === 'light'
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Light Theme"
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-emerald-500 text-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Dark Theme"
              >
                <Moon className="w-3 h-3 text-emerald-950" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="flex items-center justify-between">
              <span>System Status:</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Online</span>
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span>Data Freshness:</span>
              <span className={theme === 'dark' ? 'text-slate-300' : 'text-emerald-200'}>{statusFreshness}</span>
            </p>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN VIEW AREA                                             */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className={`h-16 flex items-center justify-between px-4 sm:px-8 z-30 shrink-0 ${
          theme === 'dark'
            ? 'bg-[#080c13] border-b border-slate-800/90 text-slate-100'
            : 'bg-white border-b border-slate-200 text-slate-900'
        }`}>
          {/* Left: Active Farm Location & Language Selector */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Farm Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setShowFarmSelectDropdown(!showFarmSelectDropdown)}
                className="text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold truncate max-w-[150px] sm:max-w-[240px]">
                  {activeFarm ? `${activeFarm.name} (${activeFarm.district})` : 'Select Farm'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showFarmSelectDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase">
                    Your Registered Land Parcels ({farms.length})
                  </div>
                  {farms.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        handleSelectFarm(f);
                        setShowFarmSelectDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                        activeFarm?.id === f.id ? 'bg-emerald-50 font-bold text-emerald-900 border-l-4 border-emerald-600' : ''
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{f.name}</div>
                        <div className="text-slate-500 text-[11px]">
                          {f.village}, {f.district} • {f.areaAcres} Ac
                        </div>
                      </div>
                      {activeFarm?.id === f.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setShowAddFarmModal(true);
                        setShowFarmSelectDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 flex items-center space-x-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{t.addNewFarm}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            {/* Language Switcher Dropdown / Buttons */}
            <div className="flex items-center gap-1">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                title="Select Interface & Agro-Advisory Language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>

          {/* Right: Black Mode Toggle, Low-Data Toggle, Voice Assistant, Notifications, Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Option: Dark & Light Dual-Segmented Switch */}
            <div
              className={`flex items-center p-0.5 rounded-xl border transition shrink-0 ${
                theme === 'dark'
                  ? 'bg-[#090d15] border-slate-800 text-slate-300 shadow-inner'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              role="group"
              aria-label="Theme options"
            >
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-amber-600 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Select Light Theme"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[11px]">Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-900 text-emerald-400 shadow-xs border border-emerald-600/60 ring-1 ring-emerald-500/20'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Select Dark Theme"
              >
                <Moon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px]">Dark</span>
              </button>
            </div>

            {/* Low Data Mode Toggle */}
            <button
              onClick={() => setLowDataMode(!lowDataMode)}
              title={lowDataMode ? 'Low Data Mode ON' : 'Toggle Low Data Mode'}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                lowDataMode
                  ? 'bg-amber-500 text-amber-950 ring-2 ring-amber-300 font-bold'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lowDataMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{t.lowDataMode}</span>
            </button>

            {/* Daily Mobile Updates Launcher */}
            <button
              onClick={() => setShowMobileUpdatesModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
              title="Automated Daily Mobile Updates (SMS & WhatsApp)"
            >
              <span className="text-sm">📱</span>
              <span className="hidden sm:inline">Daily Mobile Updates</span>
              <span className="px-1.5 py-0.2 bg-emerald-700 text-[10px] rounded text-white font-mono">06:00 AM</span>
            </button>

            {/* Quick Voice Assistant Launcher */}
            <button
              onClick={() => setActiveView('chat')}
              className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-700 transition"
              title="Voice Assistant (Hindi / Marathi / English)"
            >
              🎙️
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-700 transition"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-amber-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-xs text-slate-700 flex justify-between">
                    <span>Farm Notifications ({notifications.length})</span>
                    <span className="text-[10px] text-emerald-600 cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 text-xs hover:bg-slate-50">
                        <div className="font-bold text-slate-800 flex justify-between">
                          <span>{n.title}</span>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>}
                        </div>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar & Role Switcher OR Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="w-8 h-8 rounded-full bg-emerald-200 border border-emerald-300 flex items-center justify-center font-bold text-emerald-900 text-xs shadow-sm hover:ring-2 hover:ring-emerald-400 transition cursor-pointer"
                  title={`${user.name} (${user.role})`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-bold text-xs text-slate-900 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      {user.district && (
                        <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                          📍 {user.district}, {user.state}
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      Individual Farmer Account
                    </div>
                    <button
                      onClick={() => {
                        setActiveView('auth');
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 text-emerald-800 font-bold flex items-center space-x-1.5 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Account Profile &amp; Settings</span>
                    </button>

                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 border-t border-slate-100 pt-1">
                      Workspace Role
                    </div>
                    <button
                      onClick={() => {
                        handleSwitchRole('farmer');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between cursor-pointer ${user.role === 'farmer' ? 'font-bold text-emerald-700 bg-emerald-50' : ''}`}
                    >
                      <span>👨‍🌾 {t.farmerRole}</span>
                      {user.role === 'farmer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                    <button
                      onClick={() => {
                        handleSwitchRole('agronomist');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between cursor-pointer ${user.role === 'agronomist' ? 'font-bold text-emerald-700 bg-emerald-50' : ''}`}
                    >
                      <span>🔬 {t.agronomistRole}</span>
                      {user.role === 'agronomist' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                    <button
                      onClick={() => {
                        handleSwitchRole('admin');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between cursor-pointer ${user.role === 'admin' ? 'font-bold text-emerald-700 bg-emerald-50' : ''}`}
                    >
                      <span>⚙️ {t.adminRole}</span>
                      {user.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>

                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 border-t border-slate-100 pt-1">
                      Theme Option
                    </div>
                    <div className="px-3 py-1 flex items-center gap-1.5">
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 border cursor-pointer transition ${
                          theme === 'light'
                            ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Sun className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>Light</span>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 border cursor-pointer transition ${
                          theme === 'dark'
                            ? 'bg-zinc-900 text-emerald-400 border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Moon className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Dark</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 mt-1.5 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-red-50 text-red-600 font-bold flex items-center space-x-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveView('auth')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-28 md:pb-6">
          {!user && activeView !== 'auth' && (
            <div className="mb-5 p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  🌾
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    Sign in to your personal Farmer account
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Save your crop harvest records, live field coordinates, and personalized AI advisories.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveView('auth')}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Sign Up</span>
              </button>
            </div>
          )}

          {activeView === 'dashboard' && (
            <DashboardView
              farm={activeFarm}
              crop={activeCrop}
              weather={weather}
              recommendation={recommendation}
              alerts={alerts}
              soil={latestSoil}
              activities={activities}
              language={language}
              user={user}
              loadingAdvice={loadingAdvice}
              onGenerateAdvice={handleGenerateAdvice}
              onDismissAlert={handleDismissAlert}
              onOpenRecordActivity={(title) => {
                setActivityDefaultTitle(title || '');
                setShowRecordActivityModal(true);
              }}
              onNavigate={(v) => setActiveView(v)}
              onAdoptCrop={handleAdoptCrop}
              onUpdateStage={handleUpdateCropStage}
              onOpenAuthModal={() => setActiveView('auth')}
              onOpenMobileUpdates={() => setShowMobileUpdatesModal(true)}
            />
          )}

          {activeView === 'advisor' && (
            <DashboardView
              farm={activeFarm}
              crop={activeCrop}
              weather={weather}
              recommendation={recommendation}
              alerts={alerts}
              soil={latestSoil}
              activities={activities}
              language={language}
              user={user}
              loadingAdvice={loadingAdvice}
              onGenerateAdvice={handleGenerateAdvice}
              onDismissAlert={handleDismissAlert}
              onOpenRecordActivity={(title) => {
                setActivityDefaultTitle(title || '');
                setShowRecordActivityModal(true);
              }}
              onNavigate={(v) => setActiveView(v)}
              onAdoptCrop={handleAdoptCrop}
              onUpdateStage={handleUpdateCropStage}
              onOpenAuthModal={() => setActiveView('auth')}
              onOpenMobileUpdates={() => setShowMobileUpdatesModal(true)}
            />
          )}

          {activeView === 'farms' && (
            <FarmsView
              farms={farms}
              activeFarm={activeFarm}
              onSelectFarm={handleSelectFarm}
              onOpenAddFarmModal={() => setShowAddFarmModal(true)}
              onOpenAddCropModal={(farmId) => {
                // open add crop
              }}
              crops={crops}
              activities={activities}
              soil={latestSoil}
              language={language}
              onDeleteFarm={async (id) => {
                await api.deleteFarm(id);
                setFarms((prev) => prev.filter((f) => f.id !== id));
                if (activeFarm?.id === id) {
                  setActiveFarm(farms.find((f) => f.id !== id) || null);
                }
              }}
              onOpenRecordActivity={(title) => {
                setActivityDefaultTitle(title || '');
                setShowRecordActivityModal(true);
              }}
            />
          )}

          {activeView === 'map-tracking' && (
            <StateMapTrackerView
              activeFarm={activeFarm}
              language={language}
              onSelectFarmState={(st, dist) => {
                // optional hook
              }}
            />
          )}

          {activeView === 'crop-doctor' && (
            <CropDoctorView
              farm={activeFarm}
              crop={activeCrop}
              language={language}
              onAnalyzeImage={handleAnalyzeImage}
              onEscalateToExpert={handleEscalateToExpert}
            />
          )}

          {activeView === 'chat' && (
            <AiChatView
              farm={activeFarm}
              crop={activeCrop}
              weather={weather}
              language={language}
              onLanguageChange={(newLang) => {
                setLanguage(newLang);
                if (user) {
                  const updatedUser = { ...user, language: newLang };
                  setUser(updatedUser);
                  saveLocalUserProfile(updatedUser);
                  api.updateUserProfile({ language: newLang }).catch(() => {});
                }
              }}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              loading={chatLoading}
            />
          )}

          {activeView === 'soil' && (
            <SoilIntelligenceView
              farm={activeFarm}
              soilRecords={soilRecords}
              latestSoil={latestSoil}
              language={language}
              onRecordSoil={handleRecordSoil}
            />
          )}

          {activeView === 'satellite' && (
            <SatelliteView
              farm={activeFarm}
              satelliteData={satelliteData}
              language={language}
            />
          )}

          {activeView === 'expert' && (
            <ExpertDeskView
              cases={expertCases}
              language={language}
              onResolveCase={handleResolveCase}
            />
          )}

          {activeView === 'knowledge' && (
            <AgronomyLibraryView language={language} />
          )}

          {activeView === 'admin' && (
            <AdminView language={language} />
          )}

          {activeView === 'auth' && (
            <div className="w-full flex justify-center pb-8">
              <AuthView
                currentUser={user}
                language={language}
                onAuthSuccess={(u) => {
                  handleSignInProfile(u);
                  setActiveView('dashboard');
                }}
                onSignOut={handleSignOut}
                onUpdateProfile={handleUpdateProfile}
              />
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* FOOTER (Professional Polish Disclaimer Standard)              */}
        {/* ------------------------------------------------------------- */}
        <footer className="mt-auto p-4 border-t border-slate-200 bg-white flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-widest gap-4 font-bold shrink-0 hidden sm:flex">
          <span>AI-Generated Guidance</span>
          <span className="h-3 w-px bg-slate-200"></span>
          <span>Consult qualified agricultural experts for critical decisions</span>
        </footer>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* FLEXIBLE MOBILE DOCK & EXPANDABLE DRAWER FOOTER NAVIGATION   */}
      {/* ------------------------------------------------------------- */}
      <MobileNav
        activeView={activeView}
        onSelectView={setActiveView}
        language={language}
        theme={theme}
        onToggleTheme={setTheme}
        user={user}
        onOpenMobileUpdates={() => setShowMobileUpdatesModal(true)}
      />

      {/* ------------------------------------------------------------- */}
      {/* MODALS                                                        */}
      {/* ------------------------------------------------------------- */}
      <AddFarmModal
        isOpen={showAddFarmModal}
        onClose={() => setShowAddFarmModal(false)}
        onSubmit={handleCreateFarm}
      />

      <RecordActivityModal
        isOpen={showRecordActivityModal}
        onClose={() => setShowRecordActivityModal(false)}
        farm={activeFarm}
        defaultTitle={activityDefaultTitle}
        onSubmit={handleCreateActivity}
      />

      <DailyMobileUpdatesModal
        isOpen={showMobileUpdatesModal}
        onClose={() => setShowMobileUpdatesModal(false)}
        user={user}
        activeFarm={activeFarm}
        activeCrop={activeCrop}
        weather={weather}
        language={language}
      />
    </div>
  );
}
