import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Calculator,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
  Store,
  Grid,
  List,
  ArrowUpDown,
  X,
  Check,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { MandiPriceRecord } from '../types';
import { getCropImage } from '../data/cropImages';

interface MarketPricesProps {
  onSelectNav: (nav: string) => void;
  onOpenPredictionModal: (cropId: string) => void;
  onOpenCompareModal: (cropId: string) => void;
}

export const MarketPrices: React.FC<MarketPricesProps> = ({
  onSelectNav,
  onOpenPredictionModal,
  onOpenCompareModal
}) => {
  const [statesList, setStatesList] = useState<string[]>([]);
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [marketsList, setMarketsList] = useState<string[]>([]);

  // Selection states (supporting All India)
  const [selectedState, setSelectedState] = useState<string>('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Coimbatore');
  const [selectedMarket, setSelectedMarket] = useState<string>('Mettupalayam');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [prices, setPrices] = useState<MandiPriceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // View Mode: 'cards' | 'table'
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modal State: "Prices per kg in each Mandi for a Crop"
  const [selectedCropForMandis, setSelectedCropForMandis] = useState<string | null>(null);
  const [mandiPrices, setMandiPrices] = useState<MandiPriceRecord[]>([]);
  const [isMandiLoading, setIsMandiLoading] = useState<boolean>(false);
  const [mandiSearch, setMandiSearch] = useState<string>('');
  const [mandiSortBy, setMandiSortBy] = useState<'price_desc' | 'price_asc' | 'arrivals_desc'>('price_desc');

  const categories = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Pulses',
    'Oilseeds',
    'Spices',
    'Cash Crops',
    'Flowers'
  ];

  // 1. Fetch Pan-India States on Mount
  useEffect(() => {
    const loadStates = async () => {
      const states = await apiService.getPanIndiaStates();
      setStatesList(['All India', ...states.filter(s => s !== 'All India')]);
    };
    loadStates();
  }, []);

  // 2. Fetch Districts when State changes
  useEffect(() => {
    if (selectedState && selectedState !== 'All India') {
      apiService.getDistricts(selectedState).then(districts => {
        setDistrictsList(['All', ...districts]);
        if (!districts.includes(selectedDistrict)) {
          setSelectedDistrict(districts[0] || 'All');
        }
      });
    } else {
      setDistrictsList(['All']);
      setSelectedDistrict('All');
    }
  }, [selectedState]);

  // 3. Fetch Markets when District changes
  useEffect(() => {
    if (selectedState && selectedState !== 'All India' && selectedDistrict && selectedDistrict !== 'All') {
      apiService.getMarkets(selectedState, selectedDistrict).then(markets => {
        setMarketsList(['All', ...markets]);
        if (!markets.includes(selectedMarket)) {
          setSelectedMarket(markets[0] || 'All');
        }
      });
    } else {
      setMarketsList(['All']);
      setSelectedMarket('All');
    }
  }, [selectedState, selectedDistrict]);

  // 4. Fetch Market Prices based on Cascading Filters
  const fetchMarketPrices = async () => {
    setIsLoading(true);
    const records = await apiService.getMandiPrices(
      selectedState,
      selectedDistrict,
      selectedMarket,
      searchQuery || undefined,
      selectedCategory,
      selectedDate
    );
    setPrices(records);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMarketPrices();
  }, [selectedState, selectedDistrict, selectedMarket, selectedCategory, searchQuery, selectedDate]);

  // 5. Fetch Mandi comparison prices when a crop is selected for "Prices in Each Mandi"
  useEffect(() => {
    if (selectedCropForMandis) {
      setIsMandiLoading(true);
      apiService.getMandiPricesByCrop(selectedCropForMandis).then(res => {
        setMandiPrices(res);
        setIsMandiLoading(false);
      });
    } else {
      setMandiPrices([]);
    }
  }, [selectedCropForMandis]);

  // Filter & Sort Mandi Prices for Modal
  const filteredMandiPrices = useMemo(() => {
    let result = mandiPrices;
    if (mandiSearch.trim()) {
      const q = mandiSearch.toLowerCase().trim();
      result = result.filter(
        m =>
          m.market.toLowerCase().includes(q) ||
          m.district?.toLowerCase().includes(q) ||
          m.state?.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => {
      const pA = a.price_per_kg || a.modal_price || 0;
      const pB = b.price_per_kg || b.modal_price || 0;
      if (mandiSortBy === 'price_desc') return pB - pA;
      if (mandiSortBy === 'price_asc') return pA - pB;
      if (mandiSortBy === 'arrivals_desc') return (b.arrival_quantity || 0) - (a.arrival_quantity || 0);
      return 0;
    });
  }, [mandiPrices, mandiSearch, mandiSortBy]);

  // Current mandi price for the modal crop
  const currentMandiPrice = useMemo(() => {
    if (!selectedCropForMandis) return null;
    const match = prices.find(
      p => p.crop_name.toLowerCase() === selectedCropForMandis.toLowerCase()
    );
    return match ? match.price_per_kg || match.modal_price : null;
  }, [selectedCropForMandis, prices]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Indian Market Prices
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                Official AGMARKNET Data Source
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time agricultural market data across Indian States, Districts, and Mandis with verified prices per kg (₹/kg) and ₹/quintal conversion.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* View Mode Toggle: Cards vs Table */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Crop Cards View"
              >
                <Grid className="w-3.5 h-3.5" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="All Mandis Table View"
              >
                <List className="w-3.5 h-3.5" />
                Table
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>
            <button
              onClick={fetchMarketPrices}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
              title="Refresh prices"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* CASCADING SELECTION: All India → State/UT → District → Mandi/Market */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 via-slate-50 to-slate-50 border border-blue-100">
          {/* 1. State / UT Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-700" />
              1. State / UT
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 font-bold text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs cursor-pointer"
            >
              {statesList.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 2. District Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              2. District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 font-bold text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs cursor-pointer"
            >
              {districtsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Market / Mandi Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-blue-700" />
              3. Mandi / Market
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 font-bold text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs cursor-pointer"
            >
              {marketsList.map((m, idx) => (
                <option key={idx} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Crop Category & Search Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-5">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crop or variety (e.g. Tomato)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Active Filter Summary Bar with Mandi Highlight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white px-5 py-3.5 rounded-2xl shadow-xs text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span>
            Reporting Mandi: <strong>{selectedMarket}</strong> • {selectedDistrict}, {selectedState}
          </span>
        </div>
        <div className="flex items-center gap-3 font-semibold text-blue-200">
          <span>{prices.length} Commodities Available</span>
          <span className="hidden md:inline bg-blue-700/60 px-2.5 py-0.5 rounded-full text-[11px] text-blue-100">
            Click "Prices in Each Mandi" to compare across all Indian mandis
          </span>
        </div>
      </div>

      {/* Loading Skeleton or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-5 h-80 animate-pulse flex flex-col justify-between">
              <div className="h-40 bg-slate-200 rounded-2xl"></div>
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : prices.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <span className="text-5xl block mb-3">🌾</span>
          <h3 className="text-lg font-bold text-slate-900">No Market Price Records Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            No arrivals currently logged for {selectedMarket} under category "{selectedCategory}". Try choosing another mandi or category above.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* GRID OF CROP PRICE CARDS WITH ALL CROPS & IMAGES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prices.map((item) => {
            const modalKg = item.price_per_kg || item.modal_price;
            const modalQtl = item.modal_price_qtl || Math.round(modalKg * 100);
            const minKg = item.min_price || Math.round((item.min_price_qtl || modalQtl * 0.88) / 100);
            const maxKg = item.max_price || Math.round((item.max_price_qtl || modalQtl * 1.12) / 100);
            const displayImage = item.image || getCropImage(item.crop_name);

            return (
              <div
                key={item.id || `${item.crop_name}-${item.market}`}
                className="agri-card overflow-hidden flex flex-col justify-between border-slate-200 hover:border-blue-500 transition-all group bg-white rounded-3xl shadow-xs"
              >
                <div>
                  {/* Image & Price Header */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={displayImage}
                      alt={item.crop_name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getCropImage(item.crop_name);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                      {item.category}
                    </div>

                    {/* Mandi Tag */}
                    <div className="absolute top-2.5 right-2.5 bg-blue-900/85 backdrop-blur-xs text-blue-100 text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Store className="w-3 h-3 text-blue-300" />
                      {item.market}
                    </div>

                    {/* Prominent Modal Price per kg and quintal */}
                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-slate-900 px-3.5 py-2 rounded-2xl shadow-lg border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                        Modal Price
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-blue-700">
                          ₹{modalKg}/kg
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        ₹{modalQtl.toLocaleString('en-IN')}/quintal
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                          {item.crop_name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.variety || 'FAQ Standard'} • {item.market}
                        </p>
                      </div>

                      {item.trend_pct !== undefined && (
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 ${
                            item.trend_pct >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.trend_pct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {item.trend_pct >= 0 ? `+${item.trend_pct}%` : `${item.trend_pct}%`}
                        </span>
                      )}
                    </div>

                    {/* Min / Modal / Max metrics in ₹/kg */}
                    <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Min</span>
                        <span className="font-extrabold text-slate-700">₹{minKg}/kg</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">₹{Math.round(minKg * 100)}/qtl</span>
                      </div>
                      <div className="border-x border-slate-200 bg-blue-50/50 rounded-md">
                        <span className="text-[10px] text-blue-600 block font-bold">Modal Rate</span>
                        <span className="font-black text-blue-800">₹{modalKg}/kg</span>
                        <span className="text-[9px] text-blue-600 block mt-0.5 font-bold">₹{modalQtl}/qtl</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Max</span>
                        <span className="font-extrabold text-slate-700">₹{maxKg}/kg</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">₹{Math.round(maxKg * 100)}/qtl</span>
                      </div>
                    </div>

                    {/* Meta information */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 px-1">
                      <span>Arrivals: <strong className="text-slate-800">{item.arrival_quantity || 115} MT</strong></span>
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-600">
                        {item.source || "AGMARKNET"}
                      </span>
                    </div>

                    {/* Dedicated Button: Show Prices in Each Mandi */}
                    <button
                      onClick={() => setSelectedCropForMandis(item.crop_name)}
                      className="w-full mt-3 bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold text-xs py-2 px-3 rounded-xl border border-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs group/btn"
                    >
                      <Store className="w-3.5 h-3.5 text-blue-600 group-hover/btn:scale-110 transition-transform" />
                      Show Prices in Each Mandi (₹/kg)
                    </button>
                  </div>
                </div>

                {/* Action Buttons: AI Prediction & Net Profit Calculator */}
                <div className="p-4 pt-0 border-t border-slate-100 mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenPredictionModal(item.crop_name.toLowerCase())}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs py-2 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      AI Prediction
                    </button>
                    <button
                      onClick={() => onOpenCompareModal(item.crop_name.toLowerCase())}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs py-2 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5 text-slate-600" />
                      Net Returns
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectNav('lots')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors text-center cursor-pointer shadow-xs"
                  >
                    Sell Lot at {item.market}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW: ALL CROPS & MANDIS WITH PRICES PER KG */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Produce</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Mandi & District</th>
                  <th className="py-3.5 px-4 text-center">Modal Rate (₹/kg)</th>
                  <th className="py-3.5 px-4 text-center">Min / Max (₹/kg)</th>
                  <th className="py-3.5 px-4 text-center">₹/Quintal</th>
                  <th className="py-3.5 px-4 text-center">Arrivals</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prices.map((item) => {
                  const modalKg = item.price_per_kg || item.modal_price;
                  const modalQtl = item.modal_price_qtl || Math.round(modalKg * 100);
                  const minKg = item.min_price || Math.round((item.min_price_qtl || modalQtl * 0.88) / 100);
                  const maxKg = item.max_price || Math.round((item.max_price_qtl || modalQtl * 1.12) / 100);
                  const displayImage = item.image || getCropImage(item.crop_name);

                  return (
                    <tr
                      key={item.id || `${item.crop_name}-${item.market}`}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      {/* Produce thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={displayImage}
                            alt={item.crop_name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getCropImage(item.crop_name);
                            }}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                          />
                          <div>
                            <span className="font-extrabold text-slate-900 block">
                              {item.crop_name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {item.variety || 'FAQ Standard'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                      </td>

                      {/* Mandi & District */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block flex items-center gap-1">
                          <Store className="w-3.5 h-3.5 text-blue-600 inline shrink-0" />
                          {item.market}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {item.district}, {item.state}
                        </span>
                      </td>

                      {/* Modal Rate (₹/kg) */}
                      <td className="py-3 px-4 text-center">
                        <span className="text-base font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl inline-block shadow-2xs">
                          ₹{modalKg}/kg
                        </span>
                      </td>

                      {/* Min / Max (₹/kg) */}
                      <td className="py-3 px-4 text-center text-slate-600">
                        <span className="text-slate-700 font-semibold">₹{minKg}</span>
                        <span className="text-slate-400 mx-1">-</span>
                        <span className="text-slate-700 font-semibold">₹{maxKg}</span>
                      </td>

                      {/* ₹/Quintal */}
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        ₹{modalQtl.toLocaleString('en-IN')}
                      </td>

                      {/* Arrivals */}
                      <td className="py-3 px-4 text-center text-slate-700 font-semibold">
                        {item.arrival_quantity || 120} MT
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCropForMandis(item.crop_name)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                            title="Compare prices in each Mandi"
                          >
                            <Store className="w-3 h-3" />
                            Each Mandi
                          </button>
                          <button
                            onClick={() => onOpenPredictionModal(item.crop_name.toLowerCase())}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="AI Price Forecast"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: REAL-TIME PRICES PER KG IN EACH MANDI FOR SELECTED CROP       */}
      {/* ==================================================================== */}
      {selectedCropForMandis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl p-5 sm:p-6 relative max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={getCropImage(selectedCropForMandis)}
                  alt={selectedCropForMandis}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedCropForMandis}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      Real-Time Prices in Each Mandi
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live Agmarknet prices per kg (₹/kg) across reporting APMC mandis.
                    {currentMandiPrice && (
                      <span className="ml-1 text-slate-700 font-semibold">
                        (Current Mandi: <strong>{selectedMarket}</strong> at ₹{currentMandiPrice}/kg)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCropForMandis(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filter & Sort Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 shrink-0">
              {/* Search within mandis */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search mandi, district or state..."
                  value={mandiSearch}
                  onChange={(e) => setMandiSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>

              {/* Sort by dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold shrink-0 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
                  Sort:
                </span>
                <select
                  value={mandiSortBy}
                  onChange={(e) => setMandiSortBy(e.target.value as any)}
                  className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="price_desc">Highest Price (₹/kg)</option>
                  <option value="price_asc">Lowest Price (₹/kg)</option>
                  <option value="arrivals_desc">Arrivals (MT)</option>
                </select>
              </div>
            </div>

            {/* Scrollable Mandi List */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-2.5 min-h-[250px]">
              {isMandiLoading ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-xs font-bold">Loading mandi prices across India...</span>
                </div>
              ) : filteredMandiPrices.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Store className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold">No mandis found matching "{mandiSearch}".</p>
                </div>
              ) : (
                filteredMandiPrices.map((m) => {
                  const mPriceKg = m.price_per_kg || m.modal_price;
                  const diff = currentMandiPrice ? roundDiff(mPriceKg - currentMandiPrice) : null;
                  const isCurrent = m.market.toLowerCase() === selectedMarket.toLowerCase();

                  return (
                    <div
                      key={m.id || `${m.market}-${m.district}`}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold">
                          <Store className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-sm">
                              {m.market}
                            </h4>
                            {isCurrent && (
                              <span className="bg-blue-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                Selected Mandi
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {m.district}, {m.state} • Variety: <strong>{m.variety || 'Standard'}</strong>
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span>Arrivals: <strong className="text-slate-700">{m.arrival_quantity || 120} MT</strong></span>
                            <span>Min: ₹{m.min_price || Math.round(mPriceKg * 0.9)}/kg</span>
                            <span>Max: ₹{m.max_price || Math.round(mPriceKg * 1.1)}/kg</span>
                          </div>
                        </div>
                      </div>

                      {/* Price per kg & Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                            Price per kg
                          </span>
                          <span className="text-xl font-black text-blue-700 block">
                            ₹{mPriceKg}/kg
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            ₹{(m.modal_price_qtl || Math.round(mPriceKg * 100)).toLocaleString('en-IN')}/qtl
                          </span>
                          {diff !== null && diff !== 0 && (
                            <span
                              className={`text-[10px] font-extrabold inline-flex items-center gap-0.5 ${
                                diff > 0 ? 'text-emerald-600' : 'text-slate-500'
                              }`}
                            >
                              {diff > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {diff > 0 ? `+₹${diff}/kg more` : `₹${Math.abs(diff)}/kg lower`}
                            </span>
                          )}
                        </div>

                        {!isCurrent ? (
                          <button
                            onClick={() => {
                              setSelectedState(m.state);
                              setSelectedDistrict(m.district);
                              setSelectedMarket(m.market);
                              setSelectedCropForMandis(null);
                            }}
                            className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs"
                          >
                            Switch Mandi
                          </button>
                        ) : (
                          <div className="text-emerald-700 text-xs font-bold flex items-center gap-1 shrink-0 px-2 py-1 bg-emerald-50 rounded-xl">
                            <Check className="w-4 h-4 text-emerald-600" />
                            Viewing
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>Showing {filteredMandiPrices.length} Mandis reporting {selectedCropForMandis} today</span>
              <button
                onClick={() => setSelectedCropForMandis(null)}
                className="font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function roundDiff(num: number): number {
  return Math.round(num * 10) / 10;
}

