import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PhoneCall, 
  Instagram, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Sparkles, 
  Send, 
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function ContactMethods() {
  const [activeFormChannel, setActiveFormChannel] = useState<'General' | 'Booking' | 'Spiritual' | 'Emergency'>('General');
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [messageText, setMessageText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactOptions = [
    {
      id: 'helpline',
      title: '24/7 Premium Helpline',
      displayValue: '+91 1800-419-8777',
      link: 'tel:+9118004198777',
      description: 'Assistance for flight cancellations, hotels, and sudden modifications.',
      icon: PhoneCall,
      color: 'bg-orange-500',
      iconAnimation: {
        animate: {
          rotate: [0, -10, 10, -10, 10, 0],
          scale: [1, 1.05, 1.05, 1],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse' as const,
          repeatDelay: 2
        }
      },
      tag: 'Immediate response',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-100'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Concierge Desk',
      displayValue: '+91 91136-12000',
      link: 'https://wa.me/919113612000',
      description: 'Get automated flight pnr, ticket receipts, and booking links direct.',
      icon: MessageSquare,
      color: 'bg-emerald-500',
      iconAnimation: {
        animate: {
          y: [0, -5, 0],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut' as const
        }
      },
      tag: 'Average reply: 2 mins',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      id: 'instagram',
      title: 'Devbhoomi Instagram Desk',
      displayValue: '@travel.uttarakhand',
      link: 'https://instagram.com',
      description: 'Explore scenic reels, live story updates, and tag us to get featured in our global feed!',
      icon: Instagram,
      color: 'bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600',
      iconAnimation: {
        animate: {
          rotate: [0, 8, -8, 8, 0],
          scale: [1, 1.08, 1.08, 1],
        },
        transition: {
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut' as const
        }
      },
      tag: 'Feed & Reels Online',
      tagColor: 'bg-pink-50 text-pink-700 border-pink-100'
    },
    {
      id: 'office',
      title: 'Uttarakhand Regional Hub',
      displayValue: 'Dehradun Airport Rd, Sector 4',
      link: 'https://maps.google.com',
      description: 'Step in for authentic offline hospitality or local guide allotments.',
      icon: MapPin,
      color: 'bg-indigo-500',
      iconAnimation: {
        animate: {
          y: [0, -4, 0],
          scaleY: [1, 0.9, 1]
        },
        transition: {
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut' as const
        }
      },
      tag: '9:00 AM - 8:00 PM',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-100'
    }
  ];

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderContact || !messageText) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      
      // Dispatch a custom event to trigger global toast
      const event = new CustomEvent('mmt-toast-raise', {
        detail: `✨ Contact callback registered! We will ping you on ${senderContact} shortly.`
      });
      window.dispatchEvent(event);
    }, 1200);
  };

  const handleResetForm = () => {
    setSenderName('');
    setSenderContact('');
    setMessageText('');
    setFormSubmitted(false);
  };

  return (
    <div id="expert-support-hub" className="mt-16 pt-12 border-t border-slate-200">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-extrabold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            Reliable support networks
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Seamless Help & Instant Connection
          </h3>
          <p className="text-slate-400 text-xs md:text-sm font-semibold mt-1">
            Facing trouble processing your booking ticket or tracking a path? Reach out to our physical desks or trigger an automated callback.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold leading-none bg-slate-100 px-3.5 py-2 rounded-2xl border border-slate-200 shrink-0 self-start md:self-end">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">Current Wait-Time: <span className="text-emerald-600 font-black">Under 1 min</span></span>
        </div>
      </div>

      {/* Grid of contact methods & callback slot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact cards block (left column 2 span) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {contactOptions.map((opt) => (
            <motion.a
              key={opt.id}
              href={opt.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Animated Icon badge wrapper */}
                  <div className={`w-10 h-10 rounded-xl ${opt.color} text-white flex items-center justify-center shadow-md shadow-slate-200`}>
                    <motion.div
                      animate={opt.iconAnimation.animate}
                      transition={opt.iconAnimation.transition}
                    >
                      <opt.icon className="w-5 h-5" />
                    </motion.div>
                  </div>

                  {/* Status tag badges */}
                  <span className={`px-2.5 py-1 text-[9.5px] font-black uppercase tracking-wide border rounded-lg ${opt.tagColor}`}>
                    {opt.tag}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-sky-600 transition-colors">
                    {opt.title}
                  </h4>
                  <p className="text-[11.5px] text-slate-450 font-medium leading-relaxed mt-1">
                    {opt.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="font-mono text-[11.5px] font-black text-slate-700 tracking-tight">
                  {opt.displayValue}
                </span>
                
                <span className="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-sky-50 text-slate-400 group-hover:text-sky-600 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Dynamic callback form slot (right column 1 span) */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
            {/* Background design pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="callback-form"
                  onSubmit={handleCallbackSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 relative z-10"
                >
                  <div>
                    <h4 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5 text-white">
                      <HelpCircle className="w-4 h-4 text-sky-400" />
                      Virtual Support Desk
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                      Type your details below and our regional concierge agents will reach out on your specified channel.
                    </p>
                  </div>

                  {/* Channel selectors pills */}
                  <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {(['General', 'Booking', 'Spiritual', 'Emergency'] as const).map((channel) => {
                      const isSelected = activeFormChannel === channel;
                      return (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => setActiveFormChannel(channel)}
                          className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                            isSelected
                              ? 'bg-sky-500 text-slate-950 shadow-xs'
                              : 'bg-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {channel}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sender Name field */}
                  <div>
                    <label htmlFor="callback-sender-name" className="block text-[8px] font-extrabold uppercase text-slate-400 tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      id="callback-sender-name"
                      type="text"
                      required
                      placeholder="e.g., Vikram Aditya"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-semibold"
                    />
                  </div>

                  {/* Contact field (Phone or Email) */}
                  <div>
                    <label htmlFor="callback-sender-contact" className="block text-[8px] font-extrabold uppercase text-slate-400 tracking-wider mb-1">
                      Phone Number or Mail id
                    </label>
                    <input
                      id="callback-sender-contact"
                      type="text"
                      required
                      placeholder="e.g., +91 98765-43210"
                      value={senderContact}
                      onChange={(e) => setSenderContact(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-semibold"
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label htmlFor="callback-message" className="block text-[8px] font-extrabold uppercase text-slate-400 tracking-wider mb-1">
                      Message / Request Overview
                    </label>
                    <textarea
                      id="callback-message"
                      rows={2}
                      maxLength={180}
                      required
                      placeholder="Mention your booking reference or custom route demand..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-semibold resize-none"
                    />
                  </div>

                  {/* Action submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !senderName || !senderContact || !messageText}
                    className={`w-full font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? 'bg-slate-800 text-slate-550 cursor-wait'
                        : 'bg-sky-500 hover:bg-sky-450 text-slate-950 font-black cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Filing request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Callback Request</span>
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="callback-success"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="space-y-4 py-8 text-center relative z-10"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm">Callback Requested!</h4>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
                      Thank you <span className="text-white font-black">{senderName}</span>. A registered agent specialized in <span className="text-sky-400 font-black">{activeFormChannel} topics</span> will contact you within minutes at <span className="text-white font-black">{senderContact}</span>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 text-[10px] font-black uppercase rounded-lg cursor-pointer transition-colors"
                  >
                    File another ticket
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
