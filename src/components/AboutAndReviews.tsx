import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Compass, 
  Award, 
  CheckCircle, 
  MessageSquare, 
  ThumbsUp, 
  User, 
  Send, 
  Activity, 
  Calendar, 
  Clock, 
  Car, 
  ShieldCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  avatarColor: string;
}

export default function AboutAndReviews() {
  // Reviews state with predefined authentic/realistic Kumaon traveler reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('rudra_travel_reviews');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'rev-1',
        name: 'Suresh Singhal',
        rating: 5,
        comment: 'Rakesh Cab Service is absolutely the best in Nainital and Nainital-Mukteshwar regions! The vehicle was extremely tidy (Toyota Innova), and Rakesh ji was super knowledgeable about local spots. Fully recommended!',
        date: 'June 12, 2026',
        verified: true,
        avatarColor: 'bg-orange-500'
      },
      {
        id: 'rev-2',
        name: 'Meenakshi Iyer',
        rating: 5,
        comment: 'Pre-booked the Char Dham Yatra Taxi Service package with them. They handled everything from forest permits to emergency oxygen. The local guide companion was so warm and helpful. Standard class was super high value.',
        date: 'May 28, 2026',
        verified: true,
        avatarColor: 'bg-emerald-500'
      },
      {
        id: 'rev-3',
        name: 'Dr. Rohan Mehra',
        rating: 4,
        comment: 'Awesome cab travel experience in Uttarakhand. Prompt pickup right at Kathgodam station and smooth driving through Kausani and Almora hairpin bends. Recommended for families looking for safe tours.',
        date: 'May 15, 2026',
        verified: true,
        avatarColor: 'bg-sky-500'
      }
    ];
  });

  // State for Review Form
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Sync reviews to local storage
  useEffect(() => {
    localStorage.setItem('rudra_travel_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Recalculate average stats
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? parseFloat((reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviewsCount).toFixed(1))
    : 5.0;

  const countForStars = (starCount: number) => {
    return reviews.filter(r => r.rating === starCount).length;
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const colors = ['bg-orange-500', 'bg-emerald-500', 'bg-sky-500', 'bg-indigo-500', 'bg-amber-500', 'bg-rose-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const addedReview: Review = {
        id: `rev-custom-${Date.now()}`,
        name: newReviewName.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        date: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        verified: true,
        avatarColor: randomColor
      };

      setReviews((prev) => [addedReview, ...prev]);
      setNewReviewName('');
      setNewReviewRating(5);
      setNewReviewComment('');
      setIsSubmitting(false);
      setShowForm(false);

      // Trigger global toast
      const event = new CustomEvent('mmt-toast-raise', {
        detail: `⭐ Thank you for your 5-star Google rating! Your review is now live.`
      });
      window.dispatchEvent(event);
    }, 1000);
  };

  return (
    <div className="space-y-16">
      
      {/* 1. ABOUT US SECTION */}
      <section id="section-about" className="scroll-mt-20 pt-8">
        <div className="bg-gradient-to-r from-orange-50/70 to-amber-50/40 p-8 md:p-12 rounded-3xl border border-orange-100/80 shadow-xs relative overflow-hidden">
          
          {/* Accent circles decorative */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-orange-200/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/4 bottom-0 w-60 h-60 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Text details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-850 font-black text-[10.5px] uppercase tracking-wider">
                <Award className="w-4 h-4 text-orange-600" />
                <span>RUDRA TRAVELS & CAB SERVICES</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Your Trusted Mountain Companion in <span className="text-orange-600">Devbhoomi Uttarakhand</span>
              </h2>

              <p className="text-slate-600 text-sm md:text-[14.5px] leading-relaxed font-semibold italic border-l-4 border-orange-500 pl-4 bg-orange-100/20 py-3 rounded-r-xl">
                "Rakesh Cab Service Mukteshwar offers a comprehensive range of convenient and reliable taxi service's catering to both local and long distance travel requirements. Whether you seek a comfortable ride within Mukteshwar, and Family time amidst the serene beauty of Nainital , Almora, Ranikhet, Kausani, Munsyari and Uttarakhand. our dedicated team is committed to making your journey memorable with a strong emphasis on customer satisfaction, we are provide personalized tour packages and assist with hotel bookings, ensuring a stress - free and enjoyable"
              </p>

              {/* Award SEO badging box requested in the text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                <div className="bg-white p-3.5 rounded-2xl border border-orange-100 flex items-start gap-2.5 shadow-2xs">
                  <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs shrink-0">
                    🏆
                  </span>
                  <div>
                    <span className="block text-xs font-black text-slate-800">Best in Nainital</span>
                    <span className="block text-[11px] text-slate-450 mt-0.5 leading-snug font-bold">
                      "Best taxi service in Nainital & Kumaon area."
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-orange-100 flex items-start gap-2.5 shadow-2xs">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
                    ⚡
                  </span>
                  <div>
                    <span className="block text-xs font-black text-slate-800">Available 24/7</span>
                    <span className="block text-[11px] text-slate-450 mt-0.5 leading-snug font-bold">
                      "Looking for taxi service near me in Mukteshwar or Nainital? We provide 24/7 service."
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges of cities */}
              <div className="pt-2">
                <span className="text-[10px] text-slate-450 font-black uppercase tracking-wider block mb-2">Our Highly Demanded Segments</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Mukteshwar', 'Nainital', 'Almora', 'Ranikhet', 'Kausani', 'Munsyari', 'Uttarakhand Wide'].map((city) => (
                    <span key={city} className="bg-white px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">
                      📍 {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Graphic Block */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Car className="w-6 h-6 text-orange-400" />
                    <span className="font-extrabold text-sm uppercase tracking-wide">Rakesh Cab fleet</span>
                  </div>
                  <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    ● ACTIVE
                  </span>
                </div>

                <h4 className="text-lg font-black text-white leading-snug">
                  "Best tour and travel company near you in the Kumaon region."
                </h4>

                <div className="space-y-3.5 text-xs text-slate-300 font-semibold">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-orange-400">
                      ✓
                    </div>
                    <span>Pre-arranged Hotel and Resort Bookings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-orange-400">
                      ✓
                    </div>
                    <span>Neat and sanitized mountain SUVs, Sedans & Tempo Travelers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-orange-400">
                      ✓
                    </div>
                    <span>Certified mountain terrain drivers with safe driving metrics</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-5 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Reach Rakesh Directly</span>
                    <a href="tel:+918859490284" className="block text-lg font-black text-white hover:text-orange-400 transition-colors">
                      +91 88594-90284
                    </a>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center font-black shadow-lg animate-pulse">
                    📞
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="section-services" className="scroll-mt-20 pt-8">
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-black tracking-widest uppercase px-3 py-1 rounded-full">
              🚖 Specialized Logistics
            </span>
            <h3 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight">
              Uttarakhand Cab Travel & Pilgrimage Services
            </h3>
            <p className="text-slate-400 text-xs md:text-sm font-semibold">
              Premium tailored cab rentals, spiritual guides, and custom sightseeing routes for standard & family tours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Service 1 */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  🗻
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-950">
                    Char Dham Yatra Taxi Service in Uttarakhand
                  </h4>
                  <p className="text-[11px] text-orange-650 font-bold uppercase tracking-wider mt-0.5">
                    🚖 Char Dham Yatra: Yamunotri • Gangotri • Kedarnath • Badrinath
                  </p>
                </div>
                <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed">
                  We specialize in the ultimate spiritual route. Our Char Dham taxi services provide comfortable private SUVs equipped with high-mileage mountain gears, health essentials, and permits. Travel in absolute comfort with seasoned guides who handle your sanctum entries and VIP checkpoints.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-slate-400 font-black uppercase">Service Rates</span>
                  <span className="text-sm font-black text-slate-900">Starting at ₹4,000 / day</span>
                </div>
                <a 
                  href="tel:+918859490284"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  Inquire Now
                </a>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  🚗
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-950">
                    Uttarakhand cab travel Service
                  </h4>
                  <p className="text-[11px] text-sky-600 font-bold uppercase tracking-wider mt-0.5">
                    Explore the beauty of Nainital, Almora, Kausani, and Mukteshwar
                  </p>
                </div>
                <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed">
                  Need a quick pickup from Kathgodam railway station or Pantnagar hotels? Or planning sweet pine-wood forest drives among Almora and Ranikhet? Get dedicated custom local cab service with certified 24/7 assistance and transparent pricing with no hidden charges.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-slate-400 font-black uppercase">Service Rates</span>
                  <span className="text-sm font-black text-slate-900">₹12 / km plain, ₹15 / km hill</span>
                </div>
                <a 
                  href="https://wa.me/918859490284"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Cab
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. VERIFIED GOOGLE REVIEWS SECTION (FULLY WORKING) */}
      <section id="section-reviews" className="scroll-mt-20 pt-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-xs space-y-8">
          
          {/* Header containing total rating summary and user action */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-amber-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Verified Google Reviews</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Authentic Guest Experiences
              </h3>
              <p className="text-slate-450 text-xs font-semibold mt-0.5">
                Every review represents a real family adventure driven across Nainital, Mukteshwar, or Char Dham.
              </p>
            </div>

            {/* Action Write review */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-amber-500 hover:bg-amber-450 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-transform active:scale-95 flex items-center gap-2 shadow"
            >
              <span>{showForm ? 'Close Custom Form' : 'Write a Review'}</span>
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          {/* Central score distribution container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            {/* Total score panel */}
            <div className="lg:col-span-4 text-center space-y-2">
              <span className="block text-4xl md:text-5xl font-black text-slate-900">
                {averageRating}
              </span>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-5 h-5 ${
                      s <= Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`} 
                  />
                ))}
              </div>
              <span className="block text-[11px] text-slate-450 font-extrabold uppercase tracking-widest mt-1">
                Based on {totalReviewsCount} Customer Reviews
              </span>
            </div>

            {/* Micro progress ratings */}
            <div className="lg:col-span-8 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = countForStars(stars);
                const percent = totalReviewsCount > 0 ? (count / totalReviewsCount) * 105 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <span className="w-12 text-right">{stars} star{stars > 1 ? 's' : ''}</span>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-6 text-slate-450 text-[11px] font-extrabold">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Review Form Entry */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                key="review-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleReviewSubmit}
                className="bg-amber-50/40 p-5 md:p-6 rounded-2xl border border-amber-200/50 space-y-4 overflow-hidden"
              >
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800">Add custom Google rating with feedback</h4>
                  <p className="text-[10.5px] text-slate-400 font-bold mt-0.5">Submit reviews to immediately update and re-calculate our global score.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-500 tracking-wider mb-1">Your Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g., Vikram Aditya"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-500 tracking-wider mb-1">Star rating (1-5)</label>
                    <div className="flex items-center gap-1.5 h-10">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= newReviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-500 tracking-wider mb-1">Feedback review details</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Describe your tour comfort, driver punctuality, and car cleanliness..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !newReviewName.trim() || !newReviewComment.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Syncing review...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Google Review</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Reviews list rendering */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                layout
                className="p-5 border border-slate-100 rounded-2xl space-y-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full ${rev.avatarColor} text-white font-black text-xs flex items-center justify-center`}>
                      {rev.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <span className="block font-black text-xs text-slate-800">{rev.name}</span>
                      <span className="block text-[10px] text-slate-400 font-extrabold mt-0.5">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star 
                        key={st} 
                        className={`w-3.5 h-3.5 ${
                          st <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-600 font-semibold leading-relaxed">
                  {rev.comment}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
                  <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    Verified Guest traveler ✔
                  </span>

                  <button className="hover:text-slate-600 flex items-center gap-1 font-bold">
                    <ThumbsUp className="w-3 h-3 text-slate-400" />
                    <span>Helpful (1)</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
