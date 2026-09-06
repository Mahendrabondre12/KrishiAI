export type UserRole = 'farmer' | 'agronomist' | 'admin';
export type AppLanguage = 'en' | 'hi' | 'mr' | 'pa' | 'gu' | 'te' | 'ta' | 'kn' | 'bn';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  language: AppLanguage;
  createdAt: string;
  avatarUrl?: string;
  state?: string;
  district?: string;
  kisanCreditCardId?: string;
  landHoldingAcres?: number;
  khataNumber?: string;
  totalFarmsCount?: number;
  isCustomProfile?: boolean;
  smsAlertsEnabled?: boolean;
  weatherAlertsEnabled?: boolean;
  cropActivityAlertsEnabled?: boolean;
}

export interface StageDetail {
  stageNumber: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  dayRange: string;
  progressPct: number;
  keyActivities: string[];
  fertilizerDose: string;
  irrigationRule: string;
  riskWatch: string;
  pestAlert: string;
}

export interface MostHarvestedCrop {
  id: string;
  cropName: string;
  localName?: string;
  harvestRank: number; // 1 = top most harvested
  typicalHarvestSeason: 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
  durationDays: number;
  avgYieldQuintalsPerAcre: string;
  profitabilityIndex: 'High (₹45k-80k/ac)' | 'Very High (₹70k-1.2L/ac)' | 'Moderate (₹30k-50k/ac)';
  dominantDistricts: string[];
  climateSoilSuitability: string;
  popularVarieties: string[];
  recommendedSowingMonth: string;
  harvestMonth: string;
  marketDemand: 'Very High' | 'High' | 'Steady';
  waterRequirement: 'Low' | 'Moderate' | 'High';
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
  | 'Stage 1: Sowing & Germination (Days 0-15)'
  | 'Stage 2: Vegetative Growth (Days 15-40)'
  | 'Stage 3: Flowering & Pod Formation (Days 40-75)'
  | 'Stage 4: Maturity & Harvest (Days 75-100+)'
  | 'Sowing / Nursery'
  | 'Germination & Emergence'
  | 'Vegetative Growth'
  | 'Tillering / Branching'
  | 'Flowering & Pollination'
  | 'Grain / Fruit Development'
  | 'Fruiting & Harvesting'
  | 'Maturity & Ripening'
  | 'Harvest Ready'
  | string;

export interface Crop {
  id: string;
  farmId: string;
  userId: string;
  name: string;
  variety: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial' | 'All Season' | string;
  sowingDate: string;
  expectedHarvestDate?: string;
  currentStage: CropStage;
  healthScore?: number;
  durationDays?: number;
  expectedYieldQuintals?: number;
  targetYieldQuintals?: number;
  createdAt: string;
}

export interface SoilRecord {
  id: string;
  farmId: string;
  userId: string;
  testedAt: string;
  ph?: number;
  nitrogenKgPerHa?: number;
  phosphorusKgPerHa?: number;
  potassiumKgPerHa?: number;
  organicCarbonPct?: number;
  moisturePct?: number;
  electricalConductivity?: number;
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
  quantity?: string;
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
  possibleIssue: string;
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

export interface AgroClimaticZoneInfo {
  zoneCode: string;
  zoneName: string;
  majorState: string;
  climateType: string;
  annualRainfallMm: string;
  dominantSoilType: string;
  majorCrops: string[];
  weatherRisks: string[];
  endemicDiseases: string[];
  harvestCalendar: {
    kharifWindow: string;
    rabiWindow: string;
    zaidWindow: string;
  };
}

export interface HarvestWindowCalculation {
  cropName: string;
  variety: string;
  sowingDate: string;
  durationDays: number;
  physiologicalMaturityDate: string;
  idealHarvestWindowStart: string;
  idealHarvestWindowPeak: string;
  idealHarvestWindowEnd: string;
  windowSpanDays: number;
  daysElapsed: number;
  daysRemaining: number;
  progressPct: number;
  harvestStatus: 'growing' | 'approaching_window' | 'in_ideal_window' | 'past_ideal_window';
  weatherHarvestScore: 'optimal_dry' | 'moderate_caution' | 'storm_risk';
  weatherConditionSummary: string;
  rainProbabilityInWindow: number;
  grainMoistureTarget: string;
  recommendedActions: string[];
  pushNotificationMessage: {
    title: string;
    body: string;
    severity: 'info' | 'warning' | 'critical';
  };
}

export interface FarmAlert {
  id: string;
  farmId: string;
  userId: string;
  title: string;
  message: string;
  type: 'weather' | 'pest' | 'irrigation' | 'nutrient' | 'harvest' | 'system';
  severity: 'info' | 'warning' | 'critical';
  isDismissed: boolean;
  actionPayload?: {
    actionType: string;
    targetView?: string;
    harvestDetails?: Partial<HarvestWindowCalculation>;
  };
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'alert' | 'recommendation' | 'expert' | 'weather' | 'harvest';
  isRead: boolean;
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
  ndviScore: number;
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
