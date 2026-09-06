import React, { useState } from 'react';
import {
  Sprout,
  Globe,
  Wifi,
  WifiOff,
  Bell,
  User as UserIcon,
  ChevronDown,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Farm, User, AppLanguage, NotificationItem } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface NavbarProps {
  user: User;
  farms: Farm[];
  activeFarm: Farm | null;
  onSelectFarm: (farm: Farm) => void;
  language: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  lowDataMode: boolean;
  onToggleLowDataMode: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onSwitchUserRole: (role: 'farmer' | 'agronomist' | 'admin') => void;
  activeView: string;
  onSelectView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  farms,
  activeFarm,
  onSelectFarm,
  language,
  onSelectLanguage,
  lowDataMode,
  onToggleLowDataMode,
  notifications,
  onMarkNotificationRead,
  onSwitchUserRole,
  activeView,
  onSelectView
}) => {
  const t = TRANSLATIONS[language];
  const [showFarmDropdown, setShowFarmDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white border-b border-emerald-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectView('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-inner text-emerald-950 font-bold">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-white">{t.appName}</span>
                <span className="bg-emerald-700 text-emerald-200 text-xs px-1.5 py-0.5 rounded font-mono font-medium flex items-center">
                  <Sparkles className="w-3 h-3 mr-0.5" /> AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 hidden sm:block leading-none mt-0.5 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Farm Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFarmDropdown(!showFarmDropdown)}
              className="flex items-center space-x-2 bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium transition border border-emerald-700/60 max-w-[200px] sm:max-w-[260px] truncate"
            >
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{activeFarm ? activeFarm.name : t.switchFarm}</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
            </button>

            {showFarmDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t.navFarms} ({farms.length})
                </div>
                {farms.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectFarm(f);
                      setShowFarmDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-emerald-50 transition ${
                      activeFarm?.id === f.id ? 'bg-emerald-50/80 font-semibold text-emerald-900 border-l-4 border-emerald-600' : ''
                    }`}
                  >
                    <div>
                      <div className="truncate">{f.name}</div>
                      <div className="text-xs text-slate-500 font-normal">
                        {f.district}, {f.state} • {f.areaAcres} Ac
                      </div>
                    </div>
                    {activeFarm?.id === f.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      onSelectView('farms');
                      setShowFarmDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 flex items-center space-x-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>+ {t.addNewFarm}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Controls: Low Data Mode, Language, Role Switcher, Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Low-Data Mode Toggle */}
            <button
              onClick={onToggleLowDataMode}
              title={lowDataMode ? 'Low Data Mode is Active (Saves Mobile Bandwidth)' : 'Toggle Low Data Mode'}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition ${
                lowDataMode
                  ? 'bg-amber-500 text-amber-950 font-bold ring-2 ring-amber-300'
                  : 'bg-emerald-800/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700'
              }`}
            >
              {lowDataMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{t.lowDataMode}</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center space-x-1 bg-emerald-800/80 hover:bg-emerald-800 text-emerald-200 px-2.5 py-1 rounded-lg text-xs font-semibold border border-emerald-700 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                  <button
                    onClick={() => {
                      onSelectLanguage('en');
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${language === 'en' ? 'font-bold text-emerald-800 bg-emerald-50' : ''}`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => {
                      onSelectLanguage('hi');
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${language === 'hi' ? 'font-bold text-emerald-800 bg-emerald-50' : ''}`}
                  >
                    हिन्दी (Hindi)
                  </button>
                  <button
                    onClick={() => {
                      onSelectLanguage('mr');
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${language === 'mr' ? 'font-bold text-emerald-800 bg-emerald-50' : ''}`}
                  >
                    मराठी (Marathi)
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Drawer Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDrawer(!showNotifDrawer)}
                className="relative p-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-emerald-200 rounded-lg border border-emerald-700 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDrawer && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-700">Notifications ({notifications.length})</span>
                    <span className="text-[11px] text-emerald-600 cursor-pointer font-medium">Krishi Alerts</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-400">No new notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs hover:bg-slate-50 transition cursor-pointer ${!n.isRead ? 'bg-emerald-50/60' : ''}`}
                          onClick={() => onMarkNotificationRead(n.id)}
                        >
                          <div className="font-semibold text-slate-800 flex items-center justify-between">
                            <span>{n.title}</span>
                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>}
                          </div>
                          <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.body}</p>
                          <div className="text-[10px] text-slate-400 mt-1.5">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline capitalize">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] bg-emerald-900/60 px-1 py-0.5 rounded text-emerald-200 uppercase font-mono">
                  {user.role}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-300" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <div className="font-semibold text-xs text-slate-800">{user.name}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </div>
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                    Switch Workspace Role
                  </div>
                  <button
                    onClick={() => {
                      onSwitchUserRole('farmer');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between ${user.role === 'farmer' ? 'font-bold text-emerald-700 bg-emerald-50' : ''}`}
                  >
                    <span>👨‍🌾 {t.farmerRole}</span>
                    {user.role === 'farmer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => {
                      onSwitchUserRole('agronomist');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between ${user.role === 'agronomist' ? 'font-bold text-emerald-700 bg-emerald-50' : ''}`}
                  >
                    <span>🔬 {t.agronomistRole}</span>
                    {user.role === 'agronomist' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => {
                      onSwitchUserRole('admin');
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between ${user.role === 'admin' ? 'font-bold text-emerald-700 bg-emerald-50' : ''}`}
                  >
                    <span>⚙️ {t.adminRole}</span>
                    {user.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Tabs */}
      <div className="bg-emerald-950/80 border-t border-emerald-800/80 hidden md:block px-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-1">
          {[
            { id: 'dashboard', label: t.navHome, icon: '🏠' },
            { id: 'farms', label: t.navFarms, icon: '🌾' },
            { id: 'advisor', label: t.navAdvisor, icon: '🧠' },
            { id: 'crop-doctor', label: t.navCropDoctor, icon: '🩺' },
            { id: 'chat', label: t.navChat, icon: '💬' },
            { id: 'soil', label: t.navSoil, icon: '🧪' },
            { id: 'satellite', label: t.navSatellite, icon: '🛰️' },
            { id: 'expert', label: t.navExpert, icon: '👨‍🔬' },
            { id: 'knowledge', label: t.navKnowledge, icon: '📖' },
            { id: 'admin', label: t.navAdmin, icon: '📊' }
          ].map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
