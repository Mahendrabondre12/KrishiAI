import { Crop, HarvestWindowCalculation, WeatherData } from '../types';

export const CROP_DEFAULT_DURATION_MAP: Record<string, { durationDays: number; variety: string; moistureTarget: string }> = {
  Soybean: { durationDays: 100, variety: 'JS 20-98 / KDS 726', moistureTarget: '12% - 14%' },
  Wheat: { durationDays: 125, variety: 'PBW-826 / HD-3086', moistureTarget: '11% - 13%' },
  Cotton: { durationDays: 160, variety: 'RCH 659 BG II', moistureTarget: '8% - 10% (Lint)' },
  Sugarcane: { durationDays: 330, variety: 'Co-86032 / Co-0265', moistureTarget: 'Brix > 18°' },
  'Rice / Paddy': { durationDays: 125, variety: 'PR-126 / Basmati 1509', moistureTarget: '20% (Combine) / 14% (Storage)' },
  Rice: { durationDays: 125, variety: 'PR-126 / Basmati', moistureTarget: '14% (Storage)' },
  Paddy: { durationDays: 125, variety: 'PR-126', moistureTarget: '14%' },
  'Mustard / Rapeseed': { durationDays: 120, variety: 'Giriraj / RLC-3', moistureTarget: '8% - 9%' },
  Mustard: { durationDays: 120, variety: 'Giriraj', moistureTarget: '8% - 9%' },
  'Gram / Chickpea': { durationDays: 105, variety: 'Phule Vikram / Vijay', moistureTarget: '10% - 12%' },
  Chickpea: { durationDays: 105, variety: 'Digvijay', moistureTarget: '10% - 12%' },
  Onion: { durationDays: 120, variety: 'Bhima Super', moistureTarget: 'Neck fall 50-70%' },
  Potato: { durationDays: 95, variety: 'Kufri Pukhraj', moistureTarget: 'Skin hardening complete' },
  Maize: { durationDays: 105, variety: 'DKC 9108 / Pioneer', moistureTarget: '14% - 15%' },
  Groundnut: { durationDays: 115, variety: 'TG 37A / Kadiri-6', moistureTarget: '8% - 9%' },
  Tomato: { durationDays: 85, variety: 'Abhinav / Shivam', moistureTarget: 'Breaker / Pink Stage' },
  Chilli: { durationDays: 130, variety: 'Armour / Teja', moistureTarget: '10% (Dry Red)' },
  'Coffee (Arabica / Robusta)': { durationDays: 240, variety: 'Sln 9 / Chandragiri', moistureTarget: 'Crimson Red Berries' },
  Coffee: { durationDays: 240, variety: 'Chandragiri', moistureTarget: 'Ripe Berries' },
  'Ragi / Finger Millet': { durationDays: 110, variety: 'GPU 28 / ML-365', moistureTarget: '12% - 13%' },
  Ragi: { durationDays: 110, variety: 'GPU 28', moistureTarget: '12%' },
  Grapes: { durationDays: 140, variety: 'Thompson Seedless', moistureTarget: 'Brix 18-20°' }
};

export function getCropDuration(cropName: string): number {
  const match = Object.keys(CROP_DEFAULT_DURATION_MAP).find(
    (k) => k.toLowerCase() === cropName.toLowerCase() || cropName.toLowerCase().includes(k.toLowerCase())
  );
  return match ? CROP_DEFAULT_DURATION_MAP[match].durationDays : 110;
}

