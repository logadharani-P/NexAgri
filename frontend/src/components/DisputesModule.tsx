import React, { useState, useEffect } from 'react';
import {
  Scale,
  AlertCircle,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { DisputeItem } from '../types';

export const DisputesModule: React.FC = () => {
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const [orderId, setOrderId] = useState('ORD-2026-891');
  const [category, setCategory] = useState('Quality Dispute');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('+91 98421 78901');

  useEffect(() => {
    apiService.getDisputes().then(setDisputes);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await apiService.createDispute({
      order_id: orderId,
      category,
      description,
      contact_phone: contactPhone
    });
    setDisputes([created, ...disputes]);
    setShowCreateModal(false);
    setDescription('');
  };

  const categories = [
    'Payment Issue',
    'Quality Dispute',
    'Quantity Dispute',
    'Late Delivery',
    'Buyer Issue',
    'Logistics Issue',
    'Storage Issue',
    'Other'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                Disputes & Grievance Redressal
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Fair Trade Arbitrator
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Protecting both farmers and buyers with time-bound digital grievance resolution, weighbridge proof logs, and escrow arbitration.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Raise New Dispute Ticket</span>
          </button>
        </div>
      </div>

      {/* Disputes Listing */}
      <div className="space-y-4">
        {disputes.map((d) => (
          <div
            key={d.ticket_id}
            className="agri-card p-5 border-slate-200 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">{d.category}</h3>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {d.ticket_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Order Reference: <strong className="text-slate-800">{d.order_id}</strong> • Filed on: {d.created_at}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-black px-2.5 py-1 rounded-full self-start sm:self-auto ${
                  d.status === 'Resolved'
                    ? 'bg-blue-100 text-blue-800'
                    : (d.status === 'Under Review' ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-900')
                }`}
              >
                {d.status}
              </span>
            </div>

            <div className="mt-3.5 text-xs text-slate-700 leading-relaxed">
              <p><strong>Description:</strong> {d.description}</p>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>Arbitrator Note:</strong> {d.resolution}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">SLA: 24 Hours</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Dispute Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
            <h2 className="text-lg font-black text-slate-900 mb-1">
              File a Grievance / Dispute Ticket
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Our legal and mandi arbitration desk will review digital weight slips and mediate settlement within 24 hours.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Order ID</label>
                <select
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="ORD-2026-891">ORD-2026-891 (Tomato - Kaveri Agro Foods)</option>
                  <option value="ORD-2026-874">ORD-2026-874 (Onion - Sahyadri FPC)</option>
                  <option value="ORD-2026-840">ORD-2026-840 (Carrot - FreshCart)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe weight discrepancy, quality dispute, or payment issue in detail..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Mobile Number</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold shadow-sm"
                >
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
