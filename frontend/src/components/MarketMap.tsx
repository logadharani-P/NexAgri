import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Truck,
  Sparkles,
  Calculator,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import L from 'leaflet';
import { apiService } from '../services/api';
import { TransportCalculationResult } from '../types';

export const MarketMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Input states
  const [farmLocation, setFarmLocation] = useState<string>('Mettupalayam');
  const [destinationMandi, setDestinationMandi] = useState<string>('Coimbatore Main Mandi');
  const [crop, setCrop] = useState<string>('Tomato');
  const [quantityKg, setQuantityKg] = useState<number>(2500);

  // Calculation states
  const [calcResult, setCalcResult] = useState<TransportCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const availableMandis = [
    "Coimbatore Main Mandi",
    "Mettupalayam Regulated Market",
    "Perundurai Regulated Market",
    "Erode Main Regulated Market",
    "Oddanchatram Vegetable Market",
    "Pollachi Market"
  ];

  const availableCrops = [
    "Tomato",
    "Onion",
    "Potato",
    "Carrot",
    "Turmeric",
    "Green Chilli",
    "Banana",
    "Paddy (Dhan)",
    "Wheat"
  ];

  // Map markers coordinate dictionary
  const points = [
    {
      id: 'pt-farmer',
      name: 'Farm Origin (Mettupalayam)',
      lat: 11.2989,
      lng: 76.9424,
      desc: 'Sirumugai, Mettupalayam • Loading Point',
      icon: '📍',
      color: '#10b981'
    },
    {
      id: 'pt-mandi-1',
      name: 'Coimbatore Main Mandi',
      lat: 11.0168,
      lng: 76.9558,
      desc: '38 km • Highest Wholesale Liquidity',
      icon: '🏪',
      color: '#059669',
      isBest: true
    },
    {
      id: 'pt-mandi-2',
      name: 'Mettupalayam Regulated Market',
      lat: 11.3005,
      lng: 76.9482,
      desc: '12 km • Local Immediate Yard',
      icon: '🏪',
      color: '#0284c7'
    },
    {
      id: 'pt-mandi-3',
      name: 'Perundurai Regulated Market',
      lat: 11.2750,
      lng: 77.5850,
      desc: '68 km • Turmeric & Veg Hub',
      icon: '🏪',
      color: '#8b5cf6'
    },
    {
      id: 'pt-mandi-4',
      name: 'Oddanchatram Vegetable Market',
      lat: 10.4850,
      lng: 77.7450,
      desc: '110 km • Regional Horticulture Terminal',
      icon: '🏪',
      color: '#f59e0b'
    }
  ];

  // Run calculation
  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const res = await apiService.calculateTransport({
        origin_location: farmLocation,
        destination_mandi: destinationMandi,
        crop,
        quantity_kg: quantityKg,
        current_modal_price_per_kg: crop === 'Tomato' ? 34.0 : (crop === 'Turmeric' ? 142.0 : 28.0)
      });
      setCalcResult(res);
    } catch {
      // Handled in apiService fallback
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [farmLocation, destinationMandi, crop, quantityKg]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView([11.15, 77.05], 10);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors | NEXAGRI GIS'
    }).addTo(map);

    // Plot candidate markers
    points.forEach((pt) => {
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${pt.color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            border: 2px solid white;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
          ">${pt.icon}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px;">
          <strong style="color: #0f172a; font-size: 13px;">${pt.name}</strong><br/>
          <span style="color: #64748b;">${pt.desc}</span>
        </div>
      `);
    });

    // Draw route line from farm to Coimbatore Main Mandi
    const farmPt = points[0];
    const mandiPt = points[1];
    L.polyline([[farmPt.lat, farmPt.lng], [mandiPt.lat, mandiPt.lng]], {
      color: '#10b981',
      weight: 4,
      dashArray: '6, 8'
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Interactive Market Map & Transport Calculator
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-700" />
                Integrated Freight Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select your farm and destination mandi to calculate precise route distances, estimated travel times, freight expenses, and net profit comparisons.
            </p>
          </div>
        </div>

        {/* 4 Required Inputs: Farm Location, Destination Mandi, Crop, Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-slate-50 border border-blue-100">
          {/* Farm Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-700" />
              1. Current Farm Location
            </label>
            <input
              type="text"
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              placeholder="e.g. Mettupalayam"
              className="w-full bg-white border border-slate-300 text-slate-900 font-bold text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
            />
          </div>

          {/* Destination Mandi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <span className="text-blue-700">🏪</span>
              2. Destination Mandi
            </label>
            <select
              value={destinationMandi}
              onChange={(e) => setDestinationMandi(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 font-bold text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs cursor-pointer"
            >
              {availableMandis.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Crop */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <span className="text-blue-700">🌱</span>
              3. Crop
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 font-bold text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs cursor-pointer"
            >
              {availableCrops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <span className="text-blue-700">⚖️</span>
              4. Quantity (kg)
            </label>
            <input
              type="number"
              value={quantityKg}
              onChange={(e) => setQuantityKg(Math.max(100, Number(e.target.value)))}
              step="100"
              min="100"
              className="w-full bg-white border border-slate-300 text-slate-900 font-bold text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Main Map & Live Transport Calculation Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leaflet OpenStreetMap Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-slate-800">
                Live Route: {farmLocation} → {destinationMandi}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
              OpenStreetMap + NEXAGRI GIS
            </span>
          </div>

          <div
            ref={mapContainerRef}
            className="w-full h-[400px] sm:h-[460px] relative z-10"
          />

          {/* Map Legend */}
          <div className="p-3 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span> Farm Origin
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span> Selected Mandi
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span> Alternative Mandis
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Click any map pin for details</span>
          </div>
        </div>

        {/* Right 1 Col: Calculation Results & AI Recommendation */}
        <div className="space-y-4">
          {/* Main Calculation Card matching user example */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-700" />
                Transport Calculation
              </h3>
              {isCalculating && <span className="text-[11px] text-blue-700 font-bold animate-pulse">Calculating...</span>}
            </div>

            {calcResult && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Farm Origin</span>
                    <strong className="text-slate-800 text-xs">{calcResult.farm_location}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Destination Mandi</span>
                    <strong className="text-slate-800 text-xs">{calcResult.destination_mandi}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Crop</span>
                    <strong className="text-slate-800 text-xs">{calcResult.crop}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Quantity</span>
                    <strong className="text-slate-800 text-xs">{calcResult.quantity_kg.toLocaleString()} kg</strong>
                  </div>
                </div>

                {/* Key Output Metrics */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Distance</span>
                    <span className="font-extrabold text-slate-900">{calcResult.distance_km} km</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Estimated Travel Time
                    </span>
                    <span className="font-extrabold text-slate-900">{calcResult.estimated_travel_time}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Estimated Transport Cost</span>
                    <span className="font-black text-slate-900 text-sm">₹{calcResult.estimated_transport_cost.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Estimated Transport Cost/kg</span>
                    <span className="font-black text-blue-800 text-sm">₹{calcResult.estimated_cost_per_kg}/kg</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 mt-2">
                    <div className="flex justify-between items-center text-xs text-blue-900">
                      <span>Gross Crop Value:</span>
                      <span className="font-bold">₹{calcResult.gross_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-red-600 mt-1">
                      <span>Transport Deduction:</span>
                      <span className="font-bold">-₹{calcResult.estimated_transport_cost.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-blue-200/80 mt-2 pt-2 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Estimated Net Amount:</span>
                      <span className="text-lg font-black text-blue-900">₹{calcResult.estimated_net_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Box */}
                {calcResult.ai_recommendation && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 mt-3">
                    <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>AI Market Recommendation</span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-1 font-medium leading-snug">
                      {calcResult.ai_recommendation.advice}
                    </p>
                    {calcResult.ai_recommendation.extra_benefit > 0 && (
                      <p className="text-[11px] font-bold text-blue-800 mt-1.5 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                        Estimated Extra Net: +₹{calcResult.ai_recommendation.extra_benefit.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Disclaimer */}
                <div className="flex items-start gap-1.5 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Calculations are estimates for decision guidance. Actual freight fares depend on local driver rates and loading conditions. Profit is not guaranteed.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Alternative Mandi Comparisons Table */}
          {calcResult?.comparisons && (
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Market Comparison Summary
              </h4>
              <div className="space-y-2">
                {calcResult.comparisons.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setDestinationMandi(c.mandi)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      destinationMandi === c.mandi
                        ? 'border-blue-500 bg-blue-50/70'
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{c.mandi}</p>
                      <p className="text-[10px] text-slate-500">{c.distance_km} km • Rate: ₹{c.modal_price_per_kg}/kg</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-blue-800 block text-xs">
                        ₹{c.net_amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">Net Return</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