export function calculateHarvestWindow(params: {
  sowingDate: string;
  durationDays?: number;
  cropName: string;
  variety?: string;
  weather?: WeatherData | null;
}): HarvestWindowCalculation {
  const { sowingDate, cropName, variety, weather } = params;
  const duration = params.durationDays || getCropDuration(cropName);

  // Parse Sowing Date
  const sDate = new Date(sowingDate || new Date().toISOString().split('T')[0]);
  const now = new Date();

  // Physiological maturity is sowingDate + duration
  const maturityDate = new Date(sDate.getTime() + duration * 24 * 60 * 60 * 1000);

  // Ideal window:
  // Starts 4 days before maturity (field drying / early threshing begins)
  // Peaks on maturity date
  // Ends 7 days after maturity (late cut-off before pod shattering or lodging)
  const windowStart = new Date(maturityDate.getTime() - 4 * 24 * 60 * 60 * 1000);
  const windowEnd = new Date(maturityDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Days elapsed
  const diffTime = now.getTime() - sDate.getTime();
  const daysElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, Math.floor((maturityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const progressPct = Math.min(100, Math.max(0, Math.round((daysElapsed / duration) * 100)));

  // Determine Harvest Status
  let harvestStatus: 'growing' | 'approaching_window' | 'in_ideal_window' | 'past_ideal_window' = 'growing';
  if (now > windowEnd) {
    harvestStatus = 'past_ideal_window';
  } else if (now >= windowStart && now <= windowEnd) {
    harvestStatus = 'in_ideal_window';
  } else if (daysRemaining <= 15) {
    harvestStatus = 'approaching_window';
  } else {
    harvestStatus = 'growing';
  }

  // Weather suitability analysis in the harvest window
  let rainProbInWindow = 15;
  let weatherConditionSummary = 'Optimal dry, sunny weather expected. Ideal for combine harvesting & field drying.';
  let weatherHarvestScore: 'optimal_dry' | 'moderate_caution' | 'storm_risk' = 'optimal_dry';

  if (weather && weather.forecast && weather.forecast.length > 0) {
    const avgRain =
      weather.forecast.reduce((acc, curr) => acc + curr.rainProbabilityPct, 0) / weather.forecast.length;
    rainProbInWindow = Math.round(avgRain);

    if (rainProbInWindow > 45) {
      weatherHarvestScore = 'storm_risk';
      weatherConditionSummary = `⚠️ Elevated precipitation risk (${rainProbInWindow}% rain chance). Accelerate threshing and prepare waterproof tarpaulins immediately.`;
    } else if (rainProbInWindow > 25) {
      weatherHarvestScore = 'moderate_caution';
      weatherConditionSummary = `⛅ Intermittent cloud cover with ${rainProbInWindow}% rain chance. Monitor midday humidity before running threshers.`;
    } else {
      weatherHarvestScore = 'optimal_dry';
      weatherConditionSummary = `☀️ Clear dry skies (${rainProbInWindow}% rain). Ideal conditions for direct field harvesting and sun drying.`;
    }
  }

  // Moisture target
  const matchedInfo = Object.keys(CROP_DEFAULT_DURATION_MAP).find(
    (k) => k.toLowerCase() === cropName.toLowerCase() || cropName.toLowerCase().includes(k.toLowerCase())
  );
  const grainMoistureTarget = matchedInfo ? CROP_DEFAULT_DURATION_MAP[matchedInfo].moistureTarget : '12% - 14%';

  // Recommended Pre-Harvest and In-Window Actions
  const recommendedActions: string[] = [];
  if (harvestStatus === 'growing') {
    recommendedActions.push(`Maintain regular stage monitoring. Days to harvest window: ${daysRemaining} days.`);
    recommendedActions.push('Ensure optimal irrigation cutoff 10-14 days before projected maturity.');
  } else if (harvestStatus === 'approaching_window') {
    recommendedActions.push(`Stop all field irrigation now to allow uniform grain/pod dry-down (Target: ${grainMoistureTarget}).`);
    recommendedActions.push('Book custom hiring center (CHC) combine harvester or threshing labor 7 days in advance.');
    recommendedActions.push('Check nearest APMC Mandi daily arrival prices & calibrate transport bags.');
    recommendedActions.push('Inspect 10 random plants for 80-85% pod/grain color change (golden-yellow).');
  } else if (harvestStatus === 'in_ideal_window') {
    recommendedActions.push('⭐ CURRENTLY IN OPTIMAL HARVEST WINDOW: Initiate harvesting during early morning or clear sunny hours.');
    recommendedActions.push(`Perform moisture meter test. Ensure grain moisture is within ${grainMoistureTarget} before bagging.`);
    recommendedActions.push('Spread harvested crop on tarpaulins to prevent soil contact and aflatoxin development.');
    recommendedActions.push('Transport produce to warehouse / e-NAM mandi to capture peak seasonal market prices.');
  } else {
    recommendedActions.push('⚠️ Immediate harvest required to prevent shattering, bird damage, and fungal lodging.');
    recommendedActions.push('Protect harvested produce from overnight dew or unseasonal showers.');
  }

  // Format Dates
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Notification Payload
  const pushNotificationMessage = {
    title:
      harvestStatus === 'in_ideal_window'
        ? `🌾 Ideal Harvest Window Active: ${cropName}`
        : harvestStatus === 'approaching_window'
        ? `⏳ Harvest Window in ${daysRemaining} Days: ${cropName}`
        : `🌱 Harvest Forecast Updated: ${cropName}`,
    body:
      harvestStatus === 'in_ideal_window'
        ? `Optimal harvesting window is active (${formatDate(windowStart)} - ${formatDate(windowEnd)}). ${weatherConditionSummary}`
        : harvestStatus === 'approaching_window'
        ? `Target maturity on ${formatDate(maturityDate)}. Stop irrigation and book threshing equipment.`
        : `Expected maturity on ${formatDate(maturityDate)} based on ${duration}-day cycle.`,
    severity:
      harvestStatus === 'in_ideal_window'
        ? ('warning' as const)
        : harvestStatus === 'approaching_window'
        ? ('info' as const)
        : ('info' as const)
  };

  return {
    cropName,
    variety: variety || (matchedInfo ? CROP_DEFAULT_DURATION_MAP[matchedInfo].variety : 'Standard'),
    sowingDate: sDate.toISOString().split('T')[0],
    durationDays: duration,
    physiologicalMaturityDate: formatDate(maturityDate),
    idealHarvestWindowStart: formatDate(windowStart),
    idealHarvestWindowPeak: formatDate(maturityDate),
    idealHarvestWindowEnd: formatDate(windowEnd),
    windowSpanDays: 11,
    daysElapsed,
    daysRemaining,
    progressPct,
    harvestStatus,
    weatherHarvestScore,
    weatherConditionSummary,
    rainProbabilityInWindow: rainProbInWindow,
    grainMoistureTarget,
    recommendedActions,
    pushNotificationMessage
  };
}

/**
 * Triggers a native Web Push Notification (with fallback to CustomEvent / Sound)
 */
export async function sendHarvestPushNotification(
  calculation: HarvestWindowCalculation
): Promise<{ success: boolean; mode: 'native' | 'in_app'; error?: string }> {
  try {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(calculation.pushNotificationMessage.title, {
          body: calculation.pushNotificationMessage.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `harvest_${calculation.cropName}`,
          data: {
            url: window.location.href,
            crop: calculation.cropName
          }
        });
        playNotificationAudio();
        return { success: true, mode: 'native' };
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification(calculation.pushNotificationMessage.title, {
            body: calculation.pushNotificationMessage.body,
            icon: '/favicon.ico'
          });
          playNotificationAudio();
          return { success: true, mode: 'native' };
        }
      }
    }
  } catch (err: any) {
    console.warn('Native notification not supported or permission blocked, falling back to in-app event', err);
  }

  // In-app fallback trigger
  playNotificationAudio();
  window.dispatchEvent(
    new CustomEvent('krishi_push_notification', {
      detail: {
        title: calculation.pushNotificationMessage.title,
        body: calculation.pushNotificationMessage.body,
        type: 'harvest',
        severity: calculation.pushNotificationMessage.severity
      }
    })
  );

  return { success: true, mode: 'in_app' };
}

function playNotificationAudio() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Audio not allowed or unavailable
  }
}
