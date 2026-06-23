import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Home, Car, Bike, Briefcase, Calendar, Gift, X, Check, Tag, Phone, QrCode, Copy, ExternalLink, MessageSquare } from 'lucide-react';
import { TravelTab } from '../types';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingBooking: {
    type: string;
    provider: string;
    routeDetails: string;
    price: string;
    date: string;
    callback: (finalPrice: string, couponApplied?: string) => void;
  } | null;
}

// Handpicked high-value active coupons
const AVAILABLE_PROMOS = [
  { code: 'DEVBHOOMI30', label: '30% Off', desc: 'Special Devbhoomi Himalayan Season Offer', percent: 30 },
  { code: 'RUDRA25', label: '25% Off', desc: 'Exclusively on Rudra Tour and Rider Fleet', percent: 25 },
  { code: 'MMTSUPER', label: '15% Off', desc: 'MMT Co-branded instant reduction on eco rentals', percent: 15 },
  { code: 'MMTINTELECT', label: '20% Off', desc: 'Flat 20% savings on long-duration travel options', percent: 20 },
  { code: 'MMTLUXSTAY', label: '33% Off', desc: 'Equivalent value reduction for premium resort stays', percent: 33 },
];

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  pendingBooking,
}: BookingConfirmationModalProps) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Simple Payment States
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'upi' | 'support' | 'whatsapp'>('qr');
  const [isCopied, setIsCopied] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // Reset coupon and payment states whenever a new booking is pending
  useEffect(() => {
    if (pendingBooking) {
      setPromoInput('');
      setAppliedPromo(null);
      setPromoError(null);
      setPaymentMethod('qr');
      setPaymentError(null);
      setIsPaying(false);
      setIsCopied(false);
    }
  }, [pendingBooking]);

  if (!isOpen || !pendingBooking) return null;

  // Function to extract numerical base price from price string (e.g., "₹450/Day" -> 450, "₹4,500 / Night" -> 4500)
  const getNumericPrice = (priceStr: string) => {
    const numbersOnly = priceStr.replace(/[^0-9]/g, '');
    return parseInt(numbersOnly, 10) || 0;
  };

  const getUnitSuffix = (priceStr: string) => {
    if (priceStr.includes('/Day')) return '/Day';
    if (priceStr.includes('/ Night') || priceStr.includes('/Night')) return ' / Night';
    if (priceStr.includes('Night')) return ' / Night';
    return '';
  };

  const originalNum = getNumericPrice(pendingBooking.price);
  const suffix = getUnitSuffix(pendingBooking.price);

  // Compute values based on applied promo
  const currentDiscountPercent = appliedPromo ? appliedPromo.percent : 0;
  const discountAmount = Math.round((originalNum * currentDiscountPercent) / 100);
  const finalPayableNum = originalNum - discountAmount;
  const finalPayableStr = `₹${finalPayableNum.toLocaleString('en-IN')}${suffix}`;

  const handleApplyCode = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    const found = AVAILABLE_PROMOS.find((p) => p.code === cleanCode);
    if (found) {
      setAppliedPromo({ code: found.code, percent: found.percent });
      setPromoError(null);
      setPromoInput(found.code);
    } else {
      // Allow fallback default 10% discount for any unrecognized custom promo
      if (cleanCode.length >= 4) {
        setAppliedPromo({ code: cleanCode, percent: 10 });
        setPromoError(null);
      } else {
        setPromoError('Invalid coupon code. Enter at least 4 letters/numbers.');
      }
    }
  };

  const handleConfirm = () => {
    if (pendingBooking) {
      pendingBooking.callback(finalPayableStr, appliedPromo?.code);
      onClose();
    }
  };

  const handlePaymentAndConfirm = () => {
    setPaymentError(null);
    setIsPaying(true);
    
    if (pendingBooking) {
      pendingBooking.callback(finalPayableStr, appliedPromo?.code);
    }

    // Direct WhatsApp redirect with detailed package invoice details
    const waNumber = "918859490284";
    const message = `Hello Rudra Devbhoomi, I am booking the following package:\n\n*Service/Package:* ${pendingBooking?.provider}\n*Itinerary Details:* ${pendingBooking?.routeDetails}\n*Price:* ${finalPayableStr}\n*Date:* ${pendingBooking?.date}\n\nI have initiated the payment. Here is the screenshot!`;
    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

    try {
      const win = window.open(waUrl, '_blank');
      if (!win) {
        window.location.href = waUrl;
      }
    } catch (e) {
      window.location.href = waUrl;
    }

    setTimeout(() => {
      setIsPaying(false);
      onClose();
    }, 1000);
  };

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'flights':
        return <Bike className="w-5 h-5 text-sky-500" />;
      case 'hotels':
        return <Home className="w-5 h-5 text-indigo-500" />;
      case 'cabs':
        return <Car className="w-5 h-5 text-emerald-500" />;
      default:
        return <Briefcase className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <AnimatePresence>
      <div id="booking-confirm-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Modal Sheet panel */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-white/5 select-none shrink-0">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-orange-500 animate-bounce" />
              <h3 className="font-black text-sm uppercase tracking-wider animate-pulse">
                Secure Booking & Pay
              </h3>
            </div>
            <button
              type="button"
              id="close-booking-confirm"
              onClick={onClose}
              className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
            {/* Selected Service Card Summary */}
            <div className="bg-slate-50 p-4 border border-slate-200/50 rounded-2xl space-y-3">
              <span className="text-[8.5px] font-black uppercase text-slate-450 tracking-wider flex items-center gap-1">
                📌 Chosen Travel Reservation Details
              </span>
              <div className="flex gap-3 items-start">
                <div className="p-3 bg-white border border-slate-200 rounded-xl shrink-0 shadow-xs">
                  {getTabIcon(pendingBooking.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-800 tracking-tight leading-tight">
                    {pendingBooking.provider}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    {pendingBooking.routeDetails}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 bg-slate-200/50 w-max px-2.5 py-0.5 rounded-md">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                      Ride/Stay Date: {pendingBooking.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Coupons Selection Option */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider">
                  🎟️ Click to Instantly Apply Coupon
                </span>
                {appliedPromo && (
                  <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-md uppercase">
                    Code Applied: {appliedPromo.code} ({appliedPromo.percent}% Off)
                  </span>
                )}
              </div>

              {/* Grid of active pre-defined vouchers */}
              <div id="booking-promo-choices" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_PROMOS.slice(0, 4).map((promo) => {
                  const isActive = appliedPromo?.code === promo.code;
                  return (
                    <button
                      key={promo.code}
                      type="button"
                      id={`booking-apply-promo-${promo.code}`}
                      onClick={() => handleApplyCode(promo.code)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2 relative ${
                        isActive
                          ? 'bg-orange-50/70 border-orange-300 ring-2 ring-orange-500/10'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Tag className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[10.5px] font-black text-slate-800">{promo.code}</span>
                          <span className="font-sans text-[8.5px] font-black uppercase text-orange-600 bg-orange-50 px-1 py-0.2 rounded">
                            {promo.label}
                          </span>
                        </div>
                        <p className="text-[9px] font-medium text-slate-400 leading-tight mt-0.5 line-clamp-2">
                          {promo.desc}
                        </p>
                      </div>
                      {isActive && (
                        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Promo Code manual input option */}
            <div className="space-y-1.5 pt-1">
              <label htmlFor="booking-promo-custom" className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider">
                Or Enter Custom Promo Coupon
              </label>
              <div className="flex gap-2">
                <input
                  id="booking-promo-custom"
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 w-full focus:outline-none focus:border-slate-400 focus:bg-white transition-all uppercase placeholder:normal-case font-mono"
                  placeholder="e.g. DEVBHOOMI30"
                />
                <button
                  type="button"
                  id="booking-promo-apply-submit"
                  onClick={() => handleApplyCode(promoInput)}
                  className="bg-slate-800 hover:bg-slate-950 text-white font-extrabold text-[10.5px] px-4.5 py-2.5 rounded-xl transition cursor-pointer uppercase shrink-0"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <span className="block text-[10px] text-red-500 font-bold">{promoError}</span>
              )}
            </div>

            {/* SECURE DIRECT PAYMENT OPTIONS SPLIT */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4.5 space-y-3">
              <span className="block text-[9.5px] font-black uppercase text-slate-500 tracking-wider">
                💳 Secure Quick Booking Payment Options
              </span>

              {/* Quick Note: Pay and send screenshot on WhatsApp */}
              <div className="bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-xl p-3 text-[11px] font-extrabold flex items-start gap-2.5 shadow-xs select-none">
                <span className="text-sm mt-0.5 animate-bounce">📱</span>
                <div>
                  <span className="block text-[11px] font-black text-emerald-900 uppercase tracking-tight">Important Step</span>
                  <p className="font-semibold text-[10px] text-emerald-800 leading-normal mt-0.5">
                    Pay after send the screenshot on WhatsApp <span className="font-black underline text-emerald-950">+91 8859490284</span> to get immediate active receipt confirmation and boarding token!
                  </p>
                </div>
              </div>
              
              {/* Payment Tabs Selection */}
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('qr');
                    setPaymentError(null);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-[9.5px] font-black transition-all cursor-pointer ${
                    paymentMethod === 'qr'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-black shadow-xs'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <QrCode className="w-4 h-4 mb-1 text-emerald-600" />
                  <span>Scan QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('upi');
                    setPaymentError(null);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-[9.5px] font-black transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-black shadow-xs'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-base mb-0.5">📱</span>
                  <span>UPI ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('support');
                    setPaymentError(null);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-[9.5px] font-black transition-all cursor-pointer ${
                    paymentMethod === 'support'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-black shadow-xs'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <Phone className="w-4 h-4 mb-1 text-sky-600" />
                  <span>Call Us</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('whatsapp');
                    setPaymentError(null);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-[9.5px] font-black transition-all cursor-pointer ${
                    paymentMethod === 'whatsapp'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-black shadow-xs'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mb-1 text-teal-600" />
                  <span>whatsapp</span>
                </button>
              </div>

              {/* TAB 1: QR CODE */}
              {paymentMethod === 'qr' && (
                <div className="space-y-2.5 pt-2 text-center flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative">
                    <svg width="115" height="115" viewBox="0 0 100 100" className="text-slate-900 mx-auto" fill="currentColor">
                      <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                      <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                      <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                      <path d="M40,5 h5 v5 h-5 z M50,0 h5 v10 h-5 z M60,10 h5 v5 h-5 z M45,20 h10 v5 h-10 z M60,25 h5 v5 h-5 z" />
                      <path d="M35,35 h5 v5 h-5 z M45,40 h15 v5 h-15 z M30,50 h10 v5 h-10 z M55,50 h5 v10 h-5 z M40,60 h5 v5 h-5 z M50,65 h10 v5 h-10 z" />
                      <path d="M35,75 h5 v5 h-5 z M45,80 h5 v15 h-5 z M55,75 h10 v5 h-10 z M60,85 h15 v5 h-15 z M80,40 h10 v5 h-10 z M75,50 h15 v5 h-15 z M90,60 h10 v5 h-10 z M85,75 h10 v10 h-10 z" />
                      <rect x="42" y="42" width="16" height="16" rx="3" fill="#ffffff" />
                      <path d="M46,51 L50,43 L54,51 Z" fill="#059669" />
                    </svg>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-[8.5px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider select-none">
                      UPI SCANNER
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold max-w-xs leading-normal">
                    Scan QR with Google Pay, PhonePe, Paytm or Bhim UPI to send transfer.
                  </p>
                  
                  <a 
                    href={`upi://pay?pa=8859490284@ybl&pn=Rudra%20Devbhoomi%2520Tours&am=${finalPayableNum}&cu=INR`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[9.5px] font-black uppercase transition-all"
                  >
                    <span>Instant UPI App Pay</span>
                    <ExternalLink className="w-3 h-3 text-emerald-450" />
                  </a>
                </div>
              )}

              {/* TAB 2: UPI PAY / ADDRESS & PHONE TRANSFERS */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-500 uppercase">
                      UPI Virtual Payment Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value="8859490284@ybl"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("8859490284@ybl");
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className="bg-slate-800 hover:bg-slate-950 text-white p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                        title="Copy UPI address"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-450" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {isCopied && (
                      <span className="block text-[8px] text-emerald-600 font-extrabold uppercase">
                        ✓ UPI Address Copied successfully!
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200/50">
                    <span className="block text-[8px] font-black text-slate-500 uppercase mb-0.5">UPI / Transfer Phone Number</span>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>GPAY / PHONEPE:</span>
                      <span className="font-mono text-slate-950 underline">+91 8859490284</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DIRECT CALL */}
              {paymentMethod === 'support' && (
                <div className="space-y-3 pt-2 text-center py-2">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-1">
                    <Phone className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black text-slate-800 tracking-tight leading-tight">
                      Direct Helpdesk support
                    </span>
                    <span className="block text-[9px] text-slate-500 font-semibold leading-relaxed mt-1 max-w-xs mx-auto">
                      Need custom transport, ride changes or instant verification? Tap to Call or WhatsApp below.
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 max-w-xs mx-auto pt-1">
                    <a 
                      href="tel:+918859490284"
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-sky-750 hover:from-sky-550 hover:to-sky-650 text-white font-black text-[10px] uppercase py-2.5 rounded-xl transition shadow-md shadow-sky-500/10"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Vikram (+91 8859490284)</span>
                    </a>
                    <a 
                      href="tel:+919627349173"
                      className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-[10px] uppercase py-2 rounded-xl transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Fleet Booking Office (+91 9627349173)</span>
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 4: WHATSAPP SCREENSHOT & MESSAGE OPTION */}
              {paymentMethod === 'whatsapp' && (
                <div className="space-y-3 pt-2 text-center py-2">
                  <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-black text-slate-800 tracking-tight leading-tight">
                      Confirm on WhatsApp Chat
                    </span>
                    <span className="block text-[9px] text-slate-500 font-semibold leading-relaxed mt-1 max-w-xs mx-auto">
                      Send your reservation details directly to get active confirmation and receipt verification.
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 max-w-xs mx-auto pt-1">
                    <a 
                      href={`https://wa.me/918859490284?text=Hello%20Rudra%20Devbhoomi,%20I%20am%20interested%20in%20booking%20the%20following%20package:%250A%250A*Package:*%20${encodeURIComponent(pendingBooking.provider)}%250A*Details:*%20${encodeURIComponent(pendingBooking.routeDetails)}%250A*Date:*%20${encodeURIComponent(pendingBooking.date)}%250A*Final%20Price:*%20${encodeURIComponent(finalPayableStr)}%250A%250APlease%20confirm%20my%20reservation.%20Thank%20you!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10.5px] uppercase py-2.5 rounded-xl transition shadow-md cursor-pointer"
                    >
                      <span>WhatsApp Vikram (+91 8859490284)</span>
                    </a>
                    <a 
                      href={`https://wa.me/919627349173?text=Hello%20Fleet%20Desk,%20I%20would%20like%20to%20reserve%20a%20package%20transfer:%250A%250A*Package:*%20${encodeURIComponent(pendingBooking.provider)}%250A*Price:*%20${encodeURIComponent(finalPayableStr)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-[10px] uppercase py-2.5 rounded-xl transition scroll-smooth"
                    >
                      <span>WhatsApp Fleet Support Desk</span>
                    </a>
                  </div>
                </div>
              )}

              {paymentError && (
                <span className="block text-[10px] text-rose-600 font-black pt-1">
                  ⚠️ {paymentError}
                </span>
              )}
            </div>

            {/* Dynamic Final Reduced Price breakdown */}
            <div className="border-t border-slate-100 pt-4 space-y-2 bg-slate-950 text-white p-4.5 rounded-2xl font-mono text-[11px] leading-relaxed relative overflow-hidden">
              {isPaying && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 z-30">
                  <span className="text-xs font-black uppercase text-amber-400 tracking-widest animate-pulse">
                    ⚡ Securing Virtual Escrow...
                  </span>
                  <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-amber-400 h-full rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.6 }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Original Price Charge:</span>
                <span>₹{originalNum.toLocaleString('en-IN')}{suffix}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-450 font-bold">
                  <span>Coupon Deduction ({appliedPromo.code} - {appliedPromo.percent}%):</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}{suffix}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-dashed border-slate-800 pt-2 font-black text-xs text-amber-400">
                <span>Final Booking Price:</span>
                <span className="underline decoration-double">
                  {finalPayableStr}
                </span>
              </div>
              <p className="text-[8px] text-slate-500 text-center leading-normal pt-1.5 select-none font-sans font-medium">
                💡 Prices verified safely through Rudra Virtual Verification integration. Apply coupon value now to complete discount check.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="bg-slate-50 p-4 border-t border-slate-150 flex gap-3 shrink-0">
            <button
              type="button"
              id="booking-confirm-cancel"
              onClick={onClose}
              disabled={isPaying}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold text-xs uppercase rounded-xl transition cursor-pointer text-center disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              id="booking-confirm-confirm"
              onClick={handlePaymentAndConfirm}
              disabled={isPaying}
              className="flex-1 px-4 py-2.5 bg-sky-500 hover:bg-sky-650 text-white font-black text-xs uppercase rounded-xl transition shadow-lg shadow-sky-500/10 cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5 animate-bounce" />
              <span>{isPaying ? 'Processing...' : 'Pay & Confirm'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
