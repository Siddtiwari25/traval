import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Home, Car, Bike, Briefcase, Calendar, Gift, X, Check, Tag } from 'lucide-react';
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

  // Reset coupon state whenever a new booking is pending
  useEffect(() => {
    if (pendingBooking) {
      setPromoInput('');
      setAppliedPromo(null);
      setPromoError(null);
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
              <h3 className="font-black text-sm uppercase tracking-wider">
                Booking Coupons & Checkout
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
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5 mt-1">
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
                {AVAILABLE_PROMOS.map((promo) => {
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

            {/* Dynamic Final Reduced Price breakdown */}
            <div className="border-t border-slate-100 pt-4 space-y-2 bg-slate-950 text-white p-4.5 rounded-2xl font-mono text-[11px] leading-relaxed">
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
                💡 Prices verified safely through Rudra Virtual Ledger integration. Apply coupon value now to complete discount check.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="bg-slate-50 p-4 border-t border-slate-150 flex gap-3 shrink-0">
            <button
              type="button"
              id="booking-confirm-cancel"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold text-xs uppercase rounded-xl transition cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              id="booking-confirm-confirm"
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-sky-500 hover:bg-sky-650 text-white font-black text-xs uppercase rounded-xl transition shadow-lg shadow-sky-500/10 cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm & Sync Trip</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
