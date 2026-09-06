import { WeatherData } from './types';

// In-memory cache for weather data by coordinates
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// WMO Weather interpretation codes
function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return 'Clear Sky';
    case 1:
      return 'Mainly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Overcast';
    case 45:
      return 'Foggy';
    case 48:
      return 'Depositing Rime Fog';
    case 51:
      return 'Light Drizzle';
    case 53:
      return 'Moderate Drizzle';
    case 55:
      return 'Dense Drizzle';
    case 61:
      return 'Slight Rain';
    case 63:
      return 'Moderate Rain';
    case 65:
      return 'Heavy Rain';
    case 71:
      return 'Slight Snow Fall';
    case 73:
      return 'Moderate Snow Fall';
    case 75:
      return 'Heavy Snow Fall';
    case 80:
      return 'Slight Rain Showers';
    case 81:
      return 'Moderate Rain Showers';
    case 82:
      return 'Violent Rain Showers';
    case 95:
      return 'Thunderstorm';
    case 96:
    case 99:
      return 'Thunderstorm with Hail';
    default:
      return 'Partly Cloudy';
  }
}

export async function fetchLiveWeather(
  latitude: number,
  longitude: number,
  locationName: string
): Promise<WeatherData> {
  const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,uv_index,soil_temperature_0_to_7cm,soil_moisture_0_to_7cm&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'KrishiAI-Agriculture-Platform/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Weather API returned status: ${response.status}`);
    }

    const data = await response.json();

    const current = data.current;
    const daily = data.daily;

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const forecast = (daily.time || []).map((dateStr: string, idx: number) => {
      const d = new Date(dateStr);
      const dayName = dayNames[d.getDay()] || dateStr;
      const rainProb = daily.precipitation_probability_max?.[idx] ?? 0;
      const precipMm = daily.precipitation_sum?.[idx] ?? 0;
      const wCode = daily.weather_code?.[idx] ?? 0;

      let irrigationAdvice = 'Normal irrigation schedule';
      if (rainProb > 60 || precipMm > 8) {
        irrigationAdvice = 'Delay irrigation (Rain expected)';
      } else if ((daily.temperature_2m_max?.[idx] ?? 25) > 36) {
        irrigationAdvice = 'Increase irrigation volume (High heat evapotranspiration)';
      }

      return {
        date: dateStr,
        dayName,
        tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? 28),
        tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? 18),
        rainProbabilityPct: Math.round(rainProb),
        precipitationMm: Number((precipMm).toFixed(1)),
        weatherCode: wCode,
        weatherDescription: getWeatherDescription(wCode),
        windSpeedMaxKmH: Math.round(daily.wind_speed_10m_max?.[idx] ?? 12),
        irrigationAdvice
      };
    });

    const weatherResult: WeatherData = {
      locationName,
      latitude,
      longitude,
      fetchedAt: new Date().toISOString(),
      isLive: true,
      current: {
        temperature: Math.round(current.temperature_2m ?? 26),
        feelsLike: Math.round(current.apparent_temperature ?? 26),
        humidity: Math.round(current.relative_humidity_2m ?? 60),
        windSpeedKmH: Math.round(current.wind_speed_10m ?? 10),
        windDirection: Math.round(current.wind_direction_10m ?? 180),
        precipitationMm: Number((current.precipitation ?? 0).toFixed(1)),
        rainProbabilityPct: Math.round(daily.precipitation_probability_max?.[0] ?? 20),
        weatherCode: current.weather_code ?? 0,
        weatherDescription: getWeatherDescription(current.weather_code ?? 0),
        uvIndex: Math.round(current.uv_index ?? 5),
        soilTemperature: current.soil_temperature_0_to_7cm !== undefined ? Math.round(current.soil_temperature_0_to_7cm) : undefined,
        soilMoisture: current.soil_moisture_0_to_7cm !== undefined ? Number((current.soil_moisture_0_to_7cm * 100).toFixed(1)) : undefined
      },
      forecast
    };

    weatherCache.set(cacheKey, { data: weatherResult, timestamp: Date.now() });
    return weatherResult;
  } catch (error) {
    console.error(`Failed to fetch live weather for (${latitude}, ${longitude}):`, error);

    // If cache had previous data, return with isLive: false
    if (cached) {
      return {
        ...cached.data,
        isLive: false
      };
    }

    // Graceful fallback indicating weather service temporarily unreachable
    return {
      locationName,
      latitude,
      longitude,
      fetchedAt: new Date().toISOString(),
      isLive: false,
      current: {
        temperature: 26,
        feelsLike: 26,
        humidity: 60,
        windSpeedKmH: 10,
        windDirection: 180,
        precipitationMm: 0,
        rainProbabilityPct: 15,
        weatherCode: 2,
        weatherDescription: 'Partly Cloudy (Cached Estimate)',
        uvIndex: 5,
        soilTemperature: 24,
        soilMoisture: 32
      },
      forecast: [
        {
          date: new Date().toISOString().split('T')[0],
          dayName: 'Today',
          tempMax: 29,
          tempMin: 19,
          rainProbabilityPct: 15,
          precipitationMm: 0,
          weatherCode: 2,
          weatherDescription: 'Partly Cloudy',
          windSpeedMaxKmH: 12,
          irrigationAdvice: 'Normal irrigation schedule'
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          dayName: 'Tomorrow',
          tempMax: 30,
          tempMin: 18,
          rainProbabilityPct: 20,
          precipitationMm: 0,
          weatherCode: 1,
          weatherDescription: 'Mainly Clear',
          windSpeedMaxKmH: 10,
          irrigationAdvice: 'Normal irrigation schedule'
        }
      ]
    };
  }
}

