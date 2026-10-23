import React from 'react';
import { User, ShieldCheck, MapPin, Phone, Sprout, Globe, CreditCard, LogOut, UserPlus, LandPlot, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../data/translations';

interface FarmerProfileProps {
  onSelectNav?: (nav: string) => void;
}

export const FarmerProfile: React.FC<FarmerProfileProps> = ({ onSelectNav }) => {
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-700 text-white flex items-center justify-center font-black text-2xl shadow-md">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Kisan Aadhaar & Mobile Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kisan Registration ID: <strong className="text-slate-800 font-mono">{user.kisanId || 'TN-CBE-2026-8941'}</strong> • {user.village || user.district} Cluster
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-red-200 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Logout / Switch Account</span>
            </button>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Farmer Personal & Location Info</span>
            </h3>
            <div className="flex justify-between text-slate-600">
              <span>Full Name:</span>
              <span className="font-bold text-slate-900">{user.name}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Mobile Number:</span>
              <span className="font-bold text-slate-900">{user.phone}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>State:</span>
              <span className="font-bold text-slate-900">{user.state}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>District:</span>
              <span className="font-bold text-slate-900">{user.district}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taluk / Village:</span>
              <span className="font-bold text-slate-900">{user.taluk || user.village || 'Sirumugai'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Kisan Pass ID:</span>
              <span className="font-bold font-mono text-blue-700">{user.kisanId || 'TN-CBE-2026-8941'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <LandPlot className="w-4 h-4 text-blue-600" />
              <span>Farming & Banking Credentials</span>
            </h3>
            <div className="flex justify-between text-slate-600">
              <span>Crops Grown:</span>
              <span className="font-bold text-slate-900">
                {user.cropsGrown && user.cropsGrown.length > 0 ? user.cropsGrown.join(', ') : 'Tomato, Carrot, Turmeric'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Farm Area & Type:</span>
              <span className="font-bold text-slate-900">
                {user.landAcres || 4.5} Acres ({user.landOwnership || 'Owner'}, {user.irrigation || 'Drip'})
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Preferred Mandi:</span>
              <span className="font-bold text-amber-700">{user.preferredMandi || 'Mettupalayam APMC'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Direct Settlement UPI:</span>
              <span className="font-mono font-bold text-blue-700">{user.upiId || 'selvam.farmer@sbi'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>App Language:</span>
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-900"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.native} ({l.name})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
