import React, { useState } from 'react';
import {
  Wheat,
  MapPin,
  Globe,
  Bell,
  Bot,
  User,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Search,
  Sprout,
  PackageCheck,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../data/translations';

interface NavbarProps {
  onOpenAIChat?: () => void;
  onOpenVoiceAI?: () => void;
  onSelectNav: (nav: string) => void;
  activeNav: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIChat, onOpenVoiceAI, onSelectNav }) => {
  const handleOpenAI = onOpenAIChat || onOpenVoiceAI || (() => {});
  const { user, role, setRole, isAuthenticated, logout } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: "Price Alert: Tomato", desc: "Coimbatore mandi price rose to ₹34/kg (+8.4%)", time: "10m ago", type: "price" },
    { id: 2, title: "Rain Radar Alert", desc: "Passing shower expected in 48h. Harvest ready crops.", time: "30m ago", type: "weather" },
    { id: 3, title: "Buyer Requisition", desc: "Kaveri Agro Foods seeking 15T Tomato @ ₹34/kg", time: "1h ago", type: "buyer" },
    { id: 4, title: "Pongal Festive Surge", desc: "Horticulture demand projected to increase 12-18%", time: "3h ago", type: "market" }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectNav('markets');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onSelectNav('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Wheat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">NEXAGRI</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                Smart Mandi
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block -mt-0.5">
              Farmer Linkage & Price Discovery Platform
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder || "Search crops, mandis, districts (e.g. Tomato, Coimbatore, Lasalgaon)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate max-w-[140px]">{user.village ? `${user.village}, ` : ''}{user.district || 'Coimbatore'}</span>
          </div>

          {/* AI Chatbot Button */}
          <button
            onClick={handleOpenAI}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3 sm:px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            title="Open NexAgri AI Assistant"
          >
            <Bot className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline">NexAgri AI</span>
            <span className="inline sm:hidden">AI</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowLangMenu(!showLangMenu); setShowProfileMenu(false); setShowNotifications(false); }}
              className="flex items-center gap-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-2 rounded-xl transition-colors border border-slate-200 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{LANGUAGES.find(l => l.code === currentLanguage)?.native}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-72 overflow-y-auto">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.selectLanguage || "Select Language"}
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 cursor-pointer ${
                      currentLanguage === lang.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-slate-400">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); setShowLangMenu(false); }}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{t.notifications || "Notifications & Alerts"}</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">4</span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                  >
                    {t.markAllRead || "Mark All Read"}
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors flex gap-3 items-start">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 mt-0.5 shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.desc}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. FARMER PROFILE IN TOP-RIGHT OF MAIN HEADER */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowLangMenu(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50 transition-all text-left shadow-2xs cursor-pointer"
            >
              {/* Farmer photo / icon */}
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 overflow-hidden border border-blue-500">
                <span>🌾</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full ring-1 ring-white"></span>
              </div>

              {/* Farmer Details */}
              <div className="hidden sm:block leading-tight">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-extrabold text-slate-900 truncate max-w-[120px]">
                    {user.name.split('(')[0].trim()}
                  </p>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                    {t.farmer || "Farmer"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate max-w-[120px] mt-0.5">
                  {user.district || 'Coimbatore'}
                </p>
              </div>

              {/* Small Dropdown Arrow */}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Farmer Info Header */}
                <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-transparent">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                      🌾
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-blue-800 font-semibold">{t.farmer || 'Farmer'} • {user.district || 'Coimbatore'}</p>
                      <p className="text-[10px] text-slate-500">{user.phone}</p>
                    </div>
                  </div>
                  {user.kisanId && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">{t.kisanId || "Kisan ID"}:</span>
                      <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{user.kisanId}</span>
                    </div>
                  )}
                </div>

                {/* 6 Required Profile Options */}
                <div className="py-1">
                  {/* 1. Profile */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSelectNav('profile');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-blue-700" />
                    <span>{t.profile || "Profile"}</span>
                  </button>

                  {/* 2. My Crops */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSelectNav('lots');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Sprout className="w-4 h-4 text-blue-700" />
                    <span>{t.myCrops || "My Crops"}</span>
                  </button>

                  {/* 3. My Orders */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSelectNav('orders');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer"
                  >
                    <PackageCheck className="w-4 h-4 text-blue-700" />
                    <span>{t.orders || "My Orders"}</span>
                  </button>

                  {/* 4. Payments */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSelectNav('payments');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-blue-700" />
                    <span>{t.payments || "Payments"}</span>
                  </button>

                  {/* 5. Settings */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSelectNav('profile');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-blue-700" />
                    <span>{t.settings || "Settings"}</span>
                  </button>
                </div>

                {/* 6. Logout */}
                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>{t.logout || "Logout"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
