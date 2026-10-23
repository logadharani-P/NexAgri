import React, { useState, useEffect } from 'react';
import {
  Plus,
  Package,
  Calendar,
  MapPin,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { apiService } from '../services/api';
import { CropLot, CropItem } from '../types';

interface MyCropsLotsProps {
  onSelectNav: (nav: string, extraData?: any) => void;
  onOpenPrediction: (cropId: string) => void;
}

export const MyCropsLots: React.FC<MyCropsLotsProps> = ({ onSelectNav, onOpenPrediction }) => {
  const [lots, setLots] = useState<CropLot[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [cropsCatalog, setCropsCatalog] = useState<CropItem[]>([]);

  // Form fields
  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('Shivam F1 Hybrid');
  const [quantityKg, setQuantityKg] = useState<number>(2500);
  const [qualityGrade, setQualityGrade] = useState('Grade A (Export / Prime)');
  const [harvestDate, setHarvestDate] = useState('Ready for Harvest');
  const [location, setLocation] = useState('Sirumugai, Mettupalayam');
  const [expectedPrice, setExpectedPrice] = useState<number>(35);

  useEffect(() => {
    apiService.getLots().then(setLots);
    apiService.getCrops().then(setCropsCatalog);
  }, []);

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await apiService.createLot({
      crop_name: cropName,
      variety,
      quantity_kg: quantityKg,
      quality_grade: qualityGrade,
      harvest_date: harvestDate,
      location,
      expected_price_per_kg: expectedPrice
    });
    setLots([created, ...lots]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              My Crops & Harvest Lots
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {lots.length} Active Lots
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Register your harvest batches to automatically match verified buyers and receive direct counter-offers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Crop Lot</span>
        </button>
      </div>

      {/* Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lots.map((lot) => (
          <div
            key={lot.id}
            className="agri-card p-5 border-slate-200 hover:border-blue-500 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Lot Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {lot.crop_name.toLowerCase().includes('tomato') ? '🍅' : (lot.crop_name.toLowerCase().includes('carrot') ? '🥕' : (lot.crop_name.toLowerCase().includes('turmeric') ? '🌾' : '📦'))}
                  </span>
                  <div>
                    <h3 className="font-black text-base text-slate-900 leading-tight">
                      {lot.crop_name}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500">{lot.variety}</span>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {lot.id}
                </span>
              </div>

              {/* Lot Specifications */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Quantity</span>
                  <span className="text-sm font-black text-slate-900">
                    {lot.quantity_kg.toLocaleString('en-IN')} kg
                  </span>
                  <span className="text-[10px] text-slate-500 block">({(lot.quantity_kg / 1000).toFixed(1)} MT)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Quality Grade</span>
                  <span className="text-xs font-extrabold text-blue-800 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    {lot.quality_grade}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Harvest State</span>
                  <span className="font-bold text-slate-800">{lot.harvest_date}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200">
                  <span className="text-[10px] text-blue-800 block font-semibold">Target Price</span>
                  <span className="text-sm font-black text-blue-700">₹{lot.expected_price_per_kg}/kg</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{lot.location}</span>
              </div>

              {/* Requirement 10: Smart PMFBY Integration Card */}
              <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wide">
                      Protect this crop
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    PMFBY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 bg-white/80 p-2 rounded-xl border border-emerald-100">
                  <div>
                    <span className="text-slate-400 block font-semibold">Insurance Coverage</span>
                    <span className="font-extrabold text-slate-900">
                      ₹{Math.round((lot.quantity_kg / 1000) * 45000).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Estimated Premium</span>
                    <span className="font-extrabold text-emerald-700">
                      ₹{Math.round(((lot.quantity_kg / 1000) * 45000 * 0.05)).toLocaleString('en-IN')} (5%)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectNav('insurance', lot.crop_name)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>Apply Now (PMFBY)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onSelectNav('buyers')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 rounded-xl transition-colors text-center shadow-xs"
              >
                Find Matching Buyers (3 Active)
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenPrediction('tomato')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-1.5 rounded-xl transition-colors text-center"
                >
                  AI Price Check
                </button>
                <button
                  onClick={() => onSelectNav('logistics')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-1.5 rounded-xl transition-colors text-center"
                >
                  Book Transport
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Lot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-900 mb-1">
              Add New Crop Lot for Sale
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter your harvest details to make it discoverable to 500+ verified agro-buyers.
            </p>

            <form onSubmit={handleCreateLot} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Crop Name</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tomato">Tomato (தக்காளி)</option>
                  <option value="Onion">Onion (வெங்காயம்)</option>
                  <option value="Carrot (Ooty/Hybrid)">Carrot (கேரட்)</option>
                  <option value="Turmeric">Turmeric (மஞ்சள்)</option>
                  <option value="Paddy / Basmati Rice">Paddy / Rice (நெல்)</option>
                  <option value="Raw Cotton (Kapas)">Cotton (பருத்தி)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Variety / Hybrid</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Shivam F1 / Super Kuroda"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Quantity (kg)</label>
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Price (₹/kg)</label>
                  <input
                    type="number"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Quality Grade</label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Grade A (Export / Prime)">Grade A (Export / Prime Quality)</option>
                  <option value="Grade B (Wholesale Good)">Grade B (Wholesale Standard)</option>
                  <option value="Grade C (Processing / Sauce)">Grade C (Processing / Secondary)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Harvest Timing</label>
                <select
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Ready for Harvest">Ready for Harvest (Immediate Dispatch)</option>
                  <option value="Ready in 2–3 Days">Ready in 2–3 Days</option>
                  <option value="Ready next week">Ready next week</option>
                  <option value="Cured & Dry in Storage">Cured & Dry in Storage</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Farm / Pickup Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-sm"
                >
                  Publish Lot for Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