// Indian agricultural districts coordinate, soil & primary crop lookup
export function getLocationCoordinates(
  stateName: string = 'Maharashtra',
  districtName: string = 'Latur'
): {
  lat: number;
  lng: number;
  soil: 'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Sandy Loam';
  defaultCrop: string;
  variety: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
} {
  const normState = stateName.toLowerCase().trim();
  const normDist = districtName.toLowerCase().trim();

  // District specific coordinates
  const districtMap: Record<string, { lat: number; lng: number; soil: 'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Sandy Loam'; crop: string; var: string; season: 'Kharif' | 'Rabi' | 'Zaid' }> = {
    latur: { lat: 18.4088, lng: 76.5604, soil: 'Black', crop: 'Soybean', var: 'JS-335', season: 'Kharif' },
    nashik: { lat: 20.0059, lng: 73.7898, soil: 'Black', crop: 'Tomato / Onion', var: 'Abhinav Hybrid F1', season: 'Zaid' },
    pune: { lat: 18.5204, lng: 73.8567, soil: 'Black', crop: 'Sugarcane', var: 'Co 86032', season: 'Kharif' },
    nagpur: { lat: 21.1458, lng: 79.0882, soil: 'Black', crop: 'Cotton / Orange', var: 'Bt Cotton Bollgard II', season: 'Kharif' },
    solapur: { lat: 17.6599, lng: 75.9064, soil: 'Black', crop: 'Pomegranate / Jowar', var: 'Bhagwa Hybrid', season: 'Rabi' },
    kolhapur: { lat: 16.7050, lng: 74.2433, soil: 'Black', crop: 'Sugarcane', var: 'Co 92005', season: 'Kharif' },
    amravati: { lat: 20.9374, lng: 77.7796, soil: 'Black', crop: 'Soybean / Cotton', var: 'MACS 1407', season: 'Kharif' },
    aurangabad: { lat: 19.8762, lng: 75.3433, soil: 'Black', crop: 'Cotton / Maize', var: 'Rasi Bt-2', season: 'Kharif' },
    ludhiana: { lat: 30.9010, lng: 75.8573, soil: 'Alluvial', crop: 'Wheat', var: 'PBW-826 / HD-3086', season: 'Rabi' },
    amritsar: { lat: 31.6340, lng: 74.8723, soil: 'Alluvial', crop: 'Basmati Rice', var: 'Pusa Basmati 1121', season: 'Kharif' },
    bathinda: { lat: 30.2110, lng: 74.9455, soil: 'Alluvial', crop: 'Cotton / Wheat', var: 'RCH 650', season: 'Kharif' },
    karnal: { lat: 29.6857, lng: 76.9905, soil: 'Alluvial', crop: 'Paddy / Wheat', var: 'CSR-30 Basmati', season: 'Kharif' },
    hisar: { lat: 29.1492, lng: 75.7217, soil: 'Sandy Loam', crop: 'Mustard', var: 'RH-725', season: 'Rabi' },
    rajkot: { lat: 22.3039, lng: 70.8022, soil: 'Black', crop: 'Groundnut / Cotton', var: 'GG-20', season: 'Kharif' },
    surat: { lat: 21.1702, lng: 72.8311, soil: 'Black', crop: 'Sugarcane / Banana', var: 'Grand Naine', season: 'Kharif' },
    indore: { lat: 22.7196, lng: 75.8577, soil: 'Black', crop: 'Soybean / Wheat', var: 'JS-9560', season: 'Kharif' },
    bhopal: { lat: 23.2599, lng: 77.4126, soil: 'Black', crop: 'Wheat / Gram', var: 'Sharbati Lok-1', season: 'Rabi' },
    lucknow: { lat: 26.8467, lng: 80.9462, soil: 'Alluvial', crop: 'Mango / Wheat', var: 'Dasheri / PBW-502', season: 'Rabi' },
    varanasi: { lat: 25.3176, lng: 82.9739, soil: 'Alluvial', crop: 'Paddy / Vegetables', var: 'Swarna Sub-1', season: 'Kharif' },
    jaipur: { lat: 26.9124, lng: 75.7873, soil: 'Sandy Loam', crop: 'Bajra / Mustard', var: 'Pusa 1201', season: 'Kharif' },
    jodhpur: { lat: 26.2389, lng: 73.0243, soil: 'Sandy Loam', crop: 'Moong / Guar', var: 'RMG-492', season: 'Kharif' },
    bengaluru: { lat: 12.9716, lng: 77.5946, soil: 'Red', crop: 'Ragi (Finger Millet)', var: 'GPU-28', season: 'Kharif' },
    belagavi: { lat: 15.8497, lng: 74.4977, soil: 'Black', crop: 'Sugarcane / Maize', var: 'Co 86032', season: 'Kharif' },
    guntur: { lat: 16.3067, lng: 80.4365, soil: 'Black', crop: 'Chilli / Cotton', var: 'Teja Chilli LCA-334', season: 'Kharif' },
    coimbatore: { lat: 11.0168, lng: 76.9558, soil: 'Red', crop: 'Coconut / Cotton', var: 'Suvin Cotton', season: 'Kharif' },
    patna: { lat: 25.5941, lng: 85.1376, soil: 'Alluvial', crop: 'Maize / Paddy', var: 'Shaktiman-5', season: 'Kharif' }
  };

  if (districtMap[normDist]) {
    const d = districtMap[normDist];
    return {
      lat: d.lat,
      lng: d.lng,
      soil: d.soil,
      defaultCrop: d.crop,
      variety: d.var,
      season: d.season
    };
  }

  // State level defaults
  if (normState.includes('punjab')) {
    return { lat: 30.9010, lng: 75.8573, soil: 'Alluvial', defaultCrop: 'Wheat', variety: 'HD-3086', season: 'Rabi' };
  }
  if (normState.includes('haryana')) {
    return { lat: 29.0588, lng: 76.0856, soil: 'Alluvial', defaultCrop: 'Mustard', variety: 'RH-749', season: 'Rabi' };
  }
  if (normState.includes('gujarat')) {
    return { lat: 22.2587, lng: 71.1924, soil: 'Black', defaultCrop: 'Cotton', variety: 'Bt Cotton G-Cot-16', season: 'Kharif' };
  }
  if (normState.includes('madhya')) {
    return { lat: 22.9734, lng: 78.6569, soil: 'Black', defaultCrop: 'Soybean', variety: 'JS-335', season: 'Kharif' };
  }
  if (normState.includes('uttar')) {
    return { lat: 26.8467, lng: 80.9462, soil: 'Alluvial', defaultCrop: 'Wheat', variety: 'PBW-502', season: 'Rabi' };
  }
  if (normState.includes('rajasthan')) {
    return { lat: 27.0238, lng: 74.2179, soil: 'Sandy Loam', defaultCrop: 'Bajra', variety: 'Pusa 1201', season: 'Kharif' };
  }
  if (normState.includes('karnataka')) {
    return { lat: 15.3173, lng: 75.7139, soil: 'Red', defaultCrop: 'Ragi', variety: 'GPU-28', season: 'Kharif' };
  }
  if (normState.includes('andhra') || normState.includes('telangana')) {
    return { lat: 17.3850, lng: 78.4867, soil: 'Black', defaultCrop: 'Cotton', variety: 'Bt Cotton Teja', season: 'Kharif' };
  }
  if (normState.includes('tamil')) {
    return { lat: 11.1271, lng: 78.6569, soil: 'Red', defaultCrop: 'Paddy', variety: 'ADT-45', season: 'Kharif' };
  }
  if (normState.includes('bihar') || normState.includes('bengal')) {
    return { lat: 25.0961, lng: 85.3131, soil: 'Alluvial', defaultCrop: 'Paddy', variety: 'Swarna', season: 'Kharif' };
  }

  // Fallback (Maharashtra)
  return {
    lat: 18.4088,
    lng: 76.5604,
    soil: 'Black',
    defaultCrop: 'Soybean',
    variety: 'JS-335 (Bollgard Compatible)',
    season: 'Kharif'
  };
}
