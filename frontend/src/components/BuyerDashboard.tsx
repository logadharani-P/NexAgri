import React, { useState, useEffect } from 'react';
import {
  Building2,
  Package,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  CreditCard,
  Truck,
  Search,
  Star,
  DollarSign
} from 'lucide-react';
import { apiService } from '../services/api';
import { CropLot, OrderItem } from '../types';

interface BuyerDashboardProps {
  onSelectNav: (nav: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onSelectNav }) => {
  const [lots, setLots] = useState<CropLot[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [showNewReqModal, setShowNewReqModal] = useState<boolean>(false);

  // Requirement form
  const [reqCrop, setReqCrop] = useState('Tomato');
  const [reqQty, setReqQty] = useState('10,000 kg');
  const [reqMaxPrice, setReqMaxPrice] = useState(35);
  const [reqDate, setReqDate] = useState('15 September');
  const [reqLocation, setReqLocation] = useState('Coimbatore Processing Facility');

  const [activeReqs, setActiveReqs] = useState([
    {
      id: "REQ-01",
      crop: "Tomato",
      variety: "Shivam / S-7",
      quantity: "15 Tonnes",
      maxPrice: 34.0,
      deliveryDate: "10 Sep 2026",
      status: "Actively Receiving Bids",
      bidsCount: 4
    },
    {
      id: "REQ-02",
      crop: "Turmeric",
      variety: "Salem Supreme Finger",
      quantity: "40 Quintals",
      maxPrice: 145.0,
      deliveryDate: "18 Sep 2026",
      status: "Actively Receiving Bids",
      bidsCount: 7
    }
  ]);

  useEffect(() => {
    apiService.getLots().then(setLots);
    apiService.getOrders().then(setOrders);
  }, []);

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveReqs([
      {
        id: `REQ-0${activeReqs.length + 1}`,
        crop: reqCrop,
        variety: "Grade A Prime",
        quantity: reqQty,
        maxPrice: reqMaxPrice,
        deliveryDate: reqDate,
        status: "Actively Receiving Bids",
        bidsCount: 0
      },
      ...activeReqs
    ]);
    setShowNewReqModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Buyer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-2 border border-blue-500/30">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Verified Institutional Buyer • GSTIN Verified
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Kaveri Agro Foods Procurement Portal
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Source directly from 2,400+ verified FPOs and individual growers across Tamil Nadu and South India with digital contract assurance.
            </p>
          </div>

          <button
            onClick={() => setShowNewReqModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post Produce Requirement</span>
          </button>
        </div>

        {/* Buyer KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Active Requirements</span>
            <span className="text-xl sm:text-2xl font-black text-white">{activeReqs.length} Active</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Farmer Offers</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300">11 Incoming</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Confirmed Orders</span>
            <span className="text-xl sm:text-2xl font-black text-white">{orders.length} Active</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Pending Deliveries</span>
            <span className="text-xl sm:text-2xl font-black text-blue-400">1 Today</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[11px]">Total Purchase Value</span>
            <span className="text-xl sm:text-2xl font-black text-white">₹2,13,000</span>
          </div>
        </div>
      </div>

      {/* Active Buyer Requirements Section */}
      <div className="agri-card p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              My Active Produce Demands ("I Need Produce")
            </h3>
            <p className="text-xs text-slate-500">Farmers can view these demands and dispatch immediately</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeReqs.map((req) => (
            <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">{req.crop} ({req.variety})</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 p-2 bg-white rounded-xl border border-slate-200/80 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Quantity</span>
                    <span className="font-extrabold text-slate-800">{req.quantity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Max Price</span>
                    <span className="font-black text-blue-700">₹{req.maxPrice}/kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Target Date</span>
                    <span className="font-bold text-slate-700">{req.deliveryDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200 text-slate-500">
                <span>Incoming Bids: <strong>{req.bidsCount} Farmer Quotes</strong></span>
                <button
                  onClick={() => alert("Viewing incoming farmer quotations...")}
                  className="text-xs font-bold text-blue-700 hover:underline"
                >
                  Review Bids →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Farm Lots to Purchase */}
      <div className="agri-card p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Browse Available Farmer Lots (Ready for Direct Procurement)
            </h3>
            <p className="text-xs text-slate-500">Quality-graded produce with verified farm origin</p>
          </div>
          <button onClick={() => onSelectNav('lots')} className="text-xs font-bold text-blue-700 hover:underline">
            View All →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {lots.map((lot) => (
            <div key={lot.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{lot.crop_name}</span>
                  <span className="text-[10px] bg-slate-100 font-mono px-1.5 py-0.2 rounded text-slate-600">{lot.id}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                    {lot.quality_grade}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">
                  Quantity: <strong className="text-slate-800">{lot.quantity_kg} kg</strong> • Location: {lot.location}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 block">Farmer Ask Price</span>
                  <span className="text-sm font-black text-blue-700">₹{lot.expected_price_per_kg}/kg</span>
                </div>

                <button
                  onClick={() => alert(`Direct Purchase Contract initiated for ${lot.crop_name} (${lot.quantity_kg}kg). Escrow funds allocated.`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  Buy Lot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Requirement Modal */}
      {showNewReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
            <h2 className="text-lg font-black text-slate-900 mb-1">
              Create Produce Requirement ("I Need Produce")
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Broadcast your purchase requisition to thousands of registered farmers in your region.
            </p>

            <form onSubmit={handleCreateRequirement} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Crop</label>
                <select
                  value={reqCrop}
                  onChange={(e) => setReqCrop(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="Tomato">Tomato (Grade A / Hybrid)</option>
                  <option value="Onion">Onion (Garwa Red)</option>
                  <option value="Turmeric">Turmeric (Salem Finger)</option>
                  <option value="Carrot">Carrot (Ooty/Hybrid)</option>
                  <option value="Green Chilli">Green Chilli</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Quantity</label>
                  <input
                    type="text"
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                    placeholder="e.g. 10 Tonnes"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Maximum Price (₹/kg)</label>
                  <input
                    type="number"
                    value={reqMaxPrice}
                    onChange={(e) => setReqMaxPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Destination</label>
                <input
                  type="text"
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewReqModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-sm"
                >
                  Broadcast Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
