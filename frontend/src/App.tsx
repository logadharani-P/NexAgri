import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FarmerHome } from './components/FarmerHome';
import { MarketPrices } from './components/MarketPrices';
import { MyCropsLots } from './components/MyCropsLots';
import { FindBuyers } from './components/FindBuyers';
import { OrdersTracker } from './components/OrdersTracker';
import { PaymentsUPI } from './components/PaymentsUPI';
import { LogisticsStorage } from './components/LogisticsStorage';
import { MarketMap } from './components/MarketMap';
import { DisputesModule } from './components/DisputesModule';
import { FarmerProfile } from './components/FarmerProfile';
import { BuyerDashboard } from './components/BuyerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PricePredictorModal } from './components/PricePredictorModal';
import { PriceComparisonModal } from './components/PriceComparisonModal';
import { AgriAIChatbot } from './components/AgriAIChatbot';
import { NexAgriVoiceAssistant } from './components/NexAgriVoiceAssistant';
import { CropInsuranceDashboard } from './components/CropInsuranceDashboard';
import { AuthScreen } from './components/AuthScreen';
import { OfflineBanner } from './components/OfflineBanner';
import { useAuth } from './context/AuthContext';
import { Menu } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { role, isAuthenticated, logout } = useAuth();
  const [activeNav, setActiveNav] = useState<string>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modal triggers
  const [predictionCropId, setPredictionCropId] = useState<string | null>(null);
  const [compareCropId, setCompareCropId] = useState<string | null>(null);
  const [isVoiceAIOpen, setIsVoiceAIOpen] = useState<boolean>(false);
  const [insurancePreSelectedCrop, setInsurancePreSelectedCrop] = useState<string | undefined>(undefined);

  // Sync navigation state with browser URL path
  const syncRouteWithState = useCallback((targetNav: string, userRole: string) => {
    let path = '/';
    switch (targetNav) {
      case 'home':
        path = userRole === 'buyer' ? '/buyer' : (userRole === 'admin' ? '/admin' : '/farmer');
        break;
      case 'buyer':
        path = '/buyer';
        break;
      case 'markets':
        path = '/markets';
        break;
      case 'lots':
        path = '/lots';
        break;
      case 'buyers':
        path = '/buyers';
        break;
      case 'orders':
        path = '/orders';
        break;
      case 'payments':
        path = '/payments';
        break;
      case 'insurance':
        path = '/insurance';
        break;
      case 'logistics':
      case 'storage':
        path = '/logistics';
        break;
      case 'map':
        path = '/map';
        break;
      case 'disputes':
        path = '/disputes';
        break;
      case 'profile':
        path = '/profile';
        break;
      default:
        path = userRole === 'buyer' ? '/buyer' : '/farmer';
    }

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, []);

  // Handle URL changes & deep linking
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';

      if (!isAuthenticated) {
        // If unauthenticated, redirect any protected route to root login
        if (pathname !== '/' && pathname !== '/login' && pathname !== '/auth/login') {
          window.history.replaceState({}, '', '/');
        }
        return;
      }

      // If authenticated and visiting root or login routes, redirect to role dashboard
      if (pathname === '/' || pathname === '/login' || pathname === '/auth/login') {
        const dest = role === 'buyer' ? '/buyer' : '/farmer';
        window.history.replaceState({}, '', dest);
        setActiveNav('home');
        return;
      }

      // Map URL to activeNav
      if (pathname === '/farmer' || pathname === '/dashboard') {
        setActiveNav('home');
      } else if (pathname === '/buyer') {
        setActiveNav('buyer');
      } else if (pathname === '/markets' || pathname === '/market') {
        setActiveNav('markets');
      } else if (pathname === '/lots') {
        setActiveNav('lots');
      } else if (pathname === '/buyers') {
        setActiveNav('buyers');
      } else if (pathname === '/orders') {
        setActiveNav('orders');
      } else if (pathname === '/payments') {
        setActiveNav('payments');
      } else if (pathname === '/insurance' || pathname === '/pmfby') {
        setActiveNav('insurance');
      } else if (pathname === '/logistics' || pathname === '/storage') {
        setActiveNav('logistics');
      } else if (pathname === '/map') {
        setActiveNav('map');
      } else if (pathname === '/disputes') {
        setActiveNav('disputes');
      } else if (pathname === '/profile') {
        setActiveNav('profile');
      } else {
        setActiveNav('home');
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, role]);

  // Handle successful login
  const handleAuthSuccess = () => {
    const dest = role === 'buyer' ? '/buyer' : '/farmer';
    window.history.pushState({}, '', dest);
    setActiveNav('home');
  };

  // Nav selection handler that also updates URL
  const handleSelectNav = (navKey: string, extraData?: any) => {
    if (navKey === 'auth') {
      logout();
      window.history.pushState({}, '', '/');
      return;
    }
    if (navKey === 'insurance' && typeof extraData === 'string') {
      setInsurancePreSelectedCrop(extraData);
    } else if (navKey !== 'insurance') {
      setInsurancePreSelectedCrop(undefined);
    }
    setActiveNav(navKey);
    syncRouteWithState(navKey, role);
  };

  // 1. UNAUTHENTICATED USERS: Display the new Login / Register screen directly at '/'
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onSuccess={handleAuthSuccess}
      />
    );
  }

  // 2. AUTHENTICATED USERS: Render Dashboards & Application Views
  const renderActiveView = () => {
    if (activeNav === 'buyer' || (activeNav === 'home' && role === 'buyer')) {
      return <BuyerDashboard onSelectNav={handleSelectNav} />;
    }

    if (role === 'admin' && activeNav === 'home') {
      return <AdminDashboard />;
    }

    switch (activeNav) {
      case 'markets':
        return (
          <MarketPrices
            onSelectNav={handleSelectNav}
            onOpenPredictionModal={(cropId) => setPredictionCropId(cropId)}
            onOpenCompareModal={(cropId) => setCompareCropId(cropId)}
          />
        );
      case 'lots':
        return (
          <MyCropsLots
            onSelectNav={handleSelectNav}
            onOpenPrediction={(cropId) => setPredictionCropId(cropId)}
          />
        );
      case 'buyers':
        return <FindBuyers onSelectNav={handleSelectNav} />;
      case 'orders':
        return <OrdersTracker onSelectNav={handleSelectNav} />;
      case 'payments':
        return <PaymentsUPI />;
      case 'insurance':
        return (
          <CropInsuranceDashboard
            onSelectNav={handleSelectNav}
            preSelectedCrop={insurancePreSelectedCrop}
          />
        );
      case 'logistics':
      case 'storage':
        return <LogisticsStorage />;
      case 'map':
        return <MarketMap />;
      case 'disputes':
        return <DisputesModule />;
      case 'profile':
        return <FarmerProfile onSelectNav={handleSelectNav} />;
      case 'ai':
        return <NexAgriVoiceAssistant onSelectNav={handleSelectNav} />;
      case 'home':
      default:
        return <FarmerHome onSelectNav={handleSelectNav} onOpenAIChat={() => setIsVoiceAIOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Offline Status & Sync Alert Banner */}
      <OfflineBanner />

      {/* Top Main Navbar */}
      <Navbar
        onOpenVoiceAI={() => setIsVoiceAIOpen(true)}
        onSelectNav={handleSelectNav}
        activeNav={activeNav}
      />

      {/* Mobile Hamburger Bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-2 text-xs font-bold cursor-pointer"
        >
          <Menu className="w-5 h-5 text-blue-700" />
          <span>Menu</span>
        </button>

        <span className="text-xs font-extrabold text-slate-800 capitalize">
          Current View: {activeNav}
        </span>
      </div>

      {/* Main Body with Sidebar and Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Left Sidebar */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={handleSelectNav}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-6">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        onOpenVoiceAI={() => setIsVoiceAIOpen(true)}
      />

      {/* Modals */}
      {predictionCropId && (
        <PricePredictorModal
          cropId={predictionCropId}
          isOpen={true}
          onClose={() => setPredictionCropId(null)}
          onSelectNav={handleSelectNav}
        />
      )}

      {compareCropId && (
        <PriceComparisonModal
          cropId={compareCropId}
          isOpen={true}
          onClose={() => setCompareCropId(null)}
          onSelectMandi={() => {
            handleSelectNav('markets');
          }}
        />
      )}

      <AgriAIChatbot
        isOpen={isVoiceAIOpen}
        onClose={() => setIsVoiceAIOpen(false)}
        onOpen={() => setIsVoiceAIOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
