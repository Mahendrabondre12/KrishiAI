import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  AlertTriangle,
  User,
  MapPin,
  Stethoscope
} from 'lucide-react';
import { AppLanguage, ExpertCase } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface ExpertDeskViewProps {
  cases: ExpertCase[];
  language: AppLanguage;
  onResolveCase: (
    caseId: string,
    data: { expertName: string; diagnosis: string; prescription: string }
  ) => Promise<void>;
}

export const ExpertDeskView: React.FC<ExpertDeskViewProps> = ({
  cases,
  language,
  onResolveCase
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCase, setSelectedCase] = useState<ExpertCase | null>(cases[0] || null);
  const [expertName, setExpertName] = useState('Dr. Sunita Deshmukh (Sr. Pathologist)');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !diagnosis.trim() || !prescription.trim()) return;

    setSubmitting(true);
    try {
      await onResolveCase(selectedCase.id, {
        expertName,
        diagnosis,
        prescription
      });
      setDiagnosis('');
      setPrescription('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Agronomist Decision & Escalation Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.navExpert}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
            Review cases escalated by farmers or AI anomaly triggers. Issue verified agricultural prescriptions and treatment protocols.
          </p>
        </div>

        <div className="bg-emerald-800/60 border border-emerald-700 px-4 py-2.5 rounded-xl text-xs text-emerald-100 self-start sm:self-auto">
          <div className="font-bold text-white">Active Queue</div>
          <div className="text-emerald-300">{cases.filter((c) => c.status !== 'Resolved').length} cases awaiting review</div>
        </div>
      </div>

      {/* Main Grid: Cases List (5 Cols) vs Case Review Panel (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cases Queue */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">Escalated Cases Queue</h3>
          <div className="space-y-2.5">
            {cases.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No active expert cases in queue.
              </div>
            ) : (
              cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition cursor-pointer ${
                    selectedCase?.id === c.id
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-2">{c.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{c.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">{c.cropName}</span>
                    <span>📍 {c.location}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Case Review & Prescription Form */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4 flex items-start justify-between">
                <div>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold">
                    Case ID: {selectedCase.id}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedCase.title}</h2>
                  <div className="text-xs text-slate-500 flex items-center space-x-3 mt-1">
                    <span>Farmer: <strong>{selectedCase.farmerName}</strong></span>
                    <span>•</span>
                    <span>Crop: <strong>{selectedCase.cropName}</strong></span>
                    <span>•</span>
                    <span>Location: <strong>{selectedCase.location}</strong></span>
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                    selectedCase.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedCase.status}
                </span>
              </div>

              {/* Farmer's Reported Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Farmer Field Report & AI Screening
                </h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedCase.description}
                </p>

                {selectedCase.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56">
                    <img
                      src={selectedCase.imageUrl}
                      alt="Escalated Leaf"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {selectedCase.aiAnalysisSummary && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Preliminary Gemini AI Pathology Screening</span>
                    </div>
                    <p>{selectedCase.aiAnalysisSummary}</p>
                  </div>
                )}
              </div>

              {/* Resolved Prescription vs Form */}
              {selectedCase.status === 'Resolved' ? (
                <div className="bg-emerald-900 text-white rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-emerald-300 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Verified Prescription by {selectedCase.assignedExpertName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-200">
                      {selectedCase.resolvedAt ? new Date(selectedCase.resolvedAt).toLocaleDateString() : 'Completed'}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-200 uppercase font-semibold">Official Diagnosis</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{selectedCase.expertDiagnosis}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-200 uppercase font-semibold">Dosage & Spray Schedule</div>
                    <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed whitespace-pre-line">{selectedCase.expertPrescription}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResolve} className="space-y-4 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Submit Verified Agronomic Diagnosis & Prescription
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reviewing Agronomist Name & Designation
                    </label>
                    <input
                      type="text"
                      value={expertName}
                      onChange={(e) => setExpertName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirmed Diagnosis & Pathogen Identification
                    </label>
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Puccinia striiformis f. sp. tritici (Yellow Rust)"
                      required
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Treatment Prescription, Chemical Dosing & Application Timing
                    </label>
                    <textarea
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder="e.g. Propiconazole 25% EC @ 1ml/liter of water. Spray during morning hours before 10 AM. Repeat after 15 days if cloudy weather persists."
                      rows={4}
                      required
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Prescription...' : t.markResolved}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              Select a case from the queue to review and issue prescriptions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
