import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Ticket, Compass, Receipt, AlertCircle, Trash2, ShieldCheck } from 'lucide-react';
import { Booking } from '../types';

interface ActiveBookingsProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
}

export default function ActiveBookings({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
}: ActiveBookingsProps) {
  
  const handleCopyCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    alert(`Ticket Code [ ${code} ] successfully copied to clipboard!`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="active-bookings-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Sliding panel */}
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="pointer-events-auto w-screen max-w-md transform"
            >
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-2xl border-l border-slate-100">
                {/* Header with Dark Sky Gradient */}
                <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 px-6 py-8 text-white relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
                      <h3 className="text-xl font-bold tracking-tight font-sans">My Travel Ledger</h3>
                    </div>
                    <button 
                      id="close-drawer-btn"
                      onClick={onClose} 
                      className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-sky-200 mt-2 font-medium">Manage active reservation details, receipts, and e-tickets.</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-sky-400" />
                </div>

                {/* Ledger Listing */}
                <div className="flex-1 px-6 py-6 space-y-5">
                  {bookings.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Ticket className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-700 font-bold text-sm">No booked trips ledger found</p>
                      <p className="text-slate-400 text-xs px-6 mt-1 text-center font-medium">
                        Search and reserve flight fares, deluxe hotel resorts, premium express trains, or cabs above to display confirmed tickets.
                      </p>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        id={`booking-card-${booking.id}`}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-5 bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow"
                      >
                        {/* Header stats */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Converted
                            </span>
                            <h4 className="font-extrabold text-slate-800 text-base mt-2">{booking.provider}</h4>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">{booking.routeDetails}</p>
                          </div>
                          <span className="font-extrabold text-slate-900 text-base">{booking.price}</span>
                        </div>

                        {/* Middle details */}
                        <div className="border-t border-dashed border-slate-200 my-3 pt-3 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-sky-500" />
                            <span className="font-medium">{booking.date}</span>
                          </div>
                          
                          {booking.code && (
                            <button
                              id={`copy-code-${booking.id}`}
                              onClick={() => handleCopyCode(booking.code)}
                              className="font-mono text-[10px] font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-2 py-1 rounded border border-sky-100 hover:scale-105 transition-transform cursor-pointer"
                              title="Click to Copy Code"
                            >
                              Code: {booking.code}
                            </button>
                          )}
                        </div>

                        {/* Actions row */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-mono font-medium text-slate-400 capitalize">
                            ID: {booking.id.substring(0, 8)} | Class: Standard
                          </span>
                          
                          <button
                            id={`cancel-booking-btn-${booking.id}`}
                            onClick={() => onCancelBooking(booking.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 hover:bg-red-100/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Cancel Ledger
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Footer with receipt and secure banner */}
                <div className="bg-slate-50 p-6 border-t border-slate-100 font-sans">
                  <div className="flex gap-2 p-3 bg-blue-50/70 border border-blue-100/50 rounded-2xl">
                    <Receipt className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Protected Booking Guarantee</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-medium">
                        Your mock itineraries are backed by our interactive Sandbox standard protection. Zero actual fees apply!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
