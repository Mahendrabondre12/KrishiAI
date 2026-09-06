import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Sparkles,
  Sprout,
  Compass,
  Layers,
  Droplets,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Store,
  Calendar,
  Clock,
  TrendingUp,
  Search,
  ExternalLink,
  ChevronRight,
  Globe2,
  Navigation
} from 'lucide-react';
import { AppLanguage, Farm } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import {
  STATE_SEED_RECOMMENDATION_DATABASE,
  StateDistrictAgroProfile,
  SeedRecommendation,
  getRecommendedSeedsForLocation
} from '../lib/seedsDatabase';

interface StateMapTrackerViewProps {
  activeFarm: Farm | null;
  language: AppLanguage;
  onSelectFarmState?: (state: string, district: string) => void;
}

export const StateMapTrackerView: React.FC<StateMapTrackerViewProps> = ({
  activeFarm,
  language,
  onSelectFarmState
}) => {
  const t = (TRANSLATIONS[language] || TRANSLATIONS.en) as any;

  // Selected State and District
  const [selectedStateName, setSelectedStateName] = useState<string>(
    activeFarm?.state || 'Maharashtra'
  );
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(
    activeFarm?.district || 'Ahmednagar / Ahilyanagar'
  );
  const [cropTypeFilter, setCropTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeedModal, setSelectedSeedModal] = useState<SeedRecommendation | null>(null);

  // Active State Profile
  const currentStateProfile: StateDistrictAgroProfile = useMemo(() => {
    return (
      STATE_SEED_RECOMMENDATION_DATABASE.find(
        (s) => s.state.toLowerCase() === selectedStateName.toLowerCase()
      ) || STATE_SEED_RECOMMENDATION_DATABASE[0]
    );
  }, [selectedStateName]);

  // Current District Object
  const currentDistrict = useMemo(() => {
    return (
      currentStateProfile.districts.find(
        (d) =>
          d.name.toLowerCase() === selectedDistrictName.toLowerCase() ||
          d.name.toLowerCase().includes(selectedDistrictName.toLowerCase()) ||
          selectedDistrictName.toLowerCase().includes(d.name.toLowerCase())
      ) || currentStateProfile.districts[0]
    );
  }, [currentStateProfile, selectedDistrictName]);

  // Filtered Seeds
  const filteredSeeds = useMemo(() => {
    if (!currentDistrict) return [];
    let list = currentDistrict.recommendedSeeds;

    if (cropTypeFilter !== 'All') {
      list = list.filter((s) => s.idealSeason === cropTypeFilter || s.idealSeason === 'All Season');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.cropName.toLowerCase().includes(q) ||
          s.seedVariety.toLowerCase().includes(q) ||
          s.brandOrBreeder.toLowerCase().includes(q) ||
          s.specialTraits.toLowerCase().includes(q)
      );
    }

    return list;
  }, [currentDistrict, cropTypeFilter, searchQuery]);

  // Map Embed URL generator based on selected State & District
  const mapEmbedUrl = useMemo(() => {
    const lat = currentDistrict ? currentDistrict.lat : currentStateProfile.centerCoordinates.lat;
    const lng = currentDistrict ? currentDistrict.lng : currentStateProfile.centerCoordinates.lng;
    const query = encodeURIComponent(
      `${currentDistrict ? currentDistrict.name : selectedStateName}, India agriculture fields`
    );
    // Standard high-reliability interactive OpenStreetMap / Google Static/Embed fallback
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=${language === 'en' ? 'en' : 'hi'}&z=10&output=embed`;
  }, [currentDistrict, currentStateProfile, selectedStateName, language]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* HEADER: State Tracking & Seed Intelligence                    */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Pan-India Agricultural Agro-Climatic Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.seedSuggestionsTitle || 'Location-Based Seed & Variety Recommendations'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore interactive map tracking across agricultural states in India. Discover certified, high-yielding, and climate-resilient crop varieties curated by <strong>ICAR, State Agricultural Universities (SAUs), and KVKs</strong> tailored to your specific district soil and rainfall profile.
            </p>
          </div>

          {/* Quick Active State Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center space-x-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                {t.selectState}
              </div>
              <div className="text-lg font-bold text-white">
                {currentStateProfile.stateLocalName[language as keyof typeof currentStateProfile.stateLocalName] || currentStateProfile.state}
              </div>
              <div className="text-xs text-slate-300">
                {currentDistrict?.name}
              </div>
            </div>
          </div>
        </div>

        {/* State Selector Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-2">
          {STATE_SEED_RECOMMENDATION_DATABASE.map((st) => {
            const isSelected = st.state === selectedStateName;
            const localizedLabel =
              st.stateLocalName[language as keyof typeof st.stateLocalName] || st.state;
            return (
              <button
                key={st.state}
                onClick={() => {
                  setSelectedStateName(st.state);
                  if (st.districts.length > 0) {
                    setSelectedDistrictName(st.districts[0].name);
                  }
                }}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-white/50'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{localizedLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TWO COLUMN WORKSPACE: Interactive Map + District Selector     */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map Frame & District Highlights (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>State & District Tracking Map</span>
              </h2>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                GPS: {currentDistrict?.lat.toFixed(2)}°N, {currentDistrict?.lng.toFixed(2)}°E
              </span>
            </div>

            {/* District Selector Tabs */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase">
                {t.selectDistrict || 'Select District'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentStateProfile.districts.map((dist) => {
                  const isSelected = dist.name === currentDistrict?.name;
                  return (
                    <button
                      key={dist.name}
                      onClick={() => setSelectedDistrictName(dist.name)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {dist.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Interactive Map Embed */}
            <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              <iframe
                title="State Crop Agriculture Map"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              ></iframe>
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] text-slate-700 font-semibold shadow border border-slate-200 flex items-center space-x-1.5">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>
                  {currentDistrict?.name}, {currentStateProfile.state}
                </span>
              </div>
            </div>

            {/* Agro-Climatic Zone Metrics for Selected State */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {t.stateZone || 'Zone'}
                </span>
                <span className="font-semibold text-slate-800">
                  {currentStateProfile.majorAgroClimaticZone}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {t.dominantSoil || 'Dominant Soil'}
                </span>
                <span className="font-semibold text-slate-800">
                  {currentStateProfile.dominantSoil}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {t.rainfallAvg || 'Rainfall'}
                </span>
                <span className="font-semibold text-emerald-700">
                  ~{currentStateProfile.annualRainfallMm} mm/year
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Major Crops
                </span>
                <span className="font-semibold text-slate-800 truncate block">
                  {currentStateProfile.primaryCrops.slice(0, 3).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Certified Seeds & Varieties (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>
                    Suggested Seeds for {currentDistrict?.name} ({filteredSeeds.length})
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Certified seed varieties tested for local soil, temperature, and moisture conditions
                </p>
              </div>

              {/* Season Filter Buttons */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                {['All', 'Kharif', 'Rabi', 'All Season'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setCropTypeFilter(s)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                      cropTypeFilter === s
                        ? 'bg-white text-emerald-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search variety, crop, or breeder (e.g. Wheat, Soybean, ICAR)..."
                className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Seed List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSeeds.map((seed) => (
                <div
                  key={seed.id}
                  className="bg-slate-50 hover:bg-emerald-50/40 rounded-2xl border border-slate-200/80 p-4 transition shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {seed.cropName} • {seed.idealSeason}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm mt-1">
                          {seed.seedVariety}
                        </h3>
                        <p className="text-[11px] text-slate-500">{seed.brandOrBreeder}</p>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          seed.type === 'Biofortified'
                            ? 'bg-purple-100 text-purple-700'
                            : seed.type === 'Drought Tolerant'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {seed.type}
                      </span>
                    </div>

                    {/* Key Attributes */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/60">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">
                          {t.expectedYield || 'Expected Yield'}
                        </span>
                        <span className="font-bold text-slate-800">
                          {seed.expectedYieldQuintalPerAcre}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">
                          {t.cropDuration || 'Duration'}
                        </span>
                        <span className="font-bold text-slate-800">{seed.durationDays} Days</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-100">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">
                          {t.sowingWindow || 'Sowing Window'}
                        </span>
                        <span className="font-semibold text-emerald-800">{seed.sowingWindow}</span>
                      </div>
                    </div>

                    {/* Special Traits / Disease Shield */}
                    <div className="space-y-1">
                      <div className="flex items-start space-x-1.5 text-[11px] text-slate-600">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{seed.specialTraits}</span>
                      </div>
                      <div className="flex items-start space-x-1.5 text-[11px] text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{seed.diseaseResistance.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {t.certifiedPrice || 'Price'}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        ₹{seed.certifiedSeedPricePerKg} / kg
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedSeedModal(seed)}
                      className="text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center space-x-1 transition shadow-sm"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredSeeds.length === 0 && (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Sprout className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No seeds match your search filters.</p>
                <button
                  onClick={() => {
                    setCropTypeFilter('All');
                    setSearchQuery('');
                  }}
                  className="text-xs text-emerald-600 font-bold underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SEED DETAIL MODAL                                             */}
      {/* ------------------------------------------------------------- */}
      {selectedSeedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {selectedSeedModal.cropName} Variety
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedSeedModal.seedVariety}
                </h3>
                <p className="text-xs text-slate-500">
                  Breeder: {selectedSeedModal.brandOrBreeder}
                </p>
              </div>
              <button
                onClick={() => setSelectedSeedModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Expected Yield
                </span>
                <span className="font-bold text-slate-800">
                  {selectedSeedModal.expectedYieldQuintalPerAcre}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Maturity Duration
                </span>
                <span className="font-bold text-slate-800">
                  {selectedSeedModal.durationDays} Days
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Water Need
                </span>
                <span className="font-bold text-emerald-700">
                  {selectedSeedModal.waterRequirement}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Season</span>
                <span className="font-bold text-slate-800">{selectedSeedModal.idealSeason}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Govt Rate
                </span>
                <span className="font-bold text-emerald-700">
                  ₹{selectedSeedModal.certifiedSeedPricePerKg} / kg
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Soil Suitability
                </span>
                <span className="font-bold text-slate-800 truncate block">
                  {selectedSeedModal.idealSoilTypes.join(', ')}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">
                  Agronomic Characteristics:
                </span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedSeedModal.specialTraits}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-0.5">
                  Disease & Pest Resistance Shield:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-emerald-800 font-medium">
                  {selectedSeedModal.diseaseResistance.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-0.5">
                  Authorized Procurement & KVK Availability:
                </span>
                <div className="space-y-1">
                  {selectedSeedModal.availableAtKVKOrDealers.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 text-[11px] text-slate-600 bg-emerald-50/60 px-2.5 py-1 rounded-lg"
                    >
                      <Store className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedSeedModal(null)}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
