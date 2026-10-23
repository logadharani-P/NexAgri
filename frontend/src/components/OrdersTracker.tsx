import React, { useState, useEffect } from 'react';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  MapPin,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { OrderItem } from '../types';

interface OrdersTrackerProps {
  onSelectNav: (nav: string) => void;
}

export const OrdersTracker: React.FC<OrdersTrackerProps> = ({ onSelectNav }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    apiService.getOrders().then(data => {
      setOrders(data);
      if (data.length > 0) setSelectedOrder(data[0]);
    });
  }, []);

  const lifecycleSteps = [
    { step: 1, title: 'Confirmed', desc: 'Price & Lot Locked' },
    { step: 2, title: 'Scheduled', desc: 'Pickup Slot Assigned' },
    { step: 3, title: 'Pickup & Loading', desc: 'Farm Gate Verification' },
    { step: 4, title: 'In Transit', desc: 'Live GPS Tracking' },
    { step: 5, title: 'At Mandi / Hub', desc: 'Weighbridge & Unload' },
    { step: 6, title: 'Inspection Passed', desc: 'Quality Grade A Verified' },
    { step: 7, title: 'Payment Released', desc: 'Instant UPI Escrow Transfer' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                Order Lifecycle & Contract Tracker
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                7-Step Transparent Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time milestone tracking from farm gate pickup to digital quality inspection and instant UPI escrow disbursement.
            </p>
          </div>

          <button
            onClick={() => onSelectNav('payments')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
          >
            View UPI Settlement Receipts
          </button>
        </div>
      </div>

      {/* Orders List & Active Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Orders Selection List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
            All Contracts ({orders.length})
          </h3>

          <div className="space-y-3">
            {orders.map((ord) => {
              const isSelected = selectedOrder?.order_id === ord.order_id;
              return (
                <div
                  key={ord.order_id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`agri-card p-4 cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/30 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{ord.crop_name}</span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {ord.order_id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Buyer: <strong className="text-slate-800">{ord.buyer_name}</strong>
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        ord.step === 7
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">
                      {ord.quantity_kg.toLocaleString('en-IN')} kg @ ₹{ord.price_per_kg}/kg
                    </span>
                    <span className="font-black text-slate-900 text-sm">
                      ₹{ord.total_amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Order Detail & Full Lifecycle Tracker (7 cols) */}
        {selectedOrder && (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Contract Tracking
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedOrder.order_id} • {selectedOrder.crop_name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Buyer: <strong className="text-slate-800">{selectedOrder.buyer_name}</strong> • Transporter: <strong className="text-slate-800">{selectedOrder.transporter}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Contract Value</span>
                <span className="text-2xl font-black text-blue-700">
                  ₹{selectedOrder.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Lifecycle Progress Stepper */}
            <div className="mt-6">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">
                Milestone Progress ({selectedOrder.step} of 7 Completed)
              </h3>

              <div className="relative pl-6 space-y-5 border-l-2 border-slate-200">
                {lifecycleSteps.map((s) => {
                  const isDone = s.step <= selectedOrder.step;
                  const isCurrent = s.step === selectedOrder.step;

                  return (
                    <div key={s.step} className="relative">
                      {/* Circle indicator */}
                      <span
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                          isDone
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-200 text-slate-600'
                        } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                      >
                        {isDone ? '✓' : s.step}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs font-extrabold ${
                              isDone ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {s.step}. {s.title}
                          </h4>
                          {isCurrent && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                              Current Phase
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logistics and Payment Escrow details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Logistics & Transit
                </span>
                <p className="font-extrabold text-slate-800 mt-1">{selectedOrder.transporter}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Route: {selectedOrder.pickup_location} → {selectedOrder.delivery_location}
                </p>
                <span className="text-blue-700 font-bold text-[11px] block mt-1">
                  Est. Delivery: {selectedOrder.estimated_delivery}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                  Digital Escrow Security
                </span>
                <p className="font-extrabold text-blue-950 mt-1">{selectedOrder.payment_status}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Funds held in RBI-compliant escrow until weighbridge grade verification is confirmed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
