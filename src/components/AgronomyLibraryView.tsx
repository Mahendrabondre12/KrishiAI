import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Leaf,
  Bug,
  Droplets,
  FlaskConical,
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface AgronomyLibraryProps {
  language: AppLanguage;
}

const CROPS_KNOWLEDGE = [
  {
    id: 'wheat',
    name: 'Wheat (Triticum aestivum)',
    season: 'Rabi (Oct–April)',
    waterReq: '450–650 mm (4–6 irrigations at CRI, tillering, flowering)',
    soilReq: 'Well-drained loams, clay loams; pH 6.0–7.5',
    keyDiseases: ['Stripe/Yellow Rust', 'Karnal Bunt', 'Powdery Mildew'],
    fertilizerDose: '120 kg N : 60 kg P2O5 : 40 kg K2O per hectare'
  },
  {
    id: 'cotton',
    name: 'Cotton (Gossypium hirsutum)',
    season: 'Kharif (May–Dec)',
    waterReq: '700–1200 mm (Critical at squaring and boll formation)',
    soilReq: 'Deep black cotton soils (Vertisols); pH 7.0–8.5',
    keyDiseases: ['Cotton Leaf Curl Virus', 'Bacterial Blight', 'Bollworm Complex'],
    fertilizerDose: '100 kg N : 50 kg P2O5 : 50 kg K2O per hectare'
  },
  {
    id: 'rice',
    name: 'Rice / Paddy (Oryza sativa)',
    season: 'Kharif / Rabi',
    waterReq: '1200–2000 mm (Submerged till panicle initiation)',
    soilReq: 'Heavy clay or clayey loam with good water retention; pH 5.5–7.0',
    keyDiseases: ['Rice Blast', 'Bacterial Leaf Blight', 'Brown Plant Hopper'],
    fertilizerDose: '100 kg N : 50 kg P2O5 : 50 kg K2O + 25 kg Zinc Sulfate'
  },
  {
    id: 'tomato',
    name: 'Tomato (Solanum lycopersicum)',
    season: 'Year-round / Zaid & Rabi',
    waterReq: '600–800 mm (Drip irrigation at 2–3 day intervals)',
    soilReq: 'Sandy loam to clay loam rich in organic matter; pH 6.0–7.0',
    keyDiseases: ['Early Blight', 'Late Blight', 'Tomato Leaf Curl Virus'],
    fertilizerDose: '150 kg N : 100 kg P2O5 : 100 kg K2O with fertigation'
  },
  {
    id: 'soybean',
    name: 'Soybean (Glycine max)',
    season: 'Kharif (June–Oct)',
    waterReq: '450–700 mm (Rainfed, avoid waterlogging)',
    soilReq: 'Well-drained fertile loam or black clay soil; pH 6.5–7.5',
    keyDiseases: ['Yellow Mosaic Virus', 'Charcoal Rot', 'Girdle Beetle'],
    fertilizerDose: '30 kg N : 60 kg P2O5 : 40 kg K2O + Rhizobium seed inoculation'
  }
];

export const AgronomyLibraryView: React.FC<AgronomyLibraryProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(CROPS_KNOWLEDGE[0]);

  const filteredCrops = CROPS_KNOWLEDGE.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.season.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white rounded-2xl p-6 shadow-sm border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>ICAR & Agronomic Knowledge Repository</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.navKnowledge}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
            Standard crop production guidelines, NPK fertilization schedules, critical irrigation stages, and pest disease management protocols.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop or disease..."
            className="w-full bg-emerald-900/80 border border-emerald-700 text-white placeholder-emerald-300 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      {/* 2-Column Library layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Crop Profiles</h3>
          {filteredCrops.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCrop(c)}
              className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                selectedCrop.id === c.id
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="text-sm font-semibold">{c.name.split('(')[0]}</div>
                <div className="text-xs text-slate-500 font-normal">{c.season}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>

        {/* Right Details */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-md uppercase">
                {selectedCrop.season}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">{selectedCrop.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5 mb-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Irrigation & Water Requirement</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{selectedCrop.waterReq}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5 mb-1.5">
                  <FlaskConical className="w-4 h-4 text-amber-600" />
                  <span>Soil & Reaction Preference</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{selectedCrop.soilReq}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5 mb-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Recommended Fertilizer (Basal & Splits)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{selectedCrop.fertilizerDose}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5 mb-1.5">
                  <Bug className="w-4 h-4 text-red-600" />
                  <span>Key Pathogens & Pest Complexes</span>
                </div>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {selectedCrop.keyDiseases.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
