import React, { useState, useEffect, useRef } from 'react';
import {
  Stethoscope,
  Upload,
  Camera,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Leaf,
  Bug,
  HelpCircle,
  ArrowRight,
  Send,
  FileText,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Radio,
  RefreshCw,
  MapPin,
  Compass
} from 'lucide-react';
import { AppLanguage, Crop, DiseaseAnalysisResult, Farm } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import {
  getStateCropDoctorSampleCases,
  getLocationAgroZoneInfo,
  getLocationMostHarvestedCrops,
  ALL_SUPPORTED_STATES
} from '../lib/locationCropsData';

interface CropDoctorViewProps {
  farm: Farm | null;
  crop: Crop | null;
  language: AppLanguage;
  onAnalyzeImage: (params: {
    imageBase64: string;
    mimeType: string;
    cropNameHint?: string;
    symptomsHint?: string;
  }) => Promise<DiseaseAnalysisResult>;
  onEscalateToExpert: (analysis: DiseaseAnalysisResult, imagePreview?: string) => void;
}

export const CropDoctorView: React.FC<CropDoctorViewProps> = ({
  farm,
  crop,
  language,
  onAnalyzeImage,
  onEscalateToExpert
}) => {
  const t = TRANSLATIONS[language];
  const [activeState, setActiveState] = useState<string>(farm?.state || 'Maharashtra');
  const zoneInfo = getLocationAgroZoneInfo(activeState);
  const locationSampleCases = getStateCropDoctorSampleCases(activeState);
  const regionalCrops = getLocationMostHarvestedCrops(activeState, farm?.district);

  const [selectedImage, setSelectedImage] = useState<string | null>(locationSampleCases[0]?.image || null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [cropHint, setCropHint] = useState<string>(crop?.name || locationSampleCases[0]?.crop || 'Wheat');
  const [symptomNotes, setSymptomNotes] = useState<string>(locationSampleCases[0]?.symptoms || '');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<DiseaseAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state with farm location
  useEffect(() => {
    if (farm?.state) {
      setActiveState(farm.state);
    }
  }, [farm?.state]);

  // When activeState changes, update default sample case if result is not active
  useEffect(() => {
    const updatedCases = getStateCropDoctorSampleCases(activeState);
    if (updatedCases.length > 0 && !result) {
      setSelectedImage(updatedCases[0].image);
      setCropHint(crop?.name || updatedCases[0].crop);
      setSymptomNotes(updatedCases[0].symptoms);
      handleUrlToBase64(updatedCases[0].image);
    }
  }, [activeState, crop?.name]);

  // Speech Recognition (Mic) state
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Text-To-Speech (Voice Reading) state
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [voiceRate, setVoiceRate] = useState<number>(0.9);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Voice Reading / Text-to-Speech Handler
  const handleToggleVoiceReading = () => {
    if (!('speechSynthesis' in window) || !result) {
      alert('Text-to-speech voice audio is not supported on this browser.');
      return;
    }

    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Construct detailed read-out script
    const textToRead = `${result.cropName} pathology analysis. Detected Possible Issue: ${result.possibleIssue}. Severity level: ${result.severity}. Symptoms observed: ${result.visibleSymptoms.join('. ')}. Recommended Organic Solution: ${result.organicManagement.join('. ')}. Recommended Chemical Treatment: ${result.chemicalManagement.join('. ')}. Preventative advice: ${result.preventativeMeasures.join('. ')}. Please confirm with your local agronomist.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = voiceRate;
    utterance.pitch = 1.0;

    // Pick voice according to language if available
    const voices = window.speechSynthesis.getVoices();
    const langCode = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'pa' ? 'pa-IN' : language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : 'en-US';
    const matchedVoice = voices.find((v) => v.lang.includes(langCode) || v.lang.startsWith(language));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsPlayingVoice(true);
    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Microphone Voice Dictation Handler (STT)
  const handleToggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition microphone input is not supported in this browser. Please type symptoms manually.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'pa' ? 'pa-IN' : language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSymptomNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Convert image URL to Base64
  const handleUrlToBase64 = async (url: string) => {
    try {
      setAnalyzing(true);
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = (reader.result as string).split(',')[1];
        setImageBase64(base64data);
        setMimeType(blob.type || 'image/jpeg');
        setAnalyzing(false);
      };
      reader.readAsDataURL(blob);
    } catch {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      const full = reader.result as string;
      setSelectedImage(full);
      setImageBase64(full.split(',')[1]);
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleRunDiagnosis = async () => {
    if (!imageBase64 && selectedImage) {
      await handleUrlToBase64(selectedImage);
    }

    setAnalyzing(true);
    setErrorMsg(null);

    // Stop voice if running
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsPlayingVoice(false);

    try {
      const analysis = await onAnalyzeImage({
        imageBase64: imageBase64 || 'sample_base64_data',
        mimeType,
        cropNameHint: cropHint,
        symptomsHint: symptomNotes
      });
      setResult(analysis);
    } catch (err: any) {
      setErrorMsg(err.message || 'Diagnosis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner with Agro Zone context */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>AI Multimodal Pathology Doctor • {zoneInfo.agroZoneCode} ({activeState})</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {t.diagnoseCrop}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
            Take a photo of the affected plant leaf with your camera. Gemini AI analyzes symptoms with voice reading support, calibrated for {activeState} ({zoneInfo.majorAgroZone}).
          </p>
        </div>

        {/* State / Agro-Zone Filter Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="bg-emerald-800/80 border border-emerald-700 px-3.5 py-2 rounded-xl text-xs text-emerald-100">
            <div className="font-bold flex items-center space-x-1.5 text-emerald-300 mb-0.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{zoneInfo.agroZoneCode}: {activeState}</span>
            </div>
            <span className="text-[11px] text-emerald-200">{zoneInfo.dominantSoil}</span>
          </div>

          <select
            value={activeState}
            onChange={(e) => setActiveState(e.target.value)}
            className="bg-emerald-950 text-white border border-emerald-600 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
          >
            {ALL_SUPPORTED_STATES.map((st) => (
              <option key={st} value={st}>
                📍 {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Upload on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selection & Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>{t.uploadLeafPhoto}</span>
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Camera / Photo Scan
              </span>
            </div>

            {/* Image Preview Box with Direct Camera Snap Support */}
            <div className="relative border-2 border-dashed border-emerald-300 rounded-2xl p-3 bg-emerald-50/40 text-center flex flex-col items-center justify-center min-h-[220px]">
              {selectedImage ? (
                <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-inner group">
                  <img
                    src={selectedImage}
                    alt="Crop Leaf"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                    <label className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition">
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <label className="bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition flex items-center space-x-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full py-6">
                  <Upload className="w-10 h-10 text-emerald-600 mb-2 animate-bounce" />
                  <span className="font-bold text-xs text-slate-800">
                    Snap or Upload Leaf Photo
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">{t.orDragDrop}</span>
                  <div className="flex items-center space-x-2 mt-3">
                    <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition">
                      Upload File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition flex items-center space-x-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Camera</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Regional Sample Case Picker */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>{t.sampleImagesTitle} ({activeState})</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  {zoneInfo.agroZoneCode}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {locationSampleCases.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setSelectedImage(sc.image);
                      setCropHint(sc.crop);
                      setSymptomNotes(sc.symptoms);
                      handleUrlToBase64(sc.image);
                    }}
                    className={`text-left p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                      selectedImage === sc.image
                        ? 'bg-emerald-100/70 border-emerald-500 font-semibold text-emerald-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold truncate text-slate-900">{sc.crop}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{sc.disease}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Regional Crop Suggestions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quick Select Most Harvested Crops in {activeState}:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {regionalCrops.map((rc) => (
                  <button
                    key={rc.id}
                    type="button"
                    onClick={() => setCropHint(rc.cropName)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      cropHint === rc.cropName
                        ? 'bg-emerald-700 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
                    }`}
                  >
                    🌾 {rc.cropName.split('/')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop & Symptom Context Inputs with Microphone Voice Input */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observed Crop Name
                </label>
                <input
                  type="text"
                  value={cropHint}
                  onChange={(e) => setCropHint(e.target.value)}
                  placeholder="e.g. Soybean, Wheat, Cotton, Rice"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Symptoms & Field Observations
                  </label>
                  {/* Microphone Speech-to-Text Button */}
                  <button
                    type="button"
                    onClick={handleToggleListening}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    <span>{isListening ? 'Listening...' : 'Speak Symptoms'}</span>
                  </button>
                </div>

                <textarea
                  value={symptomNotes}
                  onChange={(e) => setSymptomNotes(e.target.value)}
                  placeholder="e.g. Orange stripes on leaf surface after cloudy fog; leaves drying up from bottom. (Or tap 'Speak Symptoms' to speak into mic)"
                  rows={2}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={handleRunDiagnosis}
                disabled={analyzing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                <span>{analyzing ? 'Analyzing Image with Gemini AI...' : 'Diagnose Plant Disease'}</span>
              </button>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Multimodal Diagnostic Report (7 Cols) with Voice Reading */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
              {/* Diagnosis Header with Voice Reading Bar */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-md">
                      {result.cropName} Diagnosis
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        result.severity === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : result.severity === 'Severe'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Severity: {result.severity}
                    </span>
                  </div>

                  {/* Voice Reading Audio Controls */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={handleToggleVoiceReading}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                        isPlayingVoice
                          ? 'bg-amber-500 text-amber-950 ring-2 ring-amber-300'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      {isPlayingVoice ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Stop Voice Reading</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>🔊 Voice Reading (Listen)</span>
                        </>
                      )}
                    </button>

                    {/* Speed Selector */}
                    <button
                      onClick={() => setVoiceRate(voiceRate === 0.9 ? 1.1 : voiceRate === 1.1 ? 0.75 : 0.9)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                      title="Voice Speed"
                    >
                      {voiceRate}x Speed
                    </button>
                  </div>
                </div>

                {/* Animated sound wave bar when voice reading is active */}
                {isPlayingVoice && (
                  <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1 items-center h-4">
                        <span className="w-1 bg-emerald-600 rounded-full animate-bounce h-3"></span>
                        <span className="w-1 bg-emerald-600 rounded-full animate-bounce delay-100 h-4"></span>
                        <span className="w-1 bg-emerald-600 rounded-full animate-bounce delay-200 h-2"></span>
                        <span className="w-1 bg-emerald-600 rounded-full animate-bounce delay-150 h-4"></span>
                      </div>
                      <span className="font-bold">Reading Out Pathology Diagnosis Aloud for Farmer...</span>
                    </div>
                    <button
                      onClick={() => {
                        window.speechSynthesis.cancel();
                        setIsPlayingVoice(false);
                      }}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Stop Audio
                    </button>
                  </div>
                )}

                <h2 className="text-lg font-black text-slate-900 mt-2.5">
                  {result.possibleIssue}
                </h2>

                <p className="text-xs text-slate-500 mt-1 italic">
                  {t.possibleIssueNotice}
                </p>
              </div>

              {/* Visible Symptoms Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Detected Visual Symptoms</span>
                </h4>
                <div className="space-y-1.5">
                  {result.visibleSymptoms.map((sym, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate & Organic vs Chemical Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Organic / Biological */}
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 text-xs">
                  <h4 className="font-bold text-emerald-900 flex items-center space-x-1.5 mb-2">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>{t.organicSolutions}</span>
                  </h4>
                  <ul className="space-y-1.5 text-emerald-950">
                    {result.organicManagement.map((org, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{org}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chemical Options */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs">
                  <h4 className="font-bold text-slate-800 flex items-center space-x-1.5 mb-2">
                    <Bug className="w-4 h-4 text-amber-600" />
                    <span>{t.chemicalSolutions}</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {result.chemicalManagement.map((chem, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{chem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Preventative Measures & Causes */}
              <div className="bg-slate-50 p-3.5 rounded-xl text-xs space-y-2">
                <div className="font-semibold text-slate-800">
                  <span className="text-slate-500">Causes & Microclimate:</span> {result.causesAndConditions}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Preventative Advice:</span>{' '}
                  {result.preventativeMeasures.join('; ')}
                </div>
              </div>

              {/* One-Click Agronomist Escalation Action */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-sm text-slate-900">Need Confirmed Expert Review?</h4>
                  <p className="text-xs text-slate-800">
                    Submit this case to Dr. Sunita Deshmukh & certified agronomy agronomists for verified prescription.
                  </p>
                </div>
                <button
                  onClick={() => onEscalateToExpert(result, selectedImage || undefined)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.escalateToExpert}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                Ready for Visual Crop Diagnosis & Voice Reading
              </h3>
              <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
                Select one of the sample test cases or take a leaf photo with your camera on the left, then click "Diagnose Plant Disease" to run multimodal analysis with voice reading aloud.
              </p>
              <button
                onClick={handleRunDiagnosis}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition cursor-pointer"
              >
                Run Sample Diagnosis (Wheat Rust)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

