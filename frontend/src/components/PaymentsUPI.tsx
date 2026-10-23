import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Lock,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { apiService } from '../services/api';
import { FarmerUPIProfile } from '../types';

export const PaymentsUPI: React.FC = () => {
  const [profile, setProfile] = useState<FarmerUPIProfile>({
    upi_id: "selvam.farmer@sbi",
    bank_name: "State Bank of India (Mettupalayam Branch)",
    account_holder: "R. Selvam",
    verified: true,
    is_default: true,
    transactions: [
      {
        id: "TXN-UPI-98421008",
        order_id: "ORD-2026-874",
        buyer: "Sahyadri Farmers Producer Co.",
        crop: "Onion (5,000 kg)",
        amount: 145000,
        type: "Credit",
        status: "Completed",
        date: "05 Sep 2026, 04:30 PM",
        vpa: "sahyadri.agri@hdfcbank",
        utr: "524890123490"
      },
      {
        id: "TXN-ESC-98421002",
        order_id: "ORD-2026-891",
        buyer: "Kaveri Agro Foods Pvt Ltd",
        crop: "Tomato (2,000 kg)",
        amount: 48500,
        type: "Escrow Held",
        status: "Pending",
        date: "06 Sep 2026, 09:15 AM",
        vpa: "kaveri.foods@icici",
        utr: "524890981244"
      },
      {
        id: "TXN-LOG-98420994",
        order_id: "ORD-2026-874",
        buyer: "Gramin Agro Transporters",
        crop: "Freight Dispatch",
        amount: 3200,
        type: "Debit",
        status: "Completed",
        date: "05 Sep 2026, 02:00 PM",
        vpa: "gramin.trans@okaxis",
        utr: "524890119920"
      },
      {
        id: "TXN-REF-98420811",
        order_id: "ORD-2026-810",
        buyer: "Tamil Nadu Agro Logistics",
        crop: "Packaging Reversal",
        amount: 1200,
        type: "Refund",
        status: "Failed",
        date: "02 Sep 2026, 11:20 AM",
        vpa: "selvam.farmer@sbi",
        utr: "FAILED_BANK_TIMEOUT"
      }
    ]
  });

  const [activeTab, setActiveTab] = useState<'All' | 'Completed' | 'Pending' | 'Failed'>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newUpiId, setNewUpiId] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  useEffect(() => {
    apiService.getFarmerUPIProfile().then(data => {
      if (data && data.upi_id) {
        setProfile(prev => ({
          ...prev,
          ...data,
          transactions: data.transactions?.length ? data.transactions : prev.transactions
        }));
      }
    });
  }, []);

  // Filter transactions
  const filteredTransactions = profile.transactions.filter(t => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Completed') return t.status === 'Completed' || t.status === 'Settled';
    if (activeTab === 'Pending') return t.status === 'Pending' || t.status === 'Escrow Held';
    if (activeTab === 'Failed') return t.status === 'Failed';
    return true;
  });

  // Handle UPI addition and verification
  const handleSaveUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpiId.trim() || !newUpiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. yourname@upi or phone@bank).');
      return;
    }

    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 800)); // NPCI validation simulation
    await apiService.updateFarmerUPI(newUpiId.trim(), true);

    setProfile(prev => ({
      ...prev,
      upi_id: newUpiId.trim(),
      verified: true,
      is_default: true
    }));

    setIsVerifying(false);
    setShowAddModal(false);
    setNewUpiId('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profile.upi_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                UPI & Bank Payments
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                RBI & NPCI UPI Standard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Zero-delay digital settlement. Buyer funds are held in transparent smart escrow and released directly to your verified Farmer UPI ID.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-slate-200 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-blue-700" />
              <span>Receive QR</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Change UPI ID</span>
            </button>
          </div>
        </div>

        {/* 16. FARMER UPI DEDICATED CARD */}
        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 via-slate-50 to-white border border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Farmer UPI:</span>
                  <strong className="text-base sm:text-lg font-black text-slate-900 font-mono">
                    {profile.upi_id}
                  </strong>
                  <button
                    onClick={copyToClipboard}
                    className="p-1 hover:bg-blue-100 rounded text-blue-700 cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-slate-600 mt-1 font-medium">
                  Linked Account: <strong>{profile.bank_name}</strong> • Holder: {profile.account_holder}
                </p>

                {/* Status Badges Matching User Specification */}
                <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-extrabold px-2.5 py-0.5 rounded-md border border-blue-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Status: ✓ Verified
                  </span>

                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-extrabold px-2.5 py-0.5 rounded-md border border-blue-300">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    Default: ✓ Yes
                  </span>

                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    Direct Escrow Release Enabled
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:flex-col md:items-end">
              <span className="text-xs text-slate-500 font-medium">Escrow Available Balance</span>
              <span className="text-2xl font-black text-slate-900">₹1,45,000</span>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                Instant UPI Withdrawal Ready
              </span>
            </div>
          </div>

          {/* Security Guarantee Notice */}
          <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center gap-2 text-[11px] text-slate-600">
            <Lock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>
              <strong>Security Guarantee:</strong> NEXAGRI does NOT store UPI PINs, passwords, or net-banking credentials. Transactions are routed through NPCI-authorized banking gateways.
            </span>
          </div>
        </div>
      </div>

      {/* Transaction History & Status Filter Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Payment & Escrow Transaction History
            </h3>
            <p className="text-xs text-slate-500">
              Real-time audit log of buyer payments, escrow locks, and automatic releases.
            </p>
          </div>

          {/* Status Tabs: All, Completed, Pending, Failed */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['All', 'Completed', 'Pending', 'Failed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
                {tab === 'Pending' && (
                  <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-full">
                    1
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Transaction ID / UTR</th>
                <th className="pb-3">Buyer / Description</th>
                <th className="pb-3">Crop / Produce</th>
                <th className="pb-3">Amount (₹)</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-3 font-mono font-bold text-slate-800">
                    <div>{tx.id}</div>
                    <div className="text-[10px] text-slate-400 font-normal font-sans">UTR: {tx.utr}</div>
                  </td>
                  <td className="py-3.5 pr-3 font-medium text-slate-800">
                    <div className="font-bold">{tx.buyer}</div>
                    <div className="text-[10px] text-slate-500">{tx.vpa}</div>
                  </td>
                  <td className="py-3.5 pr-3 font-medium text-slate-700">
                    {tx.crop}
                  </td>
                  <td className="py-3.5 pr-3 font-black text-sm">
                    <span className={tx.type === 'Credit' ? 'text-emerald-700' : 'text-slate-900'}>
                      {tx.type === 'Credit' ? '+' : ''}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        tx.status === 'Completed' || tx.status === 'Settled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.status === 'Pending' || tx.status === 'Escrow Held'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.status === 'Completed' || tx.status === 'Settled' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : tx.status === 'Pending' || tx.status === 'Escrow Held' ? (
                        <Clock className="w-3 h-3 text-amber-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-red-600" />
                      )}
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-500 font-medium">
                    {tx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Change UPI Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              Add or Update Farmer UPI ID
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your VPA handle (e.g. mobile@upi or name@bank). Funds from verified buyers will be automatically credited here.
            </p>

            <form onSubmit={handleSaveUpi} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Farmer UPI ID
                </label>
                <input
                  type="text"
                  value={newUpiId}
                  onChange={(e) => setNewUpiId(e.target.value)}
                  placeholder="e.g. 9842178901@sbi or farmer@upi"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  NPCI VPA Verification will ping your handle to verify account holder name match. No PIN required.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying with Bank...</span>
                    </>
                  ) : (
                    <span>Verify & Set Default</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 p-6 shadow-2xl text-center">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Farmer UPI QR Code
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Direct BharatQR for buyers to scan and pay instantly
            </p>

            <div className="w-52 h-52 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-emerald-500 p-4">
              <QrCode className="w-40 h-40 text-slate-800" />
            </div>

            <p className="font-mono font-bold text-xs text-slate-800 mt-4">
              {profile.upi_id}
            </p>
            <p className="text-[11px] text-slate-500">{profile.account_holder}</p>

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-5 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
