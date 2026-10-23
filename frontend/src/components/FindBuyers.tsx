import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  PhoneCall,
  CheckCircle2,
  DollarSign,
  Package,
  Send,
  Filter,
  Search,
  Building2,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { VerifiedBuyer } from '../types';

interface FindBuyersProps {
  onSelectNav: (nav: string) => void;
}

export const FindBuyers: React.FC<FindBuyersProps> = ({ onSelectNav }) => {
  const [buyers, setBuyers] = useState<VerifiedBuyer[]>([]);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBuyerForOffer, setSelectedBuyerForOffer] = useState<VerifiedBuyer | null>(null);
  const [offerSentSuccess, setOfferSentSuccess] = useState<string | null>(null);
  const [myOfferPrice, setMyOfferPrice] = useState<number>(35);

  useEffect(() => {
    apiService.getBuyers().then(setBuyers);
  }, []);

  const handleSendOffer = (buyer: VerifiedBuyer) => {
    setSelectedBuyerForOffer(buyer);
    setMyOfferPrice(buyer.offered_price_per_kg);
  };

  const confirmOfferSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBuyerForOffer) {
      setOfferSentSuccess(selectedBuyerForOffer.name);
      setSelectedBuyerForOffer(null);
      setTimeout(() => setOfferSentSuccess(null), 4000);
    }
  };

  const filteredBuyers = buyers.filter(b => {
    const matchesCrop = selectedCropFilter === 'All' || b.crop_required.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchesSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.crop_required.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                Direct Farmer-to-Buyer Linkage
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Institutional Buyers
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Connect directly with verified corporate food processors, retail chains, and exporters. Zero middleman cuts, guaranteed bank & UPI payments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              ✓ Escrow Protected Payments
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'Tomato', 'Turmeric', 'Carrot', 'Onion', 'Chilli'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCropFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCropFilter === c
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search buyer name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Success alert banner */}
      {offerSentSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-2xl flex items-center justify-between text-xs animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Direct Offer Sent to {offerSentSuccess}!</strong> The buyer's procurement manager has been notified via SMS and WhatsApp.
            </span>
          </div>
          <button
            onClick={() => onSelectNav('orders')}
            className="text-xs font-extrabold text-emerald-700 hover:underline"
          >
            Track in Orders →
          </button>
        </div>
      )}

      {/* Buyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBuyers.map((buyer) => (
          <div
            key={buyer.id}
            className="agri-card p-5 border-slate-200 hover:border-emerald-500 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Buyer Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-black text-base shadow-xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-base text-slate-900 leading-tight">
                        {buyer.name}
                      </h3>
                      {buyer.verified && (
                        <span title="Verified Enterprise">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Contact: {buyer.owner} • {buyer.contact_masked}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {buyer.badge}
                </span>
              </div>

              {/* Trust & Reliability Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Payment Reliability</span>
                  <span className="font-black text-emerald-700">{buyer.reliability_score}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Rating</span>
                  <span className="font-black text-slate-800 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {buyer.rating}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Completed Orders</span>
                  <span className="font-bold text-slate-800">{buyer.completed_orders}+</span>
                </div>
              </div>

              {/* Requirement Box */}
              <div className="mt-4 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900">
                    BUYER REQUIREMENT
                  </span>
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {buyer.distance_km} km away
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <div>
                    <span className="text-base font-black text-slate-900 block">
                      {buyer.quantity_required} {buyer.crop_required}
                    </span>
                    <span className="text-[11px] text-slate-500">Spec: {buyer.variety}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Buyer Offered Price</span>
                    <span className="text-xl font-black text-emerald-700">
                      ₹{buyer.offered_price_per_kg}/kg
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-emerald-200/80 text-[11px] text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span><strong>Payment Terms:</strong> {buyer.payment_terms}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleSendOffer(buyer)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Produce Offer</span>
              </button>

              <button
                onClick={() => alert(`Connecting directly to ${buyer.owner} at ${buyer.contact_masked}. A NEXAGRI representative has also been looped in for escrow security.`)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-blue-700" />
                <span>Call</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Send Offer Modal */}
      {selectedBuyerForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
            <h2 className="text-lg font-black text-slate-900 mb-1">
              Send Quotation to {selectedBuyerForOffer.name}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Requirement: {selectedBuyerForOffer.quantity_required} {selectedBuyerForOffer.crop_required}
            </p>

            <form onSubmit={confirmOfferSubmission} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Offered Price (₹/kg)</label>
                <input
                  type="number"
                  value={myOfferPrice}
                  onChange={(e) => setMyOfferPrice(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Buyer's posted price: ₹{selectedBuyerForOffer.offered_price_per_kg}/kg
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Available Quantity to Supply (kg)</label>
                <input
                  type="number"
                  defaultValue={2500}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Dispatch Schedule</label>
                <select className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500">
                  <option>Immediate Dispatch (Today/Tomorrow)</option>
                  <option>Within 48 Hours</option>
                  <option>Scheduled for next Monday</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedBuyerForOffer(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-sm"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
