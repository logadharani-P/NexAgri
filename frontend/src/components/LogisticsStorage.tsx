import React, { useState, useEffect } from 'react';
import {
  Truck,
  Warehouse,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Calculator,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Layers,
  ThermometerSnowflake,
  Wind
} from 'lucide-react';
import { apiService } from '../services/api';
import { LogisticsOption, StorageUnit } from '../types';

export const LogisticsStorage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logistics' | 'storage'>('logistics');
  const [logistics, setLogistics] = useState<LogisticsOption[]>([]);
  const [storage, setStorage] = useState<StorageUnit[]>([]);

  // Logistics calculator state
  const [pickupLocation, setPickupLocation] = useState('Mettupalayam Farm Gate');
  const [destinationMandi, setDestinationMandi] = useState('Coimbatore Main Mandi (38 km)');
  const [distanceKm, setDistanceKm] = useState(38);
  const [produceWeightKg, setProduceWeightKg] = useState(2500);

  // Booking simulation alert
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    apiService.getLogistics().then(setLogistics);
    apiService.getStorage().then(setStorage);
  }, []);

  const handleBookVehicle = (providerName: string) => {
    setBookingSuccess(`Dispatch scheduled with ${providerName}. Driver will arrive at farm gate in 45 minutes.`);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  const handleBookStorage = (storageName: string) => {
    setBookingSuccess(`Storage bay reserved at ${storageName}. Digital gate entry token sent via SMS.`);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                Logistics & Cold Storage Infrastructure
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Post-Harvest Support
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Reduce transit loss and avoid distress selling with on-demand agri-freight and climate-controlled storage hubs.
            </p>
          </div>

          {/* Switch Tab */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto border border-slate-200">
            <button
              onClick={() => setActiveTab('logistics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'logistics'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Logistics Fleet ({logistics.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'storage'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Warehouse className="w-4 h-4 text-blue-600" />
              <span>Cold Storage ({storage.length})</span>
            </button>
          </div>
        </div>

        {/* Confirmation banner */}
        {bookingSuccess && (
          <div className="mt-4 p-3.5 bg-blue-50 border border-blue-300 text-blue-950 rounded-2xl flex items-center gap-2.5 text-xs">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{bookingSuccess}</span>
          </div>
        )}
      </div>

      {/* Logistics Tab Content */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          {/* Freight Cost Estimation Bar */}
          <div className="agri-card p-5 bg-gradient-to-r from-blue-50/60 via-slate-50 to-white border-blue-200">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              Real-Time Route Freight & Net Revenue Calculator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-bold block mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Destination Mandi</label>
                <input
                  type="text"
                  value={destinationMandi}
                  onChange={(e) => setDestinationMandi(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Distance (km)</label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">Estimated Freight Cost</label>
                <div className="bg-blue-600 text-white font-black text-sm px-3 py-1.5 rounded-xl text-center">
                  ₹{(600 + distanceKm * 24).toLocaleString('en-IN')} (₹{((600 + distanceKm * 24) / produceWeightKg).toFixed(2)}/kg)
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Fleet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {logistics.map((veh) => {
              const estimatedFare = veh.base_fare + (distanceKm * veh.rate_per_km);
              return (
                <div
                  key={veh.id}
                  className="agri-card p-5 border-slate-200 hover:border-blue-500 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🚚</span>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{veh.provider_name}</h4>
                          <p className="text-[11px] text-slate-500">{veh.vehicle_type}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {veh.rating}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3.5 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Payload Capacity</span>
                        <span className="font-black text-slate-800">{veh.capacity_kg} kg</span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Rate per km</span>
                        <span className="font-black text-blue-700">₹{veh.rate_per_km}/km</span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs space-y-1">
                      {veh.features.map((feat, idx) => (
                        <p key={idx} className="text-slate-600 flex items-center gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{feat}</span>
                        </p>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs flex justify-between items-center">
                      <span className="text-slate-600 font-semibold">Total Ride Fare:</span>
                      <span className="text-base font-black text-blue-800">
                        ₹{estimatedFare.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookVehicle(veh.provider_name)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2.5 rounded-xl transition-colors text-center shadow-xs"
                  >
                    Book Instant Farm Pickup
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Storage Tab Content */}
      {activeTab === 'storage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {storage.map((st) => (
              <div
                key={st.id}
                className="agri-card p-5 border-slate-200 hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏪</span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {st.name}
                        </h4>
                        <span className="text-[11px] text-blue-700 font-semibold">{st.storage_type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-600 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{st.location} ({st.distance_km} km)</span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-3.5 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Available Space</span>
                      <span className="font-black text-blue-700">
                        {st.available_capacity_mt} MT / {st.total_capacity_mt} MT
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Daily Rate</span>
                      <span className="font-black text-slate-900">₹{st.price_per_day_kg}/kg/day</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Climate Control Spec
                    </span>
                    <p className="text-slate-800 font-semibold mt-0.5 flex items-center gap-1">
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {st.humidity_control}
                    </p>
                  </div>

                  <div className="mt-2.5 text-[11px] text-slate-500">
                    Suitable crops: <strong className="text-slate-700">{st.suitable_crops.join(', ')}</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleBookStorage(st.name)}
                  className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-xl transition-colors text-center"
                >
                  Reserve Storage Space
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
