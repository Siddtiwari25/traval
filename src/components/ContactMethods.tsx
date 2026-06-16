import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PhoneCall, 
  Instagram, 
  Facebook,
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
      title: 'Rakesh Cab Service (Primary)',
      displayValue: '+91-8859490284',
      link: 'tel:+918859490284',
      description: 'Available 24/7. Pre-book or hire premium cabs located in Mukteshwar & Nainital.',
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
      tag: 'Immediate Response',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-100'
    },
    {
      id: 'instagram',
      title: 'Rudra Travels Instagram',
      displayValue: '@rudra_travels_service',
      link: 'https://instagram.com',
      description: 'Follow our active feed for beautiful tour group highlights, local weather updates, and road clips.',
      icon: Instagram,
      color: 'bg-gradient-to-tr from-pink-500 via-rose-500 to-orange-500',
      iconAnimation: {
        animate: {
          scale: [1, 1.05, 1],
        },
        transition: {
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut' as const
        }
      },
      tag: 'Join 12k+ Followers',
      tagColor: 'bg-pink-55 text-pink-700 border-pink-100'
    },
    {
      id: 'facebook',
      title: 'Rakesh Cab Service Facebook',
      displayValue: 'fb.com/RudraTravelsMukteshwar',
      link: 'https://facebook.com',
      description: 'Join our friendly Himalayan travelers community page to find carpools, reviews, and active promo flyers.',
      icon: Facebook,
      color: 'bg-blue-600',
      iconAnimation: {
        animate: {
          y: [0, -4, 0],
        },
        transition: {
          duration: 2.0,
          repeat: Infinity,
          ease: 'easeInOut' as const
        }
      },
      tag: 'Active Community Group',
      tagColor: 'bg-blue-50 text-blue-705 border-blue-100'
    },
    {
      id: 'office',
      title: 'Physical Regional Desk',
      displayValue: 'Main market, mohan bazaar, Mukteshwar, Darima, Uttarakhand 263138',
      link: 'https://maps.app.goo.gl/yqNKxK8uLUj6cSsJ6',
      description: 'Come down to our head office beside Mohan Bazaar to grab customized offline coupon flyers.',
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
      tag: 'Main Market Office',
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
        </div>        {/* Physical Office & Service Pickup Point Map card */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between h-full">
            {/* Background design pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="space-y-5 relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-extrabold text-[9.5px] uppercase tracking-wider mb-2">
                  <MapPin className="w-3.5 h-3.5" /> Registered Hub
                </span>
                <h4 className="font-extrabold text-lg text-white tracking-tight">
                  Head Office & Pickup Point
                </h4>
                <p className="text-[11.5px] text-slate-400 font-semibold leading-relaxed mt-1">
                  Locate Rudra Travels & Rakesh Cab Service right at the central mountain route. Stop by for bookings, physical receipts, or tour handoffs!
                </p>
              </div>

              {/* Explicit Address specs */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 text-xs space-y-3 font-semibold text-slate-300">
                <div>
                  <span className="text-[9px] font-bold uppercase text-orange-500 tracking-widest block mb-0.5">Physical Head Office:</span>
                  <p className="text-white text-[11px] leading-relaxed">
                    Main Market, Mohan Bazaar, Mukteshwar, Darima, Uttarakhand 263138
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-2.5">
                  <span className="text-[9px] font-bold uppercase text-sky-400 tracking-widest block mb-0.5">All-Service Pickup Point:</span>
                  <div className="flex items-start gap-1 pb-1">
                    <span className="text-white text-[11.5px] font-mono leading-tight bg-slate-800 px-1.5 py-0.5 rounded mr-1">
                      FJ9X+39W, 16
                    </span>
                    <p className="text-white text-[11px] leading-relaxed flex-1">
                      Bhatelia-Mukteshwar Rd, Mukteshwar, Darima, Uttarakhand 263138
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    💡 <span className="text-slate-300">24/7 Cab Dispatch</span> & scooty pre-booked collections.
                  </span>
                </div>
              </div>

              {/* Aesthetic static Map preview frame */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden relative group">
                <img 
                  referrerPolicy="no-referrer" 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" 
                  alt="Mukteshwar Map Hub Preview" 
                  className="w-full h-24 object-cover opacity-60 group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/20" />
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <span className="bg-slate-900/90 text-white border border-slate-700/60 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow">
                    Interactive Google Coordinates
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Google Maps Action CTA */}
            <div className="pt-4 mt-4 border-t border-slate-800 relative z-10 w-full">
              <a
                href="https://maps.app.goo.gl/yqNKxK8uLUj6cSsJ6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-orange-500 hover:bg-orange-400 active:scale-97 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/10"
              >
                <MapPin className="w-4 h-4" />
                <span>Open in Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
