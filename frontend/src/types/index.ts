export type UserRole = 'farmer' | 'buyer' | 'admin' | 'logistics' | 'storage';

export interface IndianDistrict {
  id: string;
  name: string;
  markets: string[];
}

export interface IndianState {
  id: string;
  name: string;
  districts: IndianDistrict[];
}

export interface CropItem {
  id: string;
  name: string;
  hindi: string;
  tamil: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Cash Crops' | 'Spices';
  image: string;
  standard_unit: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  trend_pct: number;
  arrival_status: string;
  arrival_trend: number;
  shelf_life_days: number;
}

export interface MandiPriceRecord {
  id?: number;
  crop_id?: string;
  crop_name: string;
  hindi_name?: string;
  tamil_name?: string;
  category: string;
  variety?: string;
  image: string;
  unit: string;
  state: string;
  district: string;
  market: string;
  modal_price: number;
  modal_price_qtl?: number;
  min_price: number;
  min_price_qtl?: number;
  max_price: number;
  max_price_qtl?: number;
  price_per_kg?: number;
  trend_pct?: number;
  arrival_status?: string;
  arrival_trend?: number;
  arrival_quantity?: number;
  date: string;
  arrival_date?: string;
  grade: string;
  source?: string;
}

export interface TransportCalculationResult {
  farm_location: string;
  destination_mandi: string;
  crop: string;
  quantity_kg: number;
  distance_km: number;
  estimated_travel_time: string;
  estimated_transport_cost: number;
  estimated_cost_per_kg: number;
  modal_price_per_kg: number;
  gross_amount: number;
  estimated_net_amount: number;
  ai_recommendation: {
    recommended_market: string;
    highest_net_amount: number;
    extra_benefit: number;
    advice: string;
  };
  comparisons: Array<{
    mandi: string;
    distance_km: number;
    modal_price_per_kg: number;
    transport_cost: number;
    transport_cost_per_kg: number;
    gross_amount: number;
    net_amount: number;
  }>;
  disclaimer: string;
}

export interface WeatherInfo {
  location: string;
  temperature_c: number;
  condition: string;
  rain_probability_pct: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  advisory: string;
  forecast: Array<{
    day: string;
    temp_c: number;
    condition: string;
    rain_prob: number;
    favorable: boolean;
  }>;
}

export interface FarmerUPIProfile {
  upi_id: string;
  bank_name: string;
  account_holder: string;
  verified: boolean;
  is_default: boolean;
  qr_string?: string;
  updated_at?: string;
  transactions: Array<{
    id: string;
    order_id: string;
    buyer: string;
    crop: string;
    amount: number;
    type: string;
    status: 'Completed' | 'Pending' | 'Failed' | 'Settled' | 'Escrow Held' | 'Refund';
    date: string;
    vpa: string;
    utr: string;
  }>;
}


export interface PriceForecastPoint {
  timeline: string;
  predicted_price: number;
  confidence_pct: number;
  trend: string;
}

export interface PriceHistoryPoint {
  day: string;
  price: number;
  arrivals_mt: number;
}

export interface AIPredictionData {
  crop: string;
  market: string;
  current_price: number;
  unit: string;
  history: PriceHistoryPoint[];
  forecast: PriceForecastPoint[];
  overall_confidence: number;
  recommendation: {
    action: string;
    color: string;
    expected_gain_pct: number;
    potential_extra_revenue: number;
    factors: Array<{
      factor: string;
      status: string;
      impact: string;
    }>;
  };
  disclaimer: string;
}

export interface MarketComparison {
  market_name: string;
  distance_km: number;
  gross_price_per_kg: number;
  transport_cost_per_kg: number;
  loading_cost_per_kg: number;
  storage_cost_per_kg: number;
  mandi_cess_pct: number;
  transit_time_hrs: number;
  demand_rating: string;
  gross_total: number;
  transport_total: number;
  loading_total: number;
  storage_total: number;
  cess_total: number;
  total_expenses: number;
  net_total: number;
  net_price_per_kg: number;
  is_best_recommendation?: boolean;
}

export interface CropLot {
  id: string;
  crop_name: string;
  variety: string;
  quantity_kg: number;
  quality_grade: string;
  harvest_date: string;
  location: string;
  expected_price_per_kg: number;
  status: 'Available for Sale' | 'Offer Received' | 'Sold' | 'In Storage';
  created_at: string;
}

export interface VerifiedBuyer {
  id: string;
  name: string;
  owner: string;
  verified: boolean;
  gst_verified: boolean;
  phone_verified: boolean;
  reliability_score: number;
  rating: number;
  completed_orders: number;
  location: string;
  distance_km: number;
  crop_required: string;
  variety: string;
  quantity_required: string;
  offered_price_per_kg: number;
  payment_terms: string;
  badge: string;
  contact_masked: string;
}

export interface OrderItem {
  order_id: string;
  crop_name: string;
  quantity_kg: number;
  price_per_kg: number;
  total_amount: number;
  buyer_name: string;
  buyer_verified: boolean;
  farmer_name: string;
  pickup_location: string;
  delivery_location: string;
  status: 'Order Confirmed' | 'Pickup Scheduled' | 'In Transit' | 'At Mandi' | 'Delivered' | 'Inspection Passed' | 'Payment Released';
  step: number;
  transporter: string;
  estimated_delivery: string;
  payment_status: string;
}

export interface LogisticsOption {
  id: string;
  provider_name: string;
  vehicle_type: string;
  capacity_kg: number;
  rate_per_km: number;
  base_fare: number;
  driver_name: string;
  rating: number;
  verified: boolean;
  contact_masked: string;
  features: string[];
}

export interface StorageUnit {
  id: string;
  name: string;
  location: string;
  distance_km: number;
  storage_type: string;
  total_capacity_mt: number;
  available_capacity_mt: number;
  price_per_quintal_per_month: number;
  price_per_day_kg: number;
  suitable_crops: string[];
  rating: number;
  humidity_control: string;
  verified: boolean;
  contact: string;
}

export interface DisputeItem {
  ticket_id: string;
  order_id: string;
  category: string;
  description: string;
  status: 'Open' | 'Under Review' | 'Action Required' | 'Resolved' | 'Closed';
  created_at: string;
  resolution: string;
}
