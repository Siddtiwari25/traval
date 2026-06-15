import React from 'react';
import { motion } from 'motion/react';
import { Plane, Star, MapPin, ShieldAlert, Train as TrainIcon, Car, Wifi, Waves, Coffee, Heart, CheckCircle } from 'lucide-react';
import { City, TravelTab, Flight, Hotel, Train, Cab } from '../types';
import { FLIGHTS, HOTELS, TRAINS, CABS } from '../data';

interface SearchResultsProps {
  activeTab: TravelTab;
  fromCity: City;
  toCity: City;
  onBook: (provider: string, routeDetails: string, price: string) => void;
}

export default function SearchResults({
  activeTab,
  fromCity,
  toCity,
  onBook,
}: SearchResultsProps) {

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } },
  };

  return (
    <div id="search-results-section" className="font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Available {activeTab.substring(0, 1).toUpperCase() + activeTab.substring(1)}:{' '}
          <span className="text-sky-500 font-extrabold">{activeTab === 'hotels' ? toCity.name : `${fromCity.code} to ${toCity.code}`}</span>
        </h2>
        <span className="text-xs bg-slate-200/60 text-slate-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {activeTab === 'hotels' ? 'Destinations Lodging' : 'Realtime Schedules'}
        </span>
      </div>

      {/* FLIGHT RESULTS VIEW */}
      {activeTab === 'flights' && (
        <motion.div 
          id="flight-results-list"
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="space-y-4"
        >
          {FLIGHTS.map((flight) => (
            <motion.div
              key={flight.id}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow relative"
            >
              {/* Left Logo / airline info */}
              <div className="flex items-center gap-4 w-full md:w-1/4">
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 font-extrabold text-sm border border-sky-100 uppercase">
                  {flight.logoCode}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">{flight.airline}</h4>
                  <p className="text-xs text-slate-400 font-medium">{flight.flightNo} | Economy Cabin</p>
                </div>
              </div>

              {/* Center flight duration path */}
              <div className="flex items-center justify-between gap-6 md:gap-12 w-full md:w-2/4 px-2">
                <div className="text-left">
                  <span className="block font-black text-slate-800 text-lg">{flight.fromTime}</span>
                  <span className="text-xs text-slate-400 font-bold tracking-wide uppercase">{fromCity.name}</span>
                </div>
                
                <div className="text-center flex-1 relative px-4 max-w-44">
                  <span className="text-[11px] text-slate-400 font-bold block mb-1">{flight.duration}</span>
                  <div className="h-[2px] w-full bg-slate-200 relative rounded-full">
                    <Plane className="w-3.5 h-3.5 text-sky-400 absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-90" />
                  </div>
                  <span className="text-[10px] font-extrabold text-teal-600 block mt-1 uppercase tracking-wider">{flight.stops}</span>
                </div>

                <div className="text-right">
                  <span className="block font-black text-slate-800 text-lg">{flight.toTime}</span>
                  <span className="text-xs text-slate-400 font-bold tracking-wide uppercase">{toCity.name}</span>
                </div>
              </div>

              {/* Right Booking pricing */}
              <div className="text-right flex items-center justify-between md:flex-col gap-4 md:gap-1 w-full md:w-1/4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div>
                  <span className="text-slate-400 text-xs block font-semibold">One-way total</span>
                  <span className="block font-black text-2xl text-slate-800">${flight.price}</span>
                </div>
                <button
                  id={`btn-book-flight-${flight.id}`}
                  onClick={() => onBook(flight.airline, `${fromCity.code} ➔ ${toCity.code} (${flight.flightNo})`, `$${flight.price}`)}
                  className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-extrabold text-xs px-6 py-3 rounded-full transition-all cursor-pointer shadow-lg shadow-sky-500/10 uppercase tracking-widest"
                >
                  Book Seat
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* HOTEL RESULTS VIEW */}
      {activeTab === 'hotels' && (
        <motion.div 
          id="hotel-results-list"
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {HOTELS.map((hotel) => (
            <motion.div
              key={hotel.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow relative"
            >
              {/* Imagery Banner */}
              <div className="h-48 overflow-hidden relative group">
                <img referrerPolicy="no-referrer" src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-black text-slate-800">{hotel.rating}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/40 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{hotel.location}</span>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-lg leading-tight mb-2">{hotel.name}</h4>
                  
                  {/* Amenities List */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {hotel.amenities.map((am) => (
                      <span key={am} className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Price Per Night</span>
                    <span className="font-black text-xl text-slate-800">${hotel.pricePerNight}</span>
                  </div>
                  
                  <button
                    id={`btn-book-hotel-${hotel.id}`}
                    onClick={() => onBook(hotel.name, `Resort Stay at ${hotel.location}`, `$${hotel.pricePerNight} / Night`)}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Select Room
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* TRAIN RESULTS VIEW */}
      {activeTab === 'trains' && (
        <motion.div 
          id="train-results-list"
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="space-y-4"
        >
          {TRAINS.map((train) => (
            <motion.div
              key={train.id}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-extrabold text-sm border border-amber-100">
                  <TrainIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">{train.name}</h4>
                  <p className="text-xs text-slate-400 font-bold">Number: {train.trainNo} | Superfast</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 w-full md:w-1/3 text-center">
                <div className="text-left">
                  <span className="font-black text-slate-800 text-base block">{train.fromTime}</span>
                  <span className="text-xs text-slate-400 font-semibold uppercase">{fromCity.name}</span>
                </div>

                <div className="flex-1 px-4">
                  <span className="text-[10px] text-slate-400 font-bold block">{train.duration}</span>
                  <div className="h-0.5 bg-slate-200 my-1 relative">
                    <div className="w-2 h-2 rounded-full bg-slate-300 absolute -top-0.5 left-1/2 -translate-x-1/2" />
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-800 text-base block">{train.toTime}</span>
                  <span className="text-xs text-slate-400 font-semibold uppercase">{toCity.name}</span>
                </div>
              </div>

              <div className="w-full md:w-1/3 flex items-center justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="flex gap-1.5">
                  {train.classes.map((cls) => (
                    <span key={cls} className="font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200/40">
                      {cls}
                    </span>
                  ))}
                </div>

                <div className="text-right flex items-center gap-4">
                  <div className="mr-2">
                    <span className="text-[10px] text-slate-400 font-semibold block">Starting from</span>
                    <span className="font-black text-xl text-slate-800">${train.price}</span>
                  </div>
                  
                  <button
                    id={`btn-book-train-${train.id}`}
                    onClick={() => onBook(train.name, `${fromCity.code} ➔ ${toCity.code} Express (${train.trainNo})`, `$${train.price}`)}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Book Class
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* CAB RESULTS VIEW */}
      {activeTab === 'cabs' && (
        <motion.div 
          id="cab-results-list"
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="space-y-4"
        >
          {CABS.map((cab) => (
            <motion.div
              key={cab.id}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-extrabold border border-emerald-100">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">{cab.model}</h4>
                  <p className="text-xs text-slate-400 font-bold">{cab.type} | {cab.capacity} Seater Capacity</p>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-1/3 justify-between md:justify-center">
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-bold block mb-0.5">Rating</span>
                  <span className="inline-flex items-center gap-1 font-black text-slate-800">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    {cab.rating}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-bold block mb-0.5">Rate / KM</span>
                  <span className="font-extrabold text-slate-800">${cab.pricePerKm} / km</span>
                </div>
              </div>

              <div className="w-full md:w-1/3 flex items-center justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold block">Estimated Fare</span>
                  <span className="font-black text-2xl text-slate-800">${cab.estimatedPrice}</span>
                </div>

                <button
                  id={`btn-book-cab-${cab.id}`}
                  onClick={() => onBook(`Eco Cab: ${cab.model}`, `Airport One-Way pickup`, `$${cab.estimatedPrice}`)}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs px-6 py-3 rounded-full transition-all cursor-pointer uppercase tracking-widest"
                >
                  Reserve Cab
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
