import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  RefreshCw,
  HelpCircle,
  MapPin,
  Leaf,
  Globe,
  Check
} from 'lucide-react';
import { AiChatMessage, AppLanguage, Crop, Farm, WeatherData } from '../types';
import { TRANSLATIONS } from '../lib/translations';

export const CHAT_LANGUAGES: Array<{
  code: AppLanguage;
  label: string;
  native: string;
  flag: string;
  voiceLang: string;
}> = [
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', voiceLang: 'hi-IN' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🚩', voiceLang: 'mr-IN' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🌾', voiceLang: 'pa-IN' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🌿', voiceLang: 'gu-IN' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🌱', voiceLang: 'te-IN' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🌴', voiceLang: 'ta-IN' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '☘️', voiceLang: 'kn-IN' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🍃', voiceLang: 'bn-IN' },
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧', voiceLang: 'en-IN' }
];

const PROMPTS_BY_LANG: Record<AppLanguage, string[]> = {
  hi: [
    'क्या आज गेहूं / फसल में सिंचाई करनी चाहिए?',
    'पत्तियों पर पीले धब्बे आ रहे हैं, क्या उपाय करें?',
    'कलोल अवस्था में यूरिया व उर्वरक की कितनी मात्रा डालें?',
    'माहू और सफेद मक्खी से बचाव के जैविक उपाय बताएं'
  ],
  mr: [
    'आज शेतात पाणी द्यावे का?',
    'पाने पिवळी पडत आहेत, काय उपाय करावा?',
    'फवारणीसाठी आजची हवा योग्य आहे का?',
    'मावा व तुडतुडे नियंत्रणासाठी सेंद्रिय उपाय सांगा'
  ],
  pa: [
    'ਕੀ ਅੱਜ ਖੇਤ ਨੂੰ ਪਾਣੀ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?',
    'ਪੱਤੇ ਪੀਲੇ ਪੈ ਰਹੇ ਹਨ, ਕੀ ਇਲਾਜ ਕਰੀਏ?',
    'ਫਸਲ ਲਈ ਯੂਰੀਆ ਦੀ ਸਹੀ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?',
    'ਚੂਸਣ ਵਾਲੇ ਕੀੜਿਆਂ ਲਈ ਜੈਵਿਕ ਦਵਾਈ ਦੱਸੋ'
  ],
  gu: [
    'શું આજે પાકમાં પિયત આપવું જોઈએ?',
    'પાન પીળા પડી રહ્યા છે, શું ઉપાય કરવો?',
    'ખાતરનો યોગ્ય ડોઝ શું હોવો જોઈએ?',
    'જીવાત અને મોલો-મશી માટે ઓર્ગેનિક દવા જણાવો'
  ],
  te: [
    'ఈ రోజు పంటకు నీరు పెట్టవచ్చా?',
    'ఆకులు పసుపు రంగులోకి మారుతున్నాయి, నివారణ ఏమిటి?',
    'ఈ దశలో యూరియా ఎంత వేయాలి?',
    'రసం పీల్చే పురుగులకు సేంద్రీయ మందులు చెప్పండి'
  ],
  ta: [
    'இன்று பயிருக்கு பாசனம் செய்யலாமா?',
    'இலைகள் மஞ்சள் நிறமாக மாறுகின்றன, என்ன தீர்வு?',
    'இப்போது எவ்வளவு உரம் இட வேண்டும்?',
    'சாறு உறிஞ்சும் பூச்சிகளுக்கு இயற்கை மருந்து என்ன?'
  ],
  kn: [
    'ಇಂದು ಹೊಲಕ್ಕೆ ನೀರು ಕೊಡಬೇಕೆ?',
    'ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ, ಏನು ಪರಿಹಾರ?',
    'ಈ ಹಂತದಲ್ಲಿ ರಸಗೊಬ್ಬರ ಎಷ್ಟು ಪ್ರಮಾಣದಲ್ಲಿ ಹಾಕಬೇಕು?',
    'ರಸಹೀರುವ ಕೀಟಗಳಿಗೆ ಸಾವಯವ ಔಷಧಿ ತಿಳಿಸಿ'
  ],
  bn: [
    'আজ জমিতে সেচ দেওয়া কি ঠিক হবে?',
    'পাতা হলুদ হয়ে যাচ্ছে, কী প্রতিকার করব?',
    'এই সময় কতটা ইউরিয়া সার দেব?',
    'চোষক পোকার জন্য জৈব কীটনাশকের উপায় বলুন'
  ],
  en: [
    'Should I irrigate today based on the weather forecast?',
    'Leaves are turning yellow from the tip, what deficiency is this?',
    'What is the recommended fertilizer split for this growth stage?',
    'Organic homemade remedy for sucking pests and aphids'
  ]
};

const PLACEHOLDER_BY_LANG: Record<AppLanguage, string> = {
  hi: 'अपनी भाषा में सवाल पूछें (जैसे: आज खाद कब डालें?)...',
  mr: 'आपल्या भाषेत प्रश्न विचारा (उदा: आज पाणी द्यावे का?)...',
  pa: 'ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਵਾਲ ਪੁੱਛੋ (ਜਿਵੇਂ: ਕੀਟਾਂ ਤੋਂ ਕਿਵੇਂ ਬਚੀਏ?)...',
  gu: 'તમારી ભાષામાં પ્રશ્ન પૂછો (દા.ત: પિયત ક્યારે આપવું?)...',
  te: 'మీ భాషలో ప్రశ్న అడగండి (ఉదా: ఎరువులు ఎప్పుడు వేయాలి?)...',
  ta: 'உங்கள் மொழியில் கேள்வி கேளுங்கள் (எ.கா: உரம் எப்போது இட வேண்டும்?)...',
  kn: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ (ಉದಾ: ನೀರು ಯಾವಾಗ ಕೊಡಬೇಕು?)...',
  bn: 'নিজের ভাষায় প্রশ্ন জিজ্ঞাসা করুন (যেমন: আজ সার কখন দেব?)...',
  en: 'Ask in your preferred language (e.g. When to apply fertilizer?)...'
};

