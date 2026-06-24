import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Briefcase, Calendar, Bell, Sliders, PlayCircle, Plane, Sparkles, Check, Info, Sun, Moon, Sunrise, TreePine, Waves, Bike, Home, MapPin, Users, BookOpen, Star, Car, ArrowUp, ArrowDown, Play, Pause, ChevronsDown, X } from 'lucide-react';
import { City, Booking, TravelTab } from './types';
import { CITIES } from './data';

// Modular Sub-components
import SearchWidget from './components/SearchWidget';
import SearchResults from './components/SearchResults';
import AIPlanner from './components/AIPlanner';
import UttarakhandTourExplorer, { UTTARAKHAND_TOURS, PredefinedTour } from './components/UttarakhandTourExplorer';
import ContactMethods from './components/ContactMethods';
import AboutAndReviews from './components/AboutAndReviews';
import BookingConfirmationModal from './components/BookingConfirmationModal';

// Scenic photographs of beautiful Uttarakhand destinations for home page auto moving gallery with complete local details
const UTTARAKHAND_HERO_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=80',
    title: 'Chopta Chandrashila Peaks',
    vibe: 'Majestic Snowy Himalayan Summit',
    packageId: 'tour-chopta-tungnath-trek',
    altitude: '3,682 meters (12,079 ft)',
    bestSeason: 'April to November (Snow treks in Winter)',
    specialDelicacy: 'Kumaoni Dubuk with hot Mandua Roti',
    desc: 'A snowy, high-altitude dreamscape where sacred oak and rhododendron forests give way to dramatic, glistening white peaks. Gaze at the panoramic views of Trishul, Nanda Devi, and Chaukhamba mountains from the highest Shiva temple on earth at Tungnath.',
    tips: 'Pack thermal base layers and high-traction boots for the snow trail.'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7z5dQFkec2hamLRxQmdophxQGaZu-uS24SJypjUX_Ig&s=10',
    title: 'Kainchi Dham ',
    vibe: 'Serene Himalayan Spiritual Eye View',
    packageId: 'tour-kainchi-dham-ex-delhi-2n',
    altitude: 'Approx. 1,400 meters (4,593 ft)',
    bestSeason: 'Throughout the year (Lush greenery during Monsoon)',
    specialDelicacy: 'Kumaoni Raita, Bhatt ki Churkani & Ashram Prasad',
    desc: 'Experience a breathtaking aerial perspective of the revered Kainchi Dham, surrounded by emerald pine forests and rolling Himalayan valleys. From above, the peaceful temple complex appears harmoniously woven into the mountainscape, offering a mesmerizing blend of spirituality and natural beauty.',
    tips: 'Visit early morning for peaceful darshan, clear aerial views, and the most tranquil experience of the valley.'.'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6E4ivHafpi87UVuTrKKIItGyo6QyejYJiESIz4APTdA&s=10',
    title: 'Naini Lake Boats',
    vibe: 'Colorful Rowboats & Emerald Waters',
    packageId: 'tour-nainital',
    altitude: '1,938 meters (6,358 ft)',
    bestSeason: 'March to June & September to December',
    specialDelicacy: 'Kumaoni Bal Mithai & Thukpa',
    desc: 'Watch rows of vibrant yellow wooden rowboats sway gently along the emerald waters of Naini Lake. Guarded by steep pine-covered slopes, Nainital offers a timeless, peaceful rowing experience under clear blue skies.',
    tips: 'Rent a hand-rowed gondola boat for an authentic local storytelling experience.'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcxaHVLzVAHDpO9Iusnmy557Nw0n6KBMCRLW140fVOnQ&s=10',
    title: 'Mukteshwar Dham Panoramic Aerial View',
vibe: 'Breathtaking Himalayan Eagle-Eye View',
packageId: 'tour-mukteshwar-dham-uttarakhand',
altitude: '2,312 meters (7,585 ft) above sea level',
bestSeason: 'October to June (Snow-capped peaks visible in Winter)',
specialDelicacy: 'Aloo ke Gutke & Bal Mithai',
desc: 'Soar above the majestic hills of Mukteshwar Dham and witness sweeping views of the Kumaon Himalayas. Watch clouds drift across pine-covered ridges while the ancient temple stands peacefully atop the mountain, surrounded by endless valleys and pristine forests.',
tips: 'Early morning offers the best visibility for Himalayan peaks including Nanda Devi and Trishul on clear days.'
  }
  
];

