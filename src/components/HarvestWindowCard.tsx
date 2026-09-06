import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sun,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Sparkles,
  Sliders,
  ChevronRight,
  TrendingUp,
  Volume2,
  ShieldCheck,
  Wheat,
  Share2,
  CalendarCheck,
  RefreshCw
} from 'lucide-react';
import { Crop, Farm, WeatherData, HarvestWindowCalculation } from '../types';
import { calculateHarvestWindow, getCropDuration, sendHarvestPushNotification } from '../lib/harvestCalculator';

interface HarvestWindowCardProps {
  crop: Crop | null;
  farm: Farm | null;
  weather: WeatherData | null;
  onLogHarvestActivity?: (title: string, description: string) => void;
  onSelectCropForDoctor?: (cropName: string) => void;
}

export const HarvestWindowCard: React.FC<HarvestWindowCardProps> = ({
  crop,
  farm,
  weather,
  onLogHarvestActivity,
  onSelectCropForDoctor
}) => {
  const [sowingDate, setSowingDate] = useState<string>(
    crop?.sowingDate || new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [durationDays, setDurationDays] = useState<number>(
    crop?.durationDays || getCropDuration(crop?.name || 'Soybean')
  );
  const [activeCropName, setActiveCropName] = useState<string>(crop?.name || 'Soybean');
  const [customVariety, setCustomVariety] = useState<string>(crop?.variety || 'High Yield Variety');
  const [calculation, setCalculation] = useState<HarvestWindowCalculation | null>(null);
  const [isNotifying, setIsNotifying] = useState<boolean>(false);
  const [notificationSentMessage, setNotificationSentMessage] = useState<string | null>(null);
  const [showAdvancedAdjuster, setShowAdvancedAdjuster] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  // Synchronize when crop changes
  useEffect(() => {
    if (crop) {
      if (crop.sowingDate) setSowingDate(crop.sowingDate);
      if (crop.name) setActiveCropName(crop.name);
      if (crop.variety) setCustomVariety(crop.variety);
      const dur = crop.durationDays || getCropDuration(crop.name);
      setDurationDays(dur);
    }
  }, [crop]);

  // Recalculate whenever inputs change
  useEffect(() => {
    const calc = calculateHarvestWindow({
      sowingDate,
      durationDays,
      cropName: activeCropName,
      variety: customVariety,
      weather
    });
    setCalculation(calc);
  }, [sowingDate, durationDays, activeCropName, customVariety, weather]);

  const handleSendPushNotification = async () => {
    if (!calculation) return;
    setIsNotifying(true);
    const result = await sendHarvestPushNotification(calculation);
    setIsNotifying(false);
    if (result.success) {
      setNotificationSentMessage(
        result.mode === 'native'
          ? '🔔 Native browser notification dispatched with audio chime!'
          : '🔔 In-App push notification & alert banner created!'
      );
      setTimeout(() => setNotificationSentMessage(null), 6000);
    }
  };

  const handleAddToFarmLog = () => {
    if (!calculation) return;
    if (onLogHarvestActivity) {
      onLogHarvestActivity(
        `Harvest Window Scheduled: ${calculation.cropName}`,
        `Ideal harvest window: ${calculation.idealHarvestWindowStart} to ${calculation.idealHarvestWindowEnd}. Peak target maturity on ${calculation.idealHarvestWindowPeak}. Moisture Target: ${calculation.grainMoistureTarget}.`
      );
      setIsLogged(true);
      setTimeout(() => setIsLogged(false), 5000);
    }
  };

  if (!calculation) return null;

  // Status color styles
  const statusBadge = {
    growing: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      label: '🌱 Vegetative / Grain Filling in Progress',
      ring: 'text-emerald-600'
    },
    approaching_window: {
      bg: 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse',
      label: `⏳ Approaching Harvest Window (${calculation.daysRemaining} Days Left)`,
      ring: 'text-amber-600'
    },
    in_ideal_window: {
      bg: 'bg-emerald-600 text-white border-emerald-500 shadow-md animate-bounce',
      label: '🌟 IDEAL HARVEST WINDOW ACTIVE NOW',
      ring: 'text-emerald-500'
    },
    past_ideal_window: {
      bg: 'bg-red-50 text-red-900 border-red-300',
      label: '⚠️ Past Optimal Harvest Window (Shatter Risk)',
      ring: 'text-red-600'
    }
  }[calculation.harvestStatus];

  const weatherScoreBadge = {
    optimal_dry: {
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: Sun,
      title: 'Optimal Dry Threshing Window'
    },
    moderate_caution: {
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      icon: CloudRain,
      title: 'Moderate Humidity Caution'
    },
    storm_risk: {
      color: 'text-red-700 bg-red-50 border-red-200',
      icon: AlertTriangle,
      title: 'Pre-Rain Harvest Alert'
    }
  }[calculation.weatherHarvestScore];

  const WeatherIcon = weatherScoreBadge.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-amber-950 via-emerald-950 to-slate-900 text-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Wheat className="w-4 h-4" />
              <span>ICAR Weather-Calibrated Harvest Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
              <span>Ideal Harvest Window Engine</span>
              <span className="text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                {calculation.cropName} ({calculation.durationDays} Days)
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Calculates physiological maturity &amp; optimal field dry-down window based on sowing date, variety duration, and live weather forecast.
            </p>
          </div>

          {/* Quick Notification CTA */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSendPushNotification}
              disabled={isNotifying}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-md flex items-center space-x-1.5 transition cursor-pointer active:scale-95"
            >
              <Bell className="w-4 h-4 animate-bounce" />
              <span>{isNotifying ? 'Dispatching...' : 'Push Harvest Alert'}</span>
            </button>
            <button
              onClick={() => setShowAdvancedAdjuster(!showAdvancedAdjuster)}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold border border-white/20 flex items-center space-x-1 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvancedAdjuster ? 'Close Controls' : 'Adjust Cycle'}</span>
            </button>
          </div>
        </div>

        {/* Notification Sent Banner */}
        {notificationSentMessage && (
          <div className="mt-3 bg-emerald-500/30 border border-emerald-400 text-emerald-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <span>{notificationSentMessage}</span>
            <button
              onClick={() => setNotificationSentMessage(null)}
              className="text-emerald-100 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Advanced Sowing & Duration Adjuster Drawer (Collapsible) */}
      {showAdvancedAdjuster && (
        <div className="bg-amber-50/70 border-b border-amber-200 p-4 animate-fadeIn">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-3 flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-amber-700" />
            <span>Customize Crop Sowing Date &amp; Maturity Duration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Crop Variety</label>
              <input
                type="text"
                value={activeCropName}
                onChange={(e) => setActiveCropName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium"
                placeholder="e.g. Soybean, Wheat, Cotton, Rice"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Actual Sowing Date</label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Cycle Duration (Days)</label>
                <span className="font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                  {durationDays} Days
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="360"
                step="5"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Calculated Results Grid */}
      <div className="p-5 space-y-5">
        {/* Active Status Ribbon & Timeline Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Status Metric */}
          <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${statusBadge.bg}`}>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
              Crop Lifecycle Status
            </span>
            <div className="font-black text-sm sm:text-base mt-1">{statusBadge.label}</div>
            <div className="text-[11px] opacity-90 mt-1">
              {calculation.daysElapsed} days since sowing • {calculation.daysRemaining} days left
            </div>
          </div>

          {/* Physiological Maturity Date */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Physiological Maturity (Peak)
            </span>
            <div className="font-black text-slate-800 text-base sm:text-lg mt-1 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{calculation.idealHarvestWindowPeak}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Seed development &amp; dry matter accumulation 100%
            </div>
          </div>

          {/* Ideal Harvesting Window Range */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Ideal Harvest Window Range</span>
            </span>
            <div className="font-black text-amber-900 text-sm sm:text-base mt-1">
              {calculation.idealHarvestWindowStart} – {calculation.idealHarvestWindowEnd}
            </div>
            <div className="text-[11px] text-amber-800 mt-1">
              11-day optimal threshold before pod shatter
            </div>
          </div>

          {/* Grain Moisture Target */}
          <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/60 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">
              Safe Harvest Moisture
            </span>
            <div className="font-black text-indigo-900 text-base sm:text-lg mt-1">
              {calculation.grainMoistureTarget}
            </div>
            <div className="text-[11px] text-indigo-700 mt-1">
              Prevents mold, fungal mycotoxins &amp; weight penalty
            </div>
          </div>
        </div>

        {/* Visual Lifecycle Progress Bar */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center space-x-1">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Sowing: {calculation.sowingDate}</span>
            </span>
            <span className="text-amber-700">
              Crop Maturity Progress: {calculation.progressPct}% ({calculation.daysElapsed} / {calculation.durationDays} Days)
            </span>
            <span className="flex items-center space-x-1 text-emerald-700">
              <span>Maturity: {calculation.idealHarvestWindowPeak}</span>
            </span>
          </div>

          {/* Progress track */}
          <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                calculation.progressPct >= 90
                  ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500'
              }`}
              style={{ width: `${calculation.progressPct}%` }}
            />
            {/* Ideal Window Visual Band */}
            <div
              className="absolute top-0 bottom-0 bg-amber-400/40 border-x-2 border-amber-600"
              style={{
                left: `${Math.max(0, ((calculation.durationDays - 5) / calculation.durationDays) * 100)}%`,
                width: `${(11 / calculation.durationDays) * 100}%`
              }}
              title="Ideal Harvest Window"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Stage 1: Sowing</span>
            <span>Stage 2: Vegetative Growth</span>
            <span>Stage 3: Flowering &amp; Grain Fill</span>
            <span className="font-bold text-amber-800">🌟 Stage 4: Harvest Window</span>
          </div>
        </div>

        {/* Weather Harvesting Advisory & Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left: Weather Suitability & Forecast Integration (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className={`p-4 rounded-xl border ${weatherScoreBadge.color}`}>
              <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider mb-1">
                <WeatherIcon className="w-4 h-4" />
                <span>{weatherScoreBadge.title}</span>
              </div>
              <p className="text-xs leading-relaxed font-medium mt-1">
                {calculation.weatherConditionSummary}
              </p>
              <div className="mt-3 pt-3 border-t border-current/20 flex items-center justify-between text-xs">
                <span>Harvest Window Rain Risk:</span>
                <span className="font-bold">{calculation.rainProbabilityInWindow}% Probability</span>
              </div>
            </div>

            {/* Farm Activity Logging Button */}
            <button
              onClick={handleAddToFarmLog}
              disabled={isLogged}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs ${
                isLogged
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isLogged ? '✓ Harvest Window Logged to Farm Records' : 'Log Harvest Window in Farm Activities'}</span>
            </button>
          </div>

          {/* Right: Step-by-Step Agronomic Checklist (7 cols) */}
          <div className="md:col-span-7 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pre-Harvest Agronomic Action Plan</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-medium">ICAR Harvest Standard</span>
            </div>

            <div className="space-y-2">
              {calculation.recommendedActions.map((action, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start space-x-2"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
