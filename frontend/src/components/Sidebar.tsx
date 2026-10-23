import React from 'react';
import {
  Home,
  TrendingUp,
  Sprout,
  Users,
  PackageCheck,
  CreditCard,
  Warehouse,
  MapPin,
  Bot,
  Scale,
  User,
  ShieldCheck,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeNav: string;
  onSelectNav: (nav: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  isOpenMobile,
  onCloseMobile
}) => {
  const { role, user } = useAuth();
  const { t } = useLanguage();

  // Final 11 items for Farmer navigation as specified in Requirement 17
  const farmerNavItems = [
    { id: 'home', label: t.home || 'Home', icon: Home, badge: '' },
    { id: 'markets', label: t.marketPrices || 'Indian Market Prices', icon: TrendingUp, badge: t.liveBadge || 'Live' },
    { id: 'lots', label: t.myCrops || 'My Crops & Lots', icon: Sprout, badge: t.lotsBadge || '3 Lots' },
    { id: 'buyers', label: t.findBuyers || 'Find Verified Buyers', icon: Users, badge: t.activeBadge || 'Active' },
    { id: 'orders', label: t.orders || 'Active Orders', icon: PackageCheck, badge: '2' },
    { id: 'payments', label: t.payments || 'UPI & Bank Payments', icon: CreditCard, badge: t.verifiedBadge || 'Verified' },
    { id: 'insurance', label: `🌾 ${t.insurance || 'Crop Insurance'}`, icon: ShieldCheck, badge: 'PMFBY' },
    { id: 'storage', label: t.storage || 'Cold Storage & Mandis', icon: Warehouse, badge: '' },
    { id: 'map', label: t.marketMap || 'Interactive Market Map', icon: MapPin, badge: 'GIS' },
    { id: 'ai', label: t.aiChatbot || 'AI Chatbot', icon: Bot, badge: 'NexAgri' },
    { id: 'disputes', label: t.disputes || 'Disputes & Grievances', icon: Scale, badge: '' },
    { id: 'profile', label: t.profile || 'Farmer Profile', icon: User, badge: 'Kisan ID' }
  ];

  const buyerNavItems = [
    { id: 'home', label: t.home || 'Buyer Dashboard', icon: Home, badge: '' },
    { id: 'lots', label: t.myCrops || 'Browse Farm Lots', icon: Sprout, badge: 'Fresh' },
    { id: 'markets', label: t.marketPrices || 'Indian Market Prices', icon: TrendingUp, badge: t.liveBadge || 'Live' },
    { id: 'buyers', label: t.findBuyers || 'Suppliers & FPOs', icon: Users, badge: '' },
    { id: 'orders', label: t.orders || 'Procurement Orders', icon: PackageCheck, badge: '2' },
    { id: 'payments', label: t.payments || 'Digital Invoices & UPI', icon: CreditCard, badge: '' },
    { id: 'storage', label: t.storage || 'Cold Storage & Mandis', icon: Warehouse, badge: '' },
    { id: 'map', label: t.marketMap || 'Interactive Market Map', icon: MapPin, badge: '' },
    { id: 'ai', label: t.aiChatbot || 'AI Chatbot', icon: Bot, badge: 'NexAgri' },
    { id: 'disputes', label: t.disputes || 'Disputes & Grievances', icon: Scale, badge: '' }
  ];

  const adminNavItems = [
    { id: 'home', label: 'Admin Command Center', icon: Home, badge: 'Live' },
    { id: 'markets', label: t.marketPrices || 'Price Feeds & Mandis', icon: TrendingUp, badge: '' },
    { id: 'lots', label: t.myCrops || 'Produce Catalog', icon: Sprout, badge: '' },
    { id: 'buyers', label: t.findBuyers || 'Verified Buyers List', icon: Building2, badge: '' },
    { id: 'orders', label: t.orders || 'Platform Transactions', icon: FileSpreadsheet, badge: '' },
    { id: 'disputes', label: t.disputes || 'Disputes & Grievances', icon: Scale, badge: '1 Action' }
  ];

  const navItems = role === 'buyer' ? buyerNavItems : (role === 'admin' ? adminNavItems : farmerNavItems);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Mini Banner */}
        <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-blue-50/70 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              {role === 'farmer' ? '🌾' : (role === 'buyer' ? '🏢' : '🛡️')}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {role === 'buyer' ? user.businessName : user.name}
                </p>
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 font-medium capitalize">
                {role} • {user.district || 'Coimbatore'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Link List (Exact Requirement 17 Structure) */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectNav(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Clean System Status Card Footer */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50 text-[11px] text-slate-600">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-dot"></span>
              <span>AGMARKNET Sync Active</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              439+ Mandis Connected Across India
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
