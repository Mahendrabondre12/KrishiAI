import React, { useState } from 'react';
import {
  Satellite,
  Layers,
  Activity,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { AppLanguage, Farm, SatelliteHealthData } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface SatelliteViewProps {
  farm: Farm | null;
  satelliteData?: SatelliteHealthData | null;
  language: AppLanguage;
}

export const SatelliteView: React.FC<SatelliteViewProps> = ({
  farm,
  satelliteData,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [selectedLayer, setSelectedLayer] = useState<'ndvi' | 'ndwi' | 'stress'>('ndvi');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSimulatePass = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const ndvi = satelliteData?.ndviScore ?? 0.74;
  const vitality = satelliteData?.vegetationVitality ?? 'Good';
  const ndwi = satelliteData?.moistureIndexNdwi ?? 0.42;
  const stress = satelliteData?.cropStressPct ?? 12;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-sm border border-emerald-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Satellite className="w-4 h-4" />
            <span>Sentinel-2 Multispectral Earth Observation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.navSatellite} — {farm?.name || 'Field Parcel'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Normalized Difference Vegetation Index (NDVI) and Canopy Moisture (NDWI) calibrated for GPS {farm?.latitude.toFixed(3)}°N, {farm?.longitude.toFixed(3)}°E.
          </p>
        </div>

        <button
          onClick={handleSimulatePass}
          disabled={isRefreshing}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2 self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Fetching Passes...' : 'Sync Satellite Orbit'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map/Zone Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Multispectral Field Imagery</h3>
                <span className="text-xs text-slate-500">
                  Last Pass: {satelliteData?.lastPassDate || new Date().toISOString().split('T')[0]} • Sensor: {satelliteData?.satelliteSensor || 'Sentinel-2 L2A'}
                </span>
              </div>

              {/* Layer switch buttons */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setSelectedLayer('ndvi')}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${
                    selectedLayer === 'ndvi' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  NDVI
                </button>
                <button
                  onClick={() => setSelectedLayer('ndwi')}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${
                    selectedLayer === 'ndwi' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  NDWI (Water)
                </button>
                <button
                  onClick={() => setSelectedLayer('stress')}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${
                    selectedLayer === 'stress' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Thermal Stress
                </button>
              </div>
            </div>

            {/* Field Boundary Simulation Display */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 h-80 flex items-center justify-center p-4">
              {/* Simulated Farm Grid Heatmap */}
              <div className="w-full h-full grid grid-cols-4 grid-rows-3 gap-2 p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40">
                {[
                  { id: 'Zone A1 (North)', val: '0.82', health: 'Dense Healthy', color: 'bg-emerald-600' },
                  { id: 'Zone A2 (North)', val: '0.79', health: 'Healthy Vigorous', color: 'bg-emerald-500' },
                  { id: 'Zone A3 (North-East)', val: '0.76', health: 'Healthy', color: 'bg-emerald-500' },
                  { id: 'Zone A4 (East)', val: '0.68', health: 'Moderate', color: 'bg-lime-500' },
                  { id: 'Zone B1 (West)', val: '0.78', health: 'Healthy', color: 'bg-emerald-500' },
                  { id: 'Zone B2 (Center)', val: '0.84', health: 'Dense Healthy', color: 'bg-emerald-600' },
                  { id: 'Zone B3 (Center-East)', val: '0.71', health: 'Moderate', color: 'bg-lime-500' },
                  { id: 'Zone B4 (East)', val: '0.52', health: 'Mild Moisture Stress', color: 'bg-amber-500' },
                  { id: 'Zone C1 (South-West)', val: '0.75', health: 'Healthy', color: 'bg-emerald-500' },
                  { id: 'Zone C2 (South)', val: '0.73', health: 'Healthy', color: 'bg-emerald-500' },
                  { id: 'Zone C3 (South-East)', val: '0.64', health: 'Moderate', color: 'bg-lime-500' },
                  { id: 'Zone C4 (Corner)', val: '0.45', health: 'Low Vigor / Runoff', color: 'bg-red-500' }
                ].map((zone, idx) => (
                  <div
                    key={idx}
                    className={`${zone.color}/80 hover:${zone.color} transition rounded-lg p-2 flex flex-col justify-between text-white shadow-inner cursor-pointer border border-white/20`}
                    title={`${zone.id}: ${zone.val} NDVI (${zone.health})`}
                  >
                    <span className="text-[10px] font-bold text-white/90 truncate">{zone.id.split(' ')[0]}</span>
                    <div className="text-right">
                      <span className="text-xs font-black text-white font-mono">{zone.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend overlay */}
              <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-3 text-[10px] text-white">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded bg-emerald-500"></span>
                  <span>Healthy (&gt;0.7)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded bg-lime-500"></span>
                  <span>Moderate (0.5-0.7)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded bg-amber-500"></span>
                  <span>Stressed (&lt;0.5)</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              * Parcel boundaries are automatically sampled every 5 days when Copernicus Sentinel constellation passes overhead without cloud interference.
            </p>
          </div>
        </div>

        {/* Right Analytics Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* NDVI Metric Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">NDVI Mean Index</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {vitality} Canopy
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 my-2">{ndvi} <span className="text-xs font-normal text-slate-500">/ 1.0</span></div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${ndvi * 100}%` }}></div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Values above 0.70 represent high chlorophyll density, uniform vegetative canopy, and active photosynthesis.
            </p>
          </div>

          {/* NDWI Moisture Metric */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">NDWI Canopy Moisture</span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Optimal
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 my-2">{ndwi} <span className="text-xs font-normal text-slate-500">/ 1.0</span></div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${ndwi * 100}%` }}></div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Adequate plant cellular water content. No widespread wilting symptoms detected across major field quadrants.
            </p>
          </div>

          {/* Anomaly / Actionable Recommendation */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Field Quadrant Zone C4 Attention</h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Zone C4 (South-East corner) exhibits a -18% NDVI dip compared to parcel mean. Recommend physical scouting for irrigation leak or nutrient runoff.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
