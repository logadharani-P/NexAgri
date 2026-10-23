import React from 'react';
import { Home, TrendingUp, Sprout, PackageCheck, Bot } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onOpenVoiceAI: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeNav,
  onSelectNav,
  onOpenVoiceAI
}) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', label: t.home || 'Home', icon: Home },
    { id: 'markets', label: t.marketPrices || 'Markets', icon: TrendingUp },
    { id: 'lots', label: t.myCrops || 'Sell Lots', icon: Sprout },
    { id: 'orders', label: t.orders || 'Orders', icon: PackageCheck },
    { id: 'ai', label: 'NexAgri AI', icon: Bot, isSpecial: true }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeNav === tab.id;

        if (tab.isSpecial) {
          return (
            <button
              key={tab.id}
              onClick={onOpenVoiceAI}
              className="flex flex-col items-center justify-center p-1 text-blue-600 font-extrabold text-[10px]"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md -mt-4 ring-4 ring-white">
                <Icon className="w-5 h-5 text-amber-300" />
              </div>
              <span className="mt-0.5">{tab.label}</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onSelectNav(tab.id)}
            className={`flex flex-col items-center justify-center p-1 text-[10px] font-bold transition-colors ${
              isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
            <span className="mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
