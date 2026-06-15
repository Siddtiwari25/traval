import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Briefcase, Calendar, Bell, Sliders, PlayCircle, Plane, Sparkles, Check, Info, Sun, Moon, Sunrise, TreePine, Waves } from 'lucide-react';
import { City, Booking, TravelTab } from './types';
import { CITIES } from './data';

// Modular Sub-components
import SearchWidget from './components/SearchWidget';
import SearchResults from './components/SearchResults';
import OffersSection from './components/OffersSection';
import AIPlanner from './components/AIPlanner';
import ActiveBookings from './components/ActiveBookings';
import UttarakhandTourExplorer from './components/UttarakhandTourExplorer';
import ContactMethods from './components/ContactMethods';

export default function App() {
  // Uttarakhand Theme Environment State
  const [uttarakhandTheme, setUttarakhandTheme] = useState<'dawn' | 'blue' | 'dusk'>('dawn');

  // Global booking tabs and states
  const [activeTab, setActiveTab] = useState<TravelTab>('flights');
  
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
  const [showMyLedger, setShowMyLedger] = useState(false);

  // Bookings list ledger state (persisted via localStorage)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('mmt_travel_ledger');
    return saved ? JSON.parse(saved) : [];
  });

  // Coupon state
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    // Generate a secure, unique ticket booking alphanumeric sequence
    const uniqueTicketId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codeStr = '';
    for (let i = 0; i < 6; i++) {
        codeStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      type: activeTab,
      provider: provider,
      routeDetails: routeDetails,
      date: departureDate,
      price: price,
      code: codeStr,
      status: 'Confirmed'
    };

    setBookings((prev) => [newBooking, ...prev]);
    setShowMyLedger(true);
    triggerToast(`Reservation confirmed! Your e-ticket code is ${codeStr}.`);
  };

  const handleAddAITrip = (destination: string, days: number, budget: string) => {
    const uniqueTicketId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newBooking: Booking = {
      id: `bk-ai-${Date.now()}`,
      type: 'flights',
      provider: `Gemini AI: Full Tour Guide`,
      routeDetails: `${destination} (${days} Days Customizable Itinerary)`,
      date: departureDate,
      price: budget,
      code: `AI-${uniqueTicketId}`,
      status: 'Confirmed'
    };

    setBookings((prev) => [newBooking, ...prev]);
    setShowMyLedger(true);
    triggerToast(`Successfully loaded custom AI Guide for ${destination} in your trips!`);
  };

  const handleBookUttarakhandTour = (provider: string, details: string, price: string) => {
    const uniqueReceiptId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newBooking: Booking = {
      id: `bk-ut-${Date.now()}`,
      type: 'flights',
      provider: provider,
      routeDetails: details,
      date: departureDate,
      price: price,
      code: `UT-${uniqueReceiptId}`,
      status: 'Confirmed'
    };

    setBookings((prev) => [newBooking, ...prev]);
    setShowMyLedger(true);
    triggerToast(`Spirit of Uttarakhand confirmed! Saved sequence: UT-${uniqueReceiptId}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((bk) => bk.id !== bookingId));
    triggerToast(`Reservation ${bookingId.substring(0,8)} successfully refunded and cancelled.`);
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
            <span className="text-xl md:text-2xl font-black tracking-tight select-none">
              make<span className="text-sky-400">my</span>trip
            </span>
            <span className="text-[9px] bg-sky-500/10 border border-sky-400/20 text-sky-400 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
              Workspace
            </span>
          </a>

          {/* Prompt status context or ledger access */}
          <div className="flex items-center gap-4 text-sm font-semibold">
            {appliedPromo && (
              <span className="text-xs bg-emerald-500/15 border border-emerald-400/20 text-emerald-400 font-bold px-3 py-1.5 rounded-xl hidden md:inline-flex items-center gap-1">
                Coupon: {appliedPromo}
              </span>
            )}

            <button
              id="view-trips-ledger-header"
              onClick={() => setShowMyLedger(true)}
              className="flex items-center gap-2 hover:bg-white/5 active:scale-95 px-4 py-2 rounded-full transition-all cursor-pointer relative"
            >
              <Briefcase className="w-4.5 h-4.5 text-sky-400" />
              <span className="hidden sm:inline">My Trips</span>
              {bookings.length > 0 && (
                <span className="w-5 h-5 bg-sky-500 text-slate-950 text-[11px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {bookings.length}
                </span>
              )}
            </button>
            
            <button className="bg-gradient-to-r from-sky-450 to-sky-650 hover:bg-sky-550 border border-sky-400/20 px-5 py-2.5 rounded-full font-bold shadow-lg shadow-sky-500/10 active:scale-95 transition-all text-xs md:text-sm cursor-pointer hidden xs:block">
              Member Club
            </button>
          </div>
        </div>
      </header>

      {/* Hero & bookings engine core */}
      <main className="flex-1 pb-16">
        {/* Interactive Uttarakhand Theme Background Container */}
        <div className={`relative pt-12 pb-36 px-4 text-center border-b border-slate-800 transition-all duration-1000 ease-in-out ${
          uttarakhandTheme === 'dawn'
            ? 'bg-gradient-to-b from-slate-950 via-[#311105] to-[#5c2407]'
            : uttarakhandTheme === 'blue'
            ? 'bg-gradient-to-b from-slate-950 via-[#075985] to-[#0c4a6e]'
            : 'bg-gradient-to-b from-slate-950 via-[#1e1b4b] to-[#2e1065]'
        }`}>
          {/* BACKGROUND LAYERS */}
          {/* Layer 0: Sun, Moon & Sunrise Star Atmosphere Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {/* Sun or Moon depending on active selected ambiance */}
            <AnimatePresence mode="wait">
              {uttarakhandTheme === 'dawn' && (
                <motion.div
                  key="dawn-sun"
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 0.25, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 30 }}
                  transition={{ duration: 1 }}
                  className="absolute left-1/2 -translate-x-1/2 top-4 w-96 h-96 rounded-full bg-gradient-to-t from-orange-400 to-amber-300 blur-3xl animate-sunrise-glow"
                />
              )}
              {uttarakhandTheme === 'blue' && (
                <motion.div
                  key="blue-sun"
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 0.15, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 30 }}
                  transition={{ duration: 1 }}
                  className="absolute left-1/2 -translate-x-1/2 top-2 w-96 h-96 rounded-full bg-gradient-to-t from-cyan-300 to-sky-100 blur-3xl animate-sunrise-glow"
                />
              )}
              {uttarakhandTheme === 'dusk' && (
                <motion.div
                  key="dusk-moon"
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 0.3, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 30 }}
                  transition={{ duration: 1 }}
                  className="absolute left-[65%] top-6 w-32 h-32 rounded-full bg-indigo-250 blur-xl opacity-45 flex items-center justify-center animate-sunrise-glow"
                >
                  <div className="w-24 h-24 rounded-full bg-slate-950/70 translate-x-4 -translate-y-2" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing sunray flares / twinkling stars */}
            <div className="absolute inset-0 bg-radial-at-t from-transparent via-transparent to-black/25" />
            
            {/* Constellation dust for dusk mode */}
            {uttarakhandTheme === 'dusk' && (
              <div className="absolute inset-x-0 top-0 h-48 opacity-75">
                <div className="absolute top-10 left-[15%] w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '3s' }} />
                <div className="absolute top-24 left-[28%] w-1 h-1 rounded-full bg-amber-250 animate-pulse" style={{ animationDelay: '1.2s', animationDuration: '2.5s' }} />
                <div className="absolute top-8 left-[45%] w-2 h-2 rounded-full bg-indigo-200 animate-pulse" style={{ animationDelay: '0.7s', animationDuration: '4s' }} />
                <div className="absolute top-20 left-[75%] w-1 h-1 rounded-full bg-white animate-pulse" style={{ animationDelay: '2.1s', animationDuration: '2s' }} />
                <div className="absolute top-12 left-[85%] w-1.5 h-1.5 rounded-full bg-yellow-100 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
              </div>
            )}

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
            <svg className="absolute bottom-0 left-0 w-full h-44 opacity-25" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                fill={uttarakhandTheme === 'dawn' ? '#7c2d12' : uttarakhandTheme === 'blue' ? '#0369a1' : '#1e1b4b'}
                d="M0,160 L120,240 L240,110 L360,280 L480,180 L600,260 L720,130 L840,290 L960,190 L1080,250 L1200,120 L1320,270 L1440,170 L1440,320 L0,320 Z"
              />
            </svg>

            {/* LAYER 2: Middle snow-crusted mountain summits */}
            <svg className="absolute bottom-0 left-0 w-full h-36 opacity-35" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                fill={uttarakhandTheme === 'dawn' ? '#9a3412' : uttarakhandTheme === 'blue' ? '#0284c7' : '#311042'}
                d="M0,220 L160,120 L320,260 L480,150 L640,240 L800,110 L960,250 L1120,140 L1280,230 L1440,130 L1440,320 L0,320 Z"
              />
            </svg>

            {/* LAYER 3: Sacred Himalayan Valleys & Pine Deodar outlines */}
            <svg className="absolute bottom-0 left-0 w-full h-24 opacity-60" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                fill={uttarakhandTheme === 'dawn' ? '#064e3b' : uttarakhandTheme === 'blue' ? '#014737' : '#022c22'}
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
                stroke={uttarakhandTheme === 'dawn' ? '#fdba74' : uttarakhandTheme === 'blue' ? '#38bdf8' : '#e9d5ff'}
                strokeWidth="4" 
                className="animate-river"
                d="M0,50 Q180,95 360,50 T720,50 T1080,50 T1440,50"
              />
              {/* Secondary glowing river trail */}
              <path 
                fill="none" 
                stroke={uttarakhandTheme === 'dawn' ? '#f59e0b' : uttarakhandTheme === 'blue' ? '#0ea5e9' : '#c084fc'}
                strokeWidth="2" 
                className="animate-river"
                style={{ animationDelay: '3s' }}
                d="M0,52 Q180,90 360,52 T720,52 T1080,52 T1440,52"
              />
            </svg>

            {/* Cozy Temple Glowing Lantern Nodes for Starry Dusk mode */}
            {uttarakhandTheme === 'dusk' && (
              <div className="absolute bottom-12 left-0 w-full h-10 pointer-events-none">
                <span className="absolute left-[12%] bottom-1 w-3 h-3 bg-amber-400 rounded-full blur-xs animate-ping" />
                <span className="absolute left-[12%] bottom-1 w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-lg" />
                
                <span className="absolute left-[45%] bottom-4 w-3.5 h-3.5 bg-orange-400 rounded-full blur-xs animate-ping" style={{ animationDuration: '2.5s' }} />
                <span className="absolute left-[45%] bottom-4 w-2.5 h-2.5 bg-amber-300 rounded-full shadow-lg" />

                <span className="absolute right-[22%] bottom-2 w-3 h-3 bg-yellow-400 rounded-full blur-xs animate-ping" style={{ animationDuration: '3s' }} />
                <span className="absolute right-[22%] bottom-2 w-2 h-2 bg-yellow-300 rounded-full shadow-lg" />
              </div>
            )}
          </div>

          {/* FRONTPLATE CONTENT & BUTTONS */}
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Ambient Tag Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sky-200 text-xs font-bold uppercase tracking-widest mb-4">
              <Compass className="w-3.5 h-3.5 text-orange-400" /> Devbhoomi Uttarakhand Edition
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-md font-sans"
            >
              Explore the Majestic Hills of Uttarakhand
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-xs md:text-sm font-semibold tracking-wide drop-shadow max-w-2xl mx-auto"
            >
              Experience holy rivers, mystical peak sunsets, and pristine mountain lodging. Let Gemini AI tailor your spiritual Himalayan retreat instantly.
            </motion.p>

            {/* Uttarakhand Theme Ambiance Controls */}
            <div id="uttarakhand-theme-selector" className="mt-6 flex flex-wrap justify-center gap-2 relative z-20">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider block w-full mb-1">Ambiance Preset</span>
              
              <button
                type="button"
                id="preset-himalayan-dawn"
                onClick={() => {
                  setUttarakhandTheme('dawn');
                  triggerToast("Switched ambiance to Golden Himalayan Dawn 🌅");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold tracking-tight transition-all cursor-pointer backdrop-blur-md border ${
                  uttarakhandTheme === 'dawn'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg'
                    : 'bg-black/20 hover:bg-black/30 border-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                <span>Himalayan Dawn</span>
              </button>

              <button
                type="button"
                id="preset-glacial-valley"
                onClick={() => {
                  setUttarakhandTheme('blue');
                  triggerToast("Switched ambiance to Refreshing Glacial Valley ❄️");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold tracking-tight transition-all cursor-pointer backdrop-blur-md border ${
                  uttarakhandTheme === 'blue'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-lg'
                    : 'bg-black/20 hover:bg-black/30 border-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Waves className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>Glacial Valley</span>
              </button>

              <button
                type="button"
                id="preset-temple-dusk"
                onClick={() => {
                  setUttarakhandTheme('dusk');
                  triggerToast("Switched ambiance to Spiritual Starry Night 🌌");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold tracking-tight transition-all cursor-pointer backdrop-blur-md border ${
                  uttarakhandTheme === 'dusk'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-lg'
                    : 'bg-black/20 hover:bg-black/30 border-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-purple-300" />
                <span>Starry Dusk</span>
              </button>
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

        {/* PROMOTIONS SLAT */}
        <section className="max-w-6xl mx-auto px-4 mt-14">
          <OffersSection onApplyPromo={handleApplyPromo} />
        </section>

        {/* ACTIVE SEARCH RESULTS SCREEN */}
        <AnimatePresence>
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
              />
            </section>
          )}
        </AnimatePresence>

        {/* INTERACTIVE UTTARAKHAND TOUR MAP & TRIPS SPECIFICATION */}
        <section className="max-w-6xl mx-auto px-4 mt-6">
          <UttarakhandTourExplorer 
            onBookTour={handleBookUttarakhandTour} 
            appliedPromoCode={appliedPromo} 
          />
        </section>

        {/* DYNAMIC GEMINI AI CORRIDOR */}
        <section className="max-w-6xl mx-auto px-4 mt-16">
          <AIPlanner onAddAITripToBookings={handleAddAITrip} />
        </section>

        {/* COMPREHENSIVE CONTACT METHODS WITH ANIMATED ICONS */}
        <section className="max-w-6xl mx-auto px-4">
          <ContactMethods />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-500 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold tracking-tight text-white">make<span className="text-sky-400">my</span>trip</span>
            <p className="text-xs text-slate-400 font-medium mt-3 leading-relaxed max-w-sm">
              Sandbox travel replication workspace using custom Vite, full-stack Express layouts, and premium Gemini model integrations.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3">Capabilities</h4>
            <div className="space-y-2 text-xs font-semibold">
              <span className="block text-slate-400">• Day-by-Day AI Planning</span>
              <span className="block text-slate-400">• Multi-Tab Booking State Engine</span>
              <span className="block text-slate-400">• Mock Secure Receipt Signatures</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3">Disclaimer</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
              All bookings made are virtual mocks for UI prototyping. No financial obligations apply, and no external APIs are compromised.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-8 pt-8 text-center text-xs font-medium">
          &copy; 2026 MakeMyTrip Inspired Travel Space. Custom Prototyping Platform.
        </div>
      </footer>

      {/* SEARCH FLIGHT PATH LOADER GIGANTIC MODAL */}
      <AnimatePresence>
        {isSearching && (
          <div id="search-modal-loading-screen" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-md p-8 relative z-10 text-center shadow-2xl overflow-hidden border border-slate-100"
            >
              {/* Flight vector moving path container */}
              <div className="h-16 relative overflow-hidden mb-6 bg-slate-50 rounded-2xl flex items-center border border-slate-100">
                <Plane className="w-10 h-10 text-sky-500 animate-flight absolute" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800">Compiling Travel Rates...</h3>
              <p className="text-sm text-slate-400 mt-2 font-medium">
                Syncing custom fares for travel <span className="font-extrabold text-slate-600">{fromCity.code}</span> to <span className="font-extrabold text-slate-600">{toCity.code}</span>
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
          </div>
        )}
      </AnimatePresence>

      {/* BOOKING DRAWER */}
      <ActiveBookings
        isOpen={showMyLedger}
        onClose={() => setShowMyLedger(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
      />
    </div>
  );
}
