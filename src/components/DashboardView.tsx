import React, { useState } from 'react';
import {
  Sparkles,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Info,
  Clock,
  RefreshCw,
  PlusCircle,
  Stethoscope,
  MessageSquare,
  Thermometer,
  ShieldCheck,
  Sprout,
  MapPin,
  Award,
  Wheat,
  Compass,
  Smartphone,
  Send
} from 'lucide-react';
import {
  AiRecommendation,
  AppLanguage,
  Crop,
  Farm,
  FarmActivity,
  FarmAlert,
  SoilRecord,
  User,
  WeatherData
} from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { CropStageSelector } from './CropStageSelector';
import { LocationCropSuggester } from './LocationCropSuggester';
import { HarvestWindowCard } from './HarvestWindowCard';
import { AgroZoneBanner } from './AgroZoneBanner';

interface DashboardViewProps {
  farm: Farm | null;
  crop: Crop | null;
  weather: WeatherData | null;
  recommendation: AiRecommendation | null;
  alerts: FarmAlert[];
  soil: SoilRecord | null;
  activities: FarmActivity[];
  language: AppLanguage;
  user?: User | null;
  loadingAdvice: boolean;
  onGenerateAdvice: () => void;
  onDismissAlert: (id: string) => void;
  onOpenRecordActivity: (defaultType?: string) => void;
  onNavigate: (view: string) => void;
  onAdoptCrop?: (cropData: {
    name: string;
    variety: string;
    season: 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
    durationDays: number;
    expectedYieldQuintals?: number;
  }) => Promise<void>;
  onUpdateStage?: (stageNumber: 1 | 2 | 3 | 4, stageName: string) => Promise<void>;
  onOpenAuthModal?: () => void;
  onLogHarvestActivity?: (title: string, description: string) => void;
  onSelectState?: (stateName: string) => void;
  onOpenMobileUpdates?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farm,
  crop,
  weather,
  recommendation,
  alerts,
  soil,
  activities,
  language,
  user,
  loadingAdvice,
  onGenerateAdvice,
  onDismissAlert,
  onOpenRecordActivity,
  onNavigate,
  onAdoptCrop,
  onUpdateStage,
  onOpenAuthModal,
  onLogHarvestActivity,
  onSelectState,
  onOpenMobileUpdates
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'today' | 'harvest-window' | 'stages' | 'location-crops' | 'weather' | 'activities'>('today');