interface AiChatViewProps {
  farm: Farm | null;
  crop: Crop | null;
  weather: WeatherData | null;
  language: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
  messages: AiChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  loading: boolean;
}

export const AiChatView: React.FC<AiChatViewProps> = ({
  farm,
  crop,
  weather,
  language,
  onLanguageChange,
  messages,
  onSendMessage,
  loading
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeLangConfig =
    CHAT_LANGUAGES.find((l) => l.code === language) || CHAT_LANGUAGES[0];

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Web Speech Recognition (Voice Input)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. You can type your query in the input box.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Select speech recognition language mapped to farmer's selected language
      recognition.lang = activeLangConfig.voiceLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text to Speech in selected language
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = activeLangConfig.voiceLang;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    setInputText('');
    await onSendMessage(query);
  };

  // Quick Prompt Pills for the active language
  const promptPills = PROMPTS_BY_LANG[language] || PROMPTS_BY_LANG.en;
  const currentPlaceholder = PLACEHOLDER_BY_LANG[language] || t.askQuestionPlaceholder;

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Top Farm Context Header */}
      <div className="bg-emerald-900 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center space-x-2">
              <span>{t.navChat}</span>
              <span className="text-[10px] bg-emerald-700 text-emerald-200 px-1.5 py-0.5 rounded font-mono">
                Multilingual AI
              </span>
            </h2>
            <div className="text-xs text-emerald-200 flex items-center space-x-2 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{farm ? `${farm.name} (${farm.district})` : 'General Indian Agriculture'}</span>
              {crop && (
                <>
                  <span>•</span>
                  <span>{crop.name} ({crop.currentStage})</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800 self-start sm:self-auto">
          {weather ? `🌤️ ${weather.current.temperature}°C, ${weather.current.weatherDescription}` : 'Live Meteorological Sync'}
        </div>
      </div>

      {/* Prominent Language Selector Banner */}
      <div className="bg-white rounded-2xl p-3.5 border border-emerald-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span>Select Your Language</span>
                <span className="text-[11px] font-normal text-slate-500">(आपली / अपनी भाषा निवडा)</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                🤖 Chatbot answers in:{' '}
                <span className="font-bold underline decoration-emerald-400">
                  {activeLangConfig.native} ({activeLangConfig.label})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Pill Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CHAT_LANGUAGES.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => onLanguageChange?.(item.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center space-x-1 border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-300'
                      : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border-slate-200'
                  }`}
                  title={`Switch Chat to ${item.native} (${item.label})`}
                >
                  <span className="text-xs">{item.flag}</span>
                  <span>{item.native}</span>
                  {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[530px] overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                {activeLangConfig.native}: Ask in {activeLangConfig.label}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Ask about irrigation, fertilizer dosage, crop diseases, pest remedies, or market timing in {activeLangConfig.native}. KrishiAI will reply in {activeLangConfig.native}.
              </p>

              {/* Sample Prompt Pills in Selected Language */}
              <div className="pt-3 max-w-xl mx-auto">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Suggested Questions ({activeLangConfig.native})
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {promptPills.map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(pill)}
                      className="text-xs bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl transition text-left"
                    >
                      💡 {pill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-700" />}
                </div>

                <div className={`max-w-[82%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-700 text-white rounded-tr-none'
                        : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}

                    {msg.sender === 'assistant' && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-slate-400 text-xs">
                        <span className="text-[10px] text-emerald-700 font-medium flex items-center space-x-1">
                          <span>🌐 {activeLangConfig.native}</span>
                        </span>
                        <button
                          onClick={() => handleSpeakText(msg.text)}
                          title={`Listen in ${activeLangConfig.label}`}
                          className="hover:text-emerald-700 transition p-1 flex items-center space-x-1 text-slate-500"
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-4 h-4 text-emerald-600 animate-pulse" />
                              <span className="text-[10px] text-emerald-700 font-bold">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4 text-slate-600" />
                              <span className="text-[10px]">Listen ({activeLangConfig.native})</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Follow-up Suggested Question Chips */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedQuestions.map((sq, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sq)}
                          className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg transition"
                        >
                          👉 {sq}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl max-w-sm animate-pulse border border-emerald-200">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
              <span>
                KrishiAI is generating response in{' '}
                <strong>{activeLangConfig.native} ({activeLangConfig.label})</strong>...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
          {isListening && (
            <div className="mb-2 p-2 bg-emerald-100 text-emerald-900 rounded-xl text-xs flex items-center space-x-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>
                {t.listening} (Listening in <strong>{activeLangConfig.native}</strong>...)
              </span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              title={`Voice Input in ${activeLangConfig.native} (${activeLangConfig.voiceLang})`}
              className={`p-2.5 rounded-xl border transition ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 shadow-md animate-pulse'
                  : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-300'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-600" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={currentPlaceholder}
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow transition disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
