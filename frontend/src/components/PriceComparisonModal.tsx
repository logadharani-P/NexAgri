import React, { useState, useEffect } from 'react';
import { X, Calculator, Truck, CheckCircle2, TrendingUp, AlertCircle, Sparkles, MapPin } from 'lucide-react';
import { apiService } from '../services/api';
import { MarketComparison } from '../types';

interface PriceComparisonModalProps {
  cropId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectMandi: (mandiName: string) => void;
}

export const PriceComparisonModal: React.FC<PriceComparisonModalProps> = ({
  cropId,
  isOpen,
  onClose,
  onSelectMandi
}) => {
  const [quantityKg, setQuantityKg] = useState<number>(2500);
  const [origin, setOrigin] = useState<string>('Sirumugai, Mettupalayam');
  const [comparisonData, setComparisonData] = useState<{
    crop: string;
    best_market: string;
    highest_net_price: number;
    comparisons: MarketComparison[];
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      apiService.compareMarkets(cropId, quantityKg, origin).then(res => {
        setComparisonData(res);
      });
    }
  }, [cropId, quantityKg, origin, isOpen]);

  if (!isOpen || !comparisonData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800 text-lg">⚖️</span>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Multi-Market Net Profit Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Commodity: <strong className="text-slate-800">{comparisonData.crop}</strong> • High-Return Optimizer
              </p>
            </div>
          </div>

          {/* Quick Simulation Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Produce Quantity (kg)
              </label>
              <input
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value) || 100)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Farmer Origin Location
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Net Formula Note */}
        <div className="mt-4 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between text-blue-950">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>Net In-Hand Revenue Formula:</strong> Market Price - Transport - Loading & Unloading - Storage - Mandi Cess
            </span>
          </div>
          <span className="bg-blue-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0">
            Real In-Hand Profit
          </span>
        </div>

        {/* Comparison Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 text-[11px] font-extrabold uppercase tracking-wider">
                <th className="p-3">Mandi / Market</th>
                <th className="p-3">Distance</th>
                <th className="p-3">Gross Rate</th>
                <th className="p-3">Transport Freight</th>
                <th className="p-3">Handling & Cess</th>
                <th className="p-3">Net Selling Price</th>
                <th className="p-3">Total In-Hand</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {comparisonData.comparisons.map((m, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    m.is_best_recommendation ? 'bg-blue-50/60 font-semibold' : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-900">{m.market_name}</span>
                      {m.is_best_recommendation && (
                        <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          BEST NET RETURN
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">Transit: ~{m.transit_time_hrs} hrs • Demand: {m.demand_rating}</span>
                  </td>

                  <td className="p-3 text-slate-600">
                    <span className="font-bold text-slate-800">{m.distance_km} km</span>
                  </td>

                  <td className="p-3 font-bold text-slate-900">
                    ₹{m.gross_price_per_kg}/kg
                  </td>

                  <td className="p-3 text-red-600 font-semibold">
                    -₹{m.transport_cost_per_kg}/kg
                    <span className="text-[10px] text-slate-400 block font-normal">(₹{m.transport_total})</span>
                  </td>

                  <td className="p-3 text-red-600 font-semibold">
                    -₹{(m.loading_cost_per_kg + m.storage_cost_per_kg + (m.gross_price_per_kg * m.mandi_cess_pct / 100)).toFixed(2)}/kg
                    <span className="text-[10px] text-slate-400 block font-normal">(₹{m.loading_total + m.cess_total})</span>
                  </td>

                  <td className="p-3">
                    <span className={`text-sm font-black ${m.is_best_recommendation ? 'text-blue-700' : 'text-slate-800'}`}>
                      ₹{m.net_price_per_kg}/kg
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="text-sm font-black text-slate-900">
                      ₹{m.net_total.toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        onSelectMandi(m.market_name);
                        onClose();
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                        m.is_best_recommendation
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      Choose Mandi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Insight Box */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-amber-900">Notice the Advantage of Net Price vs Gross Price:</p>
            <p className="mt-0.5 leading-relaxed">
              Chennai Mandi appears highest at ₹{comparisonData.comparisons[3]?.gross_price_per_kg}/kg, but long haul freight (₹6.80/kg) and handling drops its net return to ₹{comparisonData.comparisons[3]?.net_price_per_kg}/kg. <strong>Coimbatore Main Mandi gives the true highest payout of ₹{comparisonData.highest_net_price}/kg</strong> net in your pocket!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
