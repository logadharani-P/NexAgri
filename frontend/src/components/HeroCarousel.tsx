import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Store,
  Warehouse,
  Sparkles,
  Award,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export interface HeroSlide {
  id: number;
  eyebrow: string;
  tag: string;
  title: string;
  subtitle?: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
  image: string;
  badgeIcon: React.ReactNode;
}

interface HeroCarouselProps {
  onSelectNav: (nav: string) => void;
  onOpenAIChat?: () => void;
  onOpenVoiceAI?: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onSelectNav, onOpenAIChat, onOpenVoiceAI }) => {
  const handleOpenAI = onOpenAIChat || onOpenVoiceAI || (() => {});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slides: HeroSlide[] = [
    {
      id: 1,
      eyebrow: "SMART FARMING • SMART MARKETS",
      tag: "Live Mandi Radar",
      title: "Sell Smarter. Earn Better.",
      subtitle: "Maximized Farm Profitability",
      description: "Discover the best live mandi prices, verified institutional buyers, and transparent transit costs near you.",
      buttonText: "Check Market Prices",
      buttonAction: () => onSelectNav('markets'),
      image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1600&q=80",
      badgeIcon: <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
    },
    {
      id: 2,
      eyebrow: "AGMARKNET REAL-TIME • 500+ MANDIS",
      tag: "Daily APMC Arrivals",
      title: "Live Mandi Prices",
      subtitle: "Direct Agmarknet Feeds",
      description: "Compare crop modal prices, volume arrivals, and daily price trends across Indian agricultural mandis.",
      buttonText: "View Market Prices",
      buttonAction: () => onSelectNav('markets'),
      image: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=1600&q=80",
      badgeIcon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
    },
    {
      id: 3,
      eyebrow: "ZERO MIDDLEMEN • DIRECT TRADE",
      tag: "1,200+ Verified Buyers",
      title: "Connect Directly With Verified Buyers",
      subtitle: "Guaranteed Minimum Price",
      description: "Find trusted corporate & wholesale buyers, lock contracts, and receive secure payments without distress sales.",
      buttonText: "Find Buyers",
      buttonAction: () => onSelectNav('buyers'),
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1600&q=80",
      badgeIcon: <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
    },
    {
      id: 4,
      eyebrow: "NET PRICE OPTIMIZER • ZERO HIDDEN COSTS",
      tag: "Intelligent Market Routing",
      title: "Smart Mandi Marketplace",
      subtitle: "Highest Net Take-Home",
      description: "Find the right market for your crop after deducting real-time transport, handling, and mandi cess.",
      buttonText: "Explore Mandis",
      buttonAction: () => onSelectNav('markets'),
      image: "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=1600&q=80",
      badgeIcon: <Store className="w-3.5 h-3.5 text-blue-400" />
    },
    {
      id: 5,
      eyebrow: "COLD STORAGE & AGRI-LOGISTICS",
      tag: "Post-Harvest Assurance",
      title: "Storage & Logistics",
      subtitle: "Preserve Produce Value",
      description: "Store your harvest in nearby certified cold facilities and book verified logistics at fair per-km rates.",
      buttonText: "Find Storage",
      buttonAction: () => onSelectNav('storage'),
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
      badgeIcon: <Warehouse className="w-3.5 h-3.5 text-blue-400" />
    },
    {
      id: 6,
      eyebrow: "MULTILINGUAL AGRI-AI • 24/7 ADVISORY",
      tag: "Voice & Text Support",
      title: "AI-Powered Selling Assistant",
      subtitle: "Localized Crop Intelligence",
      description: "Get personalized sell-or-hold recommendations and live market intelligence in Tamil, Hindi, or English.",
      buttonText: "Ask NexAgri AI",
      buttonAction: () => handleOpenAI(),
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1600&q=80",
      badgeIcon: <Sparkles className="w-3.5 h-3.5 text-blue-400" />
    },
    {
      id: 7,
      eyebrow: "DIGITAL BHARAT AGRI-NETWORK",
      tag: "Farmer First Platform",
      title: "From Farm to Better Markets",
      subtitle: "Empowering Rural Producers",
      description: "One unified national ecosystem connecting farmers, institutional buyers, and transparent mandis across India.",
      buttonText: "Start Selling",
      buttonAction: () => onSelectNav('lots'),
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1600&q=80",
      badgeIcon: <Award className="w-3.5 h-3.5 text-blue-400" />
    },
    {
      id: 8,
      eyebrow: "GOVERNMENT OF INDIA • PMFBY SCHEME",
      tag: "1.5% - 5.0% Subsidized Premium",
      title: "Pradhan Mantri Fasal Bima Yojana",
      subtitle: "Protect Crops. Secure Income.",
      description: "Comprehensive risk coverage against drought, flood, hailstorm, and pests with direct subsidy support and 14447 helpline.",
      buttonText: "Explore PMFBY Insurance",
      buttonAction: () => onSelectNav('insurance'),
      image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1600&q=80",
      badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
    }
  ];

  // Auto slide interval (5 seconds)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-950 group select-none transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Agri-Marketplace Highlights Carousel"
    >
      {/* Fixed aspect / responsive height: approx 280px-340px */}
      <div className="relative w-full h-[300px] sm:h-[320px] md:h-[340px] overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Fallback and Smooth Zoom effect */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover object-center transform transition-transform duration-10000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Left-skewed multi-layer rich dark gradient to ensure high text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 sm:via-slate-900/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
                {/* Subtle agricultural blue ambient glow */}
                <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* Slide Content Overlay (Left-Aligned) */}
              <div className="relative z-10 h-full max-w-4xl flex flex-col justify-center px-6 sm:px-10 md:px-12 py-6">
                {/* Eyebrow & Tag Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                  <div className="inline-flex items-center gap-1.5 bg-blue-500/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-blue-300 border border-blue-400/30 shadow-sm">
                    {slide.badgeIcon}
                    <span>{slide.eyebrow}</span>
                  </div>

                  <span className="hidden sm:inline-flex items-center bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-200 border border-white/10">
                    {slide.tag}
                  </span>
                </div>

                {/* Large Bold Heading */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl drop-shadow-md">
                  {slide.title}
                </h2>

                {/* Supporting Description */}
                <p className="text-slate-200 text-xs sm:text-sm md:text-base mt-2 sm:mt-2.5 max-w-xl line-clamp-2 leading-relaxed font-normal">
                  {slide.description}
                </p>

                {/* Rounded CTA Button */}
                <div className="mt-4 sm:mt-5 flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      slide.buttonAction();
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-full shadow-lg shadow-blue-950/50 hover:shadow-blue-500/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/30"
                  >
                    <span>{slide.buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <span className="text-[11px] text-slate-400 font-medium hidden md:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    Verified Agmarknet Network
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Vertically centered on both sides) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-blue-600/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-blue-600/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Bottom Controls: Slide Counter & Pagination Dots */}
      <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex items-center justify-between px-6 pointer-events-none">
        {/* Slide Counter (e.g. 01 / 07) */}
        <div className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[11px] font-mono font-bold text-slate-300 hidden sm:flex items-center gap-1">
          <span className="text-blue-400">0{currentSlide + 1}</span>
          <span className="text-slate-500">/</span>
          <span>0{slides.length}</span>
        </div>

        {/* Centered Pagination Dots */}
        <div className="mx-auto flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 pointer-events-auto">
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-6 h-2 bg-blue-400 shadow-sm shadow-blue-400/50'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>

        {/* Live status badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
          <span>Live Agmarknet</span>
        </div>
      </div>
    </div>
  );
};
