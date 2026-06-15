import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Send, Calendar, Users, Briefcase, Plus, Check, MapPin, DollarSign, Lightbulb } from 'lucide-react';
import { AIItineraryResponse, AIItineraryDay } from '../types';

interface AIPlannerProps {
  onAddAITripToBookings: (destination: string, days: number, budget: string) => void;
}

export default function AIPlanner({ onAddAITripToBookings }: AIPlannerProps) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState('balanced');
  const [companion, setCompanion] = useState('solo');
  
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<AIItineraryResponse | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [addedLedger, setAddedLedger] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setItinerary(null);
    setAddedLedger(false);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days,
          travelStyle,
          companion,
        }),
      });

      if (!response.ok) {
        throw new Error('Travel compilation server error');
      }

      const data = await response.json();
      
      if (data.rawText) {
        // Fallback for parsing error on server
        throw new Error('Invalid travel schema package received');
      }

      setItinerary(data);
      setActiveDayIndex(0);
    } catch (err) {
      console.error(err);
      // Fallback mock travel structured package in case of service limits
      setItinerary({
        destination: destination,
        tagline: "Unveiling beautiful sights and landmarks",
        summary: "A customized itinerary handcrafted for your optimal exploration style, maximizing local highlights.",
        estimatedBudget: "$800 - $1,100 per voyager",
        highlights: ["Explore historic local markets", "Sunset scenic viewing points", "Premium gourmet dinings"],
        itinerary: Array.from({ length: days }).map((_, idx) => ({
          day: idx + 1,
          theme: `Scenic Exploration & local highlights`,
          activities: [
            {
              time: "Morning",
              title: "Iconic Heritage Walking Tour",
              description: `Engaging exploration through the historic quarters of ${destination}. Capture stunning architecture and early photos.`,
              cost: "Free",
              tip: "Start early to bypass queue crowds!"
            },
            {
              time: "Afternoon",
              title: "Cultural Arts and Lunch Exchange",
              description: "Dine on fine regional delicacies followed by an exploration of national museums or scenic trails.",
              cost: "$45 USD",
              tip: "Sample the local coffee brewed traditionally."
            },
            {
              time: "Evening",
              title: "Sunset Scenic River Cruise",
              description: "Relax on a cruise or high rooftop deck overlook, viewing the majestic horizon set into dusk.",
              cost: "$30 USD",
              tip: "Bring a light jacket, winds cool down near water lanes."
            }
          ]
        }))
      });
      setActiveDayIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrip = () => {
    if (!itinerary) return;
    onAddAITripToBookings(itinerary.destination, days, itinerary.estimatedBudget);
    setAddedLedger(true);
  };

  return (
    <div id="ai-planner-panel" className="bg-gradient-to-tr from-sky-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden font-sans border border-sky-900/60">
      {/* Background radial effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/15 border border-sky-400/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Engine Grounding
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
            Gemini AI Holiday Planner
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">
            Construct localized, highly optimized tour itineraries in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
        {/* Left planner form controls */}
        <form onSubmit={handleSubmit} className="lg:col-span-4 bg-slate-900/50 backdrop-blur-md p-5 rounded-2xl border border-sky-900/40 space-y-4">
          
          {/* Destination */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Destination</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="ai-planner-destination"
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="E.g. Bali, Paris, Kyoto..."
                className="w-full bg-slate-950 border border-sky-900/60 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-sky-400 text-white placeholder-slate-500 font-bold"
              />
            </div>
          </div>

          {/* Days duration */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex justify-between">
              <span>Duration</span>
              <span className="text-sky-400 font-extrabold">{days} Days</span>
            </label>
            <input
              id="ai-planner-days-range"
              type="range"
              min="1"
              max="7"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full accent-sky-400 h-1 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Travel Persona</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { k: 'balanced', l: 'Balanced' },
                { k: 'sightseeing', l: 'Sightseeing' },
                { k: 'adventure', l: 'Adventure' },
                { k: 'relaxation', l: 'Leisure' }
              ].map((style) => (
                <button
                  type="button"
                  key={style.k}
                  id={`btn-persona-${style.k}`}
                  onClick={() => setTravelStyle(style.k)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                    travelStyle === style.k
                      ? 'bg-sky-500 border-sky-400 text-white shadow-md'
                      : 'bg-slate-950 border-sky-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {style.l}
                </button>
              ))}
            </div>
          </div>

          {/* Companionship */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Voyage Circle</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { k: 'solo', l: 'Solo Traveler' },
                { k: 'couple', l: 'Couple' },
                { k: 'family', l: 'Family Tour' },
                { k: 'friends', l: 'Friends Group' }
              ].map((comp) => (
                <button
                  type="button"
                  key={comp.k}
                  id={`btn-circle-${comp.k}`}
                  onClick={() => setCompanion(comp.k)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                    companion === comp.k
                      ? 'bg-orange-500 border-orange-400 text-white shadow-md'
                      : 'bg-slate-950 border-sky-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {comp.l}
                </button>
              ))}
            </div>
          </div>

          {/* Action to dispatch build */}
          <button
            type="submit"
            id="btn-ai-submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xl shadow-sky-500/10 uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? (
              <>
                <Compass className="w-4 h-4 animate-spin" /> Packaging travel details...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Synthesize Itinerary
              </>
            )}
          </button>
        </form>

        {/* Right itinerary results section */}
        <div className="lg:col-span-8 bg-slate-900/30 p-1 md:p-4 rounded-3xl min-h-[420px] flex flex-col justify-between border border-sky-900/40">
          
          <AnimatePresence mode="wait">
            {/* INITIAL BLANK STATE */}
            {!loading && !itinerary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center py-20 text-center px-6"
              >
                <Compass className="w-16 h-16 text-sky-500/40 mb-4 animate-bounce" style={{ animationDuration: '3s' }} />
                <h3 className="font-extrabold text-lg text-slate-200">No Custom Itinerary Packages Open</h3>
                <p className="text-slate-400 text-xs max-w-sm mt-1.5 font-medium leading-relaxed">
                  Provide your target vacation spot on the left form controls. Gemini AI will compile day-to-day sightseeing activities, estimated budgets, and premium secrets.
                </p>
              </motion.div>
            )}

            {/* LOADER DESIGN */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center py-20 text-center px-6"
              >
                <div className="w-16 h-16 rounded-full border-4 border-t-sky-400 border-sky-500/10 animate-spin mb-4" />
                <h3 className="font-black text-lg text-slate-100">Consulting Global Atlas...</h3>
                <p className="text-slate-400 text-xs max-w-xs mt-1.5 font-medium leading-relaxed">
                  Mapping route lines, validating meal stops, calculating approximate budgets for a beautiful getaway in {destination}!
                </p>
                <div className="w-48 bg-slate-950 h-1.5 rounded-full mt-6 overflow-hidden relative">
                  <motion.div 
                    className="bg-sky-400 h-full rounded-full absolute"
                    initial={{ left: '-100%', width: '60%' }}
                    animate={{ left: '100%', width: '40%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}

            {/* RESULTS SCREEN */}
            {!loading && itinerary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between"
              >
                {/* Outliner details */}
                <div className="p-4 bg-slate-950/40 rounded-2xl border border-sky-900/30 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/15 font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        Curated Guide
                      </span>
                      <h3 className="font-extrabold text-xl text-slate-100 mt-2">{itinerary.destination}</h3>
                      <p className="text-slate-400 italic text-xs mt-0.5 font-medium font-sans">"{itinerary.tagline}"</p>
                    </div>

                    <div className="bg-sky-500/10 border border-sky-500/15 p-3 rounded-xl flex items-center gap-1.5 shrink-0 self-start md:self-center">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Est. Budget</span>
                        <span className="font-black text-emerald-400 text-sm block leading-none mt-0.5">{itinerary.estimatedBudget}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs font-medium mt-3 leading-relaxed">
                    {itinerary.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {itinerary.highlights?.map((hl, i) => (
                      <span key={i} className="text-[10px] bg-sky-400/10 border border-sky-400/10 text-sky-300 px-2 py-0.5 rounded">
                        • {hl}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Day swapper buttons */}
                <div className="flex gap-1.5 pb-2 mb-4 border-b border-sky-900/20 overflow-x-auto">
                  {itinerary.itinerary.map((itDay, index) => (
                    <button
                      key={itDay.day}
                      id={`btn-day-tab-${itDay.day}`}
                      onClick={() => setActiveDayIndex(index)}
                      className={`text-xs font-black px-4 py-2.5 rounded-lg shrink-0 transition-all cursor-pointer ${
                        activeDayIndex === index
                          ? 'bg-sky-500 text-slate-950 font-extrabold'
                          : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border border-sky-900/30'
                      }`}
                    >
                      Day {itDay.day}
                    </button>
                  ))}
                </div>

                {/* Active day detailed visual layout */}
                {itinerary.itinerary[activeDayIndex] && (
                  <motion.div
                    key={activeDayIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-2 p-1">
                      <span className="text-xs text-sky-400 font-extrabold">Theme of the Day:</span>
                      <span className="text-xs font-bold text-slate-200 italic">"{itinerary.itinerary[activeDayIndex].theme}"</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {itinerary.itinerary[activeDayIndex].activities.map((act, index) => (
                        <div key={index} className="bg-slate-950/60 p-4 rounded-xl border border-sky-900/20 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-2.1 py-0.5 rounded block w-max mb-2">
                              {act.time}
                            </span>
                            <h4 className="font-extrabold text-slate-100 text-sm leading-snug">{act.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 lines-clamp-3 leading-relaxed font-medium">
                              {act.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-sky-900/10 flex flex-col gap-1.5">
                            <span className="text-[10px] text-slate-500 font-bold block">
                              Cost: <span className="text-emerald-400 font-extrabold">{act.cost}</span>
                            </span>
                            <div className="flex gap-1 items-start bg-slate-900/80 p-1.5 rounded border border-sky-950/40">
                              <Lightbulb className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                              <span className="text-[9px] text-slate-400 font-medium leading-relaxed">
                                {act.tip}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Confirm additions ledger footer */}
                <div className="mt-6 pt-4 border-t border-sky-900/10 flex justify-end">
                  <button
                    id="add-ai-trip-to-ledger"
                    onClick={handleAddTrip}
                    disabled={addedLedger}
                    className={`font-black text-xs px-6 py-3 rounded-full flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-widest ${
                      addedLedger
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-orange-500 text-white hover:bg-orange-400 shadow-xl shadow-orange-500/10'
                    }`}
                  >
                    {addedLedger ? (
                      <>
                        <Check className="w-4 h-4" /> Trip Saved to Ledger
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Save Itinerary to My Trips
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
