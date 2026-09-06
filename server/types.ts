export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'farmer' | 'agronomist' | 'admin';
  language: 'en' | 'hi' | 'mr' | 'pa' | 'gu' | 'te' | 'ta' | 'kn' | 'bn';
  state?: string;
  district?: string;
  landHoldingAcres?: number;
  khataNumber?: string;
  smsAlertsEnabled?: boolean;
  weatherAlertsEnabled?: boolean;
  cropActivityAlertsEnabled?: boolean;
  createdAt: string;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  areaAcres: number;
  state: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  soilType: 'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Sandy Loam' | 'Clay' | 'Loamy';
  irrigationType: 'Drip' | 'Sprinkler' | 'Canal/Flood' | 'Borewell' | 'Rainfed';
  activeCropId?: string;
  createdAt: string;
  updatedAt: string;
}

export type CropStage =
  | 'Sowing / Nursery'
  | 'Germination & Emergence'
  | 'Vegetative Growth'
  | 'Tillering / Branching'
  | 'Flowering & Pollination'
  | 'Grain / Fruit Development'
  | 'Fruiting & Harvesting'
  | 'Maturity & Ripening'
  | 'Harvest Ready';

export interface Crop {
  id: string;
  farmId: string;
  userId: string;
  name: string; // e.g. "Wheat", "Rice/Paddy", "Cotton", "Soybean"
  variety: string; // e.g. "HD-2967", "Basmati 1121", "Bt Cotton"
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
  sowingDate: string;
  expectedHarvestDate: string;
  currentStage: CropStage;
  healthScore: number; // 0 to 100
  targetYieldQuintals?: number;
  createdAt: string;
}

export interface SoilRecord {
  id: string;
  farmId: string;
  userId: string;
  testedAt: string;
  ph?: number; // 5.5 - 8.5
  nitrogenKgPerHa?: number; // Low (<280), Medium (280-560), High (>560)
  phosphorusKgPerHa?: number; // Low (<10), Medium (10-25), High (>25)
  potassiumKgPerHa?: number; // Low (<110), Medium (110-280), High (>280)
  organicCarbonPct?: number; // <0.5 (Low), 0.5-0.75 (Med), >0.75 (High)
  moisturePct?: number;
  electricalConductivity?: number; // dS/m
  notes?: string;
  createdAt: string;
}

export interface FarmActivity {
  id: string;
  farmId: string;
  cropId?: string;
  userId: string;
  activityType: 'Irrigation' | 'Fertilizer' | 'Pesticide' | 'Weeding' | 'Scouting' | 'Harvest' | 'Soil Testing' | 'Other';
  title: string;
  description: string;
  quantity?: string; // e.g. "50 kg Urea", "2 hours Drip", "500ml Neem Oil"
  costRupees?: number;
  date: string;
  createdAt: string;
}

export interface WeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  fetchedAt: string;
  isLive: boolean;
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeedKmH: number;
    windDirection: number;
    precipitationMm: number;
    rainProbabilityPct: number;
    weatherCode: number;
    weatherDescription: string;
    uvIndex: number;
    soilTemperature?: number;
    soilMoisture?: number;
  };
  forecast: Array<{
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    rainProbabilityPct: number;
    precipitationMm: number;
    weatherCode: number;
    weatherDescription: string;
    windSpeedMaxKmH: number;
    irrigationAdvice: string;
  }>;
}

export interface AiRecommendation {
  id: string;
  farmId: string;
  cropId?: string;
  userId: string;
  generatedAt: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  currentCropCondition: string;
  summary: string;
  todayActionPlan: {
    highPriority: Array<{ action: string; why: string }>;
    mediumPriority: Array<{ action: string; why: string }>;
    monitor: Array<{ action: string; why: string }>;
  };
  irrigationAdvice: {
    recommendation: string;
    status: 'Delay' | 'Recommended' | 'Normal' | 'Heavy Drain Required';
    rationale: string;
  };
  weatherRisk: string;
  soilConsideration: string;
  next24Hours: string;
  next7Days: string;
  warnings: string[];
  confidence: {
    level: 'High' | 'Moderate' | 'Low';
    score: number;
    explanation: string;
  };
  dataSources: {
    weatherFreshness: string;
    cropStageConsidered: string;
    soilDataConsidered: boolean;
    recentActivitiesCount: number;
  };
}

export interface DiseaseAnalysisResult {
  id: string;
  cropName: string;
  possibleIssue: string; // explicitly not definitive
  confidenceLevel: 'High' | 'Moderate' | 'Low';
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  visibleSymptoms: string[];
  causesAndConditions: string;
  immediateActions: string[];
  organicManagement: string[];
  chemicalManagement: string[];
  preventativeMeasures: string[];
  expertReviewRecommended: boolean;
  additionalInfoNeeded: string[];
  disclaimer: string;
  analyzedAt: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  farmContextUsed?: {
    farmName: string;
    crop: string;
    stage: string;
    weather: string;
  };
  suggestedQuestions?: string[];
}

export interface FarmAlert {
  id: string;
  farmId: string;
  userId: string;
  title: string;
  message: string;
  type: 'weather' | 'pest' | 'irrigation' | 'nutrient' | 'system';
  severity: 'info' | 'warning' | 'critical';
  isDismissed: boolean;
  createdAt: string;
}

export interface ExpertCase {
  id: string;
  farmId: string;
  userId: string;
  farmerName: string;
  farmerPhone?: string;
  cropName: string;
  location: string;
  title: string;
  description: string;
  imageUrl?: string;
  aiAnalysisSummary?: string;
  weatherSummary?: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  assignedExpertName?: string;
  expertDiagnosis?: string;
  expertPrescription?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface SatelliteHealthData {
  farmId: string;
  lastPassDate: string;
  isAvailable: boolean;
  ndviScore: number; // 0.0 - 1.0 (Normalized Difference Vegetation Index)
  vegetationVitality: 'Excellent' | 'Good' | 'Moderate' | 'Stressed';
  moistureIndexNdwi: number;
  cropStressPct: number;
  anomalyDetected: boolean;
  fieldZoneHealth: Array<{
    zone: string;
    vitality: string;
    status: 'Healthy' | 'Moderate' | 'Needs Attention';
  }>;
  satelliteSensor: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface MobileNotificationSettings {
  userId: string;
  phone: string;
  dailyUpdatesEnabled: boolean;
  dispatchTime: string; // e.g. "06:00 AM"
  channels: ('sms' | 'whatsapp')[];
  language: string;
  includeWeather: boolean;
  includeCropAdvisory: boolean;
  includeIrrigationAlert: boolean;
  includePestWarnings: boolean;
  lastDispatchedAt?: string;
}

export interface MobileDispatchLog {
  id: string;
  userId: string;
  farmId: string;
  farmName: string;
  location: string;
  phone: string;
  recipientName?: string;
  channel: 'sms' | 'whatsapp';
  status: 'Delivered' | 'Sent' | 'Failed';
  timestamp: string;
  weatherSummary: string;
  cropSummary: string;
  fullMessageText: string;
  gatewayResponseId?: string;
}
