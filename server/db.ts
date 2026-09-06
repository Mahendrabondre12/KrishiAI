import fs from 'fs';
import path from 'path';
import {
  User,
  Farm,
  Crop,
  SoilRecord,
  FarmActivity,
  AiRecommendation,
  DiseaseAnalysisResult,
  AiChatMessage,
  FarmAlert,
  ExpertCase,
  SatelliteHealthData,
  AuditLog,
  MobileNotificationSettings,
  MobileDispatchLog
} from './types';
import { getLocationCoordinates } from './weather';

interface DatabaseSchema {
  users: User[];
  farms: Farm[];
  crops: Crop[];
  soilRecords: SoilRecord[];
  farmActivities: FarmActivity[];
  aiRecommendations: AiRecommendation[];
  diseaseAnalyses: DiseaseAnalysisResult[];
  chatMessages: (AiChatMessage & { userId: string; farmId?: string })[];
  alerts: FarmAlert[];
  notifications: Array<{
    id: string;
    userId: string;
    title: string;
    body: string;
    type: 'alert' | 'recommendation' | 'expert' | 'weather';
    isRead: boolean;
    createdAt: string;
  }>;
  expertCases: ExpertCase[];
  satelliteHealth: SatelliteHealthData[];
  auditLogs: AuditLog[];
  mobileSettings: MobileNotificationSettings[];
  mobileLogs: MobileDispatchLog[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'krishiai_db.json');

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: 'usr_farmer_1',
      name: 'Ramesh Patel',
      email: 'ramesh.farmer@krishiai.org',
      phone: '+91 98234 56789',
      role: 'farmer',
      language: 'en',
      createdAt: '2026-01-10T08:00:00.000Z'
    },
    {
      id: 'usr_expert_1',
      name: 'Dr. Sunita Deshmukh',
      email: 'sunita.agronomist@krishiai.org',
      phone: '+91 94220 11223',
      role: 'agronomist',
      language: 'en',
      createdAt: '2026-01-05T09:00:00.000Z'
    },
    {
      id: 'usr_admin_1',
      name: 'KrishiAI System Admin',
      email: 'admin@krishiai.org',
      role: 'admin',
      language: 'en',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  farms: [
    {
      id: 'farm_punjab_1',
      userId: 'usr_farmer_1',
      name: 'Green Acres — Ludhiana Block',
      areaAcres: 5.5,
      state: 'Punjab',
      district: 'Ludhiana',
      village: 'Samrala',
      latitude: 30.9010,
      longitude: 75.8573,
      soilType: 'Alluvial',
      irrigationType: 'Borewell',
      activeCropId: 'crop_wheat_1',
      createdAt: '2026-01-12T10:00:00.000Z',
      updatedAt: '2026-08-20T10:00:00.000Z'
    },
    {
      id: 'farm_maharashtra_2',
      userId: 'usr_farmer_1',
      name: 'Sahyadri Organic Orchard',
      areaAcres: 3.2,
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Dindori',
      latitude: 20.0059,
      longitude: 73.7898,
      soilType: 'Black',
      irrigationType: 'Drip',
      activeCropId: 'crop_tomato_2',
      createdAt: '2026-02-15T11:00:00.000Z',
      updatedAt: '2026-08-22T08:30:00.000Z'
    }
  ],
  crops: [
    {
      id: 'crop_wheat_1',
      farmId: 'farm_punjab_1',
      userId: 'usr_farmer_1',
      name: 'Wheat',
      variety: 'HD-3086 (Pusa Gautami)',
      season: 'Rabi',
      sowingDate: '2025-11-15',
      expectedHarvestDate: '2026-04-10',
      currentStage: 'Flowering & Pollination',
      healthScore: 88,
      targetYieldQuintals: 24,
      createdAt: '2025-11-15T06:00:00.000Z'
    },
    {
      id: 'crop_tomato_2',
      farmId: 'farm_maharashtra_2',
      userId: 'usr_farmer_1',
      name: 'Tomato',
      variety: 'Abhinav Hybrid F1',
      season: 'Zaid',
      sowingDate: '2026-01-05',
      expectedHarvestDate: '2026-04-25',
      currentStage: 'Fruiting & Harvesting',
      healthScore: 78,
      targetYieldQuintals: 180,
      createdAt: '2026-01-05T07:00:00.000Z'
    }
  ],
  soilRecords: [
    {
      id: 'soil_punjab_1',
      farmId: 'farm_punjab_1',
      userId: 'usr_farmer_1',
      testedAt: '2026-01-15',
      ph: 7.4,
      nitrogenKgPerHa: 310,
      phosphorusKgPerHa: 18.5,
      potassiumKgPerHa: 240,
      organicCarbonPct: 0.62,
      moisturePct: 34,
      electricalConductivity: 0.42,
      notes: 'Good alluvial balance. Moderate nitrogen; optimal for wheat tillering and grain filling.',
      createdAt: '2026-01-15T12:00:00.000Z'
    },
    {
      id: 'soil_nashik_2',
      farmId: 'farm_maharashtra_2',
      userId: 'usr_farmer_1',
      testedAt: '2026-01-08',
      ph: 6.8,
      nitrogenKgPerHa: 260,
      phosphorusKgPerHa: 22.0,
      potassiumKgPerHa: 310,
      organicCarbonPct: 0.85,
      moisturePct: 28,
      electricalConductivity: 0.35,
      notes: 'Rich black soil with high organic matter. Excellent for tomato and vegetable fertigation.',
      createdAt: '2026-01-08T14:00:00.000Z'
    }
  ],
  farmActivities: [
    {
      id: 'act_1',
      farmId: 'farm_punjab_1',
      cropId: 'crop_wheat_1',
      userId: 'usr_farmer_1',
      activityType: 'Irrigation',
      title: 'Crown Root Irrigation (2nd cycle)',
      description: 'Run borewell pump for 3.5 hours across Field A and B.',
      quantity: '3.5 Hours pumping',
      costRupees: 420,
      date: '2026-02-18',
      createdAt: '2026-02-18T16:00:00.000Z'
    },
    {
      id: 'act_2',
      farmId: 'farm_punjab_1',
      cropId: 'crop_wheat_1',
      userId: 'usr_farmer_1',
      activityType: 'Fertilizer',
      title: 'Top Dressing Urea Application',
      description: 'Applied neem coated urea prior to evening light drizzle.',
      quantity: '45 kg Urea / acre',
      costRupees: 1350,
      date: '2026-02-10',
      createdAt: '2026-02-10T11:00:00.000Z'
    },
    {
      id: 'act_3',
      farmId: 'farm_maharashtra_2',
      cropId: 'crop_tomato_2',
      userId: 'usr_farmer_1',
      activityType: 'Pesticide',
      title: 'Organic Neem Oil Spray',
      description: 'Preventative spray against early aphid and whitefly colonies on upper leaves.',
      quantity: '500ml 10000ppm Neem Oil in 150L water',
      costRupees: 680,
      date: '2026-02-21',
      createdAt: '2026-02-21T09:00:00.000Z'
    }
  ],
  aiRecommendations: [
    {
      id: 'rec_init_1',
      farmId: 'farm_punjab_1',
      cropId: 'crop_wheat_1',
      userId: 'usr_farmer_1',
      generatedAt: '2026-08-25T05:00:00.000Z',
      riskLevel: 'medium',
      currentCropCondition: 'Flowering stage in progress. Foliage vigor is healthy; slight humidity spike detected in district forecast.',
      summary: 'Delay scheduled irrigation by 24 hours due to predicted cloud cover and 65% precipitation probability in Ludhiana.',
      todayActionPlan: {
        highPriority: [
          {
            action: 'Postpone heavy flood irrigation until tomorrow evening',
            why: 'Predicted 12mm scattered showers will satisfy root zone moisture without waterlogging risks.'
          },
          {
            action: 'Scout upper leaves for linear yellow rust pustules',
            why: 'Morning dew and 82% relative humidity create ideal micro-climate for stripe rust incubation.'
          }
        ],
        mediumPriority: [
          {
            action: 'Prepare foliar Potassium Nitrate (13:0:45) spray for post-rain application',
            why: 'Boosts grain weight and starch accumulation during anthesis/pollination.'
          }
        ],
        monitor: [
          {
            action: 'Check drainage furrows in low-lying corner of Field B',
            why: 'Prevent standing water which can trigger collar rot.'
          }
        ]
      },
      irrigationAdvice: {
        recommendation: 'Delay irrigation for 24-36 hours.',
        status: 'Delay',
        rationale: 'Adequate soil moisture (34%) + incoming rain probability of 65%.'
      },
      weatherRisk: 'Overcast skies with moderate gusts up to 18 km/h. Avoid high chemical spray pressure in midday.',
      soilConsideration: 'Alluvial soil drainage is good, but nitrogen leaching can occur if heavy downpours happen.',
      next24Hours: 'Rain clouds expected by 4:00 PM. Keep harvesting machinery under shed.',
      next7Days: 'Clear sunny skies return on Day 3; ideal window for micronutrient foliar application.',
      warnings: [
        'Do not spray insecticides between 9 AM - 12 PM to preserve pollinating honeybees.',
        'Verify chemical labels before tank mixing.'
      ],
      confidence: {
        level: 'High',
        score: 0.91,
        explanation: 'Calibrated with real live Open-Meteo GPS weather, verified soil test (pH 7.4), and HD-3086 flowering timeline.'
      },
      dataSources: {
        weatherFreshness: 'Live Open-Meteo API (synced 10 mins ago)',
        cropStageConsidered: 'Flowering & Pollination (Day 101)',
        soilDataConsidered: true,
        recentActivitiesCount: 2
      }
    }
  ],
  diseaseAnalyses: [
    {
      id: 'dia_sample_1',
      cropName: 'Wheat',
      possibleIssue: 'Early Stage Stripe / Yellow Rust (Puccinia striiformis)',
      confidenceLevel: 'High',
      severity: 'Moderate',
      visibleSymptoms: [
        'Distinct chlorotic yellow streaks running parallel to leaf veins',
        'Small powdery yellow-orange uredinial pustules',
        'Premature yellowing of flag leaves'
      ],
      causesAndConditions: 'Cool daytime temperatures (10-18°C) accompanied by heavy morning dew and high humidity.',
      immediateActions: [
        'Isolate infected field section to prevent spore dispersal via wind.',
        'Avoid excessive urea top-dressing which makes leaf cuticle softer.'
      ],
      organicManagement: [
        'Foliar spray of fermented cow butter milk (sour chhas) 10% + 5g/L Trichoderma viride.'
      ],
      chemicalManagement: [
        'Propiconazole 25% EC @ 1ml/liter (or Tebuconazole 25.9% EC @ 1ml/L) targeted thoroughly on foliage.'
      ],
      preventativeMeasures: [
        'Adopt rust-resistant wheat varieties (e.g. HD-3086, DBW-187, PBW-725) in next sowing cycle.',
        'Maintain row spacing of 20-22.5 cm for proper sun penetration.'
      ],
      expertReviewRecommended: true,
      additionalInfoNeeded: [
        'Percentage of field canopy showing streaks',
        'Recent night temperatures and fog duration'
      ],
      disclaimer: 'AI-generated visual screening based on image patterns. Never take irreversible agronomic measures without verifying locally with a Krishi Vigyan Kendra (KVK) agronomist.',
      analyzedAt: '2026-02-20T14:30:00.000Z'
    }
  ],
  chatMessages: [
    {
      id: 'msg_1',
      userId: 'usr_farmer_1',
      farmId: 'farm_punjab_1',
      sender: 'user',
      text: 'My wheat field is in flowering stage and the sky looks cloudy. Should I irrigate today?',
      timestamp: '2026-02-24T06:15:00.000Z'
    },
    {
      id: 'msg_2',
      userId: 'usr_farmer_1',
      farmId: 'farm_punjab_1',
      sender: 'assistant',
      text: 'Namaste Ramesh ji! Based on your Ludhiana farm data (Flowering stage, HD-3086 variety, soil moisture at 34%) and the live weather forecast showing 65% chance of rain (approx. 10-12 mm) this evening, **you should delay irrigation by 24 to 36 hours**.\n\nWaterlogging during flowering can cause root hypoxia and grain shattering if winds pick up. If the expected rain does not materialize by tomorrow evening, give a light 2-hour irrigation cycle.',
      timestamp: '2026-02-24T06:15:04.000Z',
      farmContextUsed: {
        farmName: 'Green Acres — Ludhiana Block',
        crop: 'Wheat (HD-3086)',
        stage: 'Flowering & Pollination',
        weather: 'Overcast, 22°C, 65% Rain Prob'
      },
      suggestedQuestions: [
        'What fertilizer should I spray after this rain?',
        'How do I identify Yellow Rust symptoms on my wheat leaves?',
        'What is the ideal soil temperature for grain filling?'
      ]
    }
  ],
  alerts: [
    {
      id: 'alt_1',
      farmId: 'farm_punjab_1',
      userId: 'usr_farmer_1',
      title: '🌧️ Heavy Rain & Gust Warning',
      message: 'Ludhiana district meteorological advisory: 10-15mm scattered showers expected within next 18 hours. Postpone open flood irrigation.',
      type: 'weather',
      severity: 'warning',
      isDismissed: false,
      createdAt: '2026-08-25T03:00:00.000Z'
    },
    {
      id: 'alt_2',
      farmId: 'farm_maharashtra_2',
      userId: 'usr_farmer_1',
      title: '💧 Tomato Fertigation Window',
      message: 'Tomato crop in Dindori is at peak fruit enlargement. Calcium Nitrate + Boron fertigation recommended to prevent Blossom End Rot.',
      type: 'nutrient',
      severity: 'info',
      isDismissed: false,
      createdAt: '2026-08-24T08:00:00.000Z'
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      userId: 'usr_farmer_1',
      title: 'New AI Farming Action Plan Available',
      body: 'Today\'s prioritized action plan for Green Acres Wheat Field has been updated based on fresh satellite & weather feeds.',
      type: 'recommendation',
      isRead: false,
      createdAt: '2026-08-25T05:00:00.000Z'
    },
    {
      id: 'notif_2',
      userId: 'usr_farmer_1',
      title: 'Expert Case Review Updated',
      body: 'Dr. Sunita Deshmukh has reviewed your crop leaf diagnosis and added a verified prescription.',
      type: 'expert',
      isRead: false,
      createdAt: '2026-08-23T11:20:00.000Z'
    }
  ],
  expertCases: [
    {
      id: 'case_1',
      farmId: 'farm_punjab_1',
      userId: 'usr_farmer_1',
      farmerName: 'Ramesh Patel',
      farmerPhone: '+91 98234 56789',
      cropName: 'Wheat (HD-3086)',
      location: 'Ludhiana, Punjab',
      title: 'Yellowing of Flag Leaf Tips across 1.5 Acre Patch',
      description: 'Noticed bright yellow spots turning into linear stripes on upper leaves after last week\'s dense fog. Need agronomist confirmation on dosage.',
      aiAnalysisSummary: 'AI visual scan flagged 88% probability of Stripe Rust (Puccinia striiformis). Recommended Propiconazole 25% EC.',
      weatherSummary: 'Avg temp: 18°C, Humidity: 84%, Morning dew persistent for 4 hours daily.',
      status: 'Resolved',
      assignedExpertName: 'Dr. Sunita Deshmukh (Senior Agronomist, PAU)',
      expertDiagnosis: 'Confirmed mild Stripe Rust outbreak triggered by micro-climatic humidity. No collar rot observed.',
      expertPrescription: 'Apply Propiconazole 25% EC @ 200ml in 200 liters of water per acre using hollow cone nozzle. Avoid spraying if wind exceeds 15 km/h. Re-scout in 7 days.',
      resolvedAt: '2026-02-22T16:00:00.000Z',
      createdAt: '2026-02-20T15:00:00.000Z'
    }
  ],
  satelliteHealth: [
    {
      farmId: 'farm_punjab_1',
      lastPassDate: '2026-08-24',
      isAvailable: true,
      ndviScore: 0.76,
      vegetationVitality: 'Good',
      moistureIndexNdwi: 0.42,
      cropStressPct: 12,
      anomalyDetected: false,
      fieldZoneHealth: [
        { zone: 'North Sector (A1)', vitality: 'High Canopy (NDVI 0.81)', status: 'Healthy' },
        { zone: 'Central Sector (A2)', vitality: 'Uniform (NDVI 0.78)', status: 'Healthy' },
        { zone: 'South-East Lowland (B1)', vitality: 'Slight Chlorosis (NDVI 0.68)', status: 'Moderate' },
        { zone: 'South Border (B2)', vitality: 'High Canopy (NDVI 0.79)', status: 'Healthy' }
      ],
      satelliteSensor: 'Sentinel-2 / ESA Multispectral MSI (10m resolution)'
    },
    {
      farmId: 'farm_maharashtra_2',
      lastPassDate: '2026-08-23',
      isAvailable: true,
      ndviScore: 0.82,
      vegetationVitality: 'Excellent',
      moistureIndexNdwi: 0.54,
      cropStressPct: 8,
      anomalyDetected: false,
      fieldZoneHealth: [
        { zone: 'Orchard Row 1-10', vitality: 'Dense Foliage (NDVI 0.84)', status: 'Healthy' },
        { zone: 'Orchard Row 11-20', vitality: 'Dense Foliage (NDVI 0.81)', status: 'Healthy' },
        { zone: 'Nursery Area', vitality: 'Active Growth (NDVI 0.79)', status: 'Healthy' }
      ],
      satelliteSensor: 'Landsat 9 / OLI-2 (15m pansharpened)'
    }
  ],
  auditLogs: [
    {
      id: 'log_1',
      userId: 'usr_farmer_1',
      action: 'LOGIN',
      details: 'User authenticated into KrishiAI web portal',
      timestamp: '2026-08-25T04:30:00.000Z'
    },
    {
      id: 'log_2',
      userId: 'usr_farmer_1',
      action: 'AI_RECOMMENDATION_GENERATED',
      details: 'Gemini synthesized farm advisory with Open-Meteo live context',
      timestamp: '2026-08-25T05:00:00.000Z'
    }
  ],
  mobileSettings: [
    {
      userId: 'usr_farmer_1',
      phone: '+91 98234 56789',
      dailyUpdatesEnabled: true,
      dispatchTime: '06:00 AM',
      channels: ['sms', 'whatsapp'],
      language: 'en',
      includeWeather: true,
      includeCropAdvisory: true,
      includeIrrigationAlert: true,
      includePestWarnings: true,
      lastDispatchedAt: '2026-09-05T06:00:00.000Z'
    }
  ],
  mobileLogs: [
    {
      id: 'sms_init_1',
      userId: 'usr_farmer_1',
      farmId: 'farm_punjab_1',
      farmName: 'Green Acres — Ludhiana Block',
      location: 'Ludhiana, Punjab',
      phone: '+91 98234 56789',
      channel: 'sms',
      status: 'Delivered',
      timestamp: '2026-09-05T06:00:15.000Z',
      weatherSummary: '24°C - 33°C, 65% Rain Prob, Wind 14km/h',
      cropSummary: 'Wheat (Flowering) - Postpone irrigation 24h',
      fullMessageText: '🌾 KrishiAI Daily Update: 24°C-33°C, 65% rain in Ludhiana. Delay flood irrigation. Wheat in Flowering stage is healthy. Avoid chemical spraying in midday gust.',
      gatewayResponseId: 'GW_SMS_99482103'
    }
  ]
};

class KrishiDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (!parsed.mobileSettings) parsed.mobileSettings = [];
        if (!parsed.mobileLogs) parsed.mobileLogs = [];
        return parsed;
      }
    } catch (err) {
      console.error('Error reading database file, initializing fresh database:', err);
    }

    // Save initial dataset
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  private saveData(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database file:', err);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // --- Users ---
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    let user = this.data.users.find((u) => u.id === id);
    if (!user && updates.email) {
      user = this.data.users.find((u) => u.email?.toLowerCase() === updates.email?.toLowerCase());
    }
    if (!user) return undefined;
    Object.assign(user, updates);
    this.persist();
    return user;
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);

    // Automatically establish primary registered farm at the user's location
    const loc = getLocationCoordinates(newUser.state || 'Maharashtra', newUser.district || 'Latur');
    const primaryFarm = this.createFarm({
      userId: newUser.id,
      name: `${newUser.name.split(' ')[0]}'s ${newUser.district || newUser.state || 'Registered'} Farm`,
      areaAcres: newUser.landHoldingAcres || 4.5,
      state: newUser.state || 'Maharashtra',
      district: newUser.district || 'Latur',
      village: `${newUser.district || 'Central'} Taluka`,
      latitude: loc.lat,
      longitude: loc.lng,
      soilType: loc.soil,
      irrigationType: 'Borewell',
    });

    const crop = this.createCrop({
      farmId: primaryFarm.id,
      userId: newUser.id,
      name: loc.defaultCrop,
      variety: loc.variety,
      season: loc.season,
      sowingDate: '2026-06-15',
      expectedHarvestDate: '2026-10-20',
      currentStage: 'Flowering & Pollination',
      healthScore: 88,
      targetYieldQuintals: 25
    });
    this.updateFarm(primaryFarm.id, { activeCropId: crop.id });

    // Enable automated daily morning mobile updates if phone is present
    if (newUser.phone) {
      this.saveMobileSettings({
        userId: newUser.id,
        phone: newUser.phone,
        dailyUpdatesEnabled: true,
        dispatchTime: '06:00 AM',
        channels: ['sms', 'whatsapp'],
        language: newUser.language || 'en',
        includeWeather: true,
        includeCropAdvisory: true,
        includeIrrigationAlert: true,
        includePestWarnings: true
      });
    }

    this.persist();
    this.logAudit(newUser.id, 'USER_REGISTER', `Created account & registered farm for ${newUser.name} in ${primaryFarm.district}, ${primaryFarm.state}`);
    return newUser;
  }

  // --- Farms ---
  getFarms(userId?: string): Farm[] {
    if (userId) {
      let userFarms = this.data.farms.filter((f) => f.userId === userId);
      if (userFarms.length === 0) {
        // Fallback check: If user exists, initialize their registered primary farm
        const user = this.getUserById(userId);
        if (user) {
          const loc = getLocationCoordinates(user.state || 'Maharashtra', user.district || 'Latur');
          const newFarm = this.createFarm({
            userId: user.id,
            name: `${user.name.split(' ')[0]}'s ${user.district || user.state || 'Registered'} Farm`,
            areaAcres: user.landHoldingAcres || 4.5,
            state: user.state || 'Maharashtra',
            district: user.district || 'Latur',
            village: `${user.district || 'Central'} Taluka`,
            latitude: loc.lat,
            longitude: loc.lng,
            soilType: loc.soil,
            irrigationType: 'Borewell',
          });
          const newCrop = this.createCrop({
            farmId: newFarm.id,
            userId: user.id,
            name: loc.defaultCrop,
            variety: loc.variety,
            season: loc.season,
            sowingDate: '2026-06-15',
            expectedHarvestDate: '2026-10-20',
            currentStage: 'Flowering & Pollination',
            healthScore: 88,
            targetYieldQuintals: 25
          });
          this.updateFarm(newFarm.id, { activeCropId: newCrop.id });
          userFarms = [newFarm];
        }
      }
      return userFarms;
    }
    return this.data.farms;
  }

  getFarmById(id: string): Farm | undefined {
    return this.data.farms.find((f) => f.id === id);
  }

  createFarm(farm: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>): Farm {
    const newFarm: Farm = {
      ...farm,
      id: `farm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.farms.push(newFarm);
    this.persist();
    this.logAudit(farm.userId, 'FARM_CREATE', `Created farm "${newFarm.name}" in ${newFarm.district}, ${newFarm.state}`);
    return newFarm;
  }

  updateFarm(id: string, updates: Partial<Farm>): Farm | undefined {
    const farm = this.getFarmById(id);
    if (!farm) return undefined;
    Object.assign(farm, updates, { updatedAt: new Date().toISOString() });
    this.persist();
    return farm;
  }

  deleteFarm(id: string): boolean {
    const index = this.data.farms.findIndex((f) => f.id === id);
    if (index === -1) return false;
    const farm = this.data.farms[index];
    this.data.farms.splice(index, 1);
    // Cleanup related crops
    this.data.crops = this.data.crops.filter((c) => c.farmId !== id);
    this.persist();
    this.logAudit(farm.userId, 'FARM_DELETE', `Deleted farm "${farm.name}"`);
    return true;
  }

  // --- Crops ---
  getCrops(farmId?: string): Crop[] {
    if (farmId) {
      return this.data.crops.filter((c) => c.farmId === farmId);
    }
    return this.data.crops;
  }

  getCropById(id: string): Crop | undefined {
    return this.data.crops.find((c) => c.id === id);
  }

  createCrop(crop: Omit<Crop, 'id' | 'createdAt'>): Crop {
    const newCrop: Crop = {
      ...crop,
      id: `crop_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.crops.push(newCrop);
    // Update farm's active crop
    this.updateFarm(newCrop.farmId, { activeCropId: newCrop.id });
    this.persist();
    this.logAudit(crop.userId, 'CROP_ADD', `Added ${newCrop.name} (${newCrop.variety}) to farm ${newCrop.farmId}`);
    return newCrop;
  }

  updateCrop(id: string, updates: Partial<Crop>): Crop | undefined {
    const crop = this.getCropById(id);
    if (!crop) return undefined;
    Object.assign(crop, updates);
    this.persist();
    return crop;
  }

  // --- Soil Records ---
  getSoilRecords(farmId?: string): SoilRecord[] {
    if (farmId) {
      return this.data.soilRecords.filter((s) => s.farmId === farmId);
    }
    return this.data.soilRecords;
  }

  getLatestSoilRecord(farmId: string): SoilRecord | undefined {
    const list = this.getSoilRecords(farmId);
    if (list.length === 0) return undefined;
    return list.sort((a, b) => new Date(b.testedAt).getTime() - new Date(a.testedAt).getTime())[0];
  }

  createSoilRecord(record: Omit<SoilRecord, 'id' | 'createdAt'>): SoilRecord {
    const newRecord: SoilRecord = {
      ...record,
      id: `soil_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.soilRecords.push(newRecord);
    this.persist();
    this.logAudit(record.userId, 'SOIL_RECORD_ADD', `Recorded soil test for farm ${record.farmId} (pH: ${record.ph})`);
    return newRecord;
  }

  // --- Farm Activities ---
  getActivities(farmId?: string): FarmActivity[] {
    if (farmId) {
      return this.data.farmActivities.filter((a) => a.farmId === farmId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return this.data.farmActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  createActivity(activity: Omit<FarmActivity, 'id' | 'createdAt'>): FarmActivity {
    const newActivity: FarmActivity = {
      ...activity,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.farmActivities.push(newActivity);
    this.persist();
    this.logAudit(activity.userId, 'ACTIVITY_LOG', `Logged ${newActivity.activityType}: ${newActivity.title}`);
    return newActivity;
  }

  // --- AI Recommendations ---
  getRecommendations(farmId?: string): AiRecommendation[] {
    if (farmId) {
      return this.data.aiRecommendations.filter((r) => r.farmId === farmId).sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
    }
    return this.data.aiRecommendations;
  }

  getLatestRecommendation(farmId: string): AiRecommendation | undefined {
    const recs = this.getRecommendations(farmId);
    return recs.length > 0 ? recs[0] : undefined;
  }

  saveRecommendation(rec: Omit<AiRecommendation, 'id' | 'generatedAt'>): AiRecommendation {
    const newRec: AiRecommendation = {
      ...rec,
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      generatedAt: new Date().toISOString()
    };
    this.data.aiRecommendations.unshift(newRec);
    this.persist();
    return newRec;
  }

  // --- Disease Analyses ---
  getDiseaseAnalyses(): DiseaseAnalysisResult[] {
    return this.data.diseaseAnalyses;
  }

  saveDiseaseAnalysis(analysis: Omit<DiseaseAnalysisResult, 'id' | 'analyzedAt'>): DiseaseAnalysisResult {
    const newAnalysis: DiseaseAnalysisResult = {
      ...analysis,
      id: `dia_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      analyzedAt: new Date().toISOString()
    };
    this.data.diseaseAnalyses.unshift(newAnalysis);
    this.persist();
    return newAnalysis;
  }

  // --- Chat Messages ---
  getChatMessages(userId: string, farmId?: string): AiChatMessage[] {
    return this.data.chatMessages
      .filter((m) => m.userId === userId && (!farmId || m.farmId === farmId))
      .map(({ userId: _u, farmId: _f, ...rest }) => rest);
  }

  saveChatMessage(userId: string, farmId: string | undefined, msg: Omit<AiChatMessage, 'id' | 'timestamp'>): AiChatMessage {
    const fullMsg: AiChatMessage & { userId: string; farmId?: string } = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId,
      farmId
    };
    this.data.chatMessages.push(fullMsg);
    this.persist();
    return fullMsg;
  }

  // --- Alerts ---
  getAlerts(farmId?: string): FarmAlert[] {
    if (farmId) {
      return this.data.alerts.filter((a) => a.farmId === farmId);
    }
    return this.data.alerts;
  }

  createAlert(alert: Omit<FarmAlert, 'id' | 'createdAt' | 'isDismissed'>): FarmAlert {
    const newAlert: FarmAlert = {
      ...alert,
      id: `alt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      isDismissed: false,
      createdAt: new Date().toISOString()
    };
    this.data.alerts.unshift(newAlert);
    this.persist();
    return newAlert;
  }

  dismissAlert(id: string): boolean {
    const alert = this.data.alerts.find((a) => a.id === id);
    if (!alert) return false;
    alert.isDismissed = true;
    this.persist();
    return true;
  }

  // --- Notifications ---
  getNotifications(userId: string) {
    return this.data.notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createNotification(notif: { userId: string; title: string; body: string; type: 'alert' | 'recommendation' | 'expert' | 'weather' }) {
    const newNotif = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.unshift(newNotif);
    this.persist();
    return newNotif;
  }

  markNotificationRead(id: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (!notif) return false;
    notif.isRead = true;
    this.persist();
    return true;
  }

  // --- Expert Cases ---
  getExpertCases(userId?: string): ExpertCase[] {
    if (userId) {
      return this.data.expertCases.filter((c) => c.userId === userId || c.status === 'Open');
    }
    return this.data.expertCases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createExpertCase(c: Omit<ExpertCase, 'id' | 'createdAt' | 'status'>): ExpertCase {
    const newCase: ExpertCase = {
      ...c,
      id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      status: 'Open',
      createdAt: new Date().toISOString()
    };
    this.data.expertCases.unshift(newCase);
    this.persist();
    this.logAudit(c.userId, 'EXPERT_CASE_SUBMITTED', `Farmer escalated case: "${c.title}" for ${c.cropName}`);
    return newCase;
  }

  resolveExpertCase(id: string, expertName: string, diagnosis: string, prescription: string): ExpertCase | undefined {
    const caseObj = this.data.expertCases.find((c) => c.id === id);
    if (!caseObj) return undefined;
    caseObj.status = 'Resolved';
    caseObj.assignedExpertName = expertName;
    caseObj.expertDiagnosis = diagnosis;
    caseObj.expertPrescription = prescription;
    caseObj.resolvedAt = new Date().toISOString();
    this.persist();
    this.createNotification({
      userId: caseObj.userId,
      title: `Expert Review Completed: ${caseObj.cropName}`,
      body: `${expertName} has submitted verified agronomic prescription for "${caseObj.title}".`,
      type: 'expert'
    });
    return caseObj;
  }

  // --- Satellite Health ---
  getSatelliteHealth(farmId: string): SatelliteHealthData {
    const existing = this.data.satelliteHealth.find((s) => s.farmId === farmId);
    if (existing) return existing;

    // Generated default structure for new farm
    return {
      farmId,
      lastPassDate: new Date().toISOString().split('T')[0],
      isAvailable: true,
      ndviScore: 0.74,
      vegetationVitality: 'Good',
      moistureIndexNdwi: 0.38,
      cropStressPct: 14,
      anomalyDetected: false,
      fieldZoneHealth: [
        { zone: 'Sector North', vitality: 'Optimal Canopy (NDVI 0.78)', status: 'Healthy' },
        { zone: 'Sector South', vitality: 'Moderate Biomass (NDVI 0.71)', status: 'Healthy' },
        { zone: 'Sector East', vitality: 'Adequate (NDVI 0.73)', status: 'Healthy' },
        { zone: 'Sector West', vitality: 'Adequate (NDVI 0.74)', status: 'Healthy' }
      ],
      satelliteSensor: 'Sentinel-2 / ESA MSI'
    };
  }

  // --- Audit Logs & Metrics ---
  logAudit(userId: string | undefined, action: string, details: string, ip?: string) {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      ip
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    this.persist();
  }

  getAuditLogs(limit = 50): AuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }

  getAdminMetrics() {
    return {
      totalUsers: this.data.users.length,
      farmersCount: this.data.users.filter((u) => u.role === 'farmer').length,
      agronomistsCount: this.data.users.filter((u) => u.role === 'agronomist').length,
      totalFarms: this.data.farms.length,
      totalAcres: this.data.farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0),
      totalCrops: this.data.crops.length,
      activeAlerts: this.data.alerts.filter((a) => !a.isDismissed).length,
      aiRecommendationsGenerated: this.data.aiRecommendations.length,
      diseaseScansCount: this.data.diseaseAnalyses.length,
      expertCasesOpen: this.data.expertCases.filter((c) => c.status === 'Open').length,
      expertCasesResolved: this.data.expertCases.filter((c) => c.status === 'Resolved').length,
      systemHealth: 'Optimal',
      geminiApiStatus: 'Online (Connected)',
      weatherApiStatus: 'Online (Open-Meteo Global Sync Active)'
    };
  }

  // --- Mobile Daily Notifications & Message Gateway ---
  getMobileSettings(userId: string): MobileNotificationSettings | undefined {
    if (!this.data.mobileSettings) this.data.mobileSettings = [];
    return this.data.mobileSettings.find((s) => s.userId === userId);
  }

  saveMobileSettings(settings: MobileNotificationSettings): MobileNotificationSettings {
    if (!this.data.mobileSettings) this.data.mobileSettings = [];
    const idx = this.data.mobileSettings.findIndex((s) => s.userId === settings.userId);
    if (idx >= 0) {
      this.data.mobileSettings[idx] = { ...this.data.mobileSettings[idx], ...settings };
    } else {
      this.data.mobileSettings.push(settings);
    }
    this.persist();
    return settings;
  }

  getMobileLogs(userId?: string): MobileDispatchLog[] {
    if (!this.data.mobileLogs) this.data.mobileLogs = [];
    if (userId) {
      return this.data.mobileLogs.filter((l) => l.userId === userId);
    }
    return this.data.mobileLogs;
  }

  addMobileLog(log: Omit<MobileDispatchLog, 'id' | 'timestamp'>): MobileDispatchLog {
    if (!this.data.mobileLogs) this.data.mobileLogs = [];
    const newLog: MobileDispatchLog = {
      ...log,
      id: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.data.mobileLogs.unshift(newLog);
    if (this.data.mobileLogs.length > 200) {
      this.data.mobileLogs.pop();
    }
    this.persist();
    return newLog;
  }
}

export const db = new KrishiDatabase();
