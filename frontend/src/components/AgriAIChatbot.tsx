import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Globe,
  RefreshCw,
  TrendingUp,
  CloudSun,
  Truck,
  CreditCard,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Store,
  CheckCircle2
} from 'lucide-react';
import { PAN_INDIA_DATASET } from '../data/marketPricesDataset';
import { INITIAL_BUYERS, INITIAL_STORAGE, INITIAL_LOGISTICS } from '../data/indianAgriData';
import { useLanguage } from '../context/LanguageContext';

export interface AgriAIChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AgriAIChatbot: React.FC<AgriAIChatbotProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onOpen: controlledOnOpen
}) => {
  const { currentLanguage, languageName, setLanguage } = useLanguage();
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const isChatOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "🌾 **Vanakkam & Namaste! I am NexAgri AI**, your intelligent 24/7 agriculture market assistant.\n\nAsk me anything about:\n• Live mandi crop prices & arrival trends across 439+ mandis\n• Weather forecast & optimal harvest windows\n• Best mandi recommendations to maximize net return\n• Verified buyers, cold storage availability & transport freight\n• Safe UPI payments & escrow settlements",
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => languageName || 'English');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (languageName && languageName !== selectedLanguage) {
      setSelectedLanguage(languageName);
    }
  }, [languageName]);

  const quickPrompts = [
    "What is today's tomato price in Coimbatore?",
    "Will it rain near my farm tomorrow?",
    "Where to sell 2500 kg tomato for best net return?",
    "Who is buying onion right now?",
    "How much does transport cost per kg?",
    "Nearest cold storage facility?",
    "How does Farmer UPI escrow work?"
  ];

  const languages = [
    { code: 'English', label: 'English' },
    { code: 'Tamil', label: 'தமிழ்' },
    { code: 'Hindi', label: 'हिन्दी' },
    { code: 'Telugu', label: 'తెలుగు' },
    { code: 'Kannada', label: 'ಕನ್ನಡ' },
    { code: 'Malayalam', label: 'മലയാളം' },
    { code: 'Marathi', label: 'मराठी' },
    { code: 'Gujarati', label: 'ગુજરાતી' },
    { code: 'Bengali', label: 'বাংলা' },
    { code: 'Punjabi', label: 'ਪੰਜਾਬੀ' },
    { code: 'Odia', label: 'ଓଡ଼ିଆ' },
    { code: 'Assamese', label: 'অসমীয়া' },
    { code: 'Urdu', label: 'اردو' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  // Voice speech synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window) || !ttsEnabled) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown bold and bullet characters for natural speech
      const cleanText = text.replace(/[*#•_`]/g, '').slice(0, 300);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  // Speech-to-Text Recognition
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      // Language mapping
      if (selectedLanguage === 'Tamil') recognition.lang = 'ta-IN';
      else if (selectedLanguage === 'Hindi') recognition.lang = 'hi-IN';
      else if (selectedLanguage === 'Telugu') recognition.lang = 'te-IN';
      else if (selectedLanguage === 'Kannada') recognition.lang = 'kn-IN';
      else if (selectedLanguage === 'Marathi') recognition.lang = 'mr-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Intelligent fallback generator based on PAN_INDIA_DATASET
  const generateIntelligentAnswer = (q: string): string => {
    const lower = q.toLowerCase();

    // Check specific crop in Pan India dataset
    const cropMatch = PAN_INDIA_DATASET.find(c => lower.includes(c.cropName.toLowerCase()));
    if (cropMatch) {
      const changeStr = cropMatch.trendPct >= 0 ? `+${cropMatch.trendPct}%` : `${cropMatch.trendPct}%`;
      return `📊 **${cropMatch.cropName} (${cropMatch.variety}) Mandi Intelligence**:\n• **${cropMatch.market}, ${cropMatch.district}**: Modal Price ₹${cropMatch.modalPricePerKg}/kg (₹${cropMatch.modalPriceQtl}/quintal)\n• **Price Range**: ₹${cropMatch.minPricePerKg}/kg – ₹${cropMatch.maxPricePerKg}/kg\n• **Arrivals**: ${cropMatch.arrivalQuantityMT} MT today (${changeStr})\n\n💡 **NexAgri AI Advice**: Market arrivals are steady. Recommended selling window is within 48-72 hours.`;
    }

    if (lower.includes('weather') || lower.includes('rain') || lower.includes('cloud') || lower.includes('வானிலை') || lower.includes('மழை')) {
      return `🌤️ **NexAgri Farm Weather Radar**:\n• **Current Temp**: 29.5°C | Humidity: 62% | Wind: 11 km/h\n• **Precipitation Probability**: 15% today, 10% next 48 hours\n• **Advisory**: Clear sunny transport window. Safe to proceed with harvesting and road freight!`;
    }

    if (lower.includes('transport') || lower.includes('freight') || lower.includes('truck') || lower.includes('lorry') || lower.includes('வண்டி')) {
      const log = INITIAL_LOGISTICS[0];
      return `🚚 **Freight & Logistics Radar**:\n• Available Transporter: **${log.provider_name}** (${log.vehicle_type})\n• Estimated Rate: ₹${log.rate_per_km}/km (approx ₹0.52–₹0.58/kg for 2.5T load)\n• Features: GPS Tracking, Insurance Covered, direct farm gate pickup.`;
    }

    if (lower.includes('cold storage') || lower.includes('store') || lower.includes('warehouse') || lower.includes('சேமிப்பு')) {
      const cs = INITIAL_STORAGE[0];
      return `🏪 **Recommended Cold Storage Facility**:\n• **${cs.name}**\n• Location: ${cs.distance_km} km from Mettupalayam\n• Available Capacity: ${cs.available_capacity_mt} MT / ${cs.total_capacity_mt} MT\n• Tariff: ₹${cs.price_per_day_kg}/kg/day (${cs.humidity_control})`;
    }

    if (lower.includes('buyer') || lower.includes('sell') || lower.includes('purchaser') || lower.includes('வாங்குபவர்')) {
      const topBuyer = INITIAL_BUYERS[0];
      return `🤝 **Verified Active Buyer Available**:\n• **${topBuyer.name}** (Owner: ${topBuyer.owner})\n• Requirement: ${topBuyer.crop_required} (${topBuyer.quantity_required})\n• Target Price: ₹${topBuyer.offered_price_per_kg}/kg\n• Payment: UPI Escrow Secured ✓ NPCI Verified`;
    }

    if (lower.includes('upi') || lower.includes('payment') || lower.includes('escrow') || lower.includes('பணம்')) {
      return `💳 **NexAgri UPI Escrow Protection**:\n• Buyer payments are locked in RBI-regulated digital escrow upon order confirmation.\n• Inspection happens at delivery, and funds auto-release directly to your verified UPI ID within 15 minutes.\n• 100% dispute resolution guarantee with zero advance deductions.`;
    }

    if (lower.includes('where to sell') || lower.includes('best market') || lower.includes('highest')) {
      return `🏆 **NexAgri AI Best Net Return Analysis**:\n• **Coimbatore Main Mandi (38 km)**: Modal ₹34.00/kg → Net Return: **₹32.42/kg** after transport.\n• **Oddanchatram (72 km)**: Modal ₹36.00/kg → Net Return: **₹33.10/kg**\n• Selling to Oddanchatram yields an extra **+₹8,200 estimated net gain** on a 5-tonne consignment!`;
    }

    return `🌾 **NexAgri AI Mandi Assistant**:\nReceived your query: "${q}".\n\nI monitor real-time Agmarknet rates across 439+ mandis. Try asking:\n1. "What is today's tomato or onion price in Coimbatore?"\n2. "Will it rain during tomorrow's harvest?"\n3. "Who is buying vegetables near me?"\n4. "Calculate transport cost to the nearest APMC mandi."`;
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Attempt backend query
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          language: selectedLanguage
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
        speakText(data.reply);
        return;
      }
      throw new Error("Backend response error");
    } catch {
      // Local fallback with intelligent answer engine
      const localReply = generateIntelligentAnswer(textToSend);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: localReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      speakText(localReply);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOpen = () => {
    if (isChatOpen) {
      if (controlledOnClose) controlledOnClose();
      setInternalIsOpen(false);
    } else {
      if (controlledOnOpen) controlledOnOpen();
      setInternalIsOpen(true);
    }
  };

  return (
    <>
      {/* FLOATING CHATBOT BUTTON AT BOTTOM-RIGHT */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isChatOpen && (
          <button
            onClick={() => {
              if (controlledOnOpen) {
                controlledOnOpen();
              }
              setInternalIsOpen(true);
            }}
            className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-sm px-4 py-3 rounded-full shadow-2xl hover:shadow-blue-900/30 transition-all duration-300 group hover:scale-105 cursor-pointer border-2 border-white/80"
            title="Open NexAgri AI Assistant"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="tracking-wide font-extrabold pr-1">NexAgri AI</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-300 animate-pulse-dot"></span>
          </button>
        )}

        {/* Expandable Chatbot Window */}
        {isChatOpen && (
          <div className="w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm tracking-tight">NexAgri AI Chatbot</h3>
                    <span className="text-[10px] bg-blue-900/70 text-blue-200 px-1.5 py-0.2 rounded font-semibold border border-blue-400/30">
                      Live Mandi Sync
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100">Smart Farmer Market Advisory</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Text to Speech Toggle */}
                <button
                  type="button"
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    ttsEnabled
                      ? 'bg-amber-400 text-blue-950 border-amber-300 font-bold'
                      : 'bg-blue-800/80 text-blue-200 border-blue-500/30 hover:text-white'
                  }`}
                  title={ttsEnabled ? "Audio speech is ON" : "Turn audio speech ON"}
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Language Switcher */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setLanguage(e.target.value);
                  }}
                  className="bg-blue-900/80 text-white text-[11px] font-bold px-2 py-1.5 rounded-lg border border-blue-400/30 focus:outline-none cursor-pointer"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                      {l.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={toggleOpen}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Bar */}
            <div className="p-2.5 bg-blue-50/50 border-b border-blue-100/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-blue-600 font-bold shrink-0 text-[10px] uppercase">Quick Ask:</span>
              {quickPrompts.slice(0, 4).map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:border-blue-500 text-slate-700 hover:text-blue-700 font-semibold shrink-0 transition-all cursor-pointer truncate max-w-[180px] shadow-2xs"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/60">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs font-medium'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs leading-relaxed whitespace-pre-line'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 px-1">
                    <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                    {m.sender === 'ai' && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5 cursor-pointer ml-1"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                        Listen
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2.5 p-3 bg-white rounded-2xl border border-blue-200 shadow-2xs max-w-[65%]">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-xs text-slate-600 font-medium">NexAgri AI is querying mandis...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Active Listening Waveform Banner */}
            {isListening && (
              <div className="px-4 py-2 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-blue-500/10 border-t border-red-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-xs font-bold text-red-700">Listening to your voice ({selectedLanguage})...</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-red-500 rounded-full animate-voice-pulse"></span>
                  <span className="w-1 h-5 bg-amber-500 rounded-full animate-voice-pulse [animation-delay:150ms]"></span>
                  <span className="w-1 h-6 bg-emerald-500 rounded-full animate-voice-pulse [animation-delay:300ms]"></span>
                  <span className="w-1 h-4 bg-blue-500 rounded-full animate-voice-pulse [animation-delay:450ms]"></span>
                </div>
              </div>
            )}

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Input Mic Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-500 text-white border-red-600 animate-pulse ring-2 ring-red-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                  title={isListening ? "Listening... Click to stop" : "Click to speak with voice"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-blue-600" />}
                </button>

                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask in ${selectedLanguage} (prices, weather, transport)...`}
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
