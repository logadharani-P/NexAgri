import React, { createContext, useContext, useState, useMemo } from 'react';
import { LANGUAGES, TRANSLATIONS, TranslationDict } from '../data/translations';

export type Translator = TranslationDict & ((key: string, fallback?: string) => string);

interface LanguageContextType {
  currentLanguage: string;
  languageName: string;
  setLanguage: (lang: string) => void;
  t: Translator;
  speakText: (text: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Map common labels to translation dictionary keys for flexible lookup
const LABEL_KEY_MAP: Record<string, keyof TranslationDict> = {
  'home': 'home',
  'indian market prices': 'marketPrices',
  'market prices': 'marketPrices',
  'markets': 'marketPrices',
  'my crops & lots': 'myCrops',
  'my crops': 'myCrops',
  'find verified buyers': 'findBuyers',
  'find buyers': 'findBuyers',
  'active orders': 'orders',
  'orders': 'orders',
  'upi & bank payments': 'payments',
  'payments': 'payments',
  'crop insurance': 'insurance',
  'cold storage & mandis': 'storage',
  'storage': 'storage',
  'farm logistics': 'logistics',
  'logistics': 'logistics',
  'interactive market map': 'marketMap',
  'market map': 'marketMap',
  'voice ai assistant': 'aiAssistant',
  'ai assistant': 'aiAssistant',
  'ai chatbot': 'aiChatbot',
  'disputes & grievances': 'disputes',
  'disputes': 'disputes',
  'farmer profile': 'profile',
  'profile': 'profile',
  'settings': 'settings',
  'logout': 'logout',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    const saved = localStorage.getItem('nexagri_language') || 'en';
    // Normalize if someone saved a name instead of a code
    const matched = LANGUAGES.find(l => l.code === saved || l.name.toLowerCase() === saved.toLowerCase());
    return matched ? matched.code : 'en';
  });

  const setLanguage = (langInput: string) => {
    if (!langInput) return;
    // Support either code ('ta') or name ('Tamil')
    const matched = LANGUAGES.find(
      l => l.code.toLowerCase() === langInput.toLowerCase() || l.name.toLowerCase() === langInput.toLowerCase()
    );
    const code = matched ? matched.code : langInput;
    setCurrentLanguage(code);
    try {
      localStorage.setItem('nexagri_language', code);
    } catch {
      // ignore
    }
  };

  const currentLangObj = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];
  const languageName = currentLangObj.name;

  const t = useMemo<Translator>(() => {
    const activeDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
    const fallbackDict = TRANSLATIONS['en'];

    const translatorFunc = (key: string, fallback?: string): string => {
      if (!key) return fallback || '';
      // 1. Direct property match in activeDict
      if (key in activeDict) {
        return (activeDict as any)[key];
      }
      // 2. Normalized lowercase lookup
      const normalized = key.trim().toLowerCase();
      const mappedKey = LABEL_KEY_MAP[normalized];
      if (mappedKey && activeDict[mappedKey]) {
        return activeDict[mappedKey];
      }
      // 3. Check in fallback dictionary
      if (mappedKey && fallbackDict[mappedKey]) {
        return fallbackDict[mappedKey];
      }
      if (key in fallbackDict) {
        return (fallbackDict as any)[key];
      }
      return fallback !== undefined ? fallback : key;
    };

    // Attach all properties of activeDict onto translatorFunc so t.greeting, t.home etc work
    return Object.assign(translatorFunc, activeDict) as Translator;
  }, [currentLanguage]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // stop previous speech
      const cleanText = text.replace(/[*#•_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const langObj = LANGUAGES.find(l => l.code === currentLanguage);
      utterance.lang = langObj?.langTag || 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore speech errors
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, languageName, setLanguage, t, speakText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
