import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Calculator,
  Search,
  AlertOctagon,
  FileText,
  HelpCircle,
  PhoneCall,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Camera,
  UploadCloud,
  Check,
  Building2,
  X,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  FileCheck2,
  Sprout
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  InsurancePolicyRecord,
  CropLossReport,
  PMFBYSeason,
  PremiumCalculationResult
} from '../types/insurance';
import {
  OFFICIAL_PMFBY_CROPS,
  INITIAL_DEMO_POLICIES,
  INITIAL_DEMO_LOSS_REPORTS,
  PMFBY_FAQS,
  PMFBY_OFFICIAL_LINKS
} from '../data/pmfbyData';

interface CropInsuranceDashboardProps {
  onSelectNav?: (nav: string) => void;
  preSelectedCrop?: string;
  initialTab?: 'overview' | 'apply' | 'calculator' | 'status' | 'report-loss' | 'info' | 'policies';
}

export const CropInsuranceDashboard: React.FC<CropInsuranceDashboardProps> = ({
  onSelectNav,
  preSelectedCrop,
  initialTab = 'overview'
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'calculator' | 'status' | 'report-loss' | 'info' | 'policies'>(
    preSelectedCrop ? 'apply' : initialTab
  );

  // Policies and Loss Reports State
  const [policies, setPolicies] = useState<InsurancePolicyRecord[]>(INITIAL_DEMO_POLICIES);
  const [lossReports, setLossReports] = useState<CropLossReport[]>(INITIAL_DEMO_LOSS_REPORTS);

  // -------------------------------------------------------------
  // MULTI-STEP APPLICATION FORM STATE (Requirement 4)
  // -------------------------------------------------------------
  const [formStep, setFormStep] = useState<number>(1);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Step 1: Farmer Details
  const [farmerName, setFarmerName] = useState<string>(user.name || 'Selvam Murugan');
  const [mobileNumber, setMobileNumber] = useState<string>(user.phone || '+91 98765 43210');
  const [state, setState] = useState<string>('Tamil Nadu');
  const [district, setDistrict] = useState<string>(user.district || 'Coimbatore');
  const [taluk, setTaluk] = useState<string>('Mettupalayam');
  const [village, setVillage] = useState<string>(user.village || 'Sirumugai');

  // Step 2: Farm Details
  const [surveyNumber, setSurveyNumber] = useState<string>('42/1A');
  const [landArea, setLandArea] = useState<number>(3.5);
  const [landType, setLandType] = useState<'Owner' | 'Tenant' | 'Sharecropper'>('Owner');
  const [irrigationType, setIrrigationType] = useState<'Canal' | 'Borewell / Tube-well' | 'Rainfed' | 'Drip / Sprinkler'>('Borewell / Tube-well');
  const [farmLocation, setFarmLocation] = useState<string>('Sirumugai North, Mettupalayam');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>({ lat: 11.2995, lng: 76.9945 });
  const [gpsFetching, setGpsFetching] = useState<boolean>(false);

  // Step 3: Crop Details
  const [selectedCrop, setSelectedCrop] = useState<string>(preSelectedCrop || 'Tomato');
  const [season, setSeason] = useState<PMFBYSeason>('Commercial / Horticultural');
  const [sowingDate, setSowingDate] = useState<string>('2026-06-15');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState<string>('2026-09-30');
  const [cultivatedArea, setCultivatedArea] = useState<number>(3.5);
  const [expectedYieldQtl, setExpectedYieldQtl] = useState<number>(120);

  // Step 4: Insurance Details
  const [sumInsuredPerAcre, setSumInsuredPerAcre] = useState<number>(65000);
  const [insuranceCompany, setInsuranceCompany] = useState<string>('Agriculture Insurance Company of India (AICIL)');
  const [policyPeriod, setPolicyPeriod] = useState<string>('Kharif 2026 – Rabi 2027');

  // Sync crop selection defaults
  useEffect(() => {
    if (OFFICIAL_PMFBY_CROPS[selectedCrop]) {
      const cfg = OFFICIAL_PMFBY_CROPS[selectedCrop];
      setSeason(cfg.season);
      setSumInsuredPerAcre(cfg.defaultSumInsuredPerAcre);
      setInsuranceCompany(cfg.empanelledCompany);
    }
  }, [selectedCrop]);

  // Derived application premium values
  const totalSumInsured = cultivatedArea * sumInsuredPerAcre;
  const farmerRate = season === 'Kharif' ? 2.0 : (season === 'Rabi' ? 1.5 : 5.0);
  const farmerContribution = Math.round((totalSumInsured * farmerRate) / 100);
  const actuarialRate = OFFICIAL_PMFBY_CROPS[selectedCrop]?.actuarialRatePct || 14.5;
  const totalGrossPremium = Math.round((totalSumInsured * actuarialRate) / 100);
  const governmentSubsidy = Math.max(0, totalGrossPremium - farmerContribution);

  const handleFetchGPS = () => {
    setGpsFetching(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsFetching(false);
        },
        () => {
          // Fallback simulation
          setGpsLocation({ lat: 11.2995, lng: 76.9945 });
          setGpsFetching(false);
        },
        { timeout: 5000 }
      );
    } else {
      setGpsLocation({ lat: 11.2995, lng: 76.9945 });
      setGpsFetching(false);
    }
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PMFBY-TN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPolicy: InsurancePolicyRecord = {
      id: newId,
      farmerName,
      mobile: mobileNumber,
      state,
      district,
      taluk,
      village,
      surveyNumber,
      crop: selectedCrop,
      season,
      sowingDate,
      landAreaAcres: cultivatedArea,
      sumInsured: totalSumInsured,
      farmerPremiumRatePct: farmerRate,
      farmerPremiumAmount: farmerContribution,
      govSubsidyAmount: governmentSubsidy,
      insuranceCompany,
      policyPeriod,
      status: 'submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      currentMilestone: 'Application Submitted & Pending Document Verification'
    };

    setPolicies([newPolicy, ...policies]);
    setSubmittedAppId(newId);
  };

  // -------------------------------------------------------------
  // INTERACTIVE PREMIUM CALCULATOR STATE (Requirement 5)
  // -------------------------------------------------------------
  const [calcState, setCalcState] = useState<string>('Tamil Nadu');
  const [calcDistrict, setCalcDistrict] = useState<string>('Coimbatore');
  const [calcCrop, setCalcCrop] = useState<string>('Tomato');
  const [calcSeason, setCalcSeason] = useState<PMFBYSeason>('Commercial / Horticultural');
  const [calcAreaAcres, setCalcAreaAcres] = useState<number>(2.0);
  const [calcSumInsuredPerAcre, setCalcSumInsuredPerAcre] = useState<number>(65000);

  // Sync calculator crop changes
  useEffect(() => {
    if (OFFICIAL_PMFBY_CROPS[calcCrop]) {
      const cfg = OFFICIAL_PMFBY_CROPS[calcCrop];
      setCalcSeason(cfg.season);
      setCalcSumInsuredPerAcre(cfg.defaultSumInsuredPerAcre);
    }
  }, [calcCrop]);

  const calcTotalSumInsured = calcAreaAcres * calcSumInsuredPerAcre;
  const calcFarmerRatePct = calcSeason === 'Kharif' ? 2.0 : (calcSeason === 'Rabi' ? 1.5 : 5.0);
  const calcFarmerPayable = Math.round((calcTotalSumInsured * calcFarmerRatePct) / 100);
  const calcActuarialRate = OFFICIAL_PMFBY_CROPS[calcCrop]?.actuarialRatePct || 14.5;
  const calcTotalGross = Math.round((calcTotalSumInsured * calcActuarialRate) / 100);
  const calcGovSubsidy = Math.max(0, calcTotalGross - calcFarmerPayable);
  const calcCentralShare = Math.round(calcGovSubsidy / 2);
  const calcStateShare = calcGovSubsidy - calcCentralShare;

  // -------------------------------------------------------------
  // APPLICATION STATUS TRACKER STATE (Requirement 6)
  // -------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState<string>('PMFBY-TN-2026-84920');
  const [searchMobile, setSearchMobile] = useState<string>('9876543210');
  const [searchedPolicy, setSearchedPolicy] = useState<InsurancePolicyRecord | null>(policies[0]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const found = policies.find(
      (p) =>
        p.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
        p.mobile.replace(/\D/g, '').endsWith(searchMobile.replace(/\D/g, '').slice(-10))
    );
    if (found) {
      setSearchedPolicy(found);
    } else {
      setSearchedPolicy(null);
      setSearchError(`No policy found matching "${searchQuery}" or Mobile "${searchMobile}". Please check the details or try demo ID: PMFBY-TN-2026-84920`);
    }
  };

  // -------------------------------------------------------------
  // CROP LOSS REPORTING STATE (Requirement 7)
  // -------------------------------------------------------------
  const [lossCrop, setLossCrop] = useState<string>('Tomato');
  const [lossSurveyNumber, setLossSurveyNumber] = useState<string>('42/1A');
  const [lossLocation, setLossLocation] = useState<string>('Sirumugai, Mettupalayam, Coimbatore');
  const [lossDate, setLossDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [damageCategory, setDamageCategory] = useState<CropLossReport['damageCategory']>('Heavy Rain');
  const [estimatedDamagePct, setEstimatedDamagePct] = useState<number>(50);
  const [lossDescription, setLossDescription] = useState<string>('');
  const [lossPhotos, setLossPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'
  ]);
  const [submittedLossId, setSubmittedLossId] = useState<string | null>(null);

  const handleReportLossSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLossId = `CLAIM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReport: CropLossReport = {
      id: newLossId,
      policyId: policies[0]?.id || 'PMFBY-TN-2026-84920',
      crop: lossCrop,
      surveyNumber: lossSurveyNumber,
      location: lossLocation,
      dateOfLoss: lossDate,
      damageCategory,
      estimatedDamagePct,
      description: lossDescription || `Sudden ${damageCategory.toLowerCase()} damage observed across field. Immediate assessment requested.`,
      photos: lossPhotos,
      gpsCoordinates: gpsLocation ? { latitude: gpsLocation.lat, longitude: gpsLocation.lng } : { latitude: 11.2995, longitude: 76.9945 },
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Reported',
      trackingNumber: `TN-CBE-LOSS-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setLossReports([newReport, ...lossReports]);
    setSubmittedLossId(newLossId);
  };

  const handleSimulatePhotoUpload = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80'
    ];
    const picked = samplePhotos[lossPhotos.length % samplePhotos.length];
    setLossPhotos([...lossPhotos, picked]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ============================================================== */}
      {/* 2. GOVERNMENT & PMFBY BRANDED HEADER BANNER                    */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-700/50 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            {/* Government Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/15 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <span>🏛️</span> Government of India
              </span>
              <span className="bg-white/10 text-slate-200 border border-white/20 text-[11px] font-medium px-2.5 py-1 rounded-full hidden sm:inline-block">
                Ministry of Agriculture & Farmers Welfare
              </span>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <span>🛡️</span> PMFBY Integrated
              </span>
              <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                NexaAgri Portal
              </span>
            </div>

            {/* Title & Slogan */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-sans">
                Pradhan Mantri Fasal Bima Yojana
              </h1>
              <p className="text-sm sm:text-base text-emerald-200/90 font-medium mt-1">
                Protect your crops. Protect your income. (உங்கள் பயிர் பாதுகாப்பு. உங்கள் வருமான பாதுகாப்பு.)
              </p>
            </div>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Comprehensive pan-India risk coverage against non-preventable natural risks from pre-sowing to post-harvest. Subsidized farmer premium from 1.5% to 5.0%.
            </p>
          </div>

          {/* Action CTAs & Helpline Callout */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveTab('apply');
                setFormStep(1);
                setSubmittedAppId(null);
              }}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <ShieldCheck className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Apply for Crop Insurance</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 14. National PMFBY Helpline */}
            <a
              href="tel:14447"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
              title="Official PMFBY National Toll-Free Grievance & Crop Loss Helpline"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>PMFBY Helpline: <strong>14447</strong> (Toll-Free)</span>
            </a>
          </div>
        </div>

        {/* Official Links Footer Strip */}
        <div className="mt-6 pt-4 border-t border-emerald-700/40 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={PMFBY_OFFICIAL_LINKS.portal}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline hover:text-white flex items-center gap-1 text-amber-300"
            >
              <span>Official PMFBY Website (pmfby.gov.in)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-emerald-500">•</span>
            <a
              href={PMFBY_OFFICIAL_LINKS.guidelines}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1"
            >
              <span>Official Scheme Guidelines</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-emerald-500">•</span>
            <a
              href={PMFBY_OFFICIAL_LINKS.grievance}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1"
            >
              <span>Grievance Redressal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Kharif 2026 Enrollment Window Active</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. FOUR MAIN ACTION CARDS                                      */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Apply for Insurance */}
        <div
          onClick={() => {
            setActiveTab('apply');
            setFormStep(1);
            setSubmittedAppId(null);
          }}
          className={`agri-card p-5 cursor-pointer transition-all duration-200 group border-2 ${
            activeTab === 'apply'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
              : 'border-slate-200 hover:border-emerald-500 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-xs">
              🌾
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              New Policy
            </span>
          </div>
          <h3 className="font-black text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
            Apply for Insurance
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            Protect your crop against eligible crop losses
          </p>
          <button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs">
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Card 2: Premium Calculator */}
        <div
          onClick={() => setActiveTab('calculator')}
          className={`agri-card p-5 cursor-pointer transition-all duration-200 group border-2 ${
            activeTab === 'calculator'
              ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
              : 'border-slate-200 hover:border-blue-500 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-xs">
              🧮
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Instant
            </span>
          </div>
          <h3 className="font-black text-slate-900 text-base group-hover:text-blue-700 transition-colors">
            Premium Calculator
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            Calculate your estimated crop insurance premium
          </p>
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs">
            <span>Calculate Premium</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Card 3: Application Status */}
        <div
          onClick={() => setActiveTab('status')}
          className={`agri-card p-5 cursor-pointer transition-all duration-200 group border-2 ${
            activeTab === 'status'
              ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-500/20'
              : 'border-slate-200 hover:border-purple-500 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-xs">
              📋
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Tracking
            </span>
          </div>
          <h3 className="font-black text-slate-900 text-base group-hover:text-purple-700 transition-colors">
            Application Status
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            Track your crop insurance application
          </p>
          <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs">
            <span>Check Status</span>
            <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Card 4: Report Crop Loss */}
        <div
          onClick={() => {
            setActiveTab('report-loss');
            setSubmittedLossId(null);
          }}
          className={`agri-card p-5 cursor-pointer transition-all duration-200 group border-2 ${
            activeTab === 'report-loss'
              ? 'border-rose-600 bg-rose-50/50 shadow-md ring-2 ring-rose-500/20'
              : 'border-slate-200 hover:border-rose-500 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-xs">
              ⚠️
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
              72h Window
            </span>
          </div>
          <h3 className="font-black text-slate-900 text-base group-hover:text-rose-700 transition-colors">
            Report Crop Loss
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            Report eligible crop damage or loss
          </p>
          <button className="mt-4 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs">
            <span>Report Loss</span>
            <AlertTriangle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 17. MODULE SUB-NAVIGATION TABS                                 */}
      {/* ============================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'overview', label: '📊 Dashboard Overview', icon: null },
          { id: 'apply', label: '✍️ Apply for Insurance', icon: null },
          { id: 'calculator', label: '🧮 Premium Calculator', icon: null },
          { id: 'policies', label: `🛡️ My Policies (${policies.length})`, icon: null },
          { id: 'status', label: '🔍 Application Status', icon: null },
          { id: 'report-loss', label: '⚠️ Report Crop Loss', icon: null },
          { id: 'info', label: '📖 PMFBY Info & FAQ', icon: null }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* VIEW: OVERVIEW DASHBOARD                                       */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Active Policies & Crop Coverage Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black">
                🛡️
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Active Insured Sum</span>
                <span className="text-xl font-black text-slate-900">₹2,27,500</span>
                <span className="text-[11px] text-emerald-600 block font-bold">Tomato (3.5 Acres Protected)</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-black">
                💰
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Total Govt Subsidy Received</span>
                <span className="text-xl font-black text-blue-700">₹21,612</span>
                <span className="text-[11px] text-slate-500 block font-medium">65% Shared Central/State</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-black">
                📞
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Loss Intimation Window</span>
                <span className="text-base font-black text-slate-900">72 Hours Max</span>
                <a href="tel:14447" className="text-[11px] text-blue-600 font-bold block hover:underline">
                  Toll-Free 14447
                </a>
              </div>
            </div>
          </div>

          {/* 12. WEATHER RISK INTEGRATION CARD */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Extreme Weather Risk Advisory • Coimbatore District
                  </h4>
                  <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Risk Level: Medium-High
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Western Ghats radar indicates localized thunder showers and potential waterlogging risk for standing Paddy and Tomato crops over next 48 hours.
                </p>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  *Important: Weather alerts do not automatically trigger an insurance claim. In case of field loss, report within 72 hours via PMFBY portal or helpline 14447.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('policies')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs shrink-0 cursor-pointer"
            >
              Check Insurance Protection
            </button>
          </div>

          {/* Quick Active Policy Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <span>🛡️</span>
                <span>Active Crop Protection Policies</span>
              </h3>
              <button
                onClick={() => setActiveTab('policies')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                View All ({policies.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.slice(0, 2).map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{p.crop}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'policy_active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : (p.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800')
                        }`}>
                          {p.status === 'policy_active' ? '✓ Policy Active' : (p.status === 'rejected' ? 'Rejected' : 'Processing')}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Policy ID: <strong>{p.id}</strong> • Survey: {p.surveyNumber}
                      </span>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      ₹{p.sumInsured.toLocaleString('en-IN')} Insured
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Area</span>
                      <span className="font-bold text-slate-800">{p.landAreaAcres} Acres</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Farmer Paid</span>
                      <span className="font-bold text-emerald-700">₹{p.farmerPremiumAmount} ({p.farmerPremiumRatePct}%)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Govt Subsidy</span>
                      <span className="font-bold text-blue-700">₹{p.govSubsidyAmount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 text-[11px] truncate max-w-[220px]">
                      {p.insuranceCompany}
                    </span>
                    <button
                      onClick={() => {
                        setSearchQuery(p.id);
                        setSearchedPolicy(p);
                        setActiveTab('status');
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px] cursor-pointer"
                    >
                      Track Milestones →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. FARMER INSURANCE APPLICATION FORM (Multi-step)               */}
      {/* ============================================================== */}
      {activeTab === 'apply' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          {/* Submission Success State */}
          {submittedAppId ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-md">
                ✓
              </div>
              <span className="inline-block bg-amber-100 text-amber-900 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Demo Application Submitted
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                PMFBY Crop Insurance Application Received!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Your application for <strong>{cultivatedArea} Acres of {selectedCrop}</strong> has been registered under the Pradhan Mantri Fasal Bima Yojana scheme.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Application Reference ID:</span>
                  <span className="font-mono font-black text-emerald-800">{submittedAppId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Sum Insured:</span>
                  <span className="font-bold text-slate-900">₹{totalSumInsured.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Farmer Contribution (Paid):</span>
                  <span className="font-black text-emerald-700">₹{farmerContribution.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Empanelled Insurer:</span>
                  <span className="font-semibold text-slate-800 text-[11px]">{insuranceCompany}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setSearchQuery(submittedAppId);
                    setActiveTab('status');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Track Application Status
                </button>
                <button
                  onClick={() => {
                    setSubmittedAppId(null);
                    setFormStep(1);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Apply for Another Crop
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header & Step Indicator */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Apply for PMFBY Crop Insurance
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pradhan Mantri Fasal Bima Yojana • Single-window farmer application form
                    </p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                    Demo Mode • Configurable PMFBY Rates
                  </span>
                </div>

                {/* Stepper Progress */}
                <div className="grid grid-cols-5 gap-2 mt-5">
                  {[
                    { step: 1, label: '1. Farmer' },
                    { step: 2, label: '2. Farm' },
                    { step: 3, label: '3. Crop' },
                    { step: 4, label: '4. Insurance' },
                    { step: 5, label: '5. Review' }
                  ].map((s) => (
                    <div
                      key={s.step}
                      onClick={() => setFormStep(s.step)}
                      className={`text-center pb-2 border-b-4 cursor-pointer transition-all ${
                        formStep === s.step
                          ? 'border-emerald-600 text-emerald-800 font-black'
                          : (formStep > s.step ? 'border-emerald-300 text-slate-700 font-bold' : 'border-slate-200 text-slate-400 font-medium')
                      }`}
                    >
                      <span className="text-xs">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleApplicationSubmit} className="space-y-6">
                {/* STEP 1: FARMER DETAILS */}
                {formStep === 1 && (
                  <div className="space-y-4 animate-in fade-in-50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span>👤</span> Step 1: Farmer Personal & Contact Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Farmer Full Name *</label>
                        <input
                          type="text"
                          required
                          value={farmerName}
                          onChange={(e) => setFarmerName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="As on Aadhaar Card"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (Aadhaar linked) *</label>
                        <input
                          type="tel"
                          required
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Haryana">Haryana</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">District *</label>
                        <input
                          type="text"
                          required
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="e.g. Coimbatore"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Taluk / Block *</label>
                        <input
                          type="text"
                          required
                          value={taluk}
                          onChange={(e) => setTaluk(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="e.g. Mettupalayam"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Village / Gram Panchayat *</label>
                        <input
                          type="text"
                          required
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="e.g. Sirumugai"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: FARM DETAILS */}
                {formStep === 2 && (
                  <div className="space-y-4 animate-in fade-in-50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span>🌾</span> Step 2: Land & Farm Survey Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Survey Number / Khasra No. *</label>
                        <input
                          type="text"
                          required
                          value={surveyNumber}
                          onChange={(e) => setSurveyNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="e.g. 42/1A or 89/3B"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Total Land Holding (Acres) *</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={landArea}
                          onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Farmer Land Tenancy Type *</label>
                        <select
                          value={landType}
                          onChange={(e) => setLandType(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="Owner">Land Owner (Pattadar)</option>
                          <option value="Tenant">Tenant Cultivator</option>
                          <option value="Sharecropper">Sharecropper</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Irrigation Source *</label>
                        <select
                          value={irrigationType}
                          onChange={(e) => setIrrigationType(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="Borewell / Tube-well">Borewell / Tube-well</option>
                          <option value="Canal">Government Canal</option>
                          <option value="Drip / Sprinkler">Drip / Sprinkler System</option>
                          <option value="Rainfed">Purely Rainfed</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">Farm Location / Landmark *</label>
                        <input
                          type="text"
                          required
                          value={farmLocation}
                          onChange={(e) => setFarmLocation(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="e.g. Sirumugai North, near Old Bhavani checkpost"
                        />
                      </div>
                      <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="text-slate-700">
                            GPS Coordinates:{' '}
                            <strong>
                              {gpsLocation ? `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}` : 'Not captured'}
                            </strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleFetchGPS}
                          disabled={gpsFetching}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          {gpsFetching ? 'Fetching GPS...' : '📍 Capture Farm GPS'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: CROP DETAILS */}
                {formStep === 3 && (
                  <div className="space-y-4 animate-in fade-in-50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span>🌱</span> Step 3: Crop & Sowing Particulars
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Select Crop *</label>
                        <select
                          value={selectedCrop}
                          onChange={(e) => setSelectedCrop(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          {Object.keys(OFFICIAL_PMFBY_CROPS).map((crop) => (
                            <option key={crop} value={crop}>
                              {crop} ({OFFICIAL_PMFBY_CROPS[crop].season})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Cropping Season *</label>
                        <select
                          value={season}
                          onChange={(e) => setSeason(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="Commercial / Horticultural">Commercial / Horticultural (Max 5% Farmer Premium)</option>
                          <option value="Kharif">Kharif Season (Max 2% Farmer Premium)</option>
                          <option value="Rabi">Rabi Season (Max 1.5% Farmer Premium)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Actual / Expected Sowing Date *</label>
                        <input
                          type="date"
                          required
                          value={sowingDate}
                          onChange={(e) => setSowingDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Expected Harvest Date *</label>
                        <input
                          type="date"
                          required
                          value={expectedHarvestDate}
                          onChange={(e) => setExpectedHarvestDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Cultivated Area for Insurance (Acres) *</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={cultivatedArea}
                          onChange={(e) => setCultivatedArea(parseFloat(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Expected Yield (Quintals) *</label>
                        <input
                          type="number"
                          required
                          value={expectedYieldQtl}
                          onChange={(e) => setExpectedYieldQtl(parseInt(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: INSURANCE DETAILS */}
                {formStep === 4 && (
                  <div className="space-y-4 animate-in fade-in-50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span>🛡️</span> Step 4: Sum Insured & Premium Calculation
                    </h3>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-700">Notified Sum Insured per Acre</span>
                          <p className="text-[11px] text-slate-500">Based on State Level Technical Committee (SLTC) norms</p>
                        </div>
                        <span className="text-base font-black text-emerald-800">
                          ₹{sumInsuredPerAcre.toLocaleString('en-IN')} / Acre
                        </span>
                      </div>

                      <div className="border-t border-emerald-200/80 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-emerald-100">
                          <span className="text-slate-500 block text-[10px] font-semibold">Total Sum Insured</span>
                          <span className="text-sm font-black text-slate-900">₹{totalSumInsured.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-emerald-100">
                          <span className="text-slate-500 block text-[10px] font-semibold">Farmer Share ({farmerRate}%)</span>
                          <span className="text-sm font-black text-emerald-700">₹{farmerContribution.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-emerald-100">
                          <span className="text-slate-500 block text-[10px] font-semibold">Government Subsidy</span>
                          <span className="text-sm font-black text-blue-700">₹{governmentSubsidy.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-emerald-100">
                          <span className="text-slate-500 block text-[10px] font-semibold">Farmer Contribution</span>
                          <span className="text-sm font-black text-amber-700">{farmerRate}% Max</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Empanelled Insurance Company *</label>
                        <input
                          type="text"
                          readOnly
                          value={insuranceCompany}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Policy Period *</label>
                        <input
                          type="text"
                          readOnly
                          value={policyPeriod}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: FINAL CONFIRMATION & REVIEW */}
                {formStep === 5 && (
                  <div className="space-y-4 animate-in fade-in-50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span>📝</span> Step 5: Final Review & Confirmation
                    </h3>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-slate-200 pb-3">
                        <div>
                          <span className="text-slate-400 block font-semibold">Farmer Name</span>
                          <span className="font-bold text-slate-900">{farmerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Mobile</span>
                          <span className="font-bold text-slate-900">{mobileNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">District & Village</span>
                          <span className="font-bold text-slate-900">{district}, {village}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Survey No.</span>
                          <span className="font-bold text-slate-900">{surveyNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Crop & Season</span>
                          <span className="font-bold text-slate-900">{selectedCrop} ({season})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">Insured Area</span>
                          <span className="font-bold text-slate-900">{cultivatedArea} Acres</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div>
                          <span className="text-slate-500 font-semibold block">Total Sum Insured Coverage:</span>
                          <span className="text-lg font-black text-slate-900">₹{totalSumInsured.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 font-semibold block">Farmer Payable Premium:</span>
                          <span className="text-xl font-black text-emerald-700">₹{farmerContribution.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-400 block">(Govt Subsidy: ₹{governmentSubsidy.toLocaleString('en-IN')})</span>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer Checkbox */}
                    <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-800 cursor-pointer">
                      <input type="checkbox" defaultChecked required className="mt-0.5 rounded text-emerald-600" />
                      <span className="text-[11px] leading-relaxed">
                        I hereby declare that the crop and land survey details provided are accurate as per revenue records. I agree to the operational guidelines of <strong>Pradhan Mantri Fasal Bima Yojana (PMFBY)</strong>.
                      </span>
                    </label>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {formStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setFormStep(formStep - 1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  ) : <div></div>}

                  {formStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => setFormStep(formStep + 1)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Submit Application
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. INTERACTIVE PREMIUM CALCULATOR                               */}
      {/* ============================================================== */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🧮</span>
                  <span>PMFBY Premium Calculator</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Instant calculation of farmer payable premium vs. government subsidy shares
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-1 rounded-full uppercase">
                Official PMFBY Formula
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs Panel */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
                <select
                  value={calcState}
                  onChange={(e) => setCalcState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">District</label>
                <input
                  type="text"
                  value={calcDistrict}
                  onChange={(e) => setCalcDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Crop</label>
                <select
                  value={calcCrop}
                  onChange={(e) => setCalcCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                >
                  {Object.keys(OFFICIAL_PMFBY_CROPS).map((crop) => (
                    <option key={crop} value={crop}>
                      {crop} ({OFFICIAL_PMFBY_CROPS[crop].season})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Season</label>
                  <select
                    value={calcSeason}
                    onChange={(e) => setCalcSeason(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="Commercial / Horticultural">Commercial / Hort. (5%)</option>
                    <option value="Kharif">Kharif (2%)</option>
                    <option value="Rabi">Rabi (1.5%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Cultivated Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcAreaAcres}
                    onChange={(e) => setCalcAreaAcres(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Sum Insured per Acre (₹)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={calcSumInsuredPerAcre}
                  onChange={(e) => setCalcSumInsuredPerAcre(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-800"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  *Configurable based on latest official PMFBY district gazette notifications.
                </span>
              </div>
            </div>

            {/* Output Calculation Result Box */}
            <div className="lg:col-span-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Calculated Premium Breakdown
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {calcSeason}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Sum Insured Coverage:</span>
                    <span className="font-black text-slate-900 text-sm">
                      ₹{calcTotalSumInsured.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Farmer Premium Rate:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      {calcFarmerRatePct}% (Capped by GoI)
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <span className="font-bold">Estimated Farmer Payable:</span>
                    <span className="text-lg font-black">
                      ₹{calcFarmerPayable.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/60 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Total Gross Actuarial Premium ({calcActuarialRate}%):</span>
                      <span className="font-semibold text-slate-800">₹{calcTotalGross.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-blue-700 font-semibold">
                      <span>Central Govt Subsidy Share (50%):</span>
                      <span>₹{calcCentralShare.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-blue-700 font-semibold">
                      <span>State Govt Subsidy Share (50%):</span>
                      <span>₹{calcStateShare.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-emerald-200/40">
                      <span>Total Government Subsidy Provided:</span>
                      <span className="text-emerald-700">₹{calcGovSubsidy.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setSelectedCrop(calcCrop);
                    setSeason(calcSeason);
                    setCultivatedArea(calcAreaAcres);
                    setSumInsuredPerAcre(calcSumInsuredPerAcre);
                    setActiveTab('apply');
                    setFormStep(1);
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Apply with this Calculation</span>
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-tight">
                  *Official reference value. Final premium subject to village notified area and season gazette.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. APPLICATION STATUS TRACKER                                  */}
      {/* ============================================================== */}
      {activeTab === 'status' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>🔍</span>
              <span>Track Insurance Application / Policy</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your PMFBY Application ID or registered mobile number to check real-time verification status
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchStatus} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="text-xs font-bold text-slate-700 block mb-1">Application ID / Policy ID</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. PMFBY-TN-2026-84920"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
              <input
                type="tel"
                value={searchMobile}
                onChange={(e) => setSearchMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Search className="w-3.5 h-3.5" /> Check
              </button>
            </div>
          </form>

          {/* Quick Demo ID pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-bold">Quick Demo IDs:</span>
            {policies.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSearchQuery(p.id);
                  setSearchedPolicy(p);
                  setSearchError(null);
                }}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  searchedPolicy?.id === p.id
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {p.crop} ({p.status === 'policy_active' ? 'Active' : (p.status === 'rejected' ? 'Rejected' : 'Processing')})
              </button>
            ))}
          </div>

          {searchError && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              {searchError}
            </div>
          )}

          {/* Searched Record Display */}
          {searchedPolicy && (
            <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-slate-900">
                      {searchedPolicy.crop} Crop Policy
                    </h3>
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {searchedPolicy.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Farmer: <strong>{searchedPolicy.farmerName}</strong> • {searchedPolicy.village}, {searchedPolicy.district} • Survey: {searchedPolicy.surveyNumber}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Sum Insured:</span>
                  <span className="text-lg font-black text-emerald-700">
                    ₹{searchedPolicy.sumInsured.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* TIMELINE MILESTONES (Requirement 6) */}
              {searchedPolicy.status === 'rejected' ? (
                /* REJECTED TIMELINE & CORRECTIVE ACTION */
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-black text-sm">
                    <AlertOctagon className="w-5 h-5 text-rose-600" />
                    <span>Application Rejected</span>
                  </div>
                  <div className="text-xs text-rose-950 space-y-1.5">
                    <p>
                      <strong>Reason for Rejection:</strong> {searchedPolicy.rejectionReason}
                    </p>
                    <p className="text-slate-700">
                      <strong>Corrective Action Required:</strong> {searchedPolicy.correctiveAction}
                    </p>
                  </div>
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => {
                        setActiveTab('apply');
                        setFormStep(1);
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Re-submit Corrected Documents
                    </button>
                    <a
                      href="tel:14447"
                      className="bg-white text-rose-800 border border-rose-300 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Grievance 14447
                    </a>
                  </div>
                </div>
              ) : (
                /* 6-STAGE PROGRESS TIMELINE */
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Application Milestone Timeline
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {[
                      { id: 'submitted', label: '1. Application Submitted', desc: 'Received online' },
                      { id: 'doc_verification', label: '2. Document Verification', desc: 'Land & Aadhaar checked' },
                      { id: 'insurance_processing', label: '3. Insurance Processing', desc: 'Underwriting by insurer' },
                      { id: 'crop_verification', label: '4. Crop Verification', desc: 'Area survey complete' },
                      { id: 'policy_approved', label: '5. Policy Approved', desc: 'Certificate generated' },
                      { id: 'policy_active', label: '6. Policy Active', desc: 'Cover in force' }
                    ].map((step, idx) => {
                      const stages = ['submitted', 'doc_verification', 'insurance_processing', 'crop_verification', 'policy_approved', 'policy_active'];
                      const currentIdx = stages.indexOf(searchedPolicy.status);
                      const isComplete = currentIdx >= idx;
                      const isCurrent = currentIdx === idx;

                      return (
                        <div
                          key={step.id}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            isComplete
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-400 opacity-60'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-1.5">
                            {isComplete ? '✓' : idx + 1}
                          </div>
                          <span className="text-[11px] font-black block leading-tight">{step.label}</span>
                          <span className="text-[9px] text-slate-500 block mt-0.5">{step.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. CROP LOSS REPORTING (72-hour window)                         */}
      {/* ============================================================== */}
      {activeTab === 'report-loss' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          {submittedLossId ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto shadow-md">
                ⚠️
              </div>
              <span className="inline-block bg-amber-100 text-amber-900 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Claim Intimation Registered
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Crop Loss Report Submitted Successfully!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Your report for <strong>{estimatedDamagePct}% damage</strong> to <strong>{lossCrop}</strong> has been logged within the mandatory 72-hour PMFBY window.
              </p>

              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Claim Intimation ID:</span>
                  <span className="font-mono font-black text-rose-800">{submittedLossId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Damage Cause:</span>
                  <span className="font-bold text-slate-900">{damageCategory}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Next Step:</span>
                  <span className="font-bold text-emerald-700">Joint Loss Assessment Survey in 48h</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <a
                  href="tel:14447"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" /> Call 14447 to Expedite
                </a>
                <button
                  onClick={() => setSubmittedLossId(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Report Another Damage
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span className="text-rose-600">⚠️</span>
                      <span>Report Eligible Crop Damage or Loss</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Local calamity / post-harvest loss reporting under PMFBY (Mandatory within 72 hours of occurrence)
                    </p>
                  </div>
                  <span className="bg-rose-100 text-rose-800 text-[11px] font-black px-3 py-1 rounded-full uppercase">
                    72 Hours Intimation Deadline
                  </span>
                </div>
              </div>

              <form onSubmit={handleReportLossSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Affected Crop *</label>
                    <select
                      value={lossCrop}
                      onChange={(e) => setLossCrop(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                    >
                      {Object.keys(OFFICIAL_PMFBY_CROPS).map((crop) => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Survey Number *</label>
                    <input
                      type="text"
                      required
                      value={lossSurveyNumber}
                      onChange={(e) => setLossSurveyNumber(e.target.value)}
                      placeholder="e.g. 42/1A"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Date of Loss / Calamity *</label>
                    <input
                      type="date"
                      required
                      value={lossDate}
                      onChange={(e) => setLossDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Eligible Damage Category *</label>
                    <select
                      value={damageCategory}
                      onChange={(e) => setDamageCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                    >
                      <option value="Drought">Drought</option>
                      <option value="Flood">Flood</option>
                      <option value="Heavy Rain">Heavy Rain</option>
                      <option value="Hailstorm">Hailstorm</option>
                      <option value="Cyclone">Cyclone</option>
                      <option value="Landslide">Landslide</option>
                      <option value="Pest">Pest Infestation</option>
                      <option value="Disease">Crop Disease</option>
                      <option value="Inundation">Inundation (Waterlogging)</option>
                      <option value="Other eligible event">Other eligible natural event</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Estimated Damage Percentage: <strong>{estimatedDamagePct}%</strong>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={estimatedDamagePct}
                      onChange={(e) => setEstimatedDamagePct(parseInt(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Field Location *</label>
                    <input
                      type="text"
                      required
                      value={lossLocation}
                      onChange={(e) => setLossLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Description of Crop Damage</label>
                    <textarea
                      rows={3}
                      value={lossDescription}
                      onChange={(e) => setLossDescription(e.target.value)}
                      placeholder="Describe waterlogging, lodging, leaf spotting, or hail damage extent..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  {/* Photo & GPS Upload Simulation */}
                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 block">
                        Crop Photographs & Geo-tagged Evidence ({lossPhotos.length} Attached)
                      </label>
                      <button
                        type="button"
                        onClick={handleSimulatePhotoUpload}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5" /> + Add Simulated Photo
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {lossPhotos.map((url, idx) => (
                        <div key={idx} className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 relative group">
                          <img src={url} alt="Damage" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded">
                            GPS ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href="tel:14447"
                    className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> Need Help? Call 14447
                  </a>

                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Submit Crop Loss Report</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. PMFBY INFORMATION & FAQ SECTION                             */}
      {/* ============================================================== */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span>
              <span>PMFBY Guide & Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Simple explanations for Indian farmers regarding crop insurance coverage, premium limits, and claim procedures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PMFBY_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <h4 className="font-extrabold text-sm text-slate-900 flex items-start gap-2">
                  <span className="text-emerald-600 font-black">Q{idx + 1}.</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Official Helplines & Links footer */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-sm text-emerald-950">Have More Questions?</h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Visit the official Government of India PMFBY portal or dial toll-free helpline 14447.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={PMFBY_OFFICIAL_LINKS.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="tel:14447"
                className="bg-white text-emerald-800 border border-emerald-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call 14447</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 17. MY POLICIES TAB                                            */}
      {/* ============================================================== */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🛡️</span>
                <span>My Insured Crop Policies</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Active, past, and processing crop insurance records for your registered land
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('apply');
                setFormStep(1);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              + Apply New Policy
            </button>
          </div>

          <div className="space-y-4">
            {policies.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-slate-900">{p.crop}</span>
                      <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {p.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'policy_active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : (p.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800')
                      }`}>
                        {p.status === 'policy_active' ? '✓ Active' : (p.status === 'rejected' ? 'Rejected' : 'Processing')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Survey: {p.surveyNumber} • {p.landAreaAcres} Acres • {p.policyPeriod}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Total Coverage</span>
                    <span className="text-lg font-black text-emerald-700">₹{p.sumInsured.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Farmer Contribution</span>
                    <span className="font-bold text-slate-800">₹{p.farmerPremiumAmount} ({p.farmerPremiumRatePct}%)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Govt Subsidy</span>
                    <span className="font-bold text-blue-700">₹{p.govSubsidyAmount}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[10px]">Insurer</span>
                    <span className="font-semibold text-slate-800 truncate block">{p.insuranceCompany}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Current Status: <strong>{p.currentMilestone}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery(p.id);
                      setSearchedPolicy(p);
                      setActiveTab('status');
                    }}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-xs cursor-pointer"
                  >
                    View Status Milestones →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
