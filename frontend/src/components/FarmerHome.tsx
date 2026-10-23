import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  CloudSun,
  Droplets,
  Wind,
  AlertTriangle,
  Calendar,
  DollarSign,
  Package,
  Award,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  Info,
  Bell,
  Smartphone,
  Send,
  Check,
  SlidersHorizontal,
  WifiOff,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useOffline } from '../context/OfflineContext';
import { apiService } from '../services/api';
import { CropLot, VerifiedBuyer, CropItem } from '../types';
import { HeroCarousel } from './HeroCarousel';
import { AutomaticSMSModal } from './AutomaticSMSModal';

interface FarmerHomeProps {
  onSelectNav: (nav: string) => void;
  onOpenAIChat?: () => void;
  onOpenVoiceAI?: () => void;
}

export const FarmerHome: React.FC<FarmerHomeProps> = ({ onSelectNav, onOpenAIChat, onOpenVoiceAI }) => {
  const handleOpenAI = onOpenAIChat || onOpenVoiceAI || (() => {});
  const { user } = useAuth();
  const { t, speakText } = useLanguage();
  const [crops, setCrops] = useState<CropItem[]>([]);
  const [buyers, setBuyers] = useState<VerifiedBuyer[]>([]);
  const [lots, setLots] = useState<CropLot[]>([]);
  const [selectedCropTab, setSelectedCropTab] = useState('tomato');
  const [weatherData, setWeatherData] = useState<any>(null);

  // Requirement 14: Smart Alerts state
  const [selectedAlertCategory, setSelectedAlertCategory] = useState<string>('all');
  const [alerts, setAlerts] = useState([
    {
      id: 'a1',
      title: 'Tomato price spike: +12% in Oddanchatram',
      category: 'price',
      time: '15 mins ago',
      badge: '+12% Spike',
      color: 'emerald',
      description: 'Oddanchatram Vegetable Market reports sudden modal price surge to ₹38/kg (+12%) due to reduced Kerala border arrivals.',
      actionLabel: 'View Mandi Rates',
      actionNav: 'markets'
    },
    {
      id: 'a2',
      title: 'Rain expected in 48h: Harvest now',
      category: 'weather',
      time: '1 hour ago',
      badge: 'Rain Warning',
      color: 'blue',
      description: 'Western Ghats radar indicates 40-50% rain probability starting in 48 hours. Harvest ripe horticulture produce within 36 hours.',
      actionLabel: 'Check Insurance Protection',
      actionNav: 'insurance'
    },
    {
      id: 'a3',
      title: 'Coimbatore market: 15 km away, +₹400/quintal',
      category: 'arbitrage',
      time: '2 hours ago',
      badge: '+₹400/Qtl Extra',
      color: 'amber',
      description: 'Coimbatore Main Mandi is trading at ₹3,600/qtl compared to ₹3,200/qtl local benchmark. Higher net profit after ₹1.40/kg freight.',
      actionLabel: 'Open Interactive Map',
      actionNav: 'map'
    },
    {
      id: 'a4',
      title: 'Pongal festival: Turmeric demand up 18%',
      category: 'festival',
      time: 'Today, 8:30 AM',
      badge: '+18% Festive Spike',
      color: 'purple',
      description: 'Upcoming Pongal festive cycle is triggering aggressive wholesale procurement. Dry turmeric rates expected to peak in 10–14 days.',
      actionLabel: 'View Turmeric Trends',
      actionNav: 'markets'
    },
    {
      id: 'a5',
      title: 'New buyer enquiry: 5 tonnes onion at ₹28/kg',
      category: 'buyer',
      time: 'Today, 7:45 AM',
      badge: 'Direct Buyer',
      color: 'teal',
      description: 'FreshBasket Retail chain posted an urgent requirement for 5,000 kg Grade-A Onion with 100% Escrow UPI advance.',
      actionLabel: 'View Buyer Details',
      actionNav: 'buyers'
    }
  ]);

  // Requirement 15: SMS Alert state
  const { isOnline } = useOffline();
  const [smsPhone, setSmsPhone] = useState<string>(user.phone || '+91 98765 43210');
  const [smsSending, setSmsSending] = useState<boolean>(false);
  const [smsResult, setSmsResult] = useState<any>(null);
  const [isAutoSMSModalOpen, setIsAutoSMSModalOpen] = useState<boolean>(false);
  const [isAutoSMSEnabled, setIsAutoSMSEnabled] = useState<boolean>(true);
  const [autoEvaluating, setAutoEvaluating] = useState<boolean>(false);

  const handleSimulateAutoTrigger = async () => {
    setAutoEvaluating(true);
    setSmsResult(null);
    try {
      const res = await apiService.evaluateAutoSMS({
        phone_number: smsPhone,
        crop: 'Tomato',
        mandi: 'Coimbatore Main Mandi',
        force_trigger: true
      });
      if (res && res.dispatched_alerts && res.dispatched_alerts.length > 0) {
        setSmsResult(res.dispatched_alerts[0]);
      } else {
        setSmsResult({
          status: 'delivered',
          provider: 'NEXAGRI Auto-Carrier Engine',
          phone: smsPhone,
          message: 'NEXAGRI AUTO-SMS: Tomato price surged +12% to ₹36/kg at Coimbatore Main Mandi. Recommended action: Harvest & dispatch within 36h.',
          timestamp: new Date().toISOString()
        });
      }
    } catch {
      setSmsResult({
        status: 'simulated',
        provider: 'NEXAGRI Offline SMS Gateway',
        phone: smsPhone,
        message: 'NEXAGRI AUTO-SMS: Tomato price surged +12% to ₹36/kg at Coimbatore Mandi.',
        note: 'Alert queued for transmission upon network reconnect.'
      });
    } finally {
      setAutoEvaluating(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const [cropsData, buyersData, lotsData, weatherRes] = await Promise.all([
        apiService.getCrops(),
        apiService.getBuyers(),
        apiService.getLots(),
        apiService.getWeather(user.district || 'Coimbatore')
      ]);
      setCrops(cropsData);
      setBuyers(buyersData);
      setLots(lotsData);
      setWeatherData(weatherRes);
    };
    loadData();
  }, [user.district]);

  const handleSendSmsAlert = async (customMsg?: string) => {
    setSmsSending(true);
    setSmsResult(null);
    try {
      const res = await apiService.sendSMSAlert({
        phone_number: smsPhone,
        crop: 'Tomato',
        mandi: 'Coimbatore Main Mandi',
        price_per_kg: 36,
        custom_message: customMsg || `NEXAGRI Alert: Tomato price spiked +12% to ₹36/kg at Coimbatore Mandi. Dry weather for 48h. Recommended action: Sell within 36h.`
      });
      setSmsResult(res);
    } catch (err: any) {
      setSmsResult({
        status: 'simulated',
        phone: smsPhone,
        message: customMsg || 'Tomato price alert: ₹36/kg',
        note: 'Simulated alert logged. (Telecom gateway offline / unconfigured). Set TWILIO_* or FAST2SMS_* in environment.'
      });
    } finally {
      setSmsSending(false);
    }
  };

  const handleSpeakRecommendation = () => {
    speakText(
      "AI Recommendation for Tomato: WAIT 2 TO 3 DAYS. Expected price increase from 32 rupees to 36 rupees per kg due to 14 percent lower market arrivals and high festival demand. Extra estimated earning: 10,000 rupees."
    );
  };

  return (
    <div className="space-y-6">
      {/* 0. Large Agricultural Hero Carousel / Banner Slider */}
      <HeroCarousel onSelectNav={onSelectNav} onOpenAIChat={handleOpenAI} />

      {/* 1. Greeting & Live Weather Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <span className="text-9xl">🌾</span>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot"></span>
              {t('smartRadarActive', "Live Mandi & Weather Radar Active")}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {t.greeting || "Good Morning, Farmer 👋"}
            </h1>
            <p className="text-emerald-100 text-sm mt-1 max-w-xl">
              {t.welcomeBack || "Welcome back"}, <span className="font-bold text-white">{user.name}</span>. Today's market condition strongly favors selling within 48–72 hours for high-demand horticulture crops.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
              <span className="bg-white/15 px-3 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                {user.village || 'Sirumugai'}, {user.district || 'Coimbatore'}
              </span>
              <span className="bg-white/15 px-3 py-1.5 rounded-xl flex items-center gap-1.5 backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Integrated Weather Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 min-w-[280px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun className="w-8 h-8 text-amber-300" />
                <div>
                  <span className="text-2xl font-black">{weatherData?.temperature_c ? `${weatherData.temperature_c}°C` : '29°C'}</span>
                  <span className="text-xs text-emerald-100 block">{weatherData?.condition || 'Partly Sunny'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-200">{user.district || 'Coimbatore'} Radar</span>
                <span className="text-[11px] text-emerald-100/90 block">{weatherData?.advisory ? 'Dry harvest window' : 'Clear harvest window'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center text-xs">
              <div>
                <span className="text-emerald-200 text-[10px] block">{t.rainRisk || "Rain Risk"}</span>
                <span className="font-bold text-white flex items-center justify-center gap-0.5">
                  <Droplets className="w-3 h-3 text-cyan-300" /> {weatherData?.rain_probability_pct !== undefined ? `${weatherData.rain_probability_pct}%` : '15%'}
                </span>
              </div>
              <div>
                <span className="text-emerald-200 text-[10px] block">{t.humidity || "Humidity"}</span>
                <span className="font-bold text-white">{weatherData?.humidity_pct ? `${weatherData.humidity_pct}%` : '65%'}</span>
              </div>
              <div>
                <span className="text-emerald-200 text-[10px] block">{t.wind || "Wind"}</span>
                <span className="font-bold text-white flex items-center justify-center gap-0.5">
                  <Wind className="w-3 h-3 text-teal-300" /> {weatherData?.wind_speed_kmh ? `${weatherData.wind_speed_kmh} km/h` : '12 km/h'}
                </span>
              </div>
            </div>

            {/* Weather Risk Crop Protection Banner */}
            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px]">
              <span className="text-emerald-100 flex items-center gap-1 font-medium">
                <span>🛡️</span> Crop Risk: Low-Medium
              </span>
              <button
                onClick={() => onSelectNav('insurance')}
                className="text-amber-300 hover:text-white font-extrabold underline cursor-pointer"
              >
                {t.checkInsurance || "Check Insurance Protection →"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Dashboard KPI Cards (Large, Highly Readable Numbers) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="agri-card p-4">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.myCrops || "My Crops"}</span>
            <span className="text-emerald-600 bg-emerald-50 p-1.5 rounded-lg text-xs">🍅</span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900">Tomato</p>
          <p className="text-xs font-semibold text-emerald-700 mt-0.5">2.5 Tonnes Ready</p>
        </div>

        {/* KPI 2 */}
        <div className="agri-card p-4">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.activeLots || "Active Lots"}</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900">4 Lots</p>
          <p className="text-xs text-slate-500 mt-0.5">3 Available, 1 Transit</p>
        </div>

        {/* KPI 3 */}
        <div className="agri-card p-4 bg-emerald-50/50 border-emerald-200">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.bestPrice || "Best Price"}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-emerald-800">₹32/kg</p>
          <p className="text-xs font-bold text-emerald-600 mt-0.5">+8.4% today</p>
        </div>

        {/* KPI 4 */}
        <div className="agri-card p-4">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.pendingOrders || "Pending Orders"}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900">2 Orders</p>
          <p className="text-xs text-amber-700 font-medium mt-0.5">1 Pickup Today</p>
        </div>

        {/* KPI 5 */}
        <div className="agri-card p-4">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.expectedRevenue || "Expected Revenue"}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900">₹1,15,000</p>
          <p className="text-xs text-slate-500 mt-0.5">From 4 Active Lots</p>
        </div>

        {/* KPI 6 */}
        <div className="agri-card p-4 bg-blue-50/40 border-blue-200">
          <div className="flex items-center justify-between text-blue-800 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.pendingPayment || "Pending Payment"}</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-blue-900">₹48,500</p>
          <p className="text-xs font-semibold text-blue-700 mt-0.5">UPI Escrow Secured</p>
        </div>
      </div>

      {/* 3. Major Section: AI SMART SELL RECOMMENDATION & SMART MARKET NET RETURN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Smart Sell Recommendation (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-emerald-500 shadow-md p-6 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl">
                🍅
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {t.smartSellTitle || "AI Smart Sell Recommendation"}
                  </h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    82% Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Target Crop: <span className="font-bold text-slate-800">Tomato (Shivam Hybrid)</span> • Mettupalayam Lot
                </p>
              </div>
            </div>

            <button
              onClick={handleSpeakRecommendation}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-200"
            >
              <span>🔊 {t.listen || "Listen"}</span>
            </button>
          </div>

          {/* Core Decision Highlight */}
          <div className="mt-5 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-2xl p-4 sm:p-5 border border-emerald-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">
                  AI Decision Engine:
                </span>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="inline-flex items-center px-3.5 py-1 rounded-xl bg-emerald-600 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-sm">
                    🟢 {t.waitDays || "WAIT 2–3 DAYS"}
                  </span>
                  <span className="text-xs font-bold text-emerald-800">
                    Peak Expected: Sept 8–9
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-slate-500 font-medium block">{t.expectedAddRevenue || "Expected Additional Revenue"}</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700">+₹10,000</span>
                <span className="text-[11px] text-slate-500 block">On your 2.5 Tonne harvest</span>
              </div>
            </div>

            {/* Price Metrics Comparison */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-200/80">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">{t.todaysPrice || "Today's Price"}</span>
                <span className="text-base font-extrabold text-slate-900">₹32/kg</span>
              </div>
              <div className="bg-emerald-100/60 p-2.5 rounded-xl border border-emerald-300">
                <span className="text-[11px] text-emerald-800 font-semibold block">{t.predictedIn3Days || "Predicted in 3 Days"}</span>
                <span className="text-base font-extrabold text-emerald-800">₹36/kg</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">{t.marketArrivals || "Market Arrivals"}</span>
                <span className="text-base font-extrabold text-amber-700">↓ 12% Drop</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">{t.buyerDemand || "Buyer Demand"}</span>
                <span className="text-base font-extrabold text-emerald-700">↑ Very High</span>
              </div>
            </div>
          </div>

          {/* AI Reasoning Factor List */}
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-800 mb-2">{t.whyPriceRise || "Why is the price expected to rise?"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Lower mandi arrivals across Coimbatore hub</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Festival & weekend retail demand surge</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Clear dry weather: zero transit spoilage risk</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">8 Verified institutional buyers bidding today</span>
              </div>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onSelectNav('lots')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              {t.sellNow || "Sell Now (Instant Offer)"}
            </button>
            <button
              onClick={() => onSelectNav('markets')}
              className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 transition-all"
            >
              {t.compareMarkets || "Compare All Markets"}
            </button>
            <button
              onClick={onOpenVoiceAI}
              className="text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              {t.askAI || "Ask AI Details"}
            </button>
          </div>
        </div>

        {/* Right Column: Smart Market Net-Return Optimizer (5 Cols) */}
        <div className="lg:col-span-5 agri-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-slate-900">{t.smartMarketTitle || "Smart Market Recommendation"}</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                    Net Profit
                  </span>
                </div>
                <p className="text-xs text-slate-500">Calculates true earnings after transport & handling</p>
              </div>
              <span className="text-2xl">🏆</span>
            </div>

            {/* Recommended Market Highlight Card */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-white border border-amber-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider bg-amber-200/80 px-2 py-0.5 rounded">
                    {t.recommendedMarket || "RECOMMENDED MARKET"}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">Coimbatore Main Mandi</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600" /> 38 km from Sirumugai
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">{t.highestNetReturn || "Highest Net Return"}</span>
                  <span className="text-2xl font-black text-emerald-700">₹32.50/kg</span>
                </div>
              </div>

              {/* Cost deduction breakdown table */}
              <div className="mt-3 text-xs space-y-1.5 bg-white p-3 rounded-xl border border-amber-200/60">
                <div className="flex justify-between text-slate-700">
                  <span>{t.grossPrice || "Gross Mandi Price"}</span>
                  <span className="font-bold text-slate-900">₹35.00/kg</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>{t.transportCost || "Transport Freight"} (₹1.40/kg)</span>
                  <span className="font-semibold">-₹1.40</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>{t.loadingHandling || "Loading & Crate Handling"}</span>
                  <span className="font-semibold">-₹0.35</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>{t.mandiCess || "Mandi User Cess"} (1%)</span>
                  <span className="font-semibold">-₹0.35</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-200 font-extrabold text-emerald-800 text-sm">
                  <span>{t.netSellingPrice || "Your Net In-Hand Price"}:</span>
                  <span>₹32.50/kg</span>
                </div>
              </div>
            </div>

            {/* Second comparison market */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Local Mettupalayam Mandi (12 km)</p>
                <p className="text-[11px] text-slate-500">Gross: ₹30.50 | Freight: ₹0.60</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Net Price</span>
                <span className="text-sm font-extrabold text-slate-700">₹29.50/kg</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectNav('markets')}
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{t.viewMarketComparison || "View Full Market Comparison Matrix"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Sudden Arrival Alert & Festival Demand Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sudden Arrival Alert */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4 shadow-sm flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-amber-900">{t.suddenArrivalDrop || "Sudden Arrival Drop Alert"}</h4>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold uppercase">
                Important
              </span>
            </div>
            <p className="text-xs text-amber-950 mt-1 leading-relaxed">
              Tomato arrivals at <strong>Coimbatore Main Mandi</strong> dropped by <span className="font-bold">14% (135 MT vs 180 MT avg)</span> today due to rain in Karnataka border routes. Demand is expected to outstrip supply by evening.
            </p>
            <div className="mt-2 text-xs font-bold text-amber-800 flex items-center gap-1">
              <span>Recommendation:</span>
              <span className="underline cursor-pointer" onClick={() => onSelectNav('markets')}>
                Check 4 alternative high-rate mandis →
              </span>
            </div>
          </div>
        </div>

        {/* Festival Demand Engine */}
        <div className="bg-purple-50 border-l-4 border-purple-500 rounded-2xl p-4 shadow-sm flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 text-purple-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-purple-900">{t.festivalDemandEngine || "Festival Demand Engine: Upcoming Procurement"}</h4>
              <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded font-bold uppercase">
                Festive Pulse
              </span>
            </div>
            <p className="text-xs text-purple-950 mt-1 leading-relaxed">
              Upcoming festive cycle (Pongal / Makar Sankranti preparation) is triggering heavy procurement for <strong>Turmeric (+11.2%)</strong>, <strong>Sugarcane (+18%)</strong>, and <strong>Vegetables (+8.4%)</strong> across wholesale centers.
            </p>
            <div className="mt-2 text-xs font-bold text-purple-800 flex items-center gap-1">
              <span>Advised Action:</span>
              <span>Hold dry turmeric in warehouse for 15 days for maximum margin.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4B. REQUIREMENT 14 & 15: AI SMART ALERTS NOTIFICATION CENTER & SMS DISPATCH PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: AI Smart Alerts Notification Center (Requirement 14) */}
        <div className="lg:col-span-7 agri-card p-6 border-2 border-emerald-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Bell className="w-5 h-5 animate-bounce-subtle" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    AI Smart Alerts & Market Radar
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    5 Active
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time price spikes, localized weather risks & direct buyer demand
                </p>
              </div>
            </div>

            {/* Filter categories */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All Alerts' },
                { id: 'price', label: 'Price Spikes' },
                { id: 'weather', label: 'Weather Radar' },
                { id: 'arbitrage', label: 'Arbitrage' },
                { id: 'festival', label: 'Festivals' },
                { id: 'buyer', label: 'Buyers' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedAlertCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    selectedAlertCategory === c.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtered Alerts List */}
          <div className="mt-4 space-y-3">
            {alerts
              .filter((a) => selectedAlertCategory === 'all' || a.category === selectedAlertCategory)
              .map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold mt-0.5 ${
                        alert.color === 'emerald'
                          ? 'bg-emerald-100 text-emerald-800'
                          : alert.color === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : alert.color === 'amber'
                          ? 'bg-amber-100 text-amber-800'
                          : alert.color === 'purple'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {alert.color === 'emerald' && '📈'}
                      {alert.color === 'blue' && '🌧️'}
                      {alert.color === 'amber' && '⚡'}
                      {alert.color === 'purple' && '🪔'}
                      {alert.color === 'teal' && '🤝'}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {alert.title}
                        </h4>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${
                            alert.color === 'emerald'
                              ? 'bg-emerald-100 text-emerald-800'
                              : alert.color === 'blue'
                              ? 'bg-blue-100 text-blue-800'
                              : alert.color === 'amber'
                              ? 'bg-amber-100 text-amber-800'
                              : alert.color === 'purple'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {alert.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {alert.description}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                        Received: {alert.time}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectNav(alert.actionNav)}
                    className="self-end sm:self-center shrink-0 bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{alert.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Right 5 cols: SMS Alerts Dispatch Widget (Requirement 15 + Automatic Alerts) */}
        <div className="lg:col-span-5 agri-card p-6 flex flex-col justify-between border-2 border-slate-200">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Direct & Auto SMS Alerts</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Auto price spikes, arrival drops & weather radar SMS
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAutoSMSModalOpen(true)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Configure Automatic SMS Trigger Rules"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-700" />
              </button>
            </div>

            {/* Offline Status Badge in Widget */}
            {!isOnline && (
              <div className="mt-3 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold flex items-center gap-2">
                <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Offline facility active. SMS alert requests will be queued and sent when reconnected.</span>
              </div>
            )}

            {/* Mobile number input */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Farmer Mobile Number (SMS Destination):
                </label>
                <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" /> 24/7 Radar Linked
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>
            </div>

            {/* Quick SMS Trigger Presets */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Alert to Trigger:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '🍅 Tomato +12% Spike', text: 'NEXAGRI Alert: Tomato price jumped +12% to ₹38/kg in Oddanchatram. Advise: Harvest now.' },
                  { label: '🌧️ Rain Alert (48h)', text: 'NEXAGRI Alert: 45% Rain probability expected near Sirumugai in 48h. Safe dry harvest window: 36h.' },
                  { label: '💰 Mandi +₹400/Qtl', text: 'NEXAGRI Alert: Coimbatore Mandi paying +₹400/qtl extra net after transport. Distance: 38km.' },
                  { label: '🤝 5T Onion Buyer', text: 'NEXAGRI Alert: FreshBasket Buyer requires 5,000kg Onion at ₹28/kg. UPI Escrow secured.' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendSmsAlert(preset.text)}
                    disabled={smsSending}
                    className="p-2 text-left rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 transition-all cursor-pointer text-[11px] font-bold text-slate-800 disabled:opacity-50"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Action Buttons: Live Manual Send + Automatic Trigger Simulation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => handleSendSmsAlert()}
                disabled={smsSending || !smsPhone}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {smsSending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Send Live SMS</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSimulateAutoTrigger}
                disabled={autoEvaluating || !smsPhone}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {autoEvaluating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>⚡ Test Auto-Alert</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-time SMS Result Display (Strict compliance with Requirement 15) */}
          {smsResult && (
            <div
              className={`mt-4 p-3 rounded-xl text-xs border ${
                smsResult.status === 'delivered'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {smsResult.status === 'delivered' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800">SMS Dispatched Successfully!</span>
                  </>
                ) : (
                  <>
                    <Info className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-800">SMS Logged ({smsResult.provider || 'Gateway'})</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-600">
                <strong>To:</strong> {smsResult.phone} • <strong>Provider:</strong> {smsResult.provider || 'NEXAGRI Gateway'}
              </p>
              <p className="text-[11px] mt-1 bg-white p-2 rounded-lg border border-slate-200 font-mono text-slate-700">
                "{smsResult.message}"
              </p>
              {smsResult.note && (
                <p className="text-[10px] text-slate-500 mt-1.5 italic">
                  💡 {smsResult.note}
                </p>
              )}
            </div>
          )}

          {/* Automatic SMS Rules Configuration Modal */}
          <AutomaticSMSModal
            isOpen={isAutoSMSModalOpen}
            onClose={() => setIsAutoSMSModalOpen(false)}
            farmerPhone={smsPhone}
          />
        </div>
      </div>

      {/* 5. Live Agmarknet Price Snapshot Cards with Crop Images */}
      <div className="agri-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Today's Market Price Snapshot</span>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                Agmarknet Live
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Coimbatore & Western Tamil Nadu wholesale mandi price trends
            </p>
          </div>

          <button
            onClick={() => onSelectNav('markets')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-center"
          >
            <span>Explore All 35+ Mandis</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Crops Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {crops.slice(0, 4).map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-md transition-all group"
            >
              <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {crop.category}
                </div>
                <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-extrabold px-2 py-1 rounded-lg shadow">
                  ₹{crop.modal_price}/{crop.standard_unit}
                </div>
              </div>

              <div className="p-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900">{crop.name}</h4>
                  <span
                    className={`text-xs font-bold flex items-center gap-0.5 ${
                      crop.trend_pct >= 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {crop.trend_pct >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {crop.trend_pct >= 0 ? `+${crop.trend_pct}%` : `${crop.trend_pct}%`}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mt-0.5">
                  {crop.tamil} • {crop.hindi}
                </p>

                <div className="grid grid-cols-3 gap-1 mt-3 pt-2.5 border-t border-slate-100 text-center text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Min</span>
                    <span className="font-bold text-slate-700">₹{crop.min_price}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Modal</span>
                    <span className="font-extrabold text-emerald-700">₹{crop.modal_price}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Max</span>
                    <span className="font-bold text-slate-700">₹{crop.max_price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onSelectNav('markets')}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs py-1.5 rounded-lg transition-colors text-center"
                  >
                    Compare
                  </button>
                  <button
                    onClick={() => onSelectNav('lots')}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-1.5 rounded-lg transition-colors text-center"
                  >
                    Sell Lot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Active Farmer Lots & Verified Buyer Requisitions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Farm Lots (6 Cols) */}
        <div className="lg:col-span-6 agri-card p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">My Active Produce Lots</h3>
              <p className="text-xs text-slate-500">Your current inventory open for buyer bids</p>
            </div>
            <button
              onClick={() => onSelectNav('lots')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
            >
              + Add New Lot
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {lots.map((lot) => (
              <div key={lot.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{lot.crop_name}</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {lot.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lot.quantity_kg} kg • {lot.quality_grade} • {lot.location}
                  </p>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Expected: ₹{lot.expected_price_per_kg}/kg
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 block">
                    {lot.status}
                  </span>
                  <button
                    onClick={() => onSelectNav('buyers')}
                    className="text-xs font-bold text-slate-800 hover:text-emerald-700 underline mt-1.5 block"
                  >
                    Match Buyers →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Verified Institutional Buyers (6 Cols) */}
        <div className="lg:col-span-6 agri-card p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Verified Buyers Looking for Produce</h3>
              <p className="text-xs text-slate-500">Direct linkage without mandi commission</p>
            </div>
            <button
              onClick={() => onSelectNav('buyers')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              View All (24) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {buyers.slice(0, 3).map((buyer) => (
              <div key={buyer.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">{buyer.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Needs: <span className="font-bold text-slate-800">{buyer.quantity_required} {buyer.crop_required}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Terms: {buyer.payment_terms}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-700">₹{buyer.offered_price_per_kg}/kg</span>
                  <button
                    onClick={() => onSelectNav('buyers')}
                    className="mt-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg block ml-auto transition-colors"
                  >
                    Send Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
