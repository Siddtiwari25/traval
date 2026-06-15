import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { COUPONS } from '../data';

interface OffersSectionProps {
  onApplyPromo: (code: string) => void;
}

export default function OffersSection({ onApplyPromo }: OffersSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onApplyPromo(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div id="offers-section" className="font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-930 tracking-tight flex items-center gap-2">
            <Gift className="w-5 h-5 text-orange-500 shrink-0" />
            Handpicked Offers for You
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Apply these exclusive coupon vouchers in the sandbox booking state.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COUPONS.map((coupon) => (
          <motion.div
            key={coupon.code}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-5 border border-slate-200/40 shadow-sm flex gap-4 hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Visual crop banner */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
              <img referrerPolicy="no-referrer" src={coupon.imageUrl} alt={coupon.title} className="w-full h-full object-cover" />
            </div>

            {/* details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded-md inline-block">
                  {coupon.discount}
                </span>
                <h3 className="font-extrabold text-slate-800 text-sm mt-1.5 leading-tight line-clamp-2">
                  {coupon.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 font-medium line-clamp-2 leading-relaxed">
                  {coupon.desc}
                </p>
              </div>

              {/* Action row with Copy and code trigger */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-slate-400 text-[10px] font-bold">Use Code:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                    {coupon.code}
                  </span>
                  <button
                    id={`apply-promo-${coupon.code}`}
                    onClick={() => handleCopyCode(coupon.code)}
                    className="p-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-650 flex items-center justify-center cursor-pointer transition-colors"
                    title="Click to copy and apply code"
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-sky-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Dotted separator to simulate voucher coupon ticket tear line */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-6 bg-slate-100 rounded-r-full border-r border-slate-200" />
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-6 bg-slate-100 rounded-l-full border-l border-slate-200" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
