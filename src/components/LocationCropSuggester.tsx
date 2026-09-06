import React, { useState } from 'react';
import {
  Sprout,
  MapPin,
  TrendingUp,
  Award,
  Calendar,
  Droplets,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Layers,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { AppLanguage, Crop, Farm, MostHarvestedCrop } from '../types';
import { getLocationMostHarvestedCrops, STATE_HARVEST_CATALOG } from '../lib/locationCropsData';
import { TRANSLATIONS } from '../lib/translations';

interface LocationCropSuggesterProps {
  activeFarm: Farm | null;
  language: AppLanguage;
  onAdoptCrop: (cropData: {
    name: string;
    variety: string;
    season: 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
    durationDays: number;
    expectedYieldQuintals?: number;
  }) => Promise<void>;
  onNavigateToMap?: () => void;
}

export const LocationCropSuggester: React.FC<LocationCropSuggesterProps> = ({
  activeFarm,
  language,
  onAdoptCrop,
  onNavigateToMap
}) => {
  const t = TRANSLATIONS[language];
  const [selectedState, setSelectedState] = useState<string>(activeFarm?.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(activeFarm?.district || 'Latur');
  const [filterSeason, setFilterSeason] = useState<string>('all');
  const [adoptingCropId, setAdoptingCropId] = useState<string | null>(null);
  const [adoptedSuccess, setAdoptedSuccess] = useState<string | null>(null);

  // Sync state if farm changes
  React.useEffect(() => {
    if (activeFarm) {
      setSelectedState(activeFarm.state);
      setSelectedDistrict(activeFarm.district);
    }
  }, [activeFarm?.id, activeFarm?.state, activeFarm?.district]);

  const stateProfile = STATE_HARVEST_CATALOG[selectedState] || STATE_HARVEST_CATALOG.Maharashtra;
  const harvestedCrops = getLocationMostHarvestedCrops(selectedState, selectedDistrict);

  const filteredCrops = harvestedCrops.filter((crop) => {
    if (filterSeason === 'all') return true;
    return crop.typicalHarvestSeason.toLowerCase() === filterSeason.toLowerCase();
  });

  const handleAdopt = async (crop: MostHarvestedCrop, varietyName?: string) => {
    try {
      setAdoptingCropId(crop.id);
      const chosenVariety = varietyName || crop.popularVarieties[0] || 'Standard Variety';
      const yieldEstimate = parseInt(crop.avgYieldQuintalsPerAcre.split('-')[1]) || 12;

      await onAdoptCrop({
        name: crop.cropName,
        variety: chosenVariety,
        season: crop.typicalHarvestSeason,
        durationDays: crop.durationDays,
        expectedYieldQuintals: yieldEstimate
      });

      setAdoptedSuccess(crop.cropName);
      setTimeout(() => setAdoptedSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to adopt crop:', err);
    } finally {
      setAdoptingCropId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Regional Agronomic Intelligence</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <span>Most Harvested & High-Yield Crops for this Location</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by multi-year harvest yield data, mandi profitability, and ICAR agro-climatic suitability.
          </p>
        </div>

        {/* Location Selector Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 ml-1.5 mr-1" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none pr-1 py-1"
            >
              {Object.keys(STATE_HARVEST_CATALOG).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
            <input
              type="text"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              placeholder="District name"
              className="bg-transparent font-medium text-slate-800 text-xs px-2 py-1 focus:outline-none w-28"
            />
          </div>

          {onNavigateToMap && (
            <button
              onClick={onNavigateToMap}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center space-x-1"
            >
              <MapPin className="w-3 h-3" />
              <span>Open State Map</span>
            </button>
          )}
        </div>
      </div>

      {/* Location Agro Profile Context Pill */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-3.5 rounded-xl border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-emerald-950">
            {selectedState} ({stateProfile.majorAgroZone})
          </span>
        </div>
        <div className="text-slate-600 flex items-center space-x-3 text-[11px]">
          <span>Dominant Soil: <strong className="text-slate-800">{stateProfile.dominantSoil}</strong></span>
          <span>•</span>
          <span>Cultivated Area: <strong className="text-slate-800">{stateProfile.totalCultivatedAreaMillionHa}</strong></span>
        </div>
      </div>

      {/* Season Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider mr-1">
          Season:
        </span>
        {[
          { id: 'all', label: 'All Crops' },
          { id: 'kharif', label: '🌧️ Kharif (Monsoon)' },
          { id: 'rabi', label: '❄️ Rabi (Winter)' },
          { id: 'zaid', label: '☀️ Zaid / Summer' },
          { id: 'all season', label: '🌱 Perennial / Annual' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterSeason(tab.id)}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
              filterSeason === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Success Notification Alert */}
      {adoptedSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Successfully adopted <strong>{adoptedSuccess}</strong> as the active crop for {activeFarm?.name || 'your farm'}! Stage recommendations updated.
          </span>
        </div>
      )}

      {/* Crop Recommendation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.map((crop) => {
          const isCurrentActiveCrop = activeFarm?.activeCropId && activeFarm.name.toLowerCase().includes(crop.cropName.toLowerCase());
          const isAdopting = adoptingCropId === crop.id;

          return (
            <div
              key={crop.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-emerald-400 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 relative group"
            >
              <div>
                {/* Harvest Rank Badge & Season */}
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-emerald-100 text-emerald-900 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <Award className="w-3 h-3 text-emerald-700" />
                    <span>#{crop.harvestRank} Most Harvested</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {crop.typicalHarvestSeason}
                  </span>
                </div>

                {/* Crop Name & Local Name */}
                <div className="flex items-baseline justify-between">
                  <h3 className="font-black text-slate-900 text-base">{crop.cropName}</h3>
                  {crop.localName && (
                    <span className="text-xs font-semibold text-emerald-700">{crop.localName}</span>
                  )}
                </div>

                {/* Suitability Pill */}
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {crop.climateSoilSuitability}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-50 p-2.5 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Avg Harvest Yield</span>
                    <span className="font-bold text-emerald-800">{crop.avgYieldQuintalsPerAcre}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Duration</span>
                    <span className="font-bold text-slate-800">{crop.durationDays} Days</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Sowing Window</span>
                    <span className="font-semibold text-slate-700 text-[11px]">{crop.recommendedSowingMonth}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Profitability</span>
                    <span className="font-bold text-emerald-700 text-[10px]">{crop.profitabilityIndex.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Popular Varieties Badges */}
                <div className="mt-2.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                    Certified Varieties in this zone:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {crop.popularVarieties.slice(0, 3).map((varName, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-medium"
                      >
                        {varName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: One-Click Adopt to Farm */}
              <button
                onClick={() => handleAdopt(crop)}
                disabled={isAdopting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 mt-1"
              >
                {isAdopting ? (
                  <span>Updating Farm Crop...</span>
                ) : (
                  <>
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Adopt for {activeFarm ? activeFarm.name : 'Farm'}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
