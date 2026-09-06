import React, { useState } from 'react';
import { X, Sprout, PlusCircle, Send, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { Crop, DiseaseAnalysisResult, Farm } from '../types';
import { STATE_SEED_RECOMMENDATION_DATABASE } from '../lib/seedsDatabase';

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
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
    };
  }) => Promise<void>;
}

export const AddFarmModal: React.FC<AddFarmModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [areaAcres, setAreaAcres] = useState('3.5');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Ahmednagar / Ahilyanagar');
  const [village, setVillage] = useState('Pathardi');
  const [soilType, setSoilType] = useState('Black');
  const [irrigationType, setIrrigationType] = useState('Drip');
  const [cropName, setCropName] = useState('Soybean');
  const [cropVariety, setCropVariety] = useState('Phule Sangam (KDS-726)');
  const [cropSeason, setCropSeason] = useState('Kharif');
  const [submitting, setSubmitting] = useState(false);

  // Available districts for chosen state
  const selectedStateObj = STATE_SEED_RECOMMENDATION_DATABASE.find((s) => s.state === state);
  const districtList = selectedStateObj?.districts || [];
  const activeDistrictObj = districtList.find((d) => d.name === district) || districtList[0];
  const suggestedSeeds = activeDistrictObj?.recommendedSeeds || [];

  if (!isOpen) return null;

  const handleStateChange = (newState: string) => {
    setState(newState);
    const stObj = STATE_SEED_RECOMMENDATION_DATABASE.find((s) => s.state === newState);
    if (stObj && stObj.districts.length > 0) {
      setDistrict(stObj.districts[0].name);
      if (stObj.districts[0].recommendedSeeds.length > 0) {
        const firstSeed = stObj.districts[0].recommendedSeeds[0];
        setCropName(firstSeed.cropName);
        setCropVariety(firstSeed.seedVariety);
        setCropSeason(firstSeed.idealSeason === 'All Season' ? 'Kharif' : firstSeed.idealSeason);
      }
    }
  };

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const dObj = districtList.find((d) => d.name === newDistrict);
    if (dObj && dObj.recommendedSeeds.length > 0) {
      const firstSeed = dObj.recommendedSeeds[0];
      setCropName(firstSeed.cropName);
      setCropVariety(firstSeed.seedVariety);
      setCropSeason(firstSeed.idealSeason === 'All Season' ? 'Kharif' : firstSeed.idealSeason);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const targetLat = activeDistrictObj ? activeDistrictObj.lat : (selectedStateObj ? selectedStateObj.centerCoordinates.lat : 19.176);
    const targetLng = activeDistrictObj ? activeDistrictObj.lng : (selectedStateObj ? selectedStateObj.centerCoordinates.lng : 75.183);
    try {
      await onSubmit({
        name,
        areaAcres: Number(areaAcres) || 2,
        state,
        district,
        village,
        latitude: targetLat,
        longitude: targetLng,
        soilType,
        irrigationType,
        initialCrop: cropName
          ? {
              name: cropName,
              variety: cropVariety,
              season: cropSeason,
              sowingDate: new Date().toISOString().split('T')[0],
              expectedHarvestDate: new Date(Date.now() + 115 * 86400000).toISOString().split('T')[0],
              currentStage: 'Vegetative Growth'
            }
          : undefined
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Sprout className="w-5 h-5 text-emerald-600" />
          <span>Add New Farm Parcel</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Provide farm geographic location, soil profile, and active crop for personalized AI advice.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shinde Mala North Plot"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                required
                value={areaAcres}
                onChange={(e) => setAreaAcres(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              >
                <option value="Black">Black Soil (Regur)</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Red">Red Soil</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Clay">Clay Soil</option>
                <option value="Loamy">Loamy Soil</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                {STATE_SEED_RECOMMENDATION_DATABASE.map((st) => (
                  <option key={st.state} value={st.state}>
                    {st.state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                {districtList.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Town</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Village name"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Quick Seed Suggestions for Chosen Location */}
          {suggestedSeeds.length > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Recommended Seeds for {district}:</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-normal">Click to apply</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSeeds.map((seed) => (
                  <button
                    key={seed.id}
                    type="button"
                    onClick={() => {
                      setCropName(seed.cropName);
                      setCropVariety(seed.seedVariety);
                      setCropSeason(seed.idealSeason === 'All Season' ? 'Kharif' : seed.idealSeason);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border text-left transition ${
                      cropVariety === seed.seedVariety
                        ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-emerald-100/50 border-slate-200'
                    }`}
                  >
                    🌱 {seed.cropName} - {seed.seedVariety} ({seed.type})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Irrigation System</label>
            <select
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
            >
              <option value="Drip">Drip Irrigation</option>
              <option value="Sprinkler">Sprinkler Irrigation</option>
              <option value="Canal/Flood">Canal / Surface Flood</option>
              <option value="Borewell">Borewell Tube</option>
              <option value="Rainfed">Rainfed</option>
            </select>
          </div>

          {/* Initial Crop */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-xs text-slate-800 mb-2">Active Crop Details in Field</h4>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="Crop (e.g. Wheat)"
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
              />
              <input
                type="text"
                value={cropVariety}
                onChange={(e) => setCropVariety(e.target.value)}
                placeholder="Variety"
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
              />
              <select
                value={cropSeason}
                onChange={(e) => setCropSeason(e.target.value)}
                className="text-xs px-2 py-1.5 rounded-lg border border-slate-300"
              >
                <option value="Kharif">Kharif</option>
                <option value="Rabi">Rabi</option>
                <option value="Zaid">Zaid</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl border hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow transition"
            >
              {submitting ? 'Creating...' : 'Add Farm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface RecordActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm | null;
  defaultTitle?: string;
  onSubmit: (data: {
    farmId: string;
    activityType: 'Irrigation' | 'Fertilizer' | 'Pesticide' | 'Weeding' | 'Scouting' | 'Harvest';
    title: string;
    description: string;
    quantity?: string;
    costRupees?: number;
    date: string;
  }) => Promise<void>;
}

export const RecordActivityModal: React.FC<RecordActivityModalProps> = ({
  isOpen,
  onClose,
  farm,
  defaultTitle = '',
  onSubmit
}) => {
  const [activityType, setActivityType] = useState<'Irrigation' | 'Fertilizer' | 'Pesticide' | 'Weeding' | 'Scouting' | 'Harvest'>('Irrigation');
  const [title, setTitle] = useState(defaultTitle || 'Drip Irrigation Session');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('2 hours');
  const [costRupees, setCostRupees] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !farm) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        farmId: farm.id,
        activityType,
        title,
        description,
        quantity,
        costRupees: costRupees ? Number(costRupees) : undefined,
        date
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-base font-bold text-slate-900">Record Farm Activity</h2>
        <p className="text-xs text-slate-500 mt-0.5 mb-4">Log operations for {farm.name}</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Operation Type</label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value as any)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
            >
              <option value="Irrigation">Irrigation</option>
              <option value="Fertilizer">Fertilizer Application</option>
              <option value="Pesticide">Pesticide / Fungicide Spray</option>
              <option value="Weeding">Weeding / Interculture</option>
              <option value="Scouting">Field Scouting / Health Check</option>
              <option value="Harvest">Harvesting</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity / Duration</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 50 kg Urea or 3 hrs"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cost (₹)</label>
              <input
                type="number"
                value={costRupees}
                onChange={(e) => setCostRupees(e.target.value)}
                placeholder="e.g. 450"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="e.g. Applied Urea with neem cake under light moisture condition"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl border">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow"
            >
              {submitting ? 'Saving...' : 'Save Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
