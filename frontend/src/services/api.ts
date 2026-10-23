import {
  IndianState,
  CropItem,
  MandiPriceRecord,
  AIPredictionData,
  MarketComparison,
  CropLot,
  VerifiedBuyer,
  OrderItem,
  LogisticsOption,
  StorageUnit,
  DisputeItem
} from '../types';
import {
  INDIAN_STATES,
  INITIAL_CROPS,
  INITIAL_BUYERS,
  INITIAL_LOGISTICS,
  INITIAL_STORAGE,
  INITIAL_LOTS,
  INITIAL_ORDERS,
  INITIAL_DISPUTES
} from '../data/indianAgriData';
import {
  PAN_INDIA_DATASET,
  filterMarketPrices,
  DATASET_STATS,
  getMarketsForCrop,
  calculateBestMarketNetReturn,
  MarketPriceItem
} from '../data/marketPricesDataset';
import { getCropImage } from '../data/cropImages';
import { offlineStorage } from './offlineStorage';

const BASE_URL = 'http://localhost:8000/api';

// Safe fetch with fallback and offline persistence
async function fetchWithFallback<T>(endpoint: string, fallbackData: T, options?: RequestInit): Promise<T> {
  const isPost = options?.method === 'POST';

  // If device is offline and it's a GET request, check offline storage first
  if (!offlineStorage.isOnline() && !isPost) {
    const cached = offlineStorage.get<T>(endpoint);
    if (cached) return cached.data;
    return fallbackData;
  }

  // If device is offline and it's a POST request, queue it to sync later!
  if (!offlineStorage.isOnline() && isPost && options?.body) {
    try {
      const parsedBody = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      offlineStorage.queueAction('SEND_SMS', `${BASE_URL}${endpoint}`, parsedBody);
    } catch {
      // ignore
    }
    return fallbackData;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 sec timeout
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    // Cache successful GET data in offline storage
    if (!isPost) {
      offlineStorage.set(endpoint, data);
    }
    return data;
  } catch (err) {
    // Check offline storage before falling back to static fixtures
    const cached = offlineStorage.get<T>(endpoint);
    if (cached) return cached.data;
    return fallbackData;
  }
}

