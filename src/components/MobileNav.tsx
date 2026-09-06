import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  Stethoscope,
  MessageSquare,
  MoreHorizontal,
  Sprout,
  FlaskConical,
  Satellite,
  UserCheck,
  BookOpen,
  MapPin,
  ShieldCheck,
  User as UserIcon,
  Sun,
  Moon,
  X,
  Smartphone,
  ChevronUp,
  Camera
} from 'lucide-react';
import { AppLanguage, User } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface MobileNavProps {
  activeView: string;
  onSelectView: (view: string) => void;
  language: AppLanguage;
  theme: 'dark' | 'light';
  onToggleTheme: (newTheme: 'dark' | 'light') => void;
  user: User | null;
  onOpenMobileUpdates: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeView,
  onSelectView,
  language,
  theme,
  onToggleTheme,
  user,
  onOpenMobileUpdates
}) => {
  const t = TRANSLATIONS[language];
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleTabClick = (viewId: string) => {
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      try {
        window.navigator.vibrate(18);
      } catch {
        // ignore vibrate errors if blocked
      }
    }
    onSelectView(viewId);
    setIsMoreOpen(false);
  };

  // Primary 4 tabs + 1 "More" tab for ultimate flexibility
  const mainTabs = [
    { id: 'dashboard', label: t.navHome, icon: Home },
    { id: 'advisor', label: t.navAdvisor, icon: Sparkles },
    // Center Action: Crop Doctor (Elevated prominent hub)
    { id: 'crop-doctor', label: t.navCropDoctor, icon: Stethoscope, isCenter: true },
    { id: 'chat', label: t.navChat, icon: MessageSquare },
  ];

  // Secondary modules available in the flexible drawer
  const moreModules = [
    { id: 'farms', label: t.navFarms, icon: Sprout, desc: 'Registered Land Parcels & Crops' },
    { id: 'soil', label: t.soilAnalysis, icon: FlaskConical, desc: 'NPK Testing & Soil Health' },
    { id: 'satellite', label: t.satelliteHealth, icon: Satellite, desc: 'NDVI Vegetation Vigour' },
    { id: 'expert', label: t.expertDesk, icon: UserCheck, desc: 'Escalate to Govt Agronomist' },
    { id: 'library', label: t.agronomyLibrary, icon: BookOpen, desc: 'Crop Diseases & Treatment' },
    { id: 'map', label: 'State Agro Map', icon: MapPin, desc: '36 States Agro Tracker' },
    { id: 'admin', label: t.adminConsole, icon: ShieldCheck, desc: 'Regional Governance Telemetry' },
    { id: 'auth', label: user ? user.name || 'Account' : 'Sign In / Register', icon: UserIcon, desc: 'Farmer Profile & Sync' }
  ];

  const isMoreActive = moreModules.some((m) => m.id === activeView);

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 1. FLEXIBLE EXPANDABLE BOTTOM SHEET DRAWER                    */}
      {/* ------------------------------------------------------------- */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop Blur overlay */}
          <div
            onClick={() => setIsMoreOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Drawer Sheet Content */}
          <div className="relative bg-white dark:bg-[#070b12] text-slate-900 dark:text-slate-100 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl p-5 max-h-[85vh] overflow-y-auto z-10 animate-in slide-in-from-bottom-5 duration-200">
            {/* Grab Handle */}
            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black tracking-tight">Flexible Navigation Hub</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Quick access to all KrishiAI farming modules &amp; preferences
                </p>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Row (Theme toggle & Mobile SMS/WhatsApp updates) */}
            <div className="grid grid-cols-2 gap-2.5 my-3.5">
              {/* Theme Switcher Button */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Theme:</span>
                <div className="flex items-center p-0.5 rounded-lg bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => onToggleTheme('light')}
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center space-x-1 transition ${
                      theme === 'light'
                        ? 'bg-white text-amber-600 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleTheme('dark')}
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center space-x-1 transition ${
                      theme === 'dark'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Moon className="w-3 h-3 text-emerald-300" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Daily Mobile Alerts Trigger */}
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onOpenMobileUpdates();
                }}
                className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs cursor-pointer hover:bg-emerald-100 transition"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="truncate">SMS &amp; WhatsApp</span>
              </button>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {moreModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-start space-x-3 p-3 rounded-xl border text-left transition cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                        : 'bg-slate-50 dark:bg-[#0c121d] border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{item.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ADAPTIVE FLOATING DOCK FOOTER                              */}
      {/* ------------------------------------------------------------- */}
      <nav
        className="fixed bottom-2 left-2 right-2 z-40 md:hidden bg-white/95 dark:bg-[#070b13]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-xl shadow-black/15 transition-all"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* Tab 1: Home */}
          {mainTabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center h-full space-y-0.5 transition cursor-pointer active:scale-95 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-black'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight truncate max-w-[58px]">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Center Hub: Crop Doctor (Elevated prominent action with glowing halo) */}
          <div className="flex flex-col items-center justify-center relative -top-3">
            <button
              onClick={() => handleTabClick('crop-doctor')}
              className={`w-13 h-13 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg transition transform active:scale-90 cursor-pointer ${
                activeView === 'crop-doctor'
                  ? 'bg-gradient-to-tr from-emerald-500 via-teal-600 to-emerald-400 shadow-emerald-500/50 ring-4 ring-emerald-300 dark:ring-emerald-900/60'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-700 shadow-emerald-900/40'
              }`}
              title={t.navCropDoctor}
            >
              <Stethoscope className="w-6 h-6 animate-pulse" />
            </button>
            <span
              className={`text-[9px] font-black tracking-tight mt-1 truncate max-w-[62px] ${
                activeView === 'crop-doctor'
                  ? 'text-emerald-600 dark:text-emerald-400 font-black'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {t.navCropDoctor}
            </span>
          </div>

          {/* Tab 4: AI Chat */}
          {mainTabs.slice(3, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center h-full space-y-0.5 transition cursor-pointer active:scale-95 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-black'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight truncate max-w-[58px]">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Tab 5: "More" Flexible Navigation Drawer Toggle */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.navigator?.vibrate) {
                try {
                  window.navigator.vibrate(15);
                } catch {}
              }
              setIsMoreOpen(!isMoreOpen);
            }}
            className={`flex flex-col items-center justify-center h-full space-y-0.5 transition cursor-pointer active:scale-95 ${
              isMoreOpen || isMoreActive
                ? 'text-emerald-600 dark:text-emerald-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="More Modules & Settings"
          >
            <div
              className={`p-1.5 rounded-xl transition relative ${
                isMoreOpen || isMoreActive
                  ? 'bg-emerald-100 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                  : ''
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
              {/* Subtle indicator dot if active view is one of the secondary views */}
              {isMoreActive && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-black"></span>
              )}
            </div>
            <span className="text-[10px] tracking-tight truncate max-w-[58px]">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
