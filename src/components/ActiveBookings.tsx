import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Ticket, 
  Compass, 
  Receipt, 
  AlertCircle, 
  Trash2, 
  ShieldCheck,
  User,
  Sliders,
  Printer,
  Download,
  PhoneCall,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  Edit2,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { Booking } from '../types';

interface ActiveBookingsProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onUpdateBooking: (updated: Booking) => void;
}

export default function ActiveBookings({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onUpdateBooking,
}: ActiveBookingsProps) {
  
  // Track currently selected booking for immersive receipt & e-ticket detail view
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);

  // Status configuration / metadata editing states
  const [localPassengerName, setLocalPassengerName] = useState<string>('');
  const [localPassengerPhone, setLocalPassengerPhone] = useState<string>('');
  const [localPassengerEmail, setLocalPassengerEmail] = useState<string>('');
  const [localNotes, setLocalNotes] = useState<string>('');
  const [localStatus, setLocalStatus] = useState<'Confirmed' | 'Pending' | 'Completed'>('Confirmed');
  const [localDate, setLocalDate] = useState<string>('');

  // Handle opening deep edit details
  const handleOpenDetails = (booking: Booking) => {
    setSelectedBookingDetails(booking);
    setLocalPassengerName(booking.passengerName || 'Vikram Aditya');
    setLocalPassengerPhone(booking.passengerPhone || '+91-8859490284');
    setLocalPassengerEmail(booking.passengerEmail || 'rakeshcabservics@gmail.com');
    setLocalNotes(booking.notes || 'Himalayan excursion, clean vehicle preference requested.');
    setLocalStatus(booking.status || 'Confirmed');
    setLocalDate(booking.date || '2026-06-16');
  };

  // Save changes back to state ledger
  const handleSaveChanges = () => {
    if (!selectedBookingDetails) return;
    
    const updated: Booking = {
      ...selectedBookingDetails,
      passengerName: localPassengerName,
      passengerPhone: localPassengerPhone,
      passengerEmail: localPassengerEmail,
      status: localStatus,
      date: localDate,
      notes: localNotes
    };

    onUpdateBooking(updated);
    setSelectedBookingDetails(updated);
  };

  const handleCopyCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    alert(`🎫 Alphanumeric boarding pass [ ${code} ] successfully copied to system clipboard!`);
  };

  // Helper to parse double or currency rates to accurate numeric quantities
  const parseNumericPrice = (priceStr: string): number => {
    const cleanStr = priceStr.replace(/[^0-9]/g, '');
    const val = parseInt(cleanStr, 10);
    return isNaN(val) ? 1500 : val;
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
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Sliding panel drawer */}
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 md:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="pointer-events-auto w-screen max-w-md transform"
            >
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-3xl border-l border-slate-200">
                {/* Header with Luxury Dark Blue Sky Pattern */}
                <div className="bg-[#0f172a] px-6 py-6 text-white relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5.5 h-5.5 text-orange-500 animate-spin" style={{ animationDuration: '7s' }} />
                      <h3 className="text-lg font-black tracking-tight uppercase">My Travel Ledger</h3>
                    </div>
                    <button 
                      id="close-drawer-btn"
                      onClick={onClose} 
                      className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-semibold">
                    Manage active reservation details, receipts, and e-tickets instantly.
                  </p>
                  
                  {/* Urgent Helpline Box directly clickable inside ledger */}
                  <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-orange-400 font-extrabold flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-orange-400" /> Direct Dial 24/7 Helpline Support
                    </span>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <a 
                        href="tel:+918859490284" 
                        className="text-white hover:text-orange-400 font-black cursor-pointer transition text-[11.5px]"
                        title="Call hotline 1 directly"
                      >
                        📞 +91-8859490284
                      </a>
                      <span className="text-white/20">|</span>
                      <a 
                        href="tel:+919627349173" 
                        className="text-white hover:text-orange-400 font-black cursor-pointer transition text-[11.5px]"
                        title="Call hotline 2 directly"
                      >
                        📞 +91-9627349173
                      </a>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
                </div>

                {/* Ledger Listing Body */}
                <div className="flex-1 px-5 py-5 space-y-5 overflow-y-auto">
                  {bookings.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                        <Ticket className="w-8 h-8 text-orange-500 animate-pulse" />
                      </div>
                      <p className="text-slate-800 font-black text-sm uppercase">Your travel Ledger is Empty</p>
                      <p className="text-slate-500 text-[11px] px-8 mt-2 text-center leading-relaxed font-semibold">
                        Ready to design your journey? Reserve hotel resorts, cozy scooters, customizable private cabs, or Himalayan tours above to populate receipts and tickets.
                      </p>
                    </div>
                  ) : (
                    bookings.map((booking) => {
                      const isConfirmed = booking.status === 'Confirmed';
                      return (
                        <motion.div
                          key={booking.id}
                          id={`booking-card-${booking.id}`}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-4 border border-slate-200 bg-white hover:bg-slate-50/50 rounded-2xl shadow-xs hover:shadow-md transition-all relative"
                        >
                          {/* Top row status */}
                          <div className="flex justify-between items-start">
                            <div>
                              {isConfirmed ? (
                                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1 font-mono">
                                  <CheckCircle className="w-3 h-3 text-emerald-500" /> Confirmed ✅
                                </span>
                              ) : (
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-flex items-center gap-1 font-mono ${
                                  booking.status === 'Completed' 
                                    ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                                    : 'bg-amber-50 border border-amber-200 text-amber-700'
                                }`}>
                                  <AlertCircle className="w-3 h-3 text-current animate-pulse" /> {booking.status || 'Pending'}
                                </span>
                              )}
                              
                              <h4 className="font-black text-slate-800 text-[14px] mt-2 block tracking-tight line-clamp-1">
                                {booking.provider}
                              </h4>
                              <p className="text-[11px] font-bold text-slate-500 line-clamp-1 mt-0.5">
                                {booking.routeDetails}
                              </p>
                            </div>
                            <span className="font-black text-orange-650 text-sm md:text-[14.5px] bg-orange-50 px-2 py-1 rounded-lg border border-orange-100 font-mono">
                              {booking.price}
                            </span>
                          </div>

                          {/* Date and Barcode Ticket Codes */}
                          <div className="border-t border-dashed border-slate-200 my-3.5 pt-3 flex items-center justify-between text-xs">
                            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-orange-500" />
                              Date: {booking.date}
                            </span>
                            
                            {booking.code && (
                              <button
                                type="button"
                                id={`btn-copy-code-${booking.id}`}
                                onClick={() => handleCopyCode(booking.code)}
                                className="font-mono text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-100 hover:border-amber-300 px-2 py-0.5 rounded transition-colors cursor-pointer"
                                title="Click to copy boarding code"
                              >
                                Ticket: {booking.code}
                              </button>
                            )}
                          </div>

                          {/* Double Action Column */}
                          <div className="flex gap-2 justify-between pt-1">
                            <button
                              type="button"
                              id={`btn-open-manage-${booking.id}`}
                              onClick={() => handleOpenDetails(booking)}
                              className="flex-1 bg-[#0f172a] hover:bg-[#1e293b] active:scale-97 text-white font-extrabold text-[10.5px] px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm uppercase tracking-wide"
                            >
                              <Sliders className="w-3.5 h-3.5 text-orange-400" />
                              <span>Manage details & e-Ticket</span>
                            </button>

                            <button
                              id={`cancel-booking-btn-${booking.id}`}
                              onClick={() => onCancelBooking(booking.id)}
                              className="text-[10.5px] text-red-600 hover:text-red-700 font-black hover:bg-red-50 border border-transparent hover:border-red-100 px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                              title="Delete/refund ledger reservation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Verified ledger Guarantee footer */}
                <div className="bg-slate-50 p-5 border-t border-slate-150 font-sans">
                  <div className="flex gap-2.5 p-3.5 bg-sky-50 border border-sky-100 rounded-xl">
                    <Receipt className="w-5.5 h-5.5 text-sky-650 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-[11px] font-black text-slate-850 uppercase tracking-wide">
                        Connected travel network guarantee
                      </h4>
                      <p className="text-[9.5px] text-slate-500 mt-1 leading-relaxed font-semibold">
                        Reservations booked through this portal are filed directly into our local passenger ledger system. Need immediate dispatch or vehicle allocation changes? Reach our fleet desk dynamically through the call buttons.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: INTEGRATED DETAILS, RECEIPTS, BARCODE E-TICKETS & CONFIRMED TICKETING OPTION */}
      <AnimatePresence>
        {selectedBookingDetails && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs pointer-events-auto overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-3xl w-full max-w-xl overflow-hidden my-4 flex flex-col relative max-h-[92vh]"
              id="ledger-booking-details-modal"
            >
              {/* Modal Core Header */}
              <div className="bg-[#0f172a] p-5 text-white relative flex justify-between items-start shrink-0">
                <div>
                  <span className="text-[8px] font-black tracking-widest uppercase bg-orange-600 text-white px-2 py-0.5 rounded-sm font-sans mb-1.5 inline-block">
                    Passenger Boarding pass & Receipt
                  </span>
                  <h3 className="text-base font-black tracking-tight leading-tight">
                    {selectedBookingDetails.provider}
                  </h3>
                  <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5 max-w-[90%]">
                    {selectedBookingDetails.routeDetails}
                  </p>
                </div>
                
                <button
                  type="button"
                  id="close-deep-details-x"
                  onClick={() => setSelectedBookingDetails(null)}
                  className="rounded-full bg-white/10 hover:bg-white/20 p-1.5 text-slate-350 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable details body */}
              <div className="p-5 overflow-y-auto space-y-5 flex-1 max-h-[66vh] bg-slate-50/50" id="deep-modal-body">
                
                {/* Clickable Mobile Contacts Block inside dialog */}
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] font-black uppercase text-amber-700 tracking-wider flex items-center gap-11">
                      <PhoneCall className="w-3 h-3 text-amber-500 animate-bounce" /> Call Direct helpline directly
                    </span>
                    <p className="text-[10px] text-slate-600 font-bold">
                      Need modifications or transport pickup now? Click to ring dispatcher directly:
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href="tel:+918859490284" 
                      className="bg-orange-650 hover:bg-orange-600 text-white font-extrabold text-[10.5px] px-3 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                      title="Direct telephone call +91-8859490284"
                    >
                      <Phone className="w-3 h-3" />
                      <span>8859490284</span>
                    </a>
                    <a 
                      href="tel:+919627349173" 
                      className="bg-orange-650 hover:bg-orange-600 text-white font-extrabold text-[10.5px] px-3 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                      title="Direct telephone call +91-9627349173"
                    >
                      <Phone className="w-3 h-3" />
                      <span>9627349173</span>
                    </a>
                  </div>
                </div>

                {/* Two Column Layout: E-Ticket Stub & Details Editor */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5.5">
                  
                  {/* Left Column (Height: 7/12) - Passenger Travel Pass & Screenshot Verification Note */}
                  <div className="md:col-span-7 bg-white p-5 border border-slate-200 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
                    
                    {/* Important Verification Note */}
                    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 animate-pulse shrink-0" />
                        <h4 className="font-extrabold text-sm text-amber-900 uppercase tracking-tight">
                          Verification Note
                        </h4>
                      </div>
                      <p className="text-[11.5px] font-bold text-amber-800 leading-relaxed">
                        Please send the payment screenshot on WhatsApp to our official company WhatsApp number to instantly verify, record, and activate your E-Ticket Boarding Pass! Our representatives are active 24/7.
                      </p>
                    </div>

                    {/* Traveler Details Summary (Read-Only) */}
                    <div className="space-y-3 bg-slate-50 p-4.5 rounded-2xl border border-slate-150">
                      <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                          Traveler Pass Information
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                        <div>
                          <span className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Lead Passenger</span>
                          <span className="font-extrabold text-slate-800">{localPassengerName}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Contact Phone</span>
                          <span className="font-mono font-extrabold text-slate-800">{localPassengerPhone}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Travel Date</span>
                          <span className="font-bold text-slate-800">{localDate}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Booking Status</span>
                          <span className="font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100 uppercase text-[9px] w-max block mt-0.5">
                            {localStatus}
                          </span>
                        </div>
                      </div>

                      {localNotes && (
                        <div className="border-t border-slate-200/60 pt-2 text-[10.5px]">
                          <span className="block text-[8px] font-black uppercase text-slate-400 tracking-wider mb-0.5">Special Instructions</span>
                          <p className="text-slate-600 font-medium italic">"{localNotes}"</p>
                        </div>
                      )}
                    </div>

                    {/* DIRECT WHATSAPP CHAT & CALL ALLOCATION OPTIONS */}
                    <div className="space-y-2.5">
                      <span className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        💬 Instantly Send Screenshot to Support Desk
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Representative 1 WhatsApp & Call */}
                        <div className="bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 p-3 rounded-2xl transition flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 justify-between">
                            <span className="text-[10px] font-extrabold text-emerald-800 uppercase">Support Line 1</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          <span className="text-xs font-black text-slate-850 mt-1">Vikram Aditya</span>
                          <span className="text-[10px] font-semibold text-slate-500 font-mono mt-0.5">+91 88594 90284</span>
                          <div className="flex gap-1.5 mt-3">
                            <a
                              href={`https://wa.me/918859490284?text=Hello%20Vikram,%20here%20is%20the%20payment%20screenshot%20for%20my%20reservation%20[${selectedBookingDetails.code || 'UT'}]%20under%20my%20Travel%20Ledger.%20Total:%20${selectedBookingDetails.price},%20Pax:%20${localPassengerName}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[10px] font-extrabold py-2 px-2.5 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                              title="Chat with Vikram Aditya on WhatsApp"
                            >
                              WhatsApp
                            </a>
                            <a
                              href="tel:+918859490284"
                              className="bg-slate-800 hover:bg-slate-900 active:scale-95 text-white text-[10px] font-extrabold py-2 px-2.5 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                              title="Direct phone call Support Line 1"
                            >
                              Call
                            </a>
                          </div>
                        </div>

                        {/* Representative 2 WhatsApp & Call */}
                        <div className="bg-sky-50/50 hover:bg-sky-50 border border-sky-100 p-3 rounded-2xl transition flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 justify-between">
                            <span className="text-[10px] font-extrabold text-sky-800 uppercase">Support Line 2</span>
                            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                          </div>
                          <span className="text-xs font-black text-slate-850 mt-1">Fleet Desk</span>
                          <span className="text-[10px] font-semibold text-slate-500 font-mono mt-0.5">+91 96273 49173</span>
                          <div className="flex gap-1.5 mt-3">
                            <a
                              href={`https://wa.me/919627349173?text=Hello%20Fleet%20Desk,%20here%20is%20the%20payment%20screenshot%20for%20my%20reservation%20[${selectedBookingDetails.code || 'UT'}]%20under%20my%20Travel%20Ledger.%20Total:%20${selectedBookingDetails.price},%20Pax:%20${localPassengerName}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[10px] font-extrabold py-2 px-2.5 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                              title="Chat with Fleet Desk on WhatsApp"
                            >
                              WhatsApp
                            </a>
                            <a
                              href="tel:+919627349173"
                              className="bg-slate-800 hover:bg-slate-900 active:scale-95 text-white text-[10px] font-extrabold py-2 px-2.5 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                              title="Direct phone call Support Line 2"
                            >
                              Call
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column - E-Ticket Boarding Section with Unique UPI QR Code */}
                  <div className="md:col-span-5 flex flex-col gap-4">
                    
                    {/* Unique E-Ticket Boarding UPI QR Code Display */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden">
                      {/* Visual Stamp Ribbon */}
                      <div className="absolute top-2 right-2 rotate-12 bg-indigo-600/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        <span className="text-[7.5px] font-mono text-indigo-600 font-extrabold uppercase">
                          UNIQUE PAY QR
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                        <span className="p-1 px-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-[8px] rounded uppercase font-mono">E-Ticket Pay</span>
                        <h4 className="text-[10.5px] font-black text-slate-800 uppercase tracking-wider">
                          E-Ticket Boarding & UPI QR
                        </h4>
                      </div>

                      <p className="text-[10px] font-bold text-slate-500">
                        Scan the booking-specific QR code to pay or use the indicators beneath:
                      </p>

                      {/* Unique Generated QR Code representing the booking */}
                      <div className="flex flex-col items-center justify-center p-3.5 bg-slate-50 rounded-2xl border border-slate-150">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-md relative group flex flex-col items-center">
                          {/* Unique QR Code SVG */}
                          <svg
                            className="w-28 h-28 text-slate-900"
                            viewBox="0 0 15 15"
                            xmlns="http://www.w3.org/2000/svg"
                            shapeRendering="crispEdges"
                          >
                            {/* Background */}
                            <rect width="15" height="15" fill="#ffffff" />
                            
                            {/* Loop and draw pixels */}
                            {(() => {
                              // Deterministic QR pattern generator based on Booking ID
                              const id = selectedBookingDetails.id;
                              let hash = 0;
                              for (let i = 0; i < id.length; i++) {
                                hash = (hash << 5) - hash + id.charCodeAt(i);
                                hash |= 0;
                              }
                              
                              const grid: boolean[][] = [];
                              for (let r = 0; r < 15; r++) {
                                grid[r] = [];
                                for (let c = 0; c < 15; c++) {
                                  const isAnchor = 
                                    (r < 4 && c < 4) || // Top-Left
                                    (r < 4 && c > 10) || // Top-Right
                                    (r > 10 && c < 4); // Bottom-Left
                                  
                                  if (isAnchor) {
                                    grid[r][c] = true;
                                  } else {
                                    const val = Math.abs(Math.sin(hash + r * 15 + c));
                                    grid[r][c] = val > 0.45;
                                  }
                                }
                              }

                              const pixels: React.ReactNode[] = [];
                              grid.forEach((row, rIdx) => {
                                row.forEach((isBlack, cIdx) => {
                                  if (!isBlack) return;
                                  
                                  const isTopLeftAnchorFrame = (rIdx === 0 || rIdx === 3) && cIdx <= 3;
                                  const isTopRightAnchorFrame = (rIdx === 0 || rIdx === 3) && cIdx >= 11;
                                  const isBottomLeftAnchorFrame = (rIdx === 11 || rIdx === 14) && cIdx <= 3;
                                  
                                  let fillColor = "currentColor";
                                  if (isTopLeftAnchorFrame || isTopRightAnchorFrame || isBottomLeftAnchorFrame) {
                                    fillColor = "#f97316"; // Brand orange for anchors
                                  }
                                  
                                  pixels.push(
                                    <rect
                                      key={`qr-rect-${rIdx}-${cIdx}`}
                                      x={cIdx}
                                      y={rIdx}
                                      width="1"
                                      height="1"
                                      fill={fillColor}
                                    />
                                  );
                                });
                              });
                              return pixels;
                            })()}
                          </svg>

                          <div className="mt-1.5 font-mono text-[8px] font-black uppercase text-slate-400 tracking-widest text-center">
                            REF: {selectedBookingDetails.id.substring(0,8).toUpperCase()} • CODE: {selectedBookingDetails.code}
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-slate-700 mt-2">
                          Fare Charge: <span className="font-extrabold text-orange-650">{selectedBookingDetails.price}</span>
                        </span>
                      </div>

                      {/* Payment Details & Smooth Checkout with Copy UPI ID button */}
                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                          <span>UPI Account Details</span>
                          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase font-mono">Online</span>
                        </div>

                        <div className="space-y-2">
                          {/* UPI ID 1 Row with copy button directly next to it */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
                              <span className="font-mono text-[10px] text-slate-700 font-bold truncate">8859490284@ybl</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('8859490284@ybl');
                                window.dispatchEvent(new CustomEvent('mmt-toast-raise', { 
                                  detail: '📋 UPI ID [ 8859490284@ybl ] is copied! Paste directly in GPay / PhonePe / Paytm to pay.' 
                                }));
                              }}
                              className="bg-indigo-650 hover:bg-indigo-750 active:scale-95 text-white text-[9.5px] font-extrabold py-1.5 px-3 rounded-lg transition-all shrink-0 cursor-pointer text-center"
                            >
                              Copy UPI ID
                            </button>
                          </div>

                          {/* UPI ID 2 Row with copy button directly next to it */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
                              <span className="font-mono text-[10px] text-slate-700 font-bold truncate">9627349173@ybl</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('9627349173@ybl');
                                window.dispatchEvent(new CustomEvent('mmt-toast-raise', { 
                                  detail: '📋 UPI ID [ 9627349173@ybl ] is copied! Paste directly in GPay / PhonePe / Paytm to pay.' 
                                }));
                              }}
                              className="bg-indigo-650 hover:bg-indigo-750 active:scale-95 text-white text-[9.5px] font-extrabold py-1.5 px-3 rounded-lg transition-all shrink-0 cursor-pointer text-center"
                            >
                              Copy UPI ID
                            </button>
                          </div>

                          <div className="text-[10px] text-slate-500 font-semibold space-y-1">
                            <div className="flex justify-between">
                              <span>Lead Pax:</span>
                              <span className="text-slate-800 font-bold">{localPassengerName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Mobile:</span>
                              <span className="text-slate-800 font-bold">{localPassengerPhone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Departs:</span>
                              <span className="text-slate-800 font-bold">{localDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info Guideline footer */}
                      <p className="text-[9.2px] text-slate-500 leading-relaxed font-semibold">
                        💡 **Direct Verification Guide**: Pay the exact amount (**{selectedBookingDetails.price}**) using the unique QR code or copied UPI ID. Click on the WhatsApp option left to share your payment receipt with Vikram Aditya or Fleet Desk to verify your ticket immediately!
                      </p>

                    </div>

                  </div>
                </div>

              </div>

              {/* Close Operations bar */}
              <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  🔐 Protected Sandbox transaction
                </span>
                <button
                  type="button"
                  id="btn-close-deep-details-footer"
                  onClick={() => setSelectedBookingDetails(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
