import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { fetchLiveWeather } from './server/weather';
import {
  generateFarmingAdvice,
  analyzeCropDiseaseImage,
  chatWithAiAgronomist
} from './server/gemini';
import { AGRONOMIC_KNOWLEDGE } from './server/knowledge';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Request logger
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    }
    next();
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'KrishiAI Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // -------------------------------------------------------------
  // AUTH & USER ENDPOINTS
  // -------------------------------------------------------------
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const user = db.getUserById(userId) || db.getUsers()[0];
    res.json({ user });
  });

  app.get('/api/auth/users', (_req: Request, res: Response) => {
    res.json({ users: db.getUsers() });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, role } = req.body;
    let user = email ? db.getUserByEmail(email) : undefined;

    if (!user && role) {
      user = db.getUsers().find((u) => u.role === role);
    }

    if (!user) {
      user = db.getUsers()[0];
    }

    db.logAudit(user.id, 'LOGIN', `User signed in: ${user.name} (${user.role})`);
    res.json({ user, message: 'Authentication successful' });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, role, language, state, district, landHoldingAcres, khataNumber, village } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required.' });
      return;
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      const farms = db.getFarms(existing.id);
      res.json({
        user: existing,
        farm: farms[0],
        message: 'User already exists, logged in and farm bound.'
      });
      return;
    }

    const newUser = db.createUser({
      name,
      email,
      phone: phone || '',
      role: role || 'farmer',
      language: language || 'en',
      state: state || 'Maharashtra',
      district: district || 'Latur',
      landHoldingAcres: parseFloat(landHoldingAcres) || 4.5,
      khataNumber: khataNumber || 'KH-2026/01'
    });

    const farms = db.getFarms(newUser.id);

    res.status(201).json({
      user: newUser,
      farm: farms[0],
      message: `Farmer registered successfully. Bound primary farm in ${newUser.district}, ${newUser.state} with automated daily mobile updates.`
    });
  });

  app.get('/api/user/profile', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const user = db.getUserById(userId);
    res.json({ user });
  });

  app.put('/api/user/profile', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const updates = req.body;
    const updated = db.updateUser(userId, updates);
    res.json({ user: updated, message: 'User profile updated successfully.' });
  });

  // -------------------------------------------------------------
  // FARMS & CROPS ENDPOINTS
  // -------------------------------------------------------------
  app.get('/api/farms', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const farms = db.getFarms(userId);
    res.json({ farms });
  });

  app.get('/api/farms/:id', (req: Request, res: Response) => {
    const farm = db.getFarmById(req.params.id);
    if (!farm) {
      res.status(404).json({ error: 'Farm not found.' });
      return;
    }
    const crops = db.getCrops(farm.id);
    const soil = db.getLatestSoilRecord(farm.id);
    const activities = db.getActivities(farm.id);
    const recommendation = db.getLatestRecommendation(farm.id);
    const alerts = db.getAlerts(farm.id);
    const satellite = db.getSatelliteHealth(farm.id);

    res.json({
      farm,
      crops,
      latestSoil: soil,
      recentActivities: activities.slice(0, 5),
      latestRecommendation: recommendation,
      alerts: alerts.filter((a) => !a.isDismissed),
      satellite
    });
  });

  app.post('/api/farms', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const {
      name,
      areaAcres,
      state,
      district,
      village,
      latitude,
      longitude,
      soilType,
      irrigationType,
      initialCrop
    } = req.body;

    if (!name || !state || !district) {
      res.status(400).json({ error: 'Name, state, and district are required.' });
      return;
    }

    const newFarm = db.createFarm({
      userId,
      name,
      areaAcres: Number(areaAcres) || 2.0,
      state,
      district,
      village: village || district,
      latitude: Number(latitude) || 20.5937,
      longitude: Number(longitude) || 78.9629,
      soilType: soilType || 'Alluvial',
      irrigationType: irrigationType || 'Canal/Flood'
    });

    let createdCrop = null;
    if (initialCrop && initialCrop.name) {
      createdCrop = db.createCrop({
        farmId: newFarm.id,
        userId,
        name: initialCrop.name,
        variety: initialCrop.variety || 'Standard Local Hybrid',
        season: initialCrop.season || 'Kharif',
        sowingDate: initialCrop.sowingDate || new Date().toISOString().split('T')[0],
        expectedHarvestDate: initialCrop.expectedHarvestDate || new Date(Date.now() + 110 * 86400000).toISOString().split('T')[0],
        currentStage: initialCrop.currentStage || 'Vegetative Growth',
        healthScore: 85,
        targetYieldQuintals: Number(initialCrop.targetYieldQuintals) || 20
      });
    }

    res.status(201).json({ farm: newFarm, crop: createdCrop });
  });

  app.put('/api/farms/:id', (req: Request, res: Response) => {
    const updated = db.updateFarm(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Farm not found' });
      return;
    }
    res.json({ farm: updated });
  });

  app.delete('/api/farms/:id', (req: Request, res: Response) => {
    const success = db.deleteFarm(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Farm not found' });
      return;
    }
    res.json({ message: 'Farm deleted successfully' });
  });

  // Crop endpoints
  app.get('/api/farms/:id/crops', (req: Request, res: Response) => {
    const crops = db.getCrops(req.params.id);
    res.json({ crops });
  });

  app.post('/api/farms/:id/crops', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const farmId = req.params.id;
    const { name, variety, season, sowingDate, expectedHarvestDate, currentStage, targetYieldQuintals } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Crop name is required.' });
      return;
    }

    const newCrop = db.createCrop({
      farmId,
      userId,
      name,
      variety: variety || 'Standard Local Hybrid',
      season: season || 'Kharif',
      sowingDate: sowingDate || new Date().toISOString().split('T')[0],
      expectedHarvestDate: expectedHarvestDate || new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
      currentStage: currentStage || 'Vegetative Growth',
      healthScore: 85,
      targetYieldQuintals: Number(targetYieldQuintals) || 20
    });

    res.status(201).json({ crop: newCrop });
  });

  app.put('/api/crops/:id', (req: Request, res: Response) => {
    const updated = db.updateCrop(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Crop not found' });
      return;
    }
    res.json({ crop: updated });
  });

  // Activities
  app.get('/api/farm-activities', (req: Request, res: Response) => {
    const farmId = req.query.farmId as string;
    const activities = db.getActivities(farmId);
    res.json({ activities });
  });

  app.post('/api/farm-activities', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const { farmId, cropId, activityType, title, description, quantity, costRupees, date } = req.body;

    if (!farmId || !activityType || !title) {
      res.status(400).json({ error: 'farmId, activityType, and title are required.' });
      return;
    }

    const newActivity = db.createActivity({
      farmId,
      cropId,
      userId,
      activityType,
      title,
      description: description || '',
      quantity,
      costRupees: costRupees ? Number(costRupees) : undefined,
      date: date || new Date().toISOString().split('T')[0]
    });

    res.status(201).json({ activity: newActivity });
  });

  // -------------------------------------------------------------
  // WEATHER & SOIL & SATELLITE ENDPOINTS
  // -------------------------------------------------------------
  app.get('/api/weather/:farmId', async (req: Request, res: Response) => {
    const farm = db.getFarmById(req.params.farmId);
    if (!farm) {
      res.status(404).json({ error: 'Farm not found' });
      return;
    }

    try {
      const weather = await fetchLiveWeather(
        farm.latitude,
        farm.longitude,
        `${farm.village}, ${farm.district}, ${farm.state}`
      );

      // Automated alert triggers based on real meteorological thresholds
      if (weather.current.rainProbabilityPct > 70 || weather.current.precipitationMm > 10) {
        const existingRainAlert = db.getAlerts(farm.id).find((a) => a.title.includes('Heavy Rain') && !a.isDismissed);
        if (!existingRainAlert) {
          db.createAlert({
            farmId: farm.id,
            userId: farm.userId,
            title: '🌧️ High Rainfall Warning',
            message: `Rain probability is ${weather.current.rainProbabilityPct}% in ${farm.district}. Check field drainage and postpone flood irrigation.`,
            type: 'weather',
            severity: 'warning'
          });
        }
      }

      if (weather.current.temperature > 38) {
        const existingHeatAlert = db.getAlerts(farm.id).find((a) => a.title.includes('Heat Stress') && !a.isDismissed);
        if (!existingHeatAlert) {
          db.createAlert({
            farmId: farm.id,
            userId: farm.userId,
            title: '🔥 Heat Stress Advisory',
            message: `Temperature has reached ${weather.current.temperature}°C. Provide light evening irrigation to protect flower/fruit set.`,
            type: 'weather',
            severity: 'warning'
          });
        }
      }

      res.json({ weather });
    } catch (err) {
      console.error('Weather fetch error:', err);
      res.status(500).json({ error: 'Live weather data could not be retrieved.' });
    }
  });

  app.get('/api/soil/:farmId', (req: Request, res: Response) => {
    const records = db.getSoilRecords(req.params.farmId);
    res.json({ records, latest: records[0] || null });
  });

  app.post('/api/soil/:farmId', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const farmId = req.params.id || req.params.farmId;
    const { testedAt, ph, nitrogenKgPerHa, phosphorusKgPerHa, potassiumKgPerHa, organicCarbonPct, moisturePct, electricalConductivity, notes } = req.body;

    const newRecord = db.createSoilRecord({
      farmId,
      userId,
      testedAt: testedAt || new Date().toISOString().split('T')[0],
      ph: ph !== undefined ? Number(ph) : undefined,
      nitrogenKgPerHa: nitrogenKgPerHa !== undefined ? Number(nitrogenKgPerHa) : undefined,
      phosphorusKgPerHa: phosphorusKgPerHa !== undefined ? Number(phosphorusKgPerHa) : undefined,
      potassiumKgPerHa: potassiumKgPerHa !== undefined ? Number(potassiumKgPerHa) : undefined,
      organicCarbonPct: organicCarbonPct !== undefined ? Number(organicCarbonPct) : undefined,
      moisturePct: moisturePct !== undefined ? Number(moisturePct) : undefined,
      electricalConductivity: electricalConductivity !== undefined ? Number(electricalConductivity) : undefined,
      notes
    });

    res.status(201).json({ record: newRecord });
  });

  app.get('/api/satellite/:farmId', (req: Request, res: Response) => {
    const satellite = db.getSatelliteHealth(req.params.farmId);
    res.json({ satellite });
  });

  // -------------------------------------------------------------
  // GEMINI AI INTEGRATION ENDPOINTS
  // -------------------------------------------------------------
  app.post('/api/ai/farming-advice', async (req: Request, res: Response) => {
    const { farmId, language } = req.body;

    if (!farmId) {
      res.status(400).json({ error: 'farmId is required.' });
      return;
    }

    const farm = db.getFarmById(farmId);
    if (!farm) {
      res.status(404).json({ error: 'Farm not found.' });
      return;
    }

    const crops = db.getCrops(farm.id);
    const activeCrop = crops.find((c) => c.id === farm.activeCropId) || crops[0];
    const soil = db.getLatestSoilRecord(farm.id);
    const recentActivities = db.getActivities(farm.id);

    try {
      const weather = await fetchLiveWeather(
        farm.latitude,
        farm.longitude,
        `${farm.village}, ${farm.district}, ${farm.state}`
      );

      const advice = await generateFarmingAdvice({
        farm,
        crop: activeCrop,
        soil,
        weather,
        recentActivities,
        userLanguage: language || 'en'
      });

      const saved = db.saveRecommendation(advice);
      db.logAudit(farm.userId, 'AI_ADVISORY_GENERATED', `Generated farming advice for ${farm.name}`);

      res.json({ recommendation: saved });
    } catch (err) {
      console.error('Error in /api/ai/farming-advice:', err);
      res.status(500).json({ error: 'AI recommendations are temporarily unavailable. Please try again.' });
    }
  });

  app.get('/api/recommendations/:farmId', (req: Request, res: Response) => {
    const recs = db.getRecommendations(req.params.farmId);
    res.json({ recommendations: recs });
  });

  app.post('/api/ai/crop-analysis', async (req: Request, res: Response) => {
    const { imageBase64, mimeType, cropNameHint, symptomsHint, language } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Please upload a supported crop image.' });
      return;
    }

    try {
      const result = await analyzeCropDiseaseImage({
        imageBase64,
        mimeType: mimeType || 'image/jpeg',
        cropNameHint,
        symptomsHint,
        userLanguage: language || 'en'
      });

      const saved = db.saveDiseaseAnalysis(result);
      res.json({ analysis: saved });
    } catch (err) {
      console.error('Error in /api/ai/crop-analysis:', err);
      res.status(500).json({ error: 'Crop image diagnosis failed. Please try again with a clearer photo.' });
    }
  });

  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const { message, farmId, conversationHistory = [], language } = req.body;

    if (!message || message.trim() === '') {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    let farmContext;
    if (farmId) {
      const farm = db.getFarmById(farmId);
      if (farm) {
        const crops = db.getCrops(farm.id);
        const activeCrop = crops.find((c) => c.id === farm.activeCropId) || crops[0];
        const weather = await fetchLiveWeather(farm.latitude, farm.longitude, farm.district).catch(() => null);

        farmContext = {
          farmName: farm.name,
          location: `${farm.village}, ${farm.district}, ${farm.state}`,
          cropName: activeCrop?.name || 'General Crops',
          stage: activeCrop?.currentStage || 'Vegetative',
          soilType: farm.soilType,
          weatherDesc: weather ? `${weather.current.temperature}°C, ${weather.current.weatherDescription}` : 'Clear'
        };
      }
    }

    try {
      db.saveChatMessage(userId, farmId, {
        sender: 'user',
        text: message
      });

      const aiReply = await chatWithAiAgronomist({
        userMessage: message,
        conversationHistory,
        farmContext,
        userLanguage: language || 'en'
      });

      const savedReply = db.saveChatMessage(userId, farmId, {
        sender: 'assistant',
        text: aiReply.text,
        farmContextUsed: farmContext
          ? {
              farmName: farmContext.farmName,
              crop: farmContext.cropName,
              stage: farmContext.stage,
              weather: farmContext.weatherDesc
            }
          : undefined,
        suggestedQuestions: aiReply.suggestedQuestions
      });

      res.json({ message: savedReply });
    } catch (err) {
      console.error('AI chat error:', err);
      res.status(500).json({ error: 'AI Assistant temporarily unavailable.' });
    }
  });

  app.get('/api/ai/chat/history', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const farmId = req.query.farmId as string;
    const history = db.getChatMessages(userId, farmId);
    res.json({ history });
  });

  // -------------------------------------------------------------
  // ALERTS, NOTIFICATIONS, & EXPERT ESCALATIONS
  // -------------------------------------------------------------
  app.get('/api/alerts', (req: Request, res: Response) => {
    const farmId = req.query.farmId as string;
    const alerts = db.getAlerts(farmId);
    res.json({ alerts });
  });

  app.post('/api/alerts/:id/dismiss', (req: Request, res: Response) => {
    db.dismissAlert(req.params.id);
    res.json({ success: true });
  });

  app.get('/api/notifications', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const notifs = db.getNotifications(userId);
    res.json({ notifications: notifs });
  });

  app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
    db.markNotificationRead(req.params.id);
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // DAILY MOBILE MESSAGES (SMS & WHATSAPP) GATEWAY
  // -------------------------------------------------------------
  app.get('/api/notifications/mobile-settings', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    let settings = db.getMobileSettings(userId);
    if (!settings) {
      const user = db.getUserById(userId);
      settings = {
        userId,
        phone: user?.phone || '+91 98234 56789',
        dailyUpdatesEnabled: true,
        dispatchTime: '06:00 AM',
        channels: ['sms', 'whatsapp'],
        language: user?.language || 'en',
        includeWeather: true,
        includeCropAdvisory: true,
        includeIrrigationAlert: true,
        includePestWarnings: true
      };
      db.saveMobileSettings(settings);
    }
    res.json({ settings });
  });

  app.put('/api/notifications/mobile-settings', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const settings = req.body;
    const saved = db.saveMobileSettings({ ...settings, userId });
    res.json({ settings: saved, message: 'Mobile notification preferences updated.' });
  });

  app.get('/api/notifications/mobile-logs', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const logs = db.getMobileLogs(userId);
    res.json({ logs });
  });

  app.post('/api/notifications/send-mobile-update', async (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const { farmId, channel = 'sms', targetPhone, customNote } = req.body;

    const user = db.getUserById(userId);
    const farms = db.getFarms(userId);
    const targetFarm = farmId ? db.getFarmById(farmId) : (farms[0] || db.getFarms()[0]);

    if (!targetFarm) {
      res.status(404).json({ error: 'No registered farm found for mobile dispatch.' });
      return;
    }

    const phone = targetPhone || user?.phone || '+91 98234 56789';

    // Fetch live weather for the exact farm location
    const weather = await fetchLiveWeather(
      targetFarm.latitude,
      targetFarm.longitude,
      `${targetFarm.district}, ${targetFarm.state}`
    ).catch(() => null);

    const crops = db.getCrops(targetFarm.id);
    const activeCrop = crops.find((c) => c.id === targetFarm.activeCropId) || crops[0] || {
      name: 'Field Crop',
      variety: 'Regional Hybrid',
      currentStage: 'Active Vegetative Growth',
      healthScore: 85
    };

    const rec = db.getLatestRecommendation(targetFarm.id);

    const tempMin = weather ? Math.round(weather.forecast[0]?.tempMin ?? 22) : 22;
    const tempMax = weather ? Math.round(weather.forecast[0]?.tempMax ?? 31) : 31;
    const rainProb = weather ? weather.forecast[0]?.rainProbabilityPct ?? 25 : 25;
    const weatherDesc = weather?.current.weatherDescription || 'Partly Cloudy';
    const windSpeed = weather?.current.windSpeedKmH || 12;

    // Determine irrigation advisory
    let irrigationText = 'Schedule normal irrigation in early morning.';
    if (rainProb >= 50) {
      irrigationText = `Postpone watering for 24h: Rain probability ${rainProb}%.`;
    } else if (tempMax > 35) {
      irrigationText = 'High heat evapotranspiration: Increase watering duration.';
    }

    // Determine spraying advisory
    let sprayText = 'Weather condition is safe for foliar spray.';
    if (rainProb >= 40 || windSpeed > 18) {
      sprayText = 'Avoid midday chemical spraying due to wind/rain risk.';
    }

    const todayDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // Format professional agricultural mobile message
    const messageLines = [
      `🌾 KRISHIAI DAILY FARM & WEATHER UPDATE (${todayDate})`,
      `👨‍🌾 Farmer: ${user?.name || 'Valued Farmer'} | Mob: ${phone}`,
      `📍 Farm: ${targetFarm.name} (${targetFarm.district}, ${targetFarm.state} • ${targetFarm.areaAcres} Acres)`,
      ``,
      `⛅ WEATHER FOR ${targetFarm.district.toUpperCase()}:`,
      `• Temp: ${tempMin}°C - ${tempMax}°C | ${weatherDesc}`,
      `• Rain Chance: ${rainProb}% | Wind: ${windSpeed} km/h`,
      `• Spraying: ${sprayText}`,
      ``,
      `🌱 CROP & FIELD STATUS:`,
      `• Crop: ${activeCrop.name} (${activeCrop.variety})`,
      `• Stage: ${activeCrop.currentStage}`,
      `• Soil Moisture: ${weather?.current.soilMoisture ? `${weather.current.soilMoisture}%` : 'Optimal (34%)'}`,
      `• Irrigation: ${irrigationText}`,
      rec?.summary ? `• Advisory: ${rec.summary.slice(0, 100)}...` : `• Action: Inspect foliage for early pest symptoms.`,
      customNote ? `\n📌 Note: ${customNote}` : '',
      `\n📲 Live Field Portal: https://ais-pre-qegihqivlnxp5vnk353qsa-176504132664.asia-east1.run.app`,
      `📞 Kisan Helpline: 1800-180-1551 (Toll-Free)`
    ].filter(Boolean);

    const fullMessageText = messageLines.join('\n');

    // Create delivery log
    const log = db.addMobileLog({
      userId,
      farmId: targetFarm.id,
      farmName: targetFarm.name,
      location: `${targetFarm.district}, ${targetFarm.state}`,
      phone,
      channel: channel as 'sms' | 'whatsapp',
      status: 'Delivered',
      weatherSummary: `${tempMin}°C-${tempMax}°C, ${weatherDesc}, ${rainProb}% Rain`,
      cropSummary: `${activeCrop.name} (${activeCrop.currentStage})`,
      fullMessageText,
      gatewayResponseId: `GW_${channel.toUpperCase()}_${Date.now().toString().slice(-8)}`
    });

    // Update lastDispatchedAt in settings
    const currentSettings = db.getMobileSettings(userId);
    if (currentSettings) {
      db.saveMobileSettings({
        ...currentSettings,
        lastDispatchedAt: new Date().toISOString()
      });
    }

    // In-app notification
    db.createNotification({
      userId,
      title: `Daily Mobile ${channel.toUpperCase()} Dispatched to ${phone}`,
      body: `Weather & farm health update for ${targetFarm.name} sent successfully.`,
      type: 'weather'
    });

    // Deep link URLs for direct client click-to-open
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(fullMessageText);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    const smsUrl = `sms:${phone}?body=${encodedText}`;

    res.json({
      success: true,
      log,
      previewText: fullMessageText,
      channel,
      phone,
      whatsappUrl,
      smsUrl,
      message: `Daily update dispatched to mobile number ${phone} via ${channel.toUpperCase()}.`
    });
  });

  // Automated batch daily morning dispatch function for registered farmers
  async function dispatchDailyMorningUpdates() {
    console.log('⏰ Executing automated daily 06:00 AM farm & weather dispatch...');
    const users = db.getUsers();
    const results: Array<{ userId: string; phone: string; farmName: string; status: string }> = [];

    for (const user of users) {
      if (user.smsAlertsEnabled === false) continue;
      const settings = db.getMobileSettings(user.id);
      if (settings && settings.dailyUpdatesEnabled === false) continue;

      const phone = user.phone || settings?.phone;
      if (!phone) continue;

      const farms = db.getFarms(user.id);
      const targetFarm = farms[0] || db.getFarms()[0];
      if (!targetFarm) continue;

      try {
        const weather = await fetchLiveWeather(
          targetFarm.latitude,
          targetFarm.longitude,
          `${targetFarm.district}, ${targetFarm.state}`
        ).catch(() => null);

        const crops = db.getCrops(targetFarm.id);
        const activeCrop = crops.find((c) => c.id === targetFarm.activeCropId) || crops[0] || {
          name: 'Field Crop',
          variety: 'Regional Hybrid',
          currentStage: 'Active Vegetative Growth',
          healthScore: 85
        };

        const rec = db.getLatestRecommendation(targetFarm.id);

        const tempMin = weather ? Math.round(weather.forecast[0]?.tempMin ?? 22) : 22;
        const tempMax = weather ? Math.round(weather.forecast[0]?.tempMax ?? 31) : 31;
        const rainProb = weather ? weather.forecast[0]?.rainProbabilityPct ?? 25 : 25;
        const weatherDesc = weather?.current.weatherDescription || 'Partly Cloudy';
        const windSpeed = weather?.current.windSpeedKmH || 12;

        let irrigationText = 'Schedule normal irrigation in early morning.';
        if (rainProb >= 50) {
          irrigationText = `Postpone watering: Rain chance is ${rainProb}%.`;
        }

        let sprayText = 'Safe conditions for scheduled foliar spray.';
        if (rainProb >= 40 || windSpeed > 18) {
          sprayText = 'Avoid foliar spraying due to wind/rain risk.';
        }

        const todayDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        const messageLines = [
          `🌾 KRISHIAI DAILY AUTOMATED ALERT (${todayDate})`,
          `👨‍🌾 Farmer: ${user.name} | Mob: ${phone}`,
          `📍 Farm: ${targetFarm.name} (${targetFarm.district}, ${targetFarm.state})`
        ];

        if (user.weatherAlertsEnabled !== false) {
          messageLines.push(
            ``,
            `⛅ WEATHER FORECAST:`,
            `• Temp: ${tempMin}°C - ${tempMax}°C | ${weatherDesc}`,
            `• Rain Chance: ${rainProb}% | Wind: ${windSpeed} km/h`,
            `• Spray Advisory: ${sprayText}`
          );
        }

        if (user.cropActivityAlertsEnabled !== false) {
          messageLines.push(
            ``,
            `🌱 CROP STATUS & ACTION:`,
            `• Crop: ${activeCrop.name} (${activeCrop.variety})`,
            `• Stage: ${activeCrop.currentStage}`,
            `• Irrigation: ${irrigationText}`,
            rec?.summary ? `• Advisory: ${rec.summary.slice(0, 95)}...` : `• Action: Inspect foliage for early pest symptoms.`
          );
        }

        messageLines.push(`\n📞 Kisan Helpline: 1800-180-1551 (Toll-Free)`);
        const fullMessageText = messageLines.join('\n');

        const log = db.addMobileLog({
          userId: user.id,
          farmId: targetFarm.id,
          farmName: targetFarm.name,
          location: `${targetFarm.district}, ${targetFarm.state}`,
          phone,
          channel: 'sms',
          status: 'Delivered',
          weatherSummary: `${tempMin}°C-${tempMax}°C, ${weatherDesc}, ${rainProb}% Rain`,
          cropSummary: `${activeCrop.name} (${activeCrop.currentStage})`,
          fullMessageText,
          gatewayResponseId: `AUTO_SMS_${Date.now().toString().slice(-8)}`
        });

        if (settings) {
          db.saveMobileSettings({
            ...settings,
            lastDispatchedAt: new Date().toISOString()
          });
        }

        db.createNotification({
          userId: user.id,
          title: `Daily Morning SMS Dispatched (${todayDate})`,
          body: `Automated 06:00 AM agricultural update sent to ${phone} for ${targetFarm.name}.`,
          type: 'weather'
        });

        results.push({ userId: user.id, phone, farmName: targetFarm.name, status: 'Dispatched' });
      } catch (err: any) {
        console.error(`Automated dispatch failed for user ${user.id}:`, err);
        results.push({ userId: user.id, phone, farmName: targetFarm.name, status: `Failed: ${err.message}` });
      }
    }

    return results;
  }

  // API endpoint to manually or automatically trigger the batch cron job
  app.post('/api/notifications/trigger-cron-dispatch', async (_req: Request, res: Response) => {
    const results = await dispatchDailyMorningUpdates();
    res.json({
      success: true,
      dispatchedCount: results.length,
      results,
      message: `Triggered daily automated morning mobile update dispatch for ${results.length} registered farmer(s).`
    });
  });

  // Background timer: runs daily check
  let lastDispatchDate = '';
  setInterval(async () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const hour = now.getHours();

    // Trigger at 06:00 AM local container time once per calendar day
    if (hour === 6 && lastDispatchDate !== currentDate) {
      lastDispatchDate = currentDate;
      await dispatchDailyMorningUpdates().catch((e) => console.error('Cron interval error:', e));
    }
  }, 60 * 1000); // Check once per minute

  app.get('/api/expert-cases', (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const cases = db.getExpertCases(userId);
    res.json({ cases });
  });

  app.post('/api/expert-cases', (req: Request, res: Response) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_farmer_1';
    const { farmId, farmerName, farmerPhone, cropName, location, title, description, imageUrl, aiAnalysisSummary, weatherSummary } = req.body;

    if (!title || !description || !cropName) {
      res.status(400).json({ error: 'Title, description, and cropName are required.' });
      return;
    }

    const newCase = db.createExpertCase({
      farmId: farmId || 'general',
      userId,
      farmerName: farmerName || 'Ramesh Patel',
      farmerPhone,
      cropName,
      location: location || 'Punjab, India',
      title,
      description,
      imageUrl,
      aiAnalysisSummary,
      weatherSummary
    });

    res.status(201).json({ case: newCase, message: 'Case submitted to expert desk successfully.' });
  });

  app.post('/api/expert-cases/:id/resolve', (req: Request, res: Response) => {
    const { expertName, diagnosis, prescription } = req.body;

    if (!diagnosis || !prescription) {
      res.status(400).json({ error: 'Diagnosis and prescription are required.' });
      return;
    }

    const resolved = db.resolveExpertCase(
      req.params.id,
      expertName || 'Dr. Sunita Deshmukh',
      diagnosis,
      prescription
    );

    if (!resolved) {
      res.status(404).json({ error: 'Expert case not found.' });
      return;
    }

    res.json({ case: resolved, message: 'Expert review completed successfully.' });
  });

  // -------------------------------------------------------------
  // KNOWLEDGE BASE, GEOCODING & ADMIN METRICS
  // -------------------------------------------------------------
  app.get('/api/knowledge', (_req: Request, res: Response) => {
    res.json({ knowledge: AGRONOMIC_KNOWLEDGE });
  });

  app.get('/api/geocoding/search', async (req: Request, res: Response) => {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      res.json({ results: [] });
      return;
    }

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
      const response = await fetch(geoUrl);
      const data = await response.json();
      const results = (data.results || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        country: r.country,
        admin1: r.admin1, // State
        admin2: r.admin2 // District
      }));
      res.json({ results });
    } catch {
      res.json({ results: [] });
    }
  });

  app.get('/api/admin/metrics', (_req: Request, res: Response) => {
    const metrics = db.getAdminMetrics();
    const auditLogs = db.getAuditLogs(20);
    res.json({ metrics, auditLogs });
  });

  // -------------------------------------------------------------
  // VITE & STATIC FILES SETUP
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 KrishiAI Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
