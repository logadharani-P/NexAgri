import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Send,
  Volume2,
  Bot,
  Sparkles,
  Globe,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../data/translations';
import { apiService } from '../services/api';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { currentLanguage, setLanguage, speakText } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "🌾 **Vanakkam! I am NexAgri AI**, your multilingual agricultural market advisor.\nAsk me about today's mandi prices, whether to sell or wait, nearby buyers, cold storage availability, or freight cost.",
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "What is today's tomato price in Coimbatore?",
    "Should I sell tomato now or wait 2-3 days?",
    "Where is the nearest cold storage for carrots?",
    "Who is buying turmeric in Erode?",
    "How much does transport cost per kg?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

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

    const res = await apiService.askAIChat(textToSend, currentLanguage);

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: res.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);

    // Speak AI response aloud automatically
    speakText(res.reply);
  };

  // Web Speech API for voice recognition
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    const langMap: Record<string, string> = {
      en: 'en-IN',
      ta: 'ta-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      bn: 'bn-IN',
      pa: 'pa-IN',
      or: 'or-IN',
      as: 'as-IN',
      ur: 'ur-IN'
    };

    recognition.lang = langMap[currentLanguage] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setInputQuery(speechResult);
      setIsListening(false);
      handleSend(speechResult);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl flex flex-col h-[650px] relative overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-blue-200">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base">Ask NexAgri AI (Voice & Multilingual)</h3>
                <span className="bg-blue-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  AI Online
                </span>
              </div>
              <p className="text-xs text-blue-100">
                13 Indian Languages • Real-time Mandi Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector in Chat */}
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-blue-950/80 text-blue-200 text-xs font-bold rounded-xl px-2.5 py-1.5 border border-blue-600/40 focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-slate-900">
                  {l.native} ({l.name})
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="font-bold text-slate-500 shrink-0">Quick Ask:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 px-3 py-1 rounded-xl shrink-0 font-medium transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => {
            const isAI = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 text-xs">
                    🌾
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl ${
                    isAI
                      ? 'bg-slate-100 text-slate-900 border border-slate-200/80 rounded-tl-sm'
                      : 'bg-blue-600 text-white font-medium rounded-tr-sm shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {m.text}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-slate-200/50 text-[10px] opacity-70">
                    <span>{m.timestamp}</span>
                    {isAI && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="hover:underline flex items-center gap-1 font-semibold"
                        title="Play voice readout"
                      >
                        <Volume2 className="w-3 h-3" /> Read aloud
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs italic">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              NexAgri AI is analyzing Agmarknet feeds and weather radar...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl transition-all shadow-sm ${
                isListening
                  ? 'bg-red-500 text-white animate-bounce'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300'
              }`}
              title={isListening ? "Listening... click to stop" : "Speak in regional language"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? "Listening... speak now in your language" : "Ask question or speak in Tamil, Hindi, English..."}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
