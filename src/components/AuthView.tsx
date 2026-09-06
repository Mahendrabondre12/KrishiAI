import React, { useState, useEffect } from 'react';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
  MapPin,
  Layers,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LogOut,
  ShieldCheck,
  Wheat,
  ArrowRight,
  Smartphone,
  CloudRain,
  Sprout,
  Send,
  Save,
  Check
} from 'lucide-react';
import {
  AuthChoiceBadges,
  SignInEmblem,
  SignUpEmblem,
  SignOutLogoIcon,
  SignInLogoIcon,
  SignOutEmblem,
  FlippableAuthImageCard,
  DashboardAuthInfoModal
} from './AuthBadges';
import { User, AppLanguage, UserRole } from '../types';
import {
  signInIndividualUser,
  signUpIndividualUser,
  signOutIndividualUser,
  saveLocalUserProfile
} from '../lib/firebase';
import { ALL_SUPPORTED_STATES } from '../lib/locationCropsData';
import { api } from '../lib/api';

interface AuthViewProps {
  currentUser: User | null;
  language: AppLanguage;
  onAuthSuccess: (user: User) => void;
  onSignOut: () => void;
  onUpdateProfile?: (updated: User) => void;
  initialMode?: 'signin' | 'signup';
  isModal?: boolean;
  onClose?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentUser,
  language,
  onAuthSuccess,
  onSignOut,
  onUpdateProfile,
  initialMode = 'signin',
  isModal = false,
  onClose
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(currentUser ? 'signin' : initialMode);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDashboardInfoModal, setShowDashboardInfoModal] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser && initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, currentUser]);

  // Common credentials
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sign up fields
  const [fullName, setFullName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [state, setState] = useState<string>('Maharashtra');
  const [district, setDistrict] = useState<string>('Latur');
  const [landHoldingAcres, setLandHoldingAcres] = useState<string>('4.0');
  const [khataNumber, setKhataNumber] = useState<string>('KH-2026/01');
  const [role, setRole] = useState<UserRole>('farmer');

  // SMS Alert Settings state (linked to existing currentUser state)
  const [smsPhone, setSmsPhone] = useState<string>(currentUser?.phone || '+91 98234 56789');
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState<boolean>(currentUser?.smsAlertsEnabled !== false);
  const [weatherAlertsEnabled, setWeatherAlertsEnabled] = useState<boolean>(currentUser?.weatherAlertsEnabled !== false);
  const [cropActivityAlertsEnabled, setCropActivityAlertsEnabled] = useState<boolean>(currentUser?.cropActivityAlertsEnabled !== false);
  const [savingSmsSettings, setSavingSmsSettings] = useState<boolean>(false);
  const [smsSaveSuccess, setSmsSaveSuccess] = useState<boolean>(false);
  const [sendingTestSms, setSendingTestSms] = useState<boolean>(false);
  const [testSmsFeedback, setTestSmsFeedback] = useState<{ title: string; preview: string } | null>(null);

  // Synchronize SMS Alert settings whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setSmsPhone(currentUser.phone || '+91 98234 56789');
      setSmsAlertsEnabled(currentUser.smsAlertsEnabled !== false);
      setWeatherAlertsEnabled(currentUser.weatherAlertsEnabled !== false);
      setCropActivityAlertsEnabled(currentUser.cropActivityAlertsEnabled !== false);
    }
  }, [currentUser]);

  // Helper to commit updates to User state, LocalStorage, and Backend
  const commitUserSmsState = async (updates: {
    phone?: string;
    smsAlertsEnabled?: boolean;
    weatherAlertsEnabled?: boolean;
    cropActivityAlertsEnabled?: boolean;
  }) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      ...updates
    };

    // 1. Update React User State via onUpdateProfile
    if (onUpdateProfile) {
      onUpdateProfile(updatedUser);
    }

    // 2. Persist to local storage
    saveLocalUserProfile(updatedUser);

    // 3. Sync to backend mobile settings & user profile
    try {
      await Promise.all([
        api.updateMobileSettings({
          userId: currentUser.id,
          phone: updates.phone ?? updatedUser.phone ?? '+91 98234 56789',
          dailyUpdatesEnabled: updates.smsAlertsEnabled ?? updatedUser.smsAlertsEnabled ?? true,
          includeWeather: updates.weatherAlertsEnabled ?? updatedUser.weatherAlertsEnabled ?? true,
          includeCropAdvisory: updates.cropActivityAlertsEnabled ?? updatedUser.cropActivityAlertsEnabled ?? true
        }),
        api.updateUserProfile({
          phone: updates.phone ?? updatedUser.phone,
          smsAlertsEnabled: updates.smsAlertsEnabled ?? updatedUser.smsAlertsEnabled,
          weatherAlertsEnabled: updates.weatherAlertsEnabled ?? updatedUser.weatherAlertsEnabled,
          cropActivityAlertsEnabled: updates.cropActivityAlertsEnabled ?? updatedUser.cropActivityAlertsEnabled
        })
      ]);
    } catch (err) {
      console.warn('Backend sync for SMS settings notice:', err);
    }
  };

  const handleToggleMasterSms = async (enabled: boolean) => {
    setSmsAlertsEnabled(enabled);
    setSmsSaveSuccess(false);
    await commitUserSmsState({ smsAlertsEnabled: enabled });
  };

  const handleToggleWeatherAlerts = async (enabled: boolean) => {
    setWeatherAlertsEnabled(enabled);
    setSmsSaveSuccess(false);
    await commitUserSmsState({ weatherAlertsEnabled: enabled });
  };

  const handleToggleCropActivityAlerts = async (enabled: boolean) => {
    setCropActivityAlertsEnabled(enabled);
    setSmsSaveSuccess(false);
    await commitUserSmsState({ cropActivityAlertsEnabled: enabled });
  };

  const handleSaveAllSmsSettings = async () => {
    if (!currentUser) return;
    setSavingSmsSettings(true);
    setSmsSaveSuccess(false);
    try {
      await commitUserSmsState({
        phone: smsPhone.trim() || currentUser.phone,
        smsAlertsEnabled,
        weatherAlertsEnabled,
        cropActivityAlertsEnabled
      });
      setSmsSaveSuccess(true);
      setTimeout(() => setSmsSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving SMS settings:', err);
    } finally {
      setSavingSmsSettings(false);
    }
  };

  const handleSaveSmsPhoneOnly = async () => {
    if (!currentUser) return;
    setSavingSmsSettings(true);
    try {
      await commitUserSmsState({
        phone: smsPhone.trim() || currentUser.phone
      });
      setSmsSaveSuccess(true);
      setTimeout(() => setSmsSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating phone:', err);
    } finally {
      setSavingSmsSettings(false);
    }
  };

  const handleSendTestSms = async () => {
    if (!currentUser) return;
    setSendingTestSms(true);
    setTestSmsFeedback(null);
    try {
      const res = await api.sendMobileUpdate({
        channel: 'sms',
        targetPhone: smsPhone.trim() || currentUser.phone
      });
      setTestSmsFeedback({
        title: `Test SMS Dispatched to ${res.phone || smsPhone}`,
        preview: res.previewText
      });
    } catch (err: any) {
      setTestSmsFeedback({
        title: 'SMS Gateway Dispatch Failed',
        preview: err.message || 'Please check your internet connection or mobile format.'
      });
    } finally {
      setSendingTestSms(false);
    }
  };

  // Handle Real Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await signInIndividualUser(email.trim(), password.trim());
      setSuccessMessage(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        onAuthSuccess(user);
        if (onClose) onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Real Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await signUpIndividualUser({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        phone: phone.trim(),
        role,
        language,
        state,
        district: district.trim() || 'Latur',
        landHoldingAcres: parseFloat(landHoldingAcres) || 4.0,
        khataNumber: khataNumber.trim() || 'KH-2026/01'
      });

      setSuccessMessage(`Account created successfully! Welcome, ${newUser.name}.`);
      setTimeout(() => {
        onAuthSuccess(newUser);
        if (onClose) onClose();
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create your account.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Real Sign Out
  const handleSignOutClick = async () => {
    setLoading(true);
    try {
      await signOutIndividualUser();
      onSignOut();
      setSuccessMessage('Signed out successfully.');
      setMode('signin');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error signing out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${isModal ? 'max-w-xl mx-auto' : 'max-w-2xl mx-auto py-6 sm:py-10'}`}>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Wheat className="w-4 h-4 text-emerald-400" />
            <span>Individual Agricultural Account</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {currentUser
              ? `Account Profile • ${currentUser.name}`
              : mode === 'signin'
              ? 'Sign In to KrishiAI'
              : 'Create Individual Account'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-lg leading-relaxed">
            {currentUser
              ? 'Manage your individual credentials, certified agro profile, and linked farm parcels.'
              : 'Secure authentication for individual farmers, agronomists, and agricultural owners.'}
          </p>
        </div>

        {/* If user is ALREADY signed in: show profile summary and clean Sign Out button */}
        {currentUser ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl shadow-md">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-lg text-slate-900">{currentUser.name}</h3>
                    <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center space-x-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser.email}</span>
                  </div>
                  {currentUser.phone && (
                    <div className="text-xs text-slate-600 flex items-center space-x-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentUser.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSignOutClick}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-95 text-white font-black text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-sm border border-red-400/40 cursor-pointer"
              >
                <SignOutLogoIcon size={20} />
                <span>{loading ? 'Signing out...' : 'Sign Out of Account'}</span>
                <span className="text-xs font-black text-red-200">&gt;</span>
              </button>
            </div>

            {/* Account Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Location &amp; Agro Zone
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{currentUser.district || 'Latur'}, {currentUser.state || 'Maharashtra'}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Land Holding &amp; Khata
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>{currentUser.landHoldingAcres || 4.0} Acres • {currentUser.khataNumber || 'KH-2026/01'}</span>
                </div>
              </div>
            </div>

            {/* SMS Alert Settings Section */}
            <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                      <span>SMS Alert Settings</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Daily 06:00 AM
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Synchronized with registered farm in {currentUser.district || 'Latur'}, {currentUser.state || 'Maharashtra'}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center space-x-1.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${smsAlertsEnabled ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`}></span>
                  <span className={`font-bold text-[11px] ${smsAlertsEnabled ? 'text-emerald-800' : 'text-slate-500'}`}>
                    {smsAlertsEnabled ? 'Alerts Active' : 'Alerts Paused'}
                  </span>
                </div>
              </div>

              {/* Registered Mobile Number Input & Edit */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Registered Mobile Number (प्राप्तकर्ता मोबाइल नंबर)
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="w-4 h-4 text-emerald-600 absolute left-3 pointer-events-none" />
                      <input
                        type="tel"
                        value={smsPhone}
                        onChange={(e) => {
                          setSmsPhone(e.target.value);
                          setSmsSaveSuccess(false);
                        }}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full pl-9 pr-24 py-2 text-xs font-semibold text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={handleSaveSmsPhoneOnly}
                        disabled={savingSmsSettings}
                        className="absolute right-1 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-md transition cursor-pointer"
                      >
                        {savingSmsSettings ? 'Saving...' : 'Update'}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  SMS &amp; WhatsApp advisories will be dispatched to this registered number.
                </p>
              </div>

              {/* Master Toggle: Daily SMS Alerts */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                <div className="pr-4">
                  <div className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                    <span>Enable Daily Morning SMS Dispatches</span>
                    {smsAlertsEnabled && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">ON</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Trigger automated 06:00 AM weather forecasts &amp; agronomic advisories.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={smsAlertsEnabled}
                  onClick={() => handleToggleMasterSms(!smsAlertsEnabled)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    smsAlertsEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      smsAlertsEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Specific Sub-Toggles: Weather & Crop Activity */}
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Alert Categories (अलर्ट श्रेणियां)
                </div>

                {/* 1. Daily Weather & Rain Warnings Toggle */}
                <div className={`p-3 rounded-xl border transition flex items-start justify-between ${
                  weatherAlertsEnabled && smsAlertsEnabled ? 'bg-white border-emerald-200' : 'bg-slate-50/80 border-slate-200 opacity-80'
                }`}>
                  <div className="flex items-start space-x-3 pr-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      weatherAlertsEnabled && smsAlertsEnabled ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <CloudRain className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">
                        Daily Weather &amp; Rain Warnings (मौसम अपडेट)
                      </h5>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        High/low temperatures, precipitation chance (%), wind speed, and rain/heatwave alerts for your farm location.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={weatherAlertsEnabled}
                    disabled={!smsAlertsEnabled}
                    onClick={() => handleToggleWeatherAlerts(!weatherAlertsEnabled)}
                    className={`w-11 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 mt-1 ${
                      weatherAlertsEnabled && smsAlertsEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                    } ${!smsAlertsEnabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        weatherAlertsEnabled && smsAlertsEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Crop Activity & Advisory Updates Toggle */}
                <div className={`p-3 rounded-xl border transition flex items-start justify-between ${
                  cropActivityAlertsEnabled && smsAlertsEnabled ? 'bg-white border-emerald-200' : 'bg-slate-50/80 border-slate-200 opacity-80'
                }`}>
                  <div className="flex items-start space-x-3 pr-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      cropActivityAlertsEnabled && smsAlertsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">
                        Crop Activity &amp; Advisory Updates (फसल एवं कार्य योजना)
                      </h5>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        Stage-based fertilizer dosage, irrigation directives, pest scouting advisories, and harvest window alerts.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={cropActivityAlertsEnabled}
                    disabled={!smsAlertsEnabled}
                    onClick={() => handleToggleCropActivityAlerts(!cropActivityAlertsEnabled)}
                    className={`w-11 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 mt-1 ${
                      cropActivityAlertsEnabled && smsAlertsEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                    } ${!smsAlertsEnabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        cropActivityAlertsEnabled && smsAlertsEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Action Buttons: Test SMS Dispatch & Save */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={handleSendTestSms}
                  disabled={sendingTestSms || !smsPhone.trim()}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{sendingTestSms ? 'Dispatching...' : 'Send Test SMS Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAllSmsSettings}
                  disabled={savingSmsSettings}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  {smsSaveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Settings Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingSmsSettings ? 'Saving...' : 'Save Alert Settings'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Test SMS Dispatch Result Message */}
              {testSmsFeedback && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{testSmsFeedback.title}</span>
                    <p className="text-[11px] text-emerald-800 mt-0.5 font-mono">{testSmsFeedback.preview}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authenticated via Firebase Security</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">UID: {currentUser.id.slice(0, 12)}...</span>
            </div>
          </div>
        ) : (
          /* User is NOT signed in: display Visual Badges and Form for Sign In vs Sign Up */
          <div>
            {/* Visual Agricultural Artwork with 3D Flipping Interaction */}
            <div className="pt-4 pb-3 px-4 bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white dark:from-slate-900/60 dark:via-[#090d15] dark:to-[#070a10] border-b border-slate-200 dark:border-slate-800 text-center">
              <FlippableAuthImageCard
                mode={mode}
                onModeChange={(newMode) => {
                  setMode(newMode);
                  setErrorMessage(null);
                }}
                size={195}
                showFlipPrompt={true}
                showSegmentedControls={true}
                onOpenDashboardInfo={() => setShowDashboardInfoModal(true)}
              />
            </div>

            {/* Secondary Segmented Switcher */}
            <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0f18] text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`py-3 px-4 text-center border-b-2 transition flex items-center justify-center space-x-2 cursor-pointer ${
                  mode === 'signin'
                    ? 'border-emerald-600 text-emerald-900 dark:text-emerald-300 bg-white dark:bg-[#0c121e] font-black shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`py-3 px-4 text-center border-b-2 transition flex items-center justify-center space-x-2 cursor-pointer ${
                  mode === 'signup'
                    ? 'border-emerald-600 text-emerald-900 dark:text-emerald-300 bg-white dark:bg-[#0c121e] font-black shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Alert Messages */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{successMessage}</span>
                </div>
              )}

              {/* MODE 1: SIGN IN FORM */}
              {mode === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address (ईमेल) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Password (पासवर्ड) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-98 text-white font-black text-sm shadow-md hover:shadow-emerald-600/30 transition flex items-center justify-center space-x-2.5 cursor-pointer border border-emerald-400/40"
                  >
                    {loading ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-emerald-100" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                        </svg>
                        <span className="tracking-wide">Sign In</span>
                        <span className="font-bold text-base text-emerald-100">&gt;</span>
                      </>
                    )}
                  </button>

                  <div className="pt-3 text-center">
                    <p className="text-xs text-slate-500">
                      Don&apos;t have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="font-bold text-emerald-700 hover:underline cursor-pointer ml-1"
                      >
                        Create your individual account →
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* MODE 2: SIGN UP FORM */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Full Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name (पूरा नाम) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Balwinder Singh"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number (मोबाइल नंबर)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98XXX XXXXX"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address (ईमेल) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Password (पासवर्ड) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* State and District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Home State (राज्य) *
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        {ALL_SUPPORTED_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        District (ज़िला) *
                      </label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Latur / Ludhiana"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Land Size & Khata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Land Holding (Acres)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={landHoldingAcres}
                        onChange={(e) => setLandHoldingAcres(e.target.value)}
                        placeholder="4.0"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Khata / Land Document ID
                      </label>
                      <input
                        type="text"
                        value={khataNumber}
                        onChange={(e) => setKhataNumber(e.target.value)}
                        placeholder="KH-2026/01"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Account Type (खाता प्रकार)
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'farmer', label: '👨‍🌾 Farmer' },
                        { id: 'agronomist', label: '🔬 Agronomist' },
                        { id: 'admin', label: '⚙️ Supervisor' }
                      ].map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRole(r.id as UserRole)}
                          className={`py-2 px-3 rounded-xl border font-bold text-center transition cursor-pointer ${
                            role === r.id
                              ? 'bg-emerald-100 border-emerald-600 text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Automated Daily Mobile Notification Notice */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Automated Daily Mobile Farm &amp; Weather Updates</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Your primary farm parcel will automatically be initialized at your registered <strong>{district}, {state}</strong> location. You will receive automated daily 06:00 AM SMS &amp; WhatsApp dispatches with live weather forecast, rain probability, and crop advisory directly to your mobile!
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3.5 px-6 rounded-full bg-white hover:bg-emerald-50 dark:bg-[#0c121e] dark:hover:bg-emerald-950/60 active:scale-98 text-emerald-800 dark:text-emerald-300 font-black text-sm border-2 border-emerald-600 shadow-md hover:shadow-emerald-600/20 transition flex items-center justify-center space-x-2.5 cursor-pointer"
                  >
                    {loading ? (
                      <span>Creating individual account...</span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                        </svg>
                        <span className="tracking-wide">Sign Up</span>
                        <span className="font-bold text-base text-emerald-700 dark:text-emerald-400">&gt;</span>
                      </>
                    )}
                  </button>

                  <div className="pt-3 text-center">
                    <p className="text-xs text-slate-500">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signin')}
                        className="font-bold text-emerald-700 hover:underline cursor-pointer ml-1"
                      >
                        Sign in here →
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Information & 3D Flip Card Modal */}
      <DashboardAuthInfoModal
        isOpen={showDashboardInfoModal}
        onClose={() => setShowDashboardInfoModal(false)}
        initialMode={mode}
        onProceedAuth={(targetMode) => {
          setMode(targetMode);
          setShowDashboardInfoModal(false);
        }}
      />
    </div>
  );
};
