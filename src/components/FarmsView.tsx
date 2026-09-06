import React, { useState } from 'react';
import {
  Sprout,
  PlusCircle,
  MapPin,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Award,
  Clock
} from 'lucide-react';
import { AppLanguage, Crop, Farm, FarmActivity, SoilRecord } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { StateMapTrackerView } from './StateMapTrackerView';

interface FarmsViewProps {
  farms: Farm[];
  activeFarm: Farm | null;
  onSelectFarm: (farm: Farm) => void;
  onOpenAddFarmModal: () => void;
  onOpenAddCropModal: (farmId: string) => void;
  crops: Crop[];
  activities: FarmActivity[];
  soil: SoilRecord | null;
  language: AppLanguage;
  onDeleteFarm: (id: string) => void;
  onOpenRecordActivity: (defaultType?: string) => void;
}

export const FarmsView: React.FC<FarmsViewProps> = ({
  farms,
  activeFarm,
  onSelectFarm,
  onOpenAddFarmModal,
  onOpenAddCropModal,
  crops,
  activities,
  soil,
  language,
  onDeleteFarm,
  onOpenRecordActivity
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'farms' | 'crops' | 'history'>('farms');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>{t.navFarms}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your land parcels, GPS boundaries, active crop cycles, and historical farm logs.
          </p>
        </div>

        <button
          onClick={onOpenAddFarmModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.addNewFarm}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        {[
          { id: 'farms', label: 'Land Parcels' },
          { id: 'map', label: '🗺️ Map & Seed Tracker' },
          { id: 'crops', label: 'Active Crop Cycles' },
          { id: 'history', label: 'Farm Activity Ledger' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === tab.id
                ? 'bg-emerald-100 text-emerald-900 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: FARMS LIST */}
      {activeTab === 'farms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((f) => {
            const isSelected = activeFarm?.id === f.id;
            return (
              <div
                key={f.id}
                onClick={() => onSelectFarm(f)}
                className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition cursor-pointer relative ${
                  isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                )}

                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{f.name}</h3>
                    <div className="flex items-center space-x-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {f.village}, {f.district}, {f.state}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl my-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Area</span>
                    <span className="font-bold text-slate-800">{f.areaAcres} Acres</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Soil Type</span>
                    <span className="font-bold text-slate-800">{f.soilType}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Irrigation Facility</span>
                    <span className="font-semibold text-emerald-800">{f.irrigationType}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    GPS: {f.latitude.toFixed(2)}°, {f.longitude.toFixed(2)}°
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this farm?')) {
                        onDeleteFarm(f.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB: MAP & SEED TRACKING */}
      {activeTab === 'map' && (
        <StateMapTrackerView
          activeFarm={activeFarm}
          language={language}
        />
      )}

      {/* TAB 2: CROPS */}
      {activeTab === 'crops' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Active Crops for {activeFarm?.name || 'Selected Farm'}
            </h3>
            {activeFarm && (
              <button
                onClick={() => onOpenAddCropModal(activeFarm.id)}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg transition"
              >
                + Add Crop Cycle
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crops.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{c.name}</h4>
                    <span className="text-xs text-slate-500">
                      Variety: {c.variety} • Season: {c.season}
                    </span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-full">
                    Health: {c.healthScore}/100
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Stage:</span>
                    <span className="font-bold text-emerald-800">{c.currentStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sowing Date:</span>
                    <span className="font-semibold text-slate-800">{c.sowingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected Harvest:</span>
                    <span className="font-semibold text-slate-800">{c.expectedHarvestDate}</span>
                  </div>
                  {c.targetYieldQuintals && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Yield:</span>
                      <span className="font-bold text-slate-900">{c.targetYieldQuintals} Quintals</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-2 mt-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onOpenRecordActivity()}
                    className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    + Log Activity
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Farm Operations & Treatment Ledger</h3>
            <button
              onClick={() => onOpenRecordActivity()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              + Record New Operation
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No activities recorded yet.</div>
            ) : (
              activities.map((a) => (
                <div key={a.id} className="py-3 flex items-start justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{a.title}</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                        {a.activityType}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-0.5">{a.description}</p>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-3">
                      <span>📅 {a.date}</span>
                      {a.quantity && <span>📦 {a.quantity}</span>}
                      {a.costRupees && <span className="font-semibold text-emerald-800">💰 ₹{a.costRupees}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
