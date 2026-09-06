import {
  AiChatMessage,
  AiRecommendation,
  Crop,
  DiseaseAnalysisResult,
  ExpertCase,
  Farm,
  FarmActivity,
  FarmAlert,
  NotificationItem,
  SatelliteHealthData,
  SoilRecord,
  User,
  WeatherData,
  MobileNotificationSettings,
  MobileDispatchLog
} from '../types';

let currentUserId = 'usr_farmer_1';

export function setCurrentUserId(id: string) {
  currentUserId = id;
}

export function getCurrentUserId(): string {
  return currentUserId;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-user-id': currentUserId
});

export const api = {
  // Auth
  async getMe(): Promise<{ user: User }> {
    const res = await fetch('/api/auth/me', { headers: getHeaders() });
    return res.json();
  },

  async getUsers(): Promise<{ users: User[] }> {
    const res = await fetch('/api/auth/users', { headers: getHeaders() });
    return res.json();
  },

  async login(email?: string, role?: string): Promise<{ user: User; message: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, role })
    });
    const data = await res.json();
    if (data.user) {
      currentUserId = data.user.id;
    }
    return data;
  },

  async register(userData: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
    language?: string;
    state?: string;
    district?: string;
  }): Promise<{ user: User; message: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (data.user) {
      currentUserId = data.user.id;
    }
    return data;
  },

  async updateUserProfile(userData: Partial<User>): Promise<{ user: User; message: string }> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  // Farms
  async getFarms(): Promise<{ farms: Farm[] }> {
    const res = await fetch('/api/farms', { headers: getHeaders() });
    return res.json();
  },

  async getFarm(id: string): Promise<{
    farm: Farm;
    crops: Crop[];
    latestSoil: SoilRecord | null;
    recentActivities: FarmActivity[];
    latestRecommendation: AiRecommendation | null;
    alerts: FarmAlert[];
    satellite: SatelliteHealthData;
  }> {
    const res = await fetch(`/api/farms/${id}`, { headers: getHeaders() });
    return res.json();
  },

  async createFarm(data: {
    name: string;
    areaAcres: number;
    state: string;
    district: string;
    village: string;
    latitude: number;
    longitude: number;
    soilType: string;
    irrigationType: string;
    initialCrop?: {
      name: string;
      variety: string;
      season: string;
      sowingDate: string;
      expectedHarvestDate: string;
      currentStage: string;
      targetYieldQuintals?: number;
    };
  }): Promise<{ farm: Farm; crop?: Crop }> {
    const res = await fetch('/api/farms', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateFarm(id: string, updates: Partial<Farm>): Promise<{ farm: Farm }> {
    const res = await fetch(`/api/farms/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteFarm(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/farms/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Crops
  async getCrops(farmId: string): Promise<{ crops: Crop[] }> {
    const res = await fetch(`/api/farms/${farmId}/crops`, { headers: getHeaders() });
    return res.json();
  },

  async addCrop(farmId: string, data: Partial<Crop>): Promise<{ crop: Crop }> {
    const res = await fetch(`/api/farms/${farmId}/crops`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async createCrop(data: { farmId: string } & Partial<Crop>): Promise<{ crop: Crop }> {
    return this.addCrop(data.farmId, data);
  },

  async updateCrop(id: string, updates: Partial<Crop>): Promise<{ crop: Crop }> {
    const res = await fetch(`/api/crops/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // Activities
  async getActivities(farmId?: string): Promise<{ activities: FarmActivity[] }> {
    const url = farmId ? `/api/farm-activities?farmId=${farmId}` : '/api/farm-activities';
    const res = await fetch(url, { headers: getHeaders() });
    return res.json();
  },

  async recordActivity(activity: Partial<FarmActivity>): Promise<{ activity: FarmActivity }> {
    const res = await fetch('/api/farm-activities', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(activity)
    });
    return res.json();
  },

  // Weather
  async getWeather(farmId: string): Promise<{ weather: WeatherData }> {
    const res = await fetch(`/api/weather/${farmId}`, { headers: getHeaders() });
    return res.json();
  },

  // Soil
  async getSoil(farmId: string): Promise<{ records: SoilRecord[]; latest: SoilRecord | null }> {
    const res = await fetch(`/api/soil/${farmId}`, { headers: getHeaders() });
    return res.json();
  },

  async recordSoil(farmId: string, data: Partial<SoilRecord>): Promise<{ record: SoilRecord }> {
    const res = await fetch(`/api/soil/${farmId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // AI Farming Advice
  async generateFarmingAdvice(farmId: string, language: string): Promise<{ recommendation: AiRecommendation }> {
    const res = await fetch('/api/ai/farming-advice', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ farmId, language })
    });
    return res.json();
  },

  async getRecommendations(farmId: string): Promise<{ recommendations: AiRecommendation[] }> {
    const res = await fetch(`/api/recommendations/${farmId}`, { headers: getHeaders() });
    return res.json();
  },

  // AI Crop Disease Multimodal
  async analyzeCropDisease(params: {
    imageBase64: string;
    mimeType: string;
    cropNameHint?: string;
    symptomsHint?: string;
    language?: string;
  }): Promise<{ analysis: DiseaseAnalysisResult }> {
    const res = await fetch('/api/ai/crop-analysis', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    return res.json();
  },

  // AI Chat
  async sendChatMessage(params: {
    message: string;
    farmId?: string;
    conversationHistory?: Array<{ sender: 'user' | 'assistant'; text: string }>;
    language?: string;
  }): Promise<{ message: AiChatMessage }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    return res.json();
  },

  async getChatHistory(farmId?: string): Promise<{ history: AiChatMessage[] }> {
    const url = farmId ? `/api/ai/chat/history?farmId=${farmId}` : '/api/ai/chat/history';
    const res = await fetch(url, { headers: getHeaders() });
    return res.json();
  },

  // Alerts
  async getAlerts(farmId?: string): Promise<{ alerts: FarmAlert[] }> {
    const url = farmId ? `/api/alerts?farmId=${farmId}` : '/api/alerts';
    const res = await fetch(url, { headers: getHeaders() });
    return res.json();
  },

  async dismissAlert(alertId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/alerts/${alertId}/dismiss`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    const res = await fetch('/api/notifications', { headers: getHeaders() });
    return res.json();
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/notifications/${id}/read`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  // Expert Cases
  async getExpertCases(): Promise<{ cases: ExpertCase[] }> {
    const res = await fetch('/api/expert-cases', { headers: getHeaders() });
    return res.json();
  },

  async submitExpertCase(data: Partial<ExpertCase>): Promise<{ case: ExpertCase; message: string }> {
    const res = await fetch('/api/expert-cases', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async resolveExpertCase(
    caseId: string,
    data: { expertName: string; diagnosis: string; prescription: string }
  ): Promise<{ case: ExpertCase; message: string }> {
    const res = await fetch(`/api/expert-cases/${caseId}/resolve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Knowledge Base & Geocoding & Admin
  async getKnowledge(): Promise<{ knowledge: any }> {
    const res = await fetch('/api/knowledge');
    return res.json();
  },

  async searchLocation(query: string): Promise<{ results: any[] }> {
    const res = await fetch(`/api/geocoding/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  async getAdminMetrics(): Promise<{ metrics: any; auditLogs: any[] }> {
    const res = await fetch('/api/admin/metrics', { headers: getHeaders() });
    return res.json();
  },

  // Daily Mobile Messages & Weather Gateway
  async getMobileSettings(): Promise<{ settings: MobileNotificationSettings }> {
    const res = await fetch('/api/notifications/mobile-settings', { headers: getHeaders() });
    return res.json();
  },

  async updateMobileSettings(
    settings: Partial<MobileNotificationSettings>
  ): Promise<{ settings: MobileNotificationSettings; message: string }> {
    const res = await fetch('/api/notifications/mobile-settings', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  async getMobileLogs(): Promise<{ logs: MobileDispatchLog[] }> {
    const res = await fetch('/api/notifications/mobile-logs', { headers: getHeaders() });
    return res.json();
  },

  async sendMobileUpdate(data: {
    farmId?: string;
    channel?: 'sms' | 'whatsapp';
    targetPhone?: string;
    customNote?: string;
  }): Promise<{
    success: boolean;
    log: MobileDispatchLog;
    previewText: string;
    channel: string;
    phone: string;
    whatsappUrl: string;
    smsUrl: string;
    message: string;
  }> {
    const res = await fetch('/api/notifications/send-mobile-update', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

