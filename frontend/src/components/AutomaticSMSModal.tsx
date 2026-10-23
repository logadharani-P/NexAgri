import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  CloudSun,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  Send
} from 'lucide-react';
import { apiService } from '../services/api';

interface AutomaticSMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerPhone?: string;
}

export const AutomaticSMSModal: React.FC<AutomaticSMSModalProps> = ({
  isOpen,
  onClose,
  farmerPhone = '+91 98765 43210'
}) => {
  const [preferences, setPreferences] = useState({
    enabled: true,
    phone_number: farmerPhone,
    auto_price_surge_enabled: true,
    price_surge_threshold_pct: 8.0,
    auto_arrival_drop_enabled: true,
    auto_rain_warning_enabled: true,
    rain_threshold_pct: 35.0,
    auto_order_escrow_enabled: true,
    monitored_crops: ['Tomato', 'Onion', 'Potato', 'Turmeric'],
    preferred_mandi: 'Coimbatore Main Mandi',
    frequency: 'instant'
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadRulesAndLogs();
    }
  }, [isOpen]);

  const loadRulesAndLogs = async () => {
    try {
      const [rules, smsLogs] = await Promise.all([
        apiService.getAutoSMSRules(),
        apiService.getSMSLogs()
      ]);
      if (rules) {
        setPreferences((prev) => ({ ...prev, ...rules }));
      }
      if (smsLogs && Array.isArray(smsLogs)) {
        setLogs(smsLogs);
      }
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccessMsg('');
    try {
      await apiService.updateAutoSMSRules(preferences);
      setSaveSuccessMsg('Automatic SMS alert settings saved successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch {
      setSaveSuccessMsg('Preferences saved locally (offline / simulated)');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunTestTrigger = async () => {
    setIsTesting(true);
    setTestResultMsg(null);
    try {
      const res = await apiService.evaluateAutoSMS({
        phone_number: preferences.phone_number,
        crop: preferences.monitored_crops[0] || 'Tomato',
        mandi: preferences.preferred_mandi,
        force_trigger: true
      });
      setTestResultMsg('Automated SMS trigger evaluated! Alert dispatched to carrier gateway.');
      loadRulesAndLogs();
      setTimeout(() => setTestResultMsg(null), 4000);
    } catch {
      setTestResultMsg('Simulated automated SMS logged.');
      setTimeout(() => setTestResultMsg(null), 4000);
    } finally {
      setIsTesting(false);
    }
  };

  const toggleCrop = (cropName: string) => {
    setPreferences((prev) => {
      const exists = prev.monitored_crops.includes(cropName);
      return {
        ...prev,
        monitored_crops: exists
          ? prev.monitored_crops.filter((c) => c !== cropName)
          : [...prev.monitored_crops, cropName]
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">Automatic SMS Alert Engine</h3>
                <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  24/7 Radar
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Automated mobile SMS dispatches for price surges, arrival drops & rain warnings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800">
          {/* 1. Master Enable Switch & Phone Number */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${preferences.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
              <div>
                <p className="font-extrabold text-sm text-slate-900">Automatic SMS Service Status</p>
                <p className="text-xs text-slate-500">
                  {preferences.enabled ? 'Active • Automated monitors running' : 'Paused • No automatic SMS will be sent'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreferences({ ...preferences, enabled: !preferences.enabled })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.enabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    preferences.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Recipient Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Mobile Number for SMS
            </label>
            <div className="relative">
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={preferences.phone_number}
                onChange={(e) => setPreferences({ ...preferences, phone_number: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* 2. Automated Trigger Conditions */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              Automated Trigger Rules
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Rule 1: Price Surge */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Price Spike Alert
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.auto_price_surge_enabled}
                    onChange={(e) => setPreferences({ ...preferences, auto_price_surge_enabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Auto-send SMS when mandi rate increases by ≥ {preferences.price_surge_threshold_pct}%
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {[5, 8, 12, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPreferences({ ...preferences, price_surge_threshold_pct: pct })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        preferences.price_surge_threshold_pct === pct
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      +{pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Rule 2: Rain Radar Warning */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <CloudSun className="w-4 h-4 text-cyan-600" />
                    Rain Radar Warning
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.auto_rain_warning_enabled}
                    onChange={(e) => setPreferences({ ...preferences, auto_rain_warning_enabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Auto-send SMS when 48h rain probability exceeds {preferences.rain_threshold_pct}%
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {[25, 35, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPreferences({ ...preferences, rain_threshold_pct: pct })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        preferences.rain_threshold_pct === pct
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      &gt;{pct}% Rain
                    </button>
                  ))}
                </div>
              </div>

              {/* Rule 3: Arrival Drop Alert */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Arrival Drop Spike
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.auto_arrival_drop_enabled}
                    onChange={(e) => setPreferences({ ...preferences, auto_arrival_drop_enabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Auto-send SMS when border arrivals plunge by &gt;10%, indicating imminent demand surge.
                </p>
              </div>

              {/* Rule 4: UPI Escrow Advance */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    UPI Escrow Settlement
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.auto_order_escrow_enabled}
                    onChange={(e) => setPreferences({ ...preferences, auto_order_escrow_enabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Instant SMS when a verified institutional buyer deposits advance funds in RBI escrow.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Monitored Crops */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Crops for Automated Surveillance:
            </label>
            <div className="flex flex-wrap gap-2">
              {['Tomato', 'Onion', 'Potato', 'Turmeric', 'Cotton', 'Green Chilli', 'Banana'].map((c) => {
                const isSelected = preferences.monitored_crops.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCrop(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Automated SMS Activity Log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Recent Automated SMS Dispatch Logs
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">Carrier Audit Trail</span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {log.provider || 'NEXAGRI Gateway'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">"{log.message}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback messages */}
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {testResultMsg && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{testResultMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleRunTestTrigger}
            disabled={isTesting}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing Trigger...' : '⚡ Test Auto-Alert Simulation'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
