import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  CloudRain,
  Layers,
  AlertTriangle,
  Info,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Farm } from '../types';
import {
  ALL_SUPPORTED_STATES,
  getLocationAgroZoneInfo,
  StateHarvestProfile
} from '../lib/locationCropsData';

interface AgroZoneBannerProps {
  farm: Farm | null;
  onSelectState?: (stateName: string) => void;
  compact?: boolean;
}

export const AgroZoneBanner: React.FC<AgroZoneBannerProps> = ({
  farm,
  onSelectState,
  compact = false
}) => {
  const activeState = farm?.state || 'Maharashtra';
  const zoneInfo: StateHarvestProfile = getLocationAgroZoneInfo(activeState);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  if (compact) {
    return (
      <div className="inline-flex items-center space-x-2 bg-emerald-800/80 text-emerald-100 border border-emerald-700/60 px-3 py-1 rounded-xl text-xs font-semibold">
        <Compass className="w-3.5 h-3.5 text-emerald-300" />
        <span>
          {zoneInfo.agroZoneCode || 'ICAR Zone'}: {zoneInfo.majorAgroZone} ({activeState})
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-emerald-800/50 space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>ICAR Agro-Climatic Zone Classification</span>
            <span className="bg-emerald-700/80 text-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {zoneInfo.agroZoneCode || 'Zone IX'}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
            <span>{zoneInfo.majorAgroZone}</span>
            <span className="text-xs text-emerald-300 font-normal">
              ({farm ? `${farm.district}, ${activeState}` : activeState})
            </span>
          </h3>

          <p className="text-xs text-emerald-200/90 max-w-2xl leading-relaxed">
            {zoneInfo.climateType} • Dominant Soil: <strong className="text-white">{zoneInfo.dominantSoil}</strong> • Annual Rainfall: <strong className="text-white">{zoneInfo.annualRainfallMm}</strong>
          </p>
        </div>

        {/* State Location Switcher */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 bg-emerald-800/90 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-600/60 shadow-xs transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>Location: {activeState}</span>
            <ChevronDown className="w-3 h-3 ml-1 text-emerald-300" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select Agro-Climatic Region
              </div>
              {ALL_SUPPORTED_STATES.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    if (onSelectState) onSelectState(st);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition ${
                    activeState === st ? 'bg-emerald-50 font-bold text-emerald-900 border-l-4 border-emerald-600' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div>{st}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {getLocationAgroZoneInfo(st).agroZoneCode} • {getLocationAgroZoneInfo(st).majorAgroZone}
                    </div>
                  </div>
                  {activeState === st && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone Characteristics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        {/* Dominant Soil */}
        <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Soil Characteristics</span>
          </span>
          <div className="font-bold text-white mt-1">{zoneInfo.dominantSoil}</div>
          <div className="text-[11px] text-emerald-300/80 mt-0.5">
            Total Cultivated Area: {zoneInfo.totalCultivatedAreaMillionHa}
          </div>
        </div>

        {/* Weather Vulnerability */}
        <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-3">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Zone Climate Vulnerabilities</span>
          </span>
          <div className="text-[11px] text-amber-100 font-medium mt-1 leading-snug">
            {zoneInfo.weatherVulnerability ? zoneInfo.weatherVulnerability.join(' • ') : 'Monsoon dry spells and unseasonal showers'}
          </div>
        </div>

        {/* Endemic Pathogens */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
          <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Endemic Pathogen Watch</span>
          </span>
          <div className="text-[11px] text-slate-200 font-medium mt-1 leading-snug">
            {zoneInfo.endemicDiseases ? zoneInfo.endemicDiseases.slice(0, 3).join(' • ') : 'Regional rust & blight vectors'}
          </div>
        </div>
      </div>
    </div>
  );
};
