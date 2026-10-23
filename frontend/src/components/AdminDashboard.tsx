import React from 'react';
import {
  ShieldAlert,
  Users,
  Building2,
  Package,
  DollarSign,
  Scale,
  TrendingUp,
  Warehouse,
  Truck,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const kpis = [
    { label: "Registered Farmers", value: "12,450", sub: "+124 this week", icon: Users, color: "text-blue-700 bg-blue-50" },
    { label: "Verified Buyers", value: "1,280", sub: "99.2% verified", icon: Building2, color: "text-indigo-700 bg-indigo-50" },
    { label: "Active Produce Lots", value: "3,890", sub: "14,200 MT listed", icon: Package, color: "text-amber-700 bg-amber-50" },
    { label: "Total GMV Processed", value: "₹42.8 Cr", sub: "Through UPI & Escrow", icon: DollarSign, color: "text-blue-800 bg-blue-100" },
    { label: "Regulated Mandis Monitored", value: "540", sub: "Agmarknet live sync", icon: TrendingUp, color: "text-slate-700 bg-slate-100" },
    { label: "Storage & Logistics Fleet", value: "430", sub: "120 Cold, 310 Trucks", icon: Truck, color: "text-purple-700 bg-purple-50" }
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                NEXAGRI System Administration Command Center
              </h1>
              <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Platform-wide telemetry, Agmarknet mandi synchronizations, dispute arbitration queue, and user trust verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
              ● All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((k, idx) => {
          const Icon = k.icon;
          return (
            <div key={idx} className="agri-card p-5 border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {k.label}
                </span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {k.value}
                </span>
                <span className="text-xs font-semibold text-emerald-700 mt-0.5 block">
                  {k.sub}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${k.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* System Health & Pending Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="agri-card p-6">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-3">
            Active Arbitration Queue (Disputes)
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-amber-950 block">DISP-2026-04 • Quality Dispute</span>
                <span className="text-[11px] text-amber-800">FreshCart vs Farmer Selvam (20kg difference reported)</span>
              </div>
              <button
                onClick={() => alert("Arbitration ticket approved based on weighbridge digital slip.")}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl"
              >
                Resolve
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 block">DISP-2026-03 • Transit Delay</span>
                <span className="text-[11px] text-slate-500">Gramin Transporters delayed by 40 min due to tire puncture</span>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                Resolved
              </span>
            </div>
          </div>
        </div>

        <div className="agri-card p-6">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-3">
            Mandi Price Feed Data Status
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">Agmarknet API Central Gateway</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized (100%)
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">IMD Weather Radar Radar Grid</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live Radar Active
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">NPCI UPI 2.0 Webhook Receiver</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 0ms Latency
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="font-bold text-slate-800">AI Price Prediction Regression Engine</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 82% Avg Accuracy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
