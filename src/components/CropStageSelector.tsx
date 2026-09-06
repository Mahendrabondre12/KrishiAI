import React, { useState } from 'react';
import {
  Layers,
  Sprout,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Droplets,
  FlaskConical,
  Bug,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { AppLanguage, Crop, Farm, StageDetail } from '../types';
import { getCropStageSystem } from '../lib/cropStagesData';
import { TRANSLATIONS } from '../lib/translations';

interface CropStageSelectorProps {
  crop: Crop | null;
  farm: Farm | null;
  language: AppLanguage;
  onUpdateStage?: (stageNumber: 1 | 2 | 3 | 4, stageName: string) => Promise<void>;
}

export const CropStageSelector: React.FC<CropStageSelectorProps> = ({
  crop,
  farm,
  language,
  onUpdateStage
}) => {
  const t = TRANSLATIONS[language];
  const cropName = crop?.name || 'Soybean';
  const stageSystem = getCropStageSystem(cropName);

  // Determine current active stage number from crop.currentStage
  const getInitialStage = (): 1 | 2 | 3 | 4 => {
    if (!crop?.currentStage) return 2;
    const stageStr = crop.currentStage.toLowerCase();
    if (stageStr.includes('sowing') || stageStr.includes('nursery') || stageStr.includes('germination') || stageStr.includes('emergence')) return 1;
    if (stageStr.includes('vegetative') || stageStr.includes('tillering') || stageStr.includes('branching') || stageStr.includes('jointing')) return 2;
    if (stageStr.includes('flowering') || stageStr.includes('pollination') || stageStr.includes('pod') || stageStr.includes('grain') || stageStr.includes('booting')) return 3;
    if (stageStr.includes('maturity') || stageStr.includes('ripening') || stageStr.includes('harvest')) return 4;
    return 2;
  };

  const [selectedStageNum, setSelectedStageNum] = useState<1 | 2 | 3 | 4>(getInitialStage());
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const activeStage = stageSystem.stages[selectedStageNum];

  const handleSetCurrentStage = async () => {
    if (!onUpdateStage) return;
    setUpdating(true);
    try {
      await onUpdateStage(selectedStageNum, activeStage.title);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3500);
    } catch (err) {
      console.error('Failed to update stage:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-0.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>4-Stage Comprehensive Crop Lifecycle Guide</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <span>{cropName} Lifecycle Stages (Stage 1 to 4)</span>
            {crop?.variety && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                {crop.variety}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between growth stages to view stage-specific nutrient plans, critical irrigation rules, and pest advisories.
          </p>
        </div>

        {crop && onUpdateStage && (
          <button
            onClick={handleSetCurrentStage}
            disabled={updating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{updating ? 'Updating...' : `Set as Active Stage ${selectedStageNum}`}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Stage {selectedStageNum} ({activeStage.title}) is now set as the active field stage for {cropName}!</span>
        </div>
      )}

      {/* 4 Interactive Stage Stepper Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([1, 2, 3, 4] as const).map((num) => {
          const st = stageSystem.stages[num];
          const isSelected = selectedStageNum === num;

          return (
            <div
              key={num}
              onClick={() => setSelectedStageNum(num)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {num}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">{st.dayRange}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                  {st.title.replace(`Stage ${num}: `, '')}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  {st.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-semibold">{st.progressPct}% Maturity</span>
                <span className={`font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {isSelected ? 'Viewing' : 'Inspect'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Stage Agronomic Action Breakdown */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
        {/* Stage Title and Progress Bar */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              {activeStage.title}
            </span>
            <span className="text-xs font-bold text-slate-600">
              {activeStage.dayRange} • {activeStage.progressPct}% Crop Cycle Complete
            </span>
          </div>
          <h3 className="font-black text-slate-900 text-base mt-2">
            {activeStage.subtitle}
          </h3>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${activeStage.progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Action Grid: Tasks, Fertilizer, Irrigation, Disease/Pest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key Agronomic Tasks */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recommended Field Operations</span>
            </h4>
            <ul className="space-y-1.5 text-slate-700">
              {activeStage.keyActivities.map((act, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nutrient & Fertilizer Dosing */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs uppercase tracking-wider">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              <span>Nutrient & Fertilizer Schedule</span>
            </h4>
            <div className="bg-purple-50/70 p-3 rounded-lg border border-purple-200 text-purple-950 font-medium leading-relaxed">
              {activeStage.fertilizerDose}
            </div>
            <div className="text-[11px] text-slate-500">
              💡 Always dissolve water-soluble foliar fertilizers in neutral pH water during early morning or late afternoon.
            </div>
          </div>

          {/* Irrigation & Water Management */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs uppercase tracking-wider">
              <Droplets className="w-4 h-4 text-cyan-600" />
              <span>Irrigation & Soil Moisture Rules</span>
            </h4>
            <div className="bg-cyan-50/70 p-3 rounded-lg border border-cyan-200 text-cyan-950 font-medium leading-relaxed">
              {activeStage.irrigationRule}
            </div>
          </div>

          {/* Vulnerability, Pest & Disease Shield */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs uppercase tracking-wider">
              <Bug className="w-4 h-4 text-amber-600" />
              <span>Pest & Microclimate Watch</span>
            </h4>
            <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200 text-amber-950 font-medium leading-relaxed">
              <div><strong className="text-amber-900">Pest Alert:</strong> {activeStage.pestAlert}</div>
              <div className="mt-1"><strong className="text-amber-900">Climate Risk:</strong> {activeStage.riskWatch}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