  if (!farm) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <Layers className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No Farm Selected</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
          Create or select a farm profile to unlock AI agronomic guidance, live weather, and crop monitoring.
        </p>
        <button
          onClick={() => onNavigate('farms')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition inline-flex items-center space-x-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.addNewFarm}</span>
        </button>
      </div>
    );
  }

  const activeAlerts = alerts.filter((a) => !a.isDismissed);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Farm Overview & Quick AI Action Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{farm.village}, {farm.district}, {farm.state}</span>
              </span>
              <span className="text-xs text-emerald-200">
                {farm.areaAcres} Acres • {farm.soilType} Soil • {farm.irrigationType}
              </span>
              {user ? (
                <button
                  onClick={onOpenAuthModal}
                  className="bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 hover:text-white border border-emerald-700/80 text-[11px] px-2.5 py-0.5 rounded-full font-semibold transition cursor-pointer flex items-center space-x-1"
                >
                  <span>👨‍🌾 {user.name}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="bg-amber-400 hover:bg-amber-300 text-amber-950 text-[11px] px-2.5 py-0.5 rounded-full font-bold transition cursor-pointer flex items-center space-x-1 shadow-xs"
                >
                  <span>🔑 Sign In / Sign Up</span>
                </button>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black mt-1.5 tracking-tight text-white flex flex-wrap items-center gap-2">
              <span>{farm.name}</span>
              {crop && (
                <span className="text-xs sm:text-sm font-semibold text-emerald-200 bg-emerald-800/90 px-2.5 py-0.5 rounded-md border border-emerald-700 flex items-center space-x-1">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{crop.name} ({crop.variety || 'Standard'})</span>
                  <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded uppercase ml-1">
                    {crop.currentStage || 'Stage 2: Vegetative'}
                  </span>
                </span>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
              {t.todayQuestion}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onGenerateAdvice}
              disabled={loadingAdvice}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-emerald-950 ${loadingAdvice ? 'animate-spin' : ''}`} />
              <span>{loadingAdvice ? t.analyzingFarm : t.generateAdviceBtn}</span>
            </button>

            <button
              onClick={() => onNavigate('crop-doctor')}
              className="bg-emerald-800/80 hover:bg-emerald-700/80 text-white border border-emerald-600/60 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-emerald-300" />
              <span>{t.diagnoseCrop}</span>
            </button>

            <button
              onClick={() => onOpenRecordActivity()}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition flex items-center space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>{t.recordActivity}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Agro-Climatic Zone Regional Banner */}
      <AgroZoneBanner farm={farm} onSelectState={onSelectState} />

      {/* Automated Daily Mobile Updates Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Automated Daily Mobile Updates (SMS &amp; WhatsApp)
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  <span>Daily 06:00 AM Active</span>
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1">
                Delivering localized weather, irrigation advice &amp; crop alerts for your registered parcel:{' '}
                <strong className="text-emerald-900 font-bold">{farm.name}</strong> ({farm.district}, {farm.state} • {farm.areaAcres} Acres) to{' '}
                <span className="font-mono font-bold text-slate-900 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
                  {user?.phone || '+91 98234 56789'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenMobileUpdates}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Today's Mobile Update</span>
            </button>
            <button
              onClick={onOpenMobileUpdates}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              <span>Preferences</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs: Today Action Plan | Harvest Window Engine | 4-Stage Lifecycle | Location Crop Suggestions | GPS Weather | Logs */}
      <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-xs overflow-x-auto text-xs font-bold">
        {[
          { id: 'today', label: "📋 Today's Smart Plan", icon: Sparkles },
          { id: 'harvest-window', label: '🌾 Ideal Harvest Window & Alerts', icon: Wheat },
          { id: 'stages', label: '🌱 4-Stage Growth Model (1 to 4)', icon: Layers },
          { id: 'location-crops', label: `📍 Top Harvested in ${farm.state}`, icon: Award },
          { id: 'weather', label: '🌦️ GPS Weather & Soil', icon: CloudRain },
          { id: 'activities', label: '📝 Field Activity Logs', icon: Calendar }
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Farm Alerts Banner */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border flex items-start justify-between shadow-sm transition ${
                alert.severity === 'critical'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alert.severity === 'critical'
                      ? 'text-red-600'
                      : alert.severity === 'warning'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`}
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">{alert.title}</h4>
                  <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{alert.message}</p>
                </div>
              </div>
              <button
                onClick={() => onDismissAlert(alert.id)}
                className="text-xs font-semibold underline px-2 py-1 hover:opacity-75 shrink-0 ml-2 cursor-pointer"
              >
                {t.dismiss}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SUB-VIEW: IDEAL HARVEST WINDOW ENGINE TAB */}
      {activeTab === 'harvest-window' && (
        <div className="space-y-6">
          <HarvestWindowCard
            crop={crop}
            farm={farm}
            weather={weather}
            onLogHarvestActivity={onLogHarvestActivity}
            onSelectCropForDoctor={(cropName) => onNavigate('crop-doctor')}
          />
        </div>
      )}

      {/* SUB-VIEW 1: 4-STAGE LIFECYCLE MODEL TAB */}
      {activeTab === 'stages' && (
        <div className="space-y-6">
          <CropStageSelector
            crop={crop}
            farm={farm}
            language={language}
            onUpdateStage={onUpdateStage}
          />
        </div>
      )}

      {/* SUB-VIEW 2: LOCATION-BASED CROP HARVEST SUGGESTIONS TAB */}
      {activeTab === 'location-crops' && (
        <div className="space-y-6">
          <LocationCropSuggester
            activeFarm={farm}
            language={language}
            onAdoptCrop={onAdoptCrop || (async () => {})}
            onNavigateToMap={() => onNavigate('map-tracking')}
          />
        </div>
      )}

      {/* SUB-VIEW 3: TODAY'S DASHBOARD & SMART ACTION PLAN */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          {/* Main Grid: Left = AI Action Plan, Right = Live GPS Weather & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: "What Should I Do Today?" SMART ACTION PLAN */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stage Overview Banner with One-Click Stage Selector Link */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Current Active Growth Stage</span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base mt-0.5">
                    {crop?.name || 'Soybean'} — {crop?.currentStage || 'Stage 2: Vegetative Growth (Days 15-40)'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Stage-specific nutrient schedules, critical watering timings, and pest alert indicators active.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('stages')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center space-x-1 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  <span>Inspect All Stages (1 to 4)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Smart Action Plan Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-800">
                        {t.appName} Today's Smart Action Plan
                      </h2>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                        <span>
                          {recommendation?.dataSources.weatherFreshness || 'Live GPS Calibrated'}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">
                          Confidence: {recommendation?.confidence.level || 'High'} ({Math.round((recommendation?.confidence.score || 0.9) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {recommendation && (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                        recommendation.riskLevel === 'low'
                          ? 'bg-emerald-100 text-emerald-800'
                          : recommendation.riskLevel === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      Risk: {recommendation.riskLevel}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-5">
                  {/* Summary Banner */}
                  {recommendation?.summary && (
                    <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-inner text-sm leading-relaxed font-medium">
                      💡 {recommendation.summary}
                    </div>
                  )}

                  {/* Action Tiers */}
                  <div className="space-y-4">
                    {/* 1. HIGH PRIORITY ACTIONS */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {t.highPriority}
                        </h3>
                      </div>

                      <div className="space-y-2.5">
                        {(recommendation?.todayActionPlan.highPriority || [
                          {
                            action: 'Check field soil moisture before next irrigation',
                            why: 'Incoming humidity shift requires adjusted irrigation volume.'
                          }
                        ]).map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-red-50/50 border border-red-100 rounded-xl p-3.5 text-xs hover:border-red-300 transition"
                          >
                            <div className="font-bold text-slate-900 text-sm flex items-start justify-between">
                              <span>{item.action}</span>
                              <button
                                onClick={() => onOpenRecordActivity(item.action)}
                                className="bg-red-100 hover:bg-red-200 text-red-800 text-[11px] px-2 py-0.5 rounded-md font-semibold shrink-0 ml-2 cursor-pointer"
                              >
                                + Log Done
                              </button>
                            </div>
                            <div className="mt-1 text-slate-600 flex items-start space-x-1.5">
                              <span className="font-bold text-red-700 shrink-0">{t.whyTitle}</span>
                              <span>{item.why}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. MEDIUM PRIORITY */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {t.mediumPriority}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        {(recommendation?.todayActionPlan.mediumPriority || [
                          {
                            action: 'Inspect crop foliage for leaf spot symptoms',
                            why: 'Early detection prevents widespread canopy damage.'
                          }
                        ]).map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-amber-50/40 border border-amber-100 rounded-xl p-3 text-xs hover:border-amber-300 transition"
                          >
                            <div className="font-bold text-slate-900 flex items-start justify-between">
                              <span>{item.action}</span>
                              <button
                                onClick={() => onOpenRecordActivity(item.action)}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] px-2 py-0.5 rounded-md font-semibold shrink-0 ml-2 cursor-pointer"
                              >
                                + Log
                              </button>
                            </div>
                            <div className="mt-1 text-slate-600 flex items-start space-x-1.5">
                              <span className="font-bold text-amber-700 shrink-0">{t.whyTitle}</span>
                              <span>{item.why}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Location-Based Harvest Suggestions Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Top Harvested Crops in {farm.district}, {farm.state}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('location-crops')}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    View All & Adopt →
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Calculated using regional mandi arrival metrics and ICAR agro-climatic zone suitability for {farm.soilType} soil.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => setActiveTab('location-crops')}
                    className="w-full bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 p-3 rounded-xl text-xs font-bold text-emerald-900 transition flex items-center justify-between cursor-pointer"
                  >
                    <span>🌾 Explore High-Yield Harvest Suggestions for {farm.state}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live GPS Weather & Soil Metrics (1 Col) */}
            <div className="space-y-6">
              {/* GPS Live Weather Card */}
              <div className="bg-gradient-to-br from-sky-900 to-sky-950 text-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CloudRain className="w-5 h-5 text-sky-300" />
                    <h3 className="font-bold text-sm">{t.navWeather}</h3>
                  </div>
                  <span className="text-[10px] bg-sky-800 text-sky-200 px-2 py-0.5 rounded-full font-mono">
                    GPS Live
                  </span>
                </div>

                {weather ? (
                  <div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-3xl font-black text-white">
                          {weather.current.temperature}°C
                        </div>
                        <div className="text-xs text-sky-200 mt-0.5">
                          {weather.current.weatherDescription}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-sky-300">Rain Chance</div>
                        <div className="text-base font-bold text-sky-200">
                          {weather.current.rainProbabilityPct}%
                        </div>
                      </div>
                    </div>

                    {/* Weather Indicators Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-sky-800/60 text-center text-xs">
                      <div className="bg-sky-950/50 p-2 rounded-lg">
                        <Droplets className="w-3.5 h-3.5 text-sky-400 mx-auto mb-0.5" />
                        <div className="text-[10px] text-sky-300">{t.humidity}</div>
                        <div className="font-bold text-white mt-0.5">{weather.current.humidity}%</div>
                      </div>
                      <div className="bg-sky-950/50 p-2 rounded-lg">
                        <Wind className="w-3.5 h-3.5 text-sky-400 mx-auto mb-0.5" />
                        <div className="text-[10px] text-sky-300">{t.windSpeed}</div>
                        <div className="font-bold text-white mt-0.5">{weather.current.windSpeedKmH} km/h</div>
                      </div>
                      <div className="bg-sky-950/50 p-2 rounded-lg">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400 mx-auto mb-0.5" />
                        <div className="text-[10px] text-sky-300">Soil Moisture</div>
                        <div className="font-bold text-white mt-0.5">{weather.current.soilMoisture || 32}%</div>
                      </div>
                    </div>

                    {/* 5-Day Mini Forecast */}
                    <div className="mt-4 pt-3 border-t border-sky-800/60">
                      <div className="text-[11px] font-semibold text-sky-300 mb-2 uppercase tracking-wider">
                        {t.weather7Day}
                      </div>
                      <div className="space-y-1.5">
                        {weather.forecast.slice(1, 5).map((f, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-sky-800/40">
                            <span className="w-10 font-semibold text-sky-200">{f.dayName}</span>
                            <span className="text-[11px] text-sky-300 truncate max-w-[90px]">{f.weatherDescription}</span>
                            <span className="text-sky-400 font-medium">💧 {f.rainProbabilityPct}%</span>
                            <span className="font-bold text-white text-right w-12">{f.tempMax}° / {f.tempMin}°</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-sky-300">Loading GPS weather data...</div>
                )}
              </div>

              {/* Soil Status Snapshot Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800 text-sm">{t.navSoil}</h3>
                  <button
                    onClick={() => onNavigate('soil')}
                    className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>

                {soil ? (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="text-[10px] text-slate-400">Soil pH</div>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">{soil.ph || '7.2'}</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="text-[10px] text-slate-400">Nitrogen</div>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">{soil.nitrogenKgPerHa || '310'} kg</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="text-[10px] text-slate-400">Potassium</div>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">{soil.potassiumKgPerHa || '240'} kg</div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs italic bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                      {soil.notes || 'Soil parameters are within healthy range for active vegetative & flowering cycles.'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-500 mb-2">No soil test uploaded for this farm.</p>
                    <button
                      onClick={() => onNavigate('soil')}
                      className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer"
                    >
                      + Add Soil Test Result
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Voice / Chat Assistant Card */}
              <div
                onClick={() => onNavigate('chat')}
                className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Ask AI Agronomist</h4>
                    <p className="text-xs text-emerald-200">{t.voiceInputPrompt}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-300" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: WEATHER & SOIL TAB */}
      {activeTab === 'weather' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <CloudRain className="w-5 h-5 text-emerald-600" />
              <span>Microclimate GPS Weather Report</span>
            </h3>
            {weather ? (
              <div className="space-y-3 text-xs">
                <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-black text-sky-950">{weather.current.temperature}°C</div>
                    <div className="text-slate-600 mt-0.5">{weather.current.weatherDescription}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-500">Precipitation Chance</div>
                    <div className="text-base font-bold text-sky-800">{weather.current.rainProbabilityPct}%</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-bold text-slate-800">7-Day Extended Agro-Forecast</div>
                  {weather.forecast.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-bold w-12">{f.dayName}</span>
                      <span className="text-slate-600">{f.weatherDescription}</span>
                      <span className="text-sky-700 font-bold">💧 {f.rainProbabilityPct}%</span>
                      <span className="font-bold text-slate-900">{f.tempMax}° / {f.tempMin}°C</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Loading weather details...</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-emerald-600" />
              <span>Soil Chemistry & Moisture Profile</span>
            </h3>
            {soil ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase">Soil pH Value</span>
                    <div className="text-lg font-black text-emerald-950 mt-1">{soil.ph || '7.2'} (Neutral)</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Organic Carbon</span>
                    <div className="text-lg font-black text-slate-900 mt-1">{soil.organicCarbonPct || '0.65'}%</div>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {soil.notes || 'Soil parameters are optimal for current crop growth stages.'}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No soil test on record.</p>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: FIELD ACTIVITIES LOG TAB */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">Field Operations & Irrigation Logs</h3>
            <button
              onClick={() => onOpenRecordActivity()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
            >
              + Log New Operation
            </button>
          </div>
          {activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((act) => (
                <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{act.title}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{act.notes || 'Completed successfully.'}</div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    {new Date(act.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No field activities recorded yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