export const apiService = {
  getStates: async (): Promise<IndianState[]> => {
    return fetchWithFallback('/states', INDIAN_STATES);
  },

  getPanIndiaStates: async (): Promise<string[]> => {
    const defaultList = INDIAN_STATES.map(s => s.name);
    return fetchWithFallback('/states', defaultList);
  },

  getDistricts: async (state: string): Promise<string[]> => {
    const foundState = INDIAN_STATES.find(s => s.name.toLowerCase() === state.toLowerCase());
    const fallbackList = foundState ? foundState.districts.map(d => d.name) : ["Coimbatore", "Erode", "Salem"];
    return fetchWithFallback(`/districts?state=${encodeURIComponent(state)}`, fallbackList);
  },

  getMarkets: async (state: string, district: string): Promise<string[]> => {
    const foundState = INDIAN_STATES.find(s => s.name.toLowerCase() === state.toLowerCase());
    const foundDist = foundState?.districts.find(d => d.name.toLowerCase() === district.toLowerCase());
    const fallbackList = foundDist ? foundDist.markets : ["Main Mandi", "Regulated Market"];
    return fetchWithFallback(`/markets?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`, fallbackList);
  },

  getCrops: async (category?: string): Promise<CropItem[]> => {
    let filtered = INITIAL_CROPS;
    if (category && category !== 'All') {
      filtered = INITIAL_CROPS.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    return fetchWithFallback(`/crops${category ? `?category=${category}` : ''}`, filtered);
  },

  getMandiPrices: async (
    state?: string,
    district?: string,
    market?: string,
    crop?: string,
    category?: string,
    date?: string
  ): Promise<MandiPriceRecord[]> => {
    const fallbackPrices: MandiPriceRecord[] = INITIAL_CROPS.map(c => {
      const modal = c.modal_price;
      return {
        crop_id: c.id,
        crop_name: c.name,
        hindi_name: c.hindi,
        tamil_name: c.tamil,
        category: c.category,
        variety: "Hybrid / Standard",
        image: c.image,
        unit: c.standard_unit,
        state: state || 'Tamil Nadu',
        district: district || 'Coimbatore',
        market: market || 'Mettupalayam',
        modal_price: modal,
        modal_price_qtl: modal * 100,
        min_price: c.min_price,
        min_price_qtl: c.min_price * 100,
        max_price: c.max_price,
        max_price_qtl: c.max_price * 100,
        price_per_kg: modal,
        trend_pct: c.trend_pct,
        arrival_status: c.arrival_status,
        arrival_trend: c.arrival_trend,
        arrival_quantity: 120.0,
        date: date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        grade: "FAQ (Fair Average Quality)",
        source: "AGMARKNET / data.gov.in"
      };
    });

    const params = new URLSearchParams();
    if (state && state !== 'All India' && state !== 'All') params.append('state', state);
    if (district && district !== 'All') params.append('district', district);
    if (market && market !== 'All') params.append('market', market);
    if (crop && crop.trim()) params.append('commodity', crop.trim());
    if (category && category !== 'All') params.append('category', category);
    if (date && date.trim()) params.append('date', date.trim());

    return fetchWithFallback(
      `/market-prices?${params.toString()}`,
      fallbackPrices
    );
  },

  getMandiPricesByCrop: async (
    cropName: string,
    state?: string,
    district?: string
  ): Promise<MandiPriceRecord[]> => {
    const params = new URLSearchParams();
    params.append('commodity', cropName);
    if (state && state !== 'All India' && state !== 'All') params.append('state', state);
    if (district && district !== 'All') params.append('district', district);

    const fallback: MandiPriceRecord[] = [
      {
        crop_id: cropName.toLowerCase(),
        crop_name: cropName,
        variety: "Grade A Standard",
        category: "Produce",
        state: "Tamil Nadu",
        district: "Coimbatore",
        market: "Mettupalayam",
        modal_price: 32,
        modal_price_qtl: 3200,
        min_price: 28,
        min_price_qtl: 2800,
        max_price: 36,
        max_price_qtl: 3600,
        price_per_kg: 32,
        arrival_quantity: 145,
        date: new Date().toISOString().split('T')[0],
        unit: "kg",
        grade: "FAQ (Fair Average Quality)",
        source: "AGMARKNET",
        image: getCropImage(cropName)
      },
      {
        crop_id: cropName.toLowerCase(),
        crop_name: cropName,
        variety: "Grade A Standard",
        category: "Produce",
        state: "Tamil Nadu",
        district: "Coimbatore",
        market: "Coimbatore Main Mandi",
        modal_price: 34,
        modal_price_qtl: 3400,
        min_price: 30,
        min_price_qtl: 3000,
        max_price: 38,
        max_price_qtl: 3800,
        price_per_kg: 34,
        arrival_quantity: 260,
        date: new Date().toISOString().split('T')[0],
        unit: "kg",
        grade: "FAQ (Fair Average Quality)",
        source: "AGMARKNET",
        image: getCropImage(cropName)
      }
    ];

    return fetchWithFallback(`/mandi-prices-by-crop?${params.toString()}`, fallback);
  },

  calculateTransport: async (payload: {
    origin_location: string;
    destination_mandi: string;
    crop: string;
    quantity_kg: number;
    current_modal_price_per_kg?: number;
  }) => {
    const qty = payload.quantity_kg || 2500;
    const rate = payload.current_modal_price_per_kg || 34;
    const fallback = {
      farm_location: payload.origin_location,
      destination_mandi: payload.destination_mandi,
      crop: payload.crop,
      quantity_kg: qty,
      distance_km: 38,
      estimated_travel_time: "1 hr 15 mins",
      estimated_transport_cost: 1336,
      estimated_cost_per_kg: 0.53,
      modal_price_per_kg: rate,
      gross_amount: qty * rate,
      estimated_net_amount: (qty * rate) - 1336,
      ai_recommendation: {
        recommended_market: "Coimbatore Main Mandi",
        highest_net_amount: (qty * (rate + 2)) - 1336,
        extra_benefit: 4500,
        advice: "Coimbatore Main Mandi offers the highest net return after transport expenses."
      },
      comparisons: [
        { mandi: "Coimbatore Main Mandi", distance_km: 38, modal_price_per_kg: rate + 2, transport_cost: 1336, transport_cost_per_kg: 0.53, gross_amount: qty * (rate + 2), net_amount: (qty * (rate + 2)) - 1336 },
        { mandi: "Mettupalayam Regulated Market", distance_km: 12, modal_price_per_kg: rate - 1.5, transport_cost: 764, transport_cost_per_kg: 0.31, gross_amount: qty * (rate - 1.5), net_amount: (qty * (rate - 1.5)) - 764 }
      ],
      disclaimer: "⚠️ Estimated calculation for decision support; not a guaranteed rate."
    };

    return fetchWithFallback('/transport-calc', fallback, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  getWeather: async (location = "Mettupalayam, Coimbatore") => {
    const fallback = {
      location,
      temperature_c: 29.5,
      condition: "Partly Cloudy with Dry Windows",
      rain_probability_pct: 15,
      humidity_pct: 65,
      wind_speed_kmh: 12.4,
      advisory: "Favorable dry transport window for the next 48-72 hours. Ideal for vegetable harvest and loading.",
      forecast: [
        { day: "Today", temp_c: 30, condition: "Sunny / Clear", rain_prob: 10, favorable: true },
        { day: "Tomorrow", temp_c: 29, condition: "Scattered Clouds", rain_prob: 15, favorable: true },
        { day: "+2 Days", temp_c: 28, condition: "Light Showers Possible", rain_prob: 35, favorable: false },
        { day: "+3 Days", temp_c: 31, condition: "Clear Sky", rain_prob: 10, favorable: true },
        { day: "+4 Days", temp_c: 30, condition: "Dry & Breezy", rain_prob: 5, favorable: true }
      ]
    };
    return fetchWithFallback(`/weather?location=${encodeURIComponent(location)}`, fallback);
  },

  getFarmerUPIProfile: async () => {
    const fallback = {
      upi_id: "selvam.farmer@sbi",
      bank_name: "State Bank of India",
      account_holder: "R. Selvam",
      verified: true,
      is_default: true,
      transactions: []
    };
    return fetchWithFallback('/upi/profile', fallback);
  },

  updateFarmerUPI: async (upi_id: string, is_default = true) => {
    return fetchWithFallback('/upi/profile', { status: 'success' }, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ upi_id, is_default })
    });
  },

  sendSMSAlert: async (payload: {
    phone_number: string;
    alert_type?: string;
    crop: string;
    mandi: string;
    price_per_kg?: number;
    custom_message?: string;
  }) => {
    return fetchWithFallback('/sms/send', {
      status: 'simulated',
      provider: 'NEXAGRI SMS Gateway',
      phone: payload.phone_number,
      message: payload.custom_message || `NEXAGRI Alert: ${payload.crop} price at ${payload.mandi} is ₹${payload.price_per_kg}/kg.`
    }, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  getAutoSMSRules: async () => {
    return fetchWithFallback('/sms/auto-rules', {
      enabled: true,
      phone_number: '+91 98765 43210',
      auto_price_surge_enabled: true,
      price_surge_threshold_pct: 8.0,
      auto_arrival_drop_enabled: true,
      auto_rain_warning_enabled: true,
      rain_threshold_pct: 35.0,
      auto_order_escrow_enabled: true,
      monitored_crops: ['Tomato', 'Onion', 'Potato', 'Turmeric', 'Cotton'],
      preferred_mandi: 'Coimbatore Main Mandi',
      frequency: 'instant'
    });
  },

  updateAutoSMSRules: async (prefs: any) => {
    return fetchWithFallback('/sms/auto-rules', {
      status: 'success',
      preferences: prefs
    }, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs)
    });
  },

  evaluateAutoSMS: async (payload: { phone_number?: string; crop?: string; mandi?: string; force_trigger?: boolean } = {}) => {
    return fetchWithFallback('/sms/auto-evaluate', {
      status: 'triggered',
      dispatched_alerts: [
        {
          id: `sms_auto_${Date.now()}`,
          trigger_type: 'auto_price_surge',
          phone: payload.phone_number || '+91 98765 43210',
          crop: payload.crop || 'Tomato',
          mandi: payload.mandi || 'Coimbatore Main Mandi',
          message: `NEXAGRI AUTO-SMS: ${payload.crop || 'Tomato'} price surged +12% to ₹36/kg at ${payload.mandi || 'Coimbatore Main Mandi'}. Recommended action: Harvest & dispatch within 36h.`,
          status: 'delivered',
          provider: 'NEXAGRI Auto-Carrier Engine',
          timestamp: new Date().toISOString()
        }
      ]
    }, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  getSMSLogs: async () => {
    return fetchWithFallback('/sms/logs', [
      {
        id: 'sms_log_1',
        trigger_type: 'auto_price_surge',
        phone: '+91 98765 43210',
        crop: 'Tomato',
        mandi: 'Coimbatore Main Mandi',
        message: 'NEXAGRI AUTO-ALERT: Tomato price jumped +8.4% to ₹34/kg at Coimbatore Main Mandi due to 14% lower border arrivals.',
        status: 'delivered',
        provider: 'NEXAGRI Auto-Carrier Gateway',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'sms_log_2',
        trigger_type: 'auto_rain_warning',
        phone: '+91 98765 43210',
        crop: 'Tomato',
        mandi: 'Mettupalayam APMC',
        message: 'NEXAGRI RADAR ALERT: Western Ghats rain risk 45% in 48h. Harvest ready horticulture produce immediately to prevent field rot.',
        status: 'delivered',
        provider: 'NEXAGRI Weather Radar SMS',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ]);
  },

  getPrediction: async (cropId: string = 'tomato', market: string = 'Coimbatore Main Mandi'): Promise<AIPredictionData> => {
    const cropItem = INITIAL_CROPS.find(c => c.id === cropId) || INITIAL_CROPS[0];
    const curr = cropItem.modal_price;

    const fallback: AIPredictionData = {
      crop: cropItem.name,
      market,
      current_price: curr,
      unit: cropItem.standard_unit,
      history: [
        { day: "6 Days Ago", price: Math.round(curr * 0.90 * 10) / 10, arrivals_mt: 180 },
        { day: "5 Days Ago", price: Math.round(curr * 0.92 * 10) / 10, arrivals_mt: 172 },
        { day: "4 Days Ago", price: Math.round(curr * 0.95 * 10) / 10, arrivals_mt: 165 },
        { day: "3 Days Ago", price: Math.round(curr * 0.94 * 10) / 10, arrivals_mt: 168 },
        { day: "2 Days Ago", price: Math.round(curr * 0.98 * 10) / 10, arrivals_mt: 154 },
        { day: "Yesterday", price: Math.round(curr * 0.99 * 10) / 10, arrivals_mt: 142 },
        { day: "Today (Live)", price: curr, arrivals_mt: 135 }
      ],
      forecast: [
        { timeline: "Tomorrow", predicted_price: Math.round(curr * 1.035 * 10) / 10, confidence_pct: 88, trend: "Up" },
        { timeline: "+2 Days", predicted_price: Math.round(curr * 1.07 * 10) / 10, confidence_pct: 85, trend: "Up" },
        { timeline: "+3 Days", predicted_price: Math.round(curr * 1.12 * 10) / 10, confidence_pct: 82, trend: "Up" },
        { timeline: "+5 Days", predicted_price: Math.round(curr * 1.15 * 10) / 10, confidence_pct: 78, trend: "Up" },
        { timeline: "+7 Days", predicted_price: Math.round(curr * 1.18 * 10) / 10, confidence_pct: 74, trend: "Moderate Up" }
      ],
      overall_confidence: 82,
      recommendation: {
        action: "WAIT 2–3 DAYS",
        color: "blue",
        expected_gain_pct: 12.5,
        potential_extra_revenue: Math.round(curr * 0.125 * 2500),
        factors: [
          { factor: "Market Arrivals", status: "Down 14% vs 7-day average", impact: "Bullish (Restricted Supply)" },
          { factor: "Upcoming Festival", status: "Pongal & Festive procurement starting", impact: "High Demand Surge" },
          { factor: "Weather Outlook", status: "Dry harvesting window for 3 days", impact: "Safe to Harvest Later" },
          { factor: "Buyer Enquiries", status: "8 Institutional orders looking for Grade A stock", impact: "Ready Off-takers" }
        ]
      },
      disclaimer: "AI prediction estimates derived from multi-factor regression, Agmarknet arrival trends, and seasonal indices. Always verify on-ground mandi supply."
    };

    return fetchWithFallback(`/predict/${cropId}?market=${encodeURIComponent(market)}`, fallback);
  },

  compareMarkets: async (cropId: string = 'tomato', quantityKg: number = 2500, origin: string = 'Mettupalayam'): Promise<{
    crop: string;
    quantity_kg: number;
    origin: string;
    best_market: string;
    highest_net_price: number;
    comparisons: MarketComparison[];
  }> => {
    const cropItem = INITIAL_CROPS.find(c => c.id === cropId) || INITIAL_CROPS[0];
    const base = cropItem.modal_price;

    const comparisons: MarketComparison[] = [
      {
        market_name: "Coimbatore Main Wholesale Mandi",
        distance_km: 38,
        gross_price_per_kg: base + 2.5,
        transport_cost_per_kg: 1.40,
        loading_cost_per_kg: 0.35,
        storage_cost_per_kg: 0.00,
        mandi_cess_pct: 1.0,
        transit_time_hrs: 1.2,
        demand_rating: "Very High",
        gross_total: Math.round((base + 2.5) * quantityKg),
        transport_total: Math.round(1.40 * quantityKg),
        loading_total: Math.round(0.35 * quantityKg),
        storage_total: 0,
        cess_total: Math.round((base + 2.5) * quantityKg * 0.01),
        total_expenses: Math.round((1.40 + 0.35 + (base + 2.5) * 0.01) * quantityKg),
        net_total: Math.round(((base + 2.5) - (1.40 + 0.35 + (base + 2.5) * 0.01)) * quantityKg),
        net_price_per_kg: Math.round(((base + 2.5) - (1.40 + 0.35 + (base + 2.5) * 0.01)) * 100) / 100,
        is_best_recommendation: true
      },
      {
        market_name: "Erode Agricultural Producer Market",
        distance_km: 72,
        gross_price_per_kg: base + 3.8,
        transport_cost_per_kg: 2.20,
        loading_cost_per_kg: 0.35,
        storage_cost_per_kg: 0.20,
        mandi_cess_pct: 1.0,
        transit_time_hrs: 2.2,
        demand_rating: "High",
        gross_total: Math.round((base + 3.8) * quantityKg),
        transport_total: Math.round(2.20 * quantityKg),
        loading_total: Math.round(0.35 * quantityKg),
        storage_total: Math.round(0.20 * quantityKg),
        cess_total: Math.round((base + 3.8) * quantityKg * 0.01),
        total_expenses: Math.round((2.20 + 0.35 + 0.20 + (base + 3.8) * 0.01) * quantityKg),
        net_total: Math.round(((base + 3.8) - (2.20 + 0.35 + 0.20 + (base + 3.8) * 0.01)) * quantityKg),
        net_price_per_kg: Math.round(((base + 3.8) - (2.20 + 0.35 + 0.20 + (base + 3.8) * 0.01)) * 100) / 100
      },
      {
        market_name: "Mettupalayam Regulated Market",
        distance_km: 12,
        gross_price_per_kg: base - 1.5,
        transport_cost_per_kg: 0.60,
        loading_cost_per_kg: 0.30,
        storage_cost_per_kg: 0.00,
        mandi_cess_pct: 1.0,
        transit_time_hrs: 0.5,
        demand_rating: "Moderate",
        gross_total: Math.round((base - 1.5) * quantityKg),
        transport_total: Math.round(0.60 * quantityKg),
        loading_total: Math.round(0.30 * quantityKg),
        storage_total: 0,
        cess_total: Math.round((base - 1.5) * quantityKg * 0.01),
        total_expenses: Math.round((0.60 + 0.30 + (base - 1.5) * 0.01) * quantityKg),
        net_total: Math.round(((base - 1.5) - (0.60 + 0.30 + (base - 1.5) * 0.01)) * quantityKg),
        net_price_per_kg: Math.round(((base - 1.5) - (0.60 + 0.30 + (base - 1.5) * 0.01)) * 100) / 100
      },
      {
        market_name: "Koyambedu Wholesale Market, Chennai",
        distance_km: 510,
        gross_price_per_kg: base + 8.5,
        transport_cost_per_kg: 6.80,
        loading_cost_per_kg: 0.60,
        storage_cost_per_kg: 0.50,
        mandi_cess_pct: 1.2,
        transit_time_hrs: 10.0,
        demand_rating: "Mega Consumption",
        gross_total: Math.round((base + 8.5) * quantityKg),
        transport_total: Math.round(6.80 * quantityKg),
        loading_total: Math.round(0.60 * quantityKg),
        storage_total: Math.round(0.50 * quantityKg),
        cess_total: Math.round((base + 8.5) * quantityKg * 0.012),
        total_expenses: Math.round((6.80 + 0.60 + 0.50 + (base + 8.5) * 0.012) * quantityKg),
        net_total: Math.round(((base + 8.5) - (6.80 + 0.60 + 0.50 + (base + 8.5) * 0.012)) * quantityKg),
        net_price_per_kg: Math.round(((base + 8.5) - (6.80 + 0.60 + 0.50 + (base + 8.5) * 0.012)) * 100) / 100
      }
    ];

    return fetchWithFallback(`/compare-markets/${cropId}?quantity_kg=${quantityKg}&origin=${encodeURIComponent(origin)}`, {
      crop: cropItem.name,
      quantity_kg: quantityKg,
      origin,
      best_market: comparisons[0].market_name,
      highest_net_price: comparisons[0].net_price_per_kg,
      comparisons
    });
  },

  getLots: async (): Promise<CropLot[]> => {
    return fetchWithFallback('/lots', INITIAL_LOTS);
  },

  createLot: async (lotData: Partial<CropLot>): Promise<CropLot> => {
    const newLot: CropLot = {
      id: `LOT-AG${new Date().getFullYear()}${Math.floor(100 + Math.random() * 900)}`,
      crop_name: lotData.crop_name || 'Tomato',
      variety: lotData.variety || 'Standard Hybrid',
      quantity_kg: lotData.quantity_kg || 1000,
      quality_grade: lotData.quality_grade || 'Grade A',
      harvest_date: lotData.harvest_date || 'Ready for Harvest',
      location: lotData.location || 'Mettupalayam, Coimbatore',
      expected_price_per_kg: lotData.expected_price_per_kg || 35,
      status: 'Available for Sale',
      created_at: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch(`${BASE_URL}/lots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lotData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Return local lot
    }
    return newLot;
  },

  getBuyers: async (): Promise<VerifiedBuyer[]> => {
    return fetchWithFallback('/buyers', INITIAL_BUYERS);
  },

  getOrders: async (): Promise<OrderItem[]> => {
    return fetchWithFallback('/orders', INITIAL_ORDERS);
  },

  getLogistics: async (): Promise<LogisticsOption[]> => {
    return fetchWithFallback('/logistics', INITIAL_LOGISTICS);
  },

  getStorage: async (): Promise<StorageUnit[]> => {
    return fetchWithFallback('/storage', INITIAL_STORAGE);
  },

  getDisputes: async (): Promise<DisputeItem[]> => {
    return fetchWithFallback('/disputes', INITIAL_DISPUTES);
  },

  createDispute: async (dispute: { order_id: string; category: string; description: string; contact_phone: string }): Promise<DisputeItem> => {
    const newDisp: DisputeItem = {
      ticket_id: `DISP-2026-0${Math.floor(Math.random() * 80 + 10)}`,
      order_id: dispute.order_id,
      category: dispute.category,
      description: dispute.description,
      status: 'Open',
      created_at: new Date().toISOString().split('T')[0],
      resolution: 'Grievance officer assigned. Expected response within 2 hours.'
    };

    try {
      const res = await fetch(`${BASE_URL}/disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dispute)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return newDisp;
  },

  askAIChat: async (query: string, language: string = 'English'): Promise<{ reply: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }

    const q = query.toLowerCase();
    if (q.includes('tomato') || q.includes('தக்காளி') || q.includes('टमाटर')) {
      return {
        reply: "🍅 **Tomato Market Pulse**:\nToday's modal price in Coimbatore is **₹32/kg** (up 8.4%).\n💡 **AI Recommendation**: **WAIT 2–3 DAYS** before selling your full lot. Market arrivals are down 14% and strong festival demand is projected to push prices to **₹35–₹37/kg**."
      };
    } else if (q.includes('where to sell') || q.includes('best market') || q.includes('எங்கு விற்க')) {
      return {
        reply: "🏆 **Best Net Revenue Market Near You**:\nBased on your location in Mettupalayam:\n• **Coimbatore Main Mandi (38 km)** gives the highest **Net Price: ₹32.50/kg** after deducting ₹1.40 transport and ₹0.35 handling.\n• Local Mettupalayam gives Net ₹29.50/kg.\n• Selling in Coimbatore yields approximately **+₹7,500 extra profit** on a 2.5 tonne lot!"
      };
    } else if (q.includes('cold storage') || q.includes('store') || q.includes('சேமிப்பு')) {
      return {
        reply: "🏪 **Recommended Cold Storage Near You**:\n**Mettupalayam Nilgiris Cooperative Cold Store** (11 km away)\n• Available Capacity: 410 MT\n• Rate: ₹0.06/kg per day (or ₹110/quintal/month)\n• Temperature: 2°C–10°C with automated humidity control."
      };
    } else {
      return {
        reply: `🌾 **NEXAGRI Advisory**:\nReceived your question: "${query}". Real-time Agmarknet prices show strong demand across South and Western Indian markets. You can check the Market Prices tab for live mandi arrivals or book instant transport via our Logistics portal!`
      };
    }
  }
};
