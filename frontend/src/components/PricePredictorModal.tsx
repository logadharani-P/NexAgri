import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
  ComposedChart
} from 'recharts';
import { apiService } from '../services/api';
import { AIPredictionData } from '../types';

interface PricePredictorModalProps {
  cropId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectNav?: (nav: string, extra?: any) => void;
}

export const PricePredictorModal: React.FC<PricePredictorModalProps> = ({
  cropId,
  isOpen,
  onClose,
  onSelectNav
}) => {
  const [data, setData] = useState<AIPredictionData | null>(null);
  const [selectedMandi, setSelectedMandi] = useState<string>('Coimbatore Main Mandi');

  useEffect(() => {
    if (isOpen) {
      apiService.getPrediction(cropId, selectedMandi).then(res => {
        setData(res);
      });
    }
  }, [cropId, selectedMandi, isOpen]);

  if (!isOpen || !data) return null;

  const currentKg = data.current_price || 34.0;
  const currentQtl = Math.round(currentKg * 100);
  const predictedKg = Math.round((currentKg * 1.125) * 10) / 10;
  const predictedQtl = Math.round(predictedKg * 100);

  // Combine historical and forecast data for the chart
  const chartPoints = [
    ...data.history.map(h => ({
      timeline: h.day,
      actualPrice: h.price,
      predictedPrice: null as number | null,
      arrivals: h.arrivals_mt
    })),
    {
      timeline: "Today (Live)",
      actualPrice: currentKg,
      predictedPrice: currentKg,
      arrivals: 135
    },
    ...data.forecast.map(f => ({
      timeline: f.timeline,
      actualPrice: null as number | null,
      predictedPrice: f.predicted_price,
      arrivals: Math.round(135 * 0.92)
    }))
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-xs">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">
                    AI Price Prediction & Demand Radar
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                    86% Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Crop: <strong className="text-slate-800 capitalize">{data.crop}</strong> • Selected Market: <strong className="text-slate-800">{selectedMandi}</strong>
                </p>
              </div>
            </div>

            {/* Mandi Selector */}
            <select
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Coimbatore Main Mandi">Coimbatore Main Mandi</option>
              <option value="Mettupalayam Regulated Market">Mettupalayam Regulated Market</option>
              <option value="Oddanchatram Vegetable Market">Oddanchatram Vegetable Market</option>
              <option value="Erode Regulated Market">Erode Regulated Market</option>
            </select>
          </div>
        </div>

        {/* 11. PRICE PREDICTION SUMMARY CARDS (EXACT MATCH TO SPECIFICATION) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {/* Current Price */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Current Price
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₹{currentKg}/kg
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              ₹{currentQtl.toLocaleString('en-IN')}/quintal
            </span>
          </div>

          {/* Predicted Price */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-300">
            <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider block">
              Predicted Price (3-5 Days)
            </span>
            <div className="text-2xl font-black text-blue-800 mt-1">
              ₹{predictedKg}/kg
            </div>
            <span className="text-[11px] text-blue-700 font-bold">
              ₹{predictedQtl.toLocaleString('en-IN')}/quintal
            </span>
          </div>

          {/* Expected Trend */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100/70 to-indigo-50 border border-blue-200">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Expected Trend
            </span>
            <div className="text-lg font-black text-blue-800 mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>↑ Increase</span>
            </div>
            <span className="text-[11px] text-blue-700 font-semibold">
              +12.5% Anticipated
            </span>
          </div>
        </div>

        {/* Prediction Narrative */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h4 className="text-sm font-extrabold text-amber-300">
              Prediction Summary: "Expected price may increase over the next 2 to 5 days."
            </h4>
          </div>
          <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">
            Recommendation: <strong>WAIT 2–3 DAYS</strong> before liquidating bulk lots. Market arrivals are dropping by 14% while institutional requisitions are building ahead of festival demand.
          </p>
        </div>

        {/* 12 & 13. Weather & Festival Demand Signals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Weather Input */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>Weather Impact (Farm Radar)</span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              Dry weather window across Western Ghats (29.5°C, 15% rain risk). Road transit remains clear for 48 hours; ideal harvest timing.
            </p>
            <div className="mt-2 text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded inline-block">
              ✓ Harvest & Transport Friendly
            </div>
          </div>

          {/* Festival Demand Input */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Festival Demand Signal</span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              Upcoming Pongal & regional festive cycles drive higher retail and institutional vegetable demand by an estimated 12-18%.
            </p>
            <div className="mt-2 text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-1 rounded inline-block">
              🎉 Pre-Festival Procurement Active
            </div>
          </div>
        </div>

        {/* Forecast Chart */}
        <div className="mt-5 p-4 rounded-2xl border border-slate-200 bg-white">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Historical Actuals vs. Predicted Price Trajectory (₹/kg)
          </h4>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartPoints}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="timeline" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis unit="₹" tick={{ fontSize: 10, fill: '#64748b' }} domain={['dataMin - 3', 'dataMax + 3']} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `₹${value}/kg`,
                    name === 'actualPrice' ? 'Historical Mandi Price' : 'Predicted Mandi Price'
                  ]}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="actualPrice" name="Actual Price" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="predictedPrice" name="AI Prediction" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requirement 11: Market Risk + Crop Protection Integration */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                Market Risk + Crop Protection (PMFBY Integrated)
              </h4>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
              Insurance: Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white/80 p-3 rounded-xl border border-emerald-100">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Current Market Price</span>
              <span className="font-extrabold text-slate-900">₹{currentKg}/kg</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Predicted Price (7d)</span>
              <span className="font-extrabold text-blue-700">₹{predictedKg}/kg</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Crop Loss Risk</span>
              <span className="font-extrabold text-amber-700">Medium (Rain Window)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">Government Subsidy</span>
              <span className="font-extrabold text-emerald-700">Up to 70%</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 text-[11px]">
            <span className="text-slate-500 italic">
              *IMPORTANT: Price predictions are for market timing only and NEVER determine whether an insurance claim is approved.
            </span>
            {onSelectNav && (
              <button
                onClick={() => {
                  onClose();
                  onSelectNav('insurance', data.crop);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer"
              >
                Protect {data.crop} with PMFBY →
              </button>
            )}
          </div>
        </div>

        {/* Mandatory AI Estimates Disclaimer */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="leading-snug text-[11px]">
            <strong>Important AI Disclaimer:</strong> Predictions are algorithmic estimates based on historical arrivals, weather radar, and festival cycles. NEXAGRI provides this for decision support only. Prices are not guaranteed.
          </span>
        </div>
      </div>
    </div>
  );
};