export default function App() {
  // Uttarakhand Theme Environment State
  const [uttarakhandTheme, setUttarakhandTheme] = useState<'dawn' | 'blue'>('blue');

  // Home page background rotating slideshow state & effect
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % UTTARAKHAND_HERO_PHOTOS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Global booking tabs and states
  const [activeTab, setActiveTab] = useState<TravelTab>('cabs');
  
  const [fromCity, setFromCity] = useState<City>(CITIES[0]); // Delhi
  const [toCity, setToCity] = useState<City>(CITIES[1]);     // Mumbai
  const [departureDate, setDepartureDate] = useState('2026-07-20');
  
  // Custom travel class state parameters
  const [travellers, setTravellers] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');
  
  // Custom hotel state parameters
  const [hotelGuestCount, setHotelGuestCount] = useState(2);
  const [hotelRoomCount, setHotelRoomCount] = useState(1);

  // Custom cab state parameters
  const [cabCapacity, setCabCapacity] = useState(4);

  // Action loaders and displays
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Bookings list ledger state (persisted via localStorage)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('mmt_travel_ledger');
    return saved ? JSON.parse(saved) : [];
  });

  // Coupon state
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Single button Scroll controller state (false = top/auto up available, true = bottom/auto last available)
  const [scrolledPastHalf, setScrolledPastHalf] = useState(false);

  // Intermediary pending booking state for coupons checkout
  const [pendingBooking, setPendingBooking] = useState<{
    type: string;
    provider: string;
    routeDetails: string;
    price: string;
    date: string;
    callback: (finalPrice: string, couponApplied?: string) => void;
  } | null>(null);

  // Directly track the booking ID to open in details panel
  const [initialBookingToDetailId, setInitialBookingToDetailId] = useState<string | null>(null);

  // Track clicking on continuous Left-to-Right Flow photos to view places inform and corresponding package options
  const [selectedScenicPhoto, setSelectedScenicPhoto] = useState<any | null>(null);

  // Listen to scroll ratio to toggle the single arrow button direction
  useEffect(() => {
    const handleScrollDepth = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrolledRatio = window.scrollY / scrollHeight;
      // If user has scrolled down past 45%, point up to Top. Otherwise point down to Last/Bottom of website.
      setScrolledPastHalf(scrolledRatio > 0.45);
    };
    window.addEventListener('scroll', handleScrollDepth);
    return () => window.removeEventListener('scroll', handleScrollDepth);
  }, []);

  // Synchronize bookings database to localStorage client-side
  useEffect(() => {
    localStorage.setItem('mmt_travel_ledger', JSON.stringify(bookings));
  }, [bookings]);

  // Capture global custom events from encapsulated components wanting to toast
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent?.detail) {
        triggerToast(customEvent.detail);
      }
    };
    window.addEventListener('mmt-toast-raise', handleToastEvent);
    return () => {
      window.removeEventListener('mmt-toast-raise', handleToastEvent);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleSearchTrigger = () => {
    setIsSearching(true);
    setShowResults(false);

    // Simulate real-time aggregator GDS search fetching schedules
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      triggerToast(`Search successful for near ${activeTab} schedules!`);
    }, 1800);
  };

  const handleBookItem = (provider: string, routeDetails: string, price: string) => {
    setPendingBooking({
      type: activeTab,
      provider: provider,
      routeDetails: routeDetails,
      price: price,
      date: departureDate,
      callback: (finalPrice: string, couponApplied?: string) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let codeStr = '';
        for (let i = 0; i < 6; i++) {
            codeStr += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const newBooking: Booking = {
          id: `bk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: activeTab,
          provider: provider,
          routeDetails: routeDetails,
          date: departureDate,
          price: finalPrice,
          code: codeStr,
          status: 'Confirmed'
        };

        setBookings((prev) => [newBooking, ...prev]);
        triggerToast(`Reservation confirmed${couponApplied ? ` with Coupon ${couponApplied}` : ''}! Your e-ticket code is ${codeStr}.`);
      }
    });
  };

  const handleAddAITrip = (destination: string, days: number, budget: string) => {
    setPendingBooking({
      type: 'flights',
      provider: `Gemini AI: Full Tour Guide`,
      routeDetails: `${destination} (${days} Days Customizable Itinerary)`,
      price: budget,
      date: departureDate,
      callback: (finalPrice: string, couponApplied?: string) => {
        const uniqueTicketId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newBooking: Booking = {
          id: `bk-ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'flights',
          provider: `Gemini AI: Full Tour Guide`,
          routeDetails: `${destination} (${days} Days Customizable Itinerary)`,
          date: departureDate,
          price: finalPrice,
          code: `AI-${uniqueTicketId}`,
          status: 'Confirmed'
        };

        setBookings((prev) => [newBooking, ...prev]);
        triggerToast(`Successfully loaded custom AI Guide${couponApplied ? ` (Promo: ${couponApplied})` : ''} for ${destination} in your trips!`);
      }
    });
  };

  const handleBookUttarakhandTour = (provider: string, details: string, price: string) => {
    setPendingBooking({
      type: 'flights',
      provider: provider,
      routeDetails: details,
      price: price,
      date: departureDate,
      callback: (finalPrice: string, couponApplied?: string) => {
        const uniqueReceiptId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newBookingId = `bk-ut-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        
        const newBooking: Booking = {
          id: newBookingId,
          type: 'flights',
          provider: provider,
          routeDetails: details,
          date: departureDate,
          price: finalPrice,
          code: `UT-${uniqueReceiptId}`,
          status: 'Confirmed'
        };

        setBookings((prev) => [newBooking, ...prev]);
        setInitialBookingToDetailId(newBookingId);
        triggerToast(`Tourism package reservation secured successfully${couponApplied ? ` with Promo Coupon ${couponApplied}` : ''}! Your e-ticket code is UT-${uniqueReceiptId}. ✅`);
      }
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((bk) => bk.id !== bookingId));
    triggerToast(`Reservation ${bookingId.substring(0,8)} successfully refunded and cancelled.`);
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === updatedBooking.id ? updatedBooking : bk))
    );
    triggerToast(`Reservation status for e-ticket [ ${updatedBooking.code} ] has been modified. ✅`);
  };

  const handleApplyPromo = (code: string) => {
    setAppliedPromo(code);
    triggerToast(`Promo Coupon [ ${code} ] applied successfully! Discounts recalculated.`);
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen font-sans flex flex-col justify-between">
      
      {/* GLOBAL TOAST BANNER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-5 left-1/2 z-50 bg-slate-900 border border-slate-800 text-white font-bold text-xs md:text-sm px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 w-max max-w-[90vw]"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-slate-950" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE HEADER */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-white-5 bg-opacity-95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo brand */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-black tracking-tight select-none uppercase">
              Rudra<span className="text-orange-500"> Travel</span>
            </span>
            <span className="text-[9px] bg-orange-500/10 border border-orange-400/20 text-orange-400 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
              Rakesh Cab Service
            </span>
          </a>

          {/* Main Navigation (Requested) */}
          <nav className="hidden lg:flex items-center gap-5 text-[10.5px] font-black uppercase tracking-wider text-slate-300">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-orange-400 hover:scale-103 transition-all cursor-pointer">Home</button>
            <button onClick={() => {
              const el = document.getElementById('curated-holiday-packages');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
              window.dispatchEvent(new CustomEvent('clear-tour-filters'));
            }} className="text-orange-400 font-extrabold hover:text-orange-355 hover:scale-103 transition-all cursor-pointer">
              Tour Packages 
            </button>
            <button onClick={() => document.getElementById('section-about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-400 hover:scale-103 transition-all cursor-pointer">About us</button>
            <button onClick={() => document.getElementById('section-services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-400 hover:scale-103 transition-all cursor-pointer">Services</button>
          </nav>

          {/* Prompt status context or ledger access */}
          <div className="flex items-center gap-4 text-sm font-semibold">
            {appliedPromo && (
              <span className="text-xs bg-emerald-500/15 border border-emerald-400/20 text-emerald-400 font-bold px-3 py-1.5 rounded-xl hidden md:inline-flex items-center gap-1">
                Coupon: {appliedPromo}
              </span>
            )}
            
            <button className="bg-gradient-to-r from-sky-450 to-sky-650 hover:bg-sky-550 border border-sky-400/20 px-5 py-2.5 rounded-full font-bold shadow-lg shadow-sky-500/10 active:scale-95 transition-all text-xs md:text-sm cursor-pointer hidden xs:block">
              Member Club
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-Responsive Navigation shortcuts ribbon bar */}
      <div className="bg-slate-900 border-t border-b border-white/5 sticky top-16 z-30 transition-all shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
            <span className="text-[10px] uppercase font-black tracking-widest text-orange-450 bg-orange-500/15 border border-orange-500/20 px-2 py-0.5 rounded-md hidden xs:inline-block">Shortcuts:</span>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-orange-500/10 hover:text-orange-300 text-slate-300 text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap"
            >
              <Home className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </button>

            <button 
              onClick={() => {
                const el = document.getElementById('curated-holiday-packages');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
                window.dispatchEvent(new CustomEvent('clear-tour-filters'));
              }} 
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500/20 text-orange-200 border border-orange-500/30 hover:bg-orange-500/30 text-xs font-black uppercase transition-all cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>Tour Packages </span>
            </button>
            <button 
              onClick={() => {
                document.getElementById('section-services')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-300 text-slate-300 text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap"
            >
              <Car className="w-3.5 h-3.5 text-emerald-450 group-hover:scale-110 transition-transform" />
              <span>Services</span>
            </button>
            <button 
              onClick={() => {
                document.getElementById('expert-support-hub')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-orange-500/10 hover:text-orange-400 text-slate-200 text-xs font-black uppercase transition-all cursor-pointer border border-orange-500/25 whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400 group-hover:animate-bounce" />
              <span>Head Office & Hub</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider shrink-0">
            <span>📞 Helpline:</span>
            <span className="text-white font-black">+91 98765-43210</span>
          </div>
        </div>
      </div>

      {/* Hero & bookings engine core */}
      <main className="flex-1 pb-16">
        {/* Interactive Uttarakhand Theme Background Container */}
        <div className={`relative pt-12 pb-36 px-4 text-center border-b border-slate-900 transition-all duration-1000 ease-in-out ${
          [
            'bg-gradient-to-b from-slate-950 via-[#060a12] to-slate-950', // Chopta Icy Dark Blue
            'bg-gradient-to-b from-slate-950 via-[#0e0401] to-slate-950', // George Everest Sunset Amber Dark
            'bg-gradient-to-b from-slate-950 via-[#010c07] to-slate-950', // Naini Boats Emerald Dark
            'bg-gradient-to-b from-slate-950 via-[#060412] to-slate-950'  // Nainital Aerial Twilight Violet Dark
          ][currentBgIndex]
        }`}>
          {/* BACKGROUND LAYERS */}
          {/* Layer 0: Sun & Sunrise Star Atmosphere Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {/* FULL HERO BACKGROUND SLIDESHOW OF BEAUTIFUL UTTARAKHAND PLACES */}
            {UTTARAKHAND_HERO_PHOTOS.map((photo, index) => (
              <div
                key={`bg-slideshow-${index}`}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out transform scale-100"
                style={{
                  backgroundImage: `url(${photo.url})`,
                  opacity: index === currentBgIndex ? 0.05 : 0,
                }}
              />
            ))}
            {/* Extra gradient overlays to protect content accessibility & readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/98 via-slate-950/92 to-slate-950" />
            {/* Sun depending on active selected ambiance */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`sun-${currentBgIndex}`}
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 0.11, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 30 }}
                transition={{ duration: 1 }}
                className={`absolute left-1/2 -translate-x-1/2 top-3 w-96 h-96 rounded-full bg-gradient-to-t blur-3xl animate-sunrise-glow ${
                  [
                    'from-cyan-400/50 via-sky-500/20 to-transparent', // Chopta
                    'from-orange-600/50 via-amber-500/20 to-transparent', // George Everest
                    'from-emerald-500/50 via-teal-500/20 to-transparent', // Naini boats
                    'from-indigo-500/50 via-purple-500/20 to-transparent'  // Nainital aerial
                  ][currentBgIndex]
                }`}
              />
            </AnimatePresence>

            {/* Glowing sunray flares */}
            <div className="absolute inset-0 bg-radial-at-t from-transparent via-transparent to-black/45" />

            {/* Floating soaring Himalayan eagles */}
            <div className="absolute top-14 left-0 w-full h-12 overflow-hidden opacity-30">
              <div className="animate-soaring absolute flex items-center gap-1">
                <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L9 9H2L7 14L5 21L12 17L19 21L17 14L22 9H15L12 2Z" />
                </svg>
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-350">Garuda</span>
              </div>
            </div>

            {/* LAYER 1: Deep Himalayan Peak silhouettes (Nanda Devi inspired) */}
            <svg className="absolute bottom-0 left-0 w-full h-44 opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                fill={['#05070d', '#130401', '#000b06', '#03020a'][currentBgIndex]}
                d="M0,160 L120,240 L240,110 L360,280 L480,180 L600,260 L720,130 L840,290 L960,190 L1080,250 L1200,120 L1320,270 L1440,170 L1440,320 L0,320 Z"
              />
            </svg>

            {/* LAYER 2: Middle snow-crusted mountain summits */}
            <svg className="absolute bottom-0 left-0 w-full h-36 opacity-30" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                fill={['#080a12', '#1b0802', '#01120a', '#060414'][currentBgIndex]}
                d="M0,220 L160,120 L320,260 L480,150 L640,240 L800,110 L960,250 L1120,140 L1280,230 L1440,130 L1440,320 L0,320 Z"
              />
            </svg>

            {/* LAYER 3: Sacred Himalayan Valleys & Pine Deodar outlines */}
            <svg className="absolute bottom-0 left-0 w-full h-24 opacity-50" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                fill={['#02040a', '#0a0301', '#000804', '#020108'][currentBgIndex]}
                d="M0,280 L200,220 L400,290 L600,210 L800,280 L1000,230 L1200,295 L1440,220 L1440,320 L0,320 Z"
              />
            </svg>

            {/* LAYER 4: Beautiful drifting translucent mist clouds */}
            <div className="absolute inset-x-0 bottom-4 h-24 bg-gradient-to-t from-transparent via-white/5 to-transparent blur-md pointer-events-none" />
            <div className="absolute bottom-8 left-[10%] w-80 h-12 bg-white/10 rounded-full blur-2xl animate-mist-slow select-none pointer-events-none" />
            <div className="absolute bottom-12 right-[15%] w-96 h-14 bg-white/5 rounded-full blur-3xl animate-mist-fast select-none pointer-events-none" />

            {/* LAYER 5: Glowing Sacred River Ganga emerging from summits */}
            <svg className="absolute bottom-0 left-0 w-full h-12 opacity-80" viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path 
                fill="none" 
                stroke={['#38bdf8', '#fdba74', '#a7f3d0', '#c084fc'][currentBgIndex]}
                strokeWidth="4" 
                className="animate-river"
                d="M0,50 Q180,95 360,50 T720,50 T1080,50 T1440,50"
              />
              {/* Secondary glowing river trail */}
              <path 
                fill="none" 
                stroke={['#0ea5e9', '#f59e0b', '#10b981', '#818cf8'][currentBgIndex]}
                strokeWidth="2" 
                className="animate-river"
                style={{ animationDelay: '3s' }}
                d="M0,52 Q180,90 360,52 T720,52 T1080,52 T1440,52"
              />
            </svg>
          </div>

          {/* FRONTPLATE CONTENT & BUTTONS */}
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Ambient Tag Badge & Interactive Background Selector Pills */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 select-none">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sky-200 text-xs font-bold uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5 text-orange-400" /> Devbhoomi Uttarakhand Edition
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {UTTARAKHAND_HERO_PHOTOS.map((photo, index) => (
                  <button
                    key={`bg-selector-${index}`}
                    type="button"
                    onClick={() => setCurrentBgIndex(index)}
                    className={`text-[9.5px] font-black uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer border ${
                      index === currentBgIndex
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-500 shadow-md scale-103'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    📍 {photo.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.1
                  }
                }
              }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight font-sans leading-tight select-none"
              id="main-hero-heading"
            >
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)',
                    transition: { type: 'spring', damping: 15, stiffness: 100 } 
                  }
                }}
                className="inline-block mr-2 md:mr-3 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.7)]"
              >
                Explore the
              </motion.span>
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9, filter: 'blur(4px)' },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: { type: 'spring', damping: 12, stiffness: 120 } 
                  }
                }}
                className="inline-block bg-gradient-to-r from-orange-400 via-amber-300 via-emerald-400 to-sky-400 bg-clip-text text-transparent animate-gradient-text drop-shadow-[0_6px_20px_rgba(249,115,22,0.4)] font-black"
              >
                Majestic Hills
              </motion.span>
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)',
                    transition: { type: 'spring', damping: 15, stiffness: 100 } 
                  }
                }}
                className="inline-block ml-2 md:ml-3 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.7)]"
              >
                of Uttarakhand
              </motion.span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-xs md:text-sm font-semibold tracking-wide drop-shadow max-w-2xl mx-auto mb-6"
            >
              Experience holy rivers, mystical peak sunsets, and pristine mountain lodging. Let  tailor your spiritual Himalayan retreat instantly.
            </motion.p>
            {/* Scenic Uttarakhand Auto Moving Slideshow Carousel with Dynamic Click-to-Explore capability */}
            <div className="my-8 w-full relative z-20 overflow-hidden py-2" id="scenic-marquee-strip">
              <div className="w-full relative overflow-hidden">
                {/* Horizontal row animating Left to Right */}
                <div className="flex w-max hover:[animation-play-state:paused] select-none">
                  <div className="flex gap-5 shrink-0 animate-marquee-lr">
                    {[
                      ...UTTARAKHAND_HERO_PHOTOS, 
                      ...UTTARAKHAND_HERO_PHOTOS,
                      ...UTTARAKHAND_HERO_PHOTOS,
                      ...UTTARAKHAND_HERO_PHOTOS
                    ].map((photo, index) => (
                      <div 
                        key={`marquee-photo-${index}`}
                        onClick={() => setSelectedScenicPhoto(photo)}
                        className="w-72 sm:w-80 h-44 sm:h-48 rounded-[1.75rem] flex-shrink-0 relative overflow-hidden bg-slate-900 border-2 border-white/10 shadow-2xl group cursor-pointer transition-all duration-300 hover:scale-103 hover:border-orange-500/80 active:scale-98"
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 pointer-events-none select-none"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent transition-opacity duration-300 group-hover:via-black/40" />
                        
                        {/* Interactive floating indicator */}
                        <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity bg-orange-600/90 text-white font-mono text-[8px] font-black tracking-widest uppercase px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1">
                          <Compass className="w-2.5 h-2.5 animate-spin-slow" /> Explore Info & Packages
                        </div>

                        {/* Elegant tags and text for place name & vibe */}
                        <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                          <span className="inline-block px-2 py-0.5 rounded bg-orange-600 text-white text-[8px] font-black uppercase tracking-wider mb-1.5 font-mono shadow-md">
                            {photo.vibe}
                          </span>
                          <h4 className="text-white text-sm sm:text-base font-extrabold tracking-tight truncate drop-shadow-md">
                            {photo.title}
                          </h4>
                          <span className="text-[10px] text-orange-200 font-medium block mt-1 opacity-80">
                            Click to reveal travel guides & prices ➔
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Central widget container */}
        <div className="max-w-6xl mx-auto -mt-24 px-4">
          <SearchWidget
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            fromCity={fromCity}
            setFromCity={setFromCity}
            toCity={toCity}
            setToCity={setToCity}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            travellers={travellers}
            setTravellers={setTravellers}
            travelClass={travelClass}
            setTravelClass={setTravelClass}
            hotelGuestCount={hotelGuestCount}
            setHotelGuestCount={setHotelGuestCount}
            hotelRoomCount={hotelRoomCount}
            setHotelRoomCount={setHotelRoomCount}
            cabCapacity={cabCapacity}
            setCabCapacity={setCabCapacity}
            onSearch={handleSearchTrigger}
          />
        </div>

        {/* ACTIVE SEARCH RESULTS SCREEN */}
        {showResults && (
          <section 
            id="results-outer-container"
            className="max-w-6xl mx-auto px-4 mt-16 pt-12 border-t border-slate-200"
          >
            <SearchResults
              activeTab={activeTab}
              fromCity={fromCity}
              toCity={toCity}
              onBook={handleBookItem}
              appliedPromoCode={appliedPromo}
            />
          </section>
        )}



        {/* INTERACTIVE UTTARAKHAND TOUR MAP & TRIPS SPECIFICATION */}
        <section id="uttarakhand-tour-explorer" className="max-w-6xl mx-auto px-4 mt-6">
          <UttarakhandTourExplorer 
            onBookTour={handleBookUttarakhandTour} 
            appliedPromoCode={appliedPromo} 
          />
        </section>

        {/* DYNAMIC GEMINI AI CORRIDOR */}
        <section className="max-w-6xl mx-auto px-4 mt-16">
          <AIPlanner onAddAITripToBookings={handleAddAITrip} />
        </section>

        {/* CUSTOM ENRICHED ABOUT US & REVIEWS SECTION */}
        <section className="max-w-6xl mx-auto px-4 mt-16">
          <AboutAndReviews />
        </section>

        {/* COMPREHENSIVE CONTACT METHODS WITH ANIMATED ICONS */}
        <section className="max-w-6xl mx-auto px-4">
          <ContactMethods />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 h-[120px] py-6 px-6 border-t border-slate-900 relative overflow-hidden flex flex-col justify-between items-center">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-950/5 pointer-events-none" />
        
        <div className="w-full max-w-4xl mx-auto text-center relative z-10 h-full flex flex-col justify-between items-center">
          <div className="flex flex-col items-center select-none">
            <span className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-1.5 leading-none">
              rudra<span className="text-orange-500">travel</span>
            </span>
            <div className="h-0.5 w-6 bg-orange-500 rounded-full mt-1" />
          </div>
          
          <p className="text-[10px] md:text-xs text-slate-400 font-medium leading-tight max-w-xl mx-auto">
            Explore  travel packages and book 24/7 Rakesh Cab Service .
          </p>
          
          <p className="text-[9px] text-slate-500 font-semibold tracking-wide">
            &copy; 2025 Rudra Travel Guide & Rakesh Vedi Cab Service.
          </p>
        </div>
      </footer>

      {/* SEARCH FLIGHT PATH LOADER GIGANTIC MODAL */}
      <AnimatePresence>
        {isSearching && (
          <motion.div 
            key="search-modal-loading-screen-root"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="search-modal-loading-screen" 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-md p-8 relative z-10 text-center shadow-2xl overflow-hidden border border-slate-100"
            >
              {/* Flight vector moving path container */}
              <div className="h-16 relative overflow-hidden mb-6 bg-slate-50 rounded-2xl flex items-center border border-slate-100">
                {activeTab === 'flights' ? (
                  <Bike className="w-10 h-10 text-sky-500 animate-flight absolute" />
                ) : (
                  <Plane className="w-10 h-10 text-sky-500 animate-flight absolute" />
                )}
              </div>
              <h3 className="text-xl font-extrabold text-slate-800">
                {activeTab === 'flights' ? 'Compiling Rental Fleet Rates...' : 'Compiling Travel Rates...'}
              </h3>
              <p className="text-sm text-slate-400 mt-2 font-medium">
                {activeTab === 'flights' ? (
                  <>Syncing custom rent quotes at <span className="font-extrabold text-slate-600">{fromCity.name}</span></>
                ) : (
                  <>Syncing custom fares for travel <span className="font-extrabold text-slate-600">{fromCity.code}</span> to <span className="font-extrabold text-slate-600">{toCity.code}</span></>
                )}
              </p>
              
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-6 overflow-hidden">
                <motion.div 
                  className="bg-orange-500 h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED TOURIST DESTINATION PORTFOLIO & PACKAGE OPTIONS MODAL */}
      <AnimatePresence>
        {selectedScenicPhoto && (() => {
          const matchedTour = UTTARAKHAND_TOURS.find((t) => t.id === selectedScenicPhoto.packageId);
          return (
            <motion.div
              key={`scenic-photo-modal-root-${selectedScenicPhoto.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              id="scenic-destination-modal"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto pointer-events-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 25 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="bg-slate-900 border border-slate-800 text-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative my-4 max-h-[90vh]"
              >
                {/* Floating Absolute Header Image */}
                <div className="relative h-48 sm:h-56 w-full flex-shrink-0 bg-slate-950">
                  <img
                    src={selectedScenicPhoto.url}
                    alt={selectedScenicPhoto.title}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/25 to-transparent" />
                  
                  {/* Close button on Top-Right */}
                  <button
                    type="button"
                    onClick={() => setSelectedScenicPhoto(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-orange-600/90 text-white transition-colors cursor-pointer border border-white/10"
                    title="Close Details Panel"
                    id="close-scenic-modal"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-4 left-5 right-5 text-left pointer-events-none">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-orange-600 text-white text-[8.5px] font-black uppercase tracking-widest font-mono shadow">
                      {selectedScenicPhoto.vibe}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 drop-shadow-md">
                      {selectedScenicPhoto.title}
                    </h3>
                  </div>
                </div>

                {/* Scrollable Informative Body Content */}
                <div className="p-5 overflow-y-auto space-y-5 flex-1 text-left custom-scrollbar" id="scenic-modal-body">
                  {/* Grid Specs */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-[11px]">
                    <div className="bg-slate-800/40 border border-slate-800 p-2.5 rounded-2xl">
                      <span className="text-orange-400 font-extrabold block mb-1 uppercase tracking-wider text-[8px]">Altitude</span>
                      <span className="font-bold text-slate-200">{selectedScenicPhoto.altitude}</span>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-800 p-2.5 rounded-2xl">
                      <span className="text-orange-400 font-extrabold block mb-1 uppercase tracking-wider text-[8px]">Best Season</span>
                      <span className="font-bold text-slate-200">{selectedScenicPhoto.bestSeason}</span>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-800 p-2.5 rounded-2xl">
                      <span className="text-orange-400 font-extrabold block mb-1 uppercase tracking-wider text-[8px]">Local Taste</span>
                      <span className="font-bold text-slate-200">{selectedScenicPhoto.specialDelicacy}</span>
                    </div>
                  </div>

                  {/* Informative text narrative */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-orange-500" /> Destination Overview
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                      {selectedScenicPhoto.desc}
                    </p>
                  </div>

                  {/* Expert guide advice */}
                  <div className="bg-orange-950/20 border border-orange-900/40 rounded-2xl p-3.5 space-y-1.5">
                    <h5 className="text-[10.5px] font-black tracking-wider text-orange-400 uppercase flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-orange-500" /> Local Concierge Tip
                    </h5>
                    <p className="text-slate-200 text-xs leading-relaxed font-medium">
                      {selectedScenicPhoto.tips}
                    </p>
                  </div>

                  {/* Corresponding Predefined Tour Package Options */}
                  {matchedTour ? (
                    <div className="border-t border-slate-800 pt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-emerald-500" /> Linked Custom Package
                        </h4>
                        <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-600/20 text-emerald-400 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                          {matchedTour.badge}
                        </span>
                      </div>

                      {/* Package summary item */}
                      <div className="bg-slate-800/30 border border-slate-800/80 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h5 className="text-[13px] font-extrabold text-white leading-snug">{matchedTour.name}</h5>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{matchedTour.subtitle}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-mono font-black text-rose-400 block">₹{matchedTour.pricePerPerson.toLocaleString('en-IN')}</span>
                            <span className="text-[8px] text-slate-400 block font-bold font-mono">per traveler</span>
                          </div>
                        </div>

                        {/* Staggered highlights list */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 pt-2 border-t border-slate-800/50">
                          {matchedTour.highlights.slice(0, 4).map((highlight, hIdx) => (
                            <div key={`modal-h-${hIdx}`} className="flex items-start gap-1.5">
                              <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="leading-snug font-medium truncate" title={highlight}>{highlight}</span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Book Package directly */}
                        <button
                          type="button"
                          onClick={() => {
                            // Instant booking logic that opens active passenger ledger seamlessly
                            handleBookUttarakhandTour(
                              "Local Travel Desk Experts",
                              `Package Tour Pass: ${matchedTour.name} (Custom Guide & ${matchedTour.duration} lodging trail included)`,
                              `₹${matchedTour.pricePerPerson.toLocaleString('en-IN')}`
                            );
                            setSelectedScenicPhoto(null);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-97 text-white font-black py-2.5 rounded-xl text-[11px] uppercase tracking-widest transition-transform select-none cursor-pointer flex items-center justify-center gap-1.5 mt-2 shadow-lg"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Instant Book & Open E-Ticket Options</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-xs text-slate-500 py-2 border-t border-slate-800">
                      Looking to customize dates? Reach our helpline for all custom itinerary bookings.
                    </div>
                  )}
                </div>

                {/* Footer close tag */}
                <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span>🗺️ Devbhoomi Tourism Board Guide</span>
                  <button
                    type="button"
                    onClick={() => setSelectedScenicPhoto(null)}
                    className="text-orange-500 hover:text-orange-400 font-extrabold uppercase"
                  >
                    Close Sheet
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* BOOKING DRAWER */}
      <BookingConfirmationModal
        isOpen={pendingBooking !== null}
        onClose={() => setPendingBooking(null)}
        pendingBooking={pendingBooking}
      />

      {/* SINGLE TOGGLE INSTANT SCROLL ARROW BUTTON (Auto Up & Auto Last) */}
      <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
        <button
          onClick={() => {
            if (scrolledPastHalf) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              triggerToast("Scrolled smoothly to the top! 🌅");
            } else {
              window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
              triggerToast("Scrolled smoothly to the bottom! 🏔️");
            }
          }}
          title={scrolledPastHalf ? "Scroll to Top (Auto Up)" : "Scroll to Bottom (Auto Last)"}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:bg-orange-600 text-slate-200 hover:text-white flex items-center justify-center cursor-pointer shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 group"
        >
          {scrolledPastHalf ? (
            <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          ) : (
            <ArrowDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
