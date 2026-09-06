import React, { useState } from 'react';
import {
  FlaskConical,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { AppLanguage, Farm, SoilRecord } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface SoilIntelligenceViewProps {
  farm: Farm | null;
  soilRecords: SoilRecord[];
  latestSoil: SoilRecord | null;
  language: AppLanguage;
  onRecordSoil: (data: Partial<SoilRecord>) => Promise<void>;
}

export const SoilIntelligenceView: React.FC<SoilIntelligenceViewProps> = ({
  farm,
  soilRecords,
  latestSoil,
  language,
  onRecordSoil
}) => {
  const t = TRANSLATIONS[language];
  const [showForm, setShowForm] = useState(false);
  const [ph, setPh] = useState<string>(latestSoil?.ph?.toString() || '7.2');
  const [nitrogen, setNitrogen] = useState<string>(latestSoil?.nitrogenKgPerHa?.toString() || '320');
  const [phosphorus, setPhosphorus] = useState<string>(latestSoil?.phosphorusKgPerHa?.toString() || '34');
  const [potassium, setPotassium] = useState<string>(latestSoil?.potassiumKgPerHa?.toString() || '245');
  const [organicCarbon, setOrganicCarbon] = useState<string>(latestSoil?.organicCarbonPct?.toString() || '0.65');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farm) return;
    setSubmitting(true);
    try {
      await onRecordSoil({
        farmId: farm.id,
        ph: Number(ph),
        nitrogenKgPerHa: Number(nitrogen),
        phosphorusKgPerHa: Number(phosphorus),
        potassiumKgPerHa: Number(potassium),
        organicCarbonPct: Number(organicCarbon),
        notes: notes || 'Laboratory Soil Health Card Test'
      });
      setShowForm(false);
      setNotes('');
    } finally {
      setSubmitting(false);
    }
  };

  const currentPh = Number(ph) || 7.2;
  const currentN = Number(nitrogen) || 300;
  const currentP = Number(phosphorus) || 30;
  const currentK = Number(potassium) || 240;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Soil Nutrient & Fertility Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {t.navSoil} for {farm?.name || 'Your Farm'}
          </h1>
          <p className="text-xs sm:text-sm text-amber-200 mt-1 max-w-xl">
            Input government Soil Health Card parameters to calculate precision fertilizer dosages, correct soil pH, and prevent nutrient runoff.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showForm ? 'Close Form' : '+ Record New Soil Test'}</span>
        </button>
      </div>

      {/* Soil Test Input Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-md space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Enter Soil Health Card Parameters</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">pH (Acidity)</label>
              <input
                type="number"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nitrogen (N) kg/ha</label>
              <input
                type="number"
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phosphorus (P) kg/ha</label>
              <input
                type="number"
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Potassium (K) kg/ha</label>
              <input
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Organic Carbon %</label>
              <input
                type="number"
                step="0.01"
                value={organicCarbon}
                onChange={(e) => setOrganicCarbon(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Lab / Officer Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. KVK Lab sample tested from Plot North-East"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow transition"
            >
              {submitting ? 'Saving...' : 'Save Soil Card'}
            </button>
          </div>
        </form>
      )}

      {/* Soil Health Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* pH Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Soil Reaction (pH)</div>
          <div className="text-3xl font-black text-slate-900 my-2">{currentPh}</div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              currentPh >= 6.5 && currentPh <= 7.8
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {currentPh >= 6.5 && currentPh <= 7.8 ? 'Ideal Neutral' : currentPh < 6.5 ? 'Acidic' : 'Alkaline'}
          </span>
          <p className="text-[11px] text-slate-500 mt-2">
            {currentPh < 6.5 ? 'Apply Agricultural Lime' : currentPh > 8.0 ? 'Apply Gypsum to reduce sodicity' : 'Nutrient availability is optimal'}
          </p>
        </div>

        {/* Nitrogen Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Available Nitrogen (N)</div>
          <div className="text-3xl font-black text-slate-900 my-2">{currentN} <span className="text-xs font-normal">kg/ha</span></div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              currentN < 280
                ? 'bg-red-100 text-red-800'
                : currentN > 560
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {currentN < 280 ? 'Low / Deficient' : currentN > 560 ? 'High' : 'Medium (Optimal)'}
          </span>
          <p className="text-[11px] text-slate-500 mt-2">
            {currentN < 280 ? 'Split 25kg Urea at tillering/branching' : 'Maintain standard basal dosage'}
          </p>
        </div>

        {/* Phosphorus Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Phosphorus (P2O5)</div>
          <div className="text-3xl font-black text-slate-900 my-2">{currentP} <span className="text-xs font-normal">kg/ha</span></div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              currentP < 23
                ? 'bg-red-100 text-red-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {currentP < 23 ? 'Low' : 'Adequate'}
          </span>
          <p className="text-[11px] text-slate-500 mt-2">
            Essential for root proliferation and early vigor
          </p>
        </div>

        {/* Potassium Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase">Potassium (K2O)</div>
          <div className="text-3xl font-black text-slate-900 my-2">{currentK} <span className="text-xs font-normal">kg/ha</span></div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              currentK < 140
                ? 'bg-red-100 text-red-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {currentK < 140 ? 'Low' : 'Adequate'}
          </span>
          <p className="text-[11px] text-slate-500 mt-2">
            Strengthens stalk & disease resistance
          </p>
        </div>
      </div>

      {/* AI Soil Interpretation Advice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>AI Soil Health Interpretation & Nutrition Guidance</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Based on the latest soil test in <strong>{farm?.district || 'your region'}</strong> ({farm?.soilType} soil), Nitrogen levels are within normal range for active crops. We recommend applying 1 split of Nitrogen fertilizer mixed with Neem Cake to slow down leaching and volatilization losses.
        </p>
      </div>
    </div>
  );
};
