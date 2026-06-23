import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bike, Hotel, Train as TrainIcon, Car, ArrowLeftRight, Calendar, UserPlus, MapPin, Compass } from 'lucide-react';
import { City, TravelTab } from '../types';
import { CITIES } from '../data';

interface SearchWidgetProps {
  activeTab: TravelTab;
  setActiveTab: (tab: TravelTab) => void;
  fromCity: City;
  setFromCity: (city: City) => void;
  toCity: City;
  setToCity: (city: City) => void;
  departureDate: string;
  setDepartureDate: (date: string) => void;
  travellers: number;
  setTravellers: (count: number) => void;
  travelClass: string;
  setTravelClass: (tClass: string) => void;
  hotelGuestCount: number;
  setHotelGuestCount: (count: number) => void;
  hotelRoomCount: number;
  setHotelRoomCount: (count: number) => void;
  cabCapacity: number;
  setCabCapacity: (cap: number) => void;
  onSearch: () => void;
}

export default function SearchWidget({
  activeTab,
  setActiveTab,
  fromCity,
  setFromCity,
  toCity,
  setToCity,
  departureDate,
  setDepartureDate,
  travellers,
  setTravellers,
  travelClass,
  setTravelClass,
  hotelGuestCount,
  setHotelGuestCount,
  hotelRoomCount,
  setHotelRoomCount,
  cabCapacity,
  setCabCapacity,
  onSearch,
}: SearchWidgetProps) {
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const selectFromCity = (city: City) => {
    setFromCity(city);
    setShowFromDropdown(false);
  };

  const selectToCity = (city: City) => {
    setToCity(city);
    setShowToDropdown(false);
  };

  return (
    <div id="search-widget" className="bg-white rounded-3xl shadow-2xl p-6 border border-slate-200/60 relative z-20">
      {/* Tab Swapper */}
      <div className="flex justify-start gap-1 md:gap-2 border-b border-slate-100 pb-4 mb-6 overflow-x-auto scrollbar-none">
        {[
          { key: 'cabs', label: 'Cabs', icon: Car },
          { key: 'hotels', label: 'Hotels', icon: Hotel },
          { key: 'flights', label: 'Scooty / Bike Rent', icon: Bike },
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key as TravelTab)}
              className={`flex items-center gap-2 font-bold text-xs md:text-sm px-6 py-3 rounded-full transition-all duration-300 relative cursor-pointer ${
                isActive
                  ? 'bg-sky-500/10 text-sky-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}

        {/* Dedicated Interactive Tour Packages trigger button */}
        <button
          key="packages"
          id="tab-packages"
          onClick={() => {
            const el = document.getElementById('curated-holiday-packages');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
            window.dispatchEvent(new CustomEvent('clear-tour-filters'));
          }}
          className="flex items-center gap-2 font-black text-xs md:text-sm px-6 py-3 rounded-full text-orange-650 bg-orange-100/40 border border-orange-200/50 hover:bg-orange-100 transition-all cursor-pointer shadow-sm shrink-0 hover:scale-103 active:scale-97"
          title="See all tour packages with no active filters"
        >
          <Compass className="w-4 h-4 text-orange-500 animate-pulse" />
          <span>Tour Packages 🎁</span>
        </button>
      </div>

      {/* Dynamic Form Panel */}
      <div className="relative">
        {/* FLIGHT / GENERAL TRAVEL SEARCH FROM-TO CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-2 border border-slate-100 rounded-3xl p-2 bg-slate-50 relative">
          
          {/* FROM SELECTOR */}
          <div 
            id="from-city-selector"
            className="lg:col-span-3 p-4 bg-white hover:bg-sky-50/30 rounded-2xl transition-all cursor-pointer relative shadow-sm border border-slate-200/40"
            onClick={() => { setShowFromDropdown(!showFromDropdown); setShowToDropdown(false); setShowClassDropdown(false); }}
          >
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-sky-500" /> {activeTab === 'flights' ? 'Pickup Point' : 'From'}
            </span>
            <div className="text-xl font-extrabold text-slate-800 block truncate">{fromCity.name}</div>
            <div className="text-xs text-slate-500 truncate font-medium">{fromCity.hotels}</div>

            {/* From Dropdown */}
            <AnimatePresence>
              {showFromDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 max-h-80 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2 text-xs font-bold text-sky-600 border-b border-slate-50">Popular Hotels</div>
                  {CITIES.map((city) => (
                    <div
                      key={`from-${city.code}`}
                      id={`from-city-option-${city.code}`}
                      onClick={() => selectFromCity(city)}
                      className={`p-3 hover:bg-sky-50 rounded-xl transition-colors flex justify-between items-center cursor-pointer ${fromCity.code === city.code ? 'bg-sky-50/60' : ''}`}
                    >
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">{city.name}</span>
                        <span className="text-[11px] text-slate-400 block max-w-56 truncate">{city.hotels}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                        {city.code}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SWAP BUTTON */}
          <div className="flex items-center justify-center lg:col-span-1 py-1 lg:py-0">
            <button
              id="swap-cities-btn"
              onClick={(e) => { e.stopPropagation(); swapCities(); }}
              className="w-11 h-11 rounded-full bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-500 text-slate-500 flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer z-10"
              title="Swap Cities"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* TO SELECTOR */}
          <div 
            id="to-city-selector"
            className="lg:col-span-3 p-4 bg-white hover:bg-sky-50/30 rounded-2xl transition-all cursor-pointer relative shadow-sm border border-slate-200/40"
            onClick={() => { setShowToDropdown(!showToDropdown); setShowFromDropdown(false); setShowClassDropdown(false); }}
          >
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" /> {activeTab === 'flights' ? 'Dropoff Point' : 'To'}
            </span>
            <div className="text-xl font-extrabold text-slate-800 block truncate">{toCity.name}</div>
            <div className="text-xs text-slate-500 truncate font-medium">{toCity.hotels}</div>

            {/* To Dropdown */}
            <AnimatePresence>
              {showToDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 lg:right-0 lg:left-auto top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 max-h-80 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2 text-xs font-bold text-orange-600 border-b border-slate-50">Popular Hotels</div>
                  {CITIES.map((city) => (
                    <div
                      key={`to-${city.code}`}
                      id={`to-city-option-${city.code}`}
                      onClick={() => selectToCity(city)}
                      className={`p-3 hover:bg-sky-50 rounded-xl transition-colors flex justify-between items-center cursor-pointer ${toCity.code === city.code ? 'bg-sky-50/60' : ''}`}
                    >
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">{city.name}</span>
                        <span className="text-[11px] text-slate-400 block max-w-56 truncate">{city.hotels}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                        {city.code}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DATE SELECTOR */}
          <div className="lg:col-span-2.5 p-4 bg-white hover:bg-sky-50/30 rounded-2xl transition-all relative shadow-sm border border-slate-200/40">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-sky-500" /> {activeTab === 'flights' ? 'Rent Start Date' : 'Travel Date'}
            </span>
            <input
              id="travel-date-input"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="text-lg font-extrabold text-slate-700 bg-transparent focus:outline-none w-full cursor-pointer mt-0.5"
            />
            <span className="block text-[11px] text-slate-400 font-medium">Selected Date Departure</span>
          </div>

          {/* TRAVEL CLASS / GUEST SELECTOR */}
          <div 
            id="travel-info-selector"
            className="lg:col-span-2.5 p-4 bg-white hover:bg-sky-50/30 rounded-2xl transition-all cursor-pointer relative shadow-sm border border-slate-200/40"
            onClick={() => { setShowClassDropdown(!showClassDropdown); setShowFromDropdown(false); setShowToDropdown(false); }}
          >
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <UserPlus className="w-3.5 h-3.5 text-sky-500" /> 
              {activeTab === 'hotels' ? 'Rooms & Guests' : activeTab === 'cabs' ? 'Cab Seating' : activeTab === 'flights' ? 'Rent Duration' : 'Travellers & Class'}
            </span>

            {activeTab === 'hotels' ? (
              <>
                <div className="text-lg font-extrabold text-slate-800">
                  {hotelRoomCount} room, {hotelGuestCount} guests
                </div>
                <div className="text-xs text-slate-500 truncate font-medium">Guests Count details</div>
              </>
            ) : activeTab === 'cabs' ? (
              <>
                <div className="text-lg font-extrabold text-slate-800">
                  Up to {cabCapacity} Seater
                </div>
                <div className="text-xs text-slate-500 truncate font-medium">Capacity parameters</div>
              </>
            ) : (
              <>
                <div className="text-lg font-extrabold text-slate-800">
                  {activeTab === 'flights' ? 'Rent Duration' : `${travellers} Traveler${travellers > 1 ? 's' : ''}`}
                </div>
                <div className="text-xs text-slate-500 truncate font-medium">
                  {activeTab === 'flights' ? (travelClass.includes('Rental') ? travelClass : '1 Day Rental') : travelClass}
                </div>
              </>
            )}

            {/* Custom Travel/Class dropdown container */}
            <AnimatePresence>
              {showClassDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {activeTab === 'hotels' ? (
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-sky-600 uppercase tracking-widest pb-1 border-b border-slate-100">Hotels Parameters</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800 text-sm block">Rooms</span>
                          <span className="text-[11px] text-slate-400">Total rooms required</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            id="btn-room-dec"
                            onClick={() => setHotelRoomCount(Math.max(1, hotelRoomCount - 1))}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm cursor-pointer"
                          >-</button>
                          <span className="font-bold w-4 text-center">{hotelRoomCount}</span>
                          <button 
                            id="btn-room-inc"
                            onClick={() => setHotelRoomCount(hotelRoomCount + 1)}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm cursor-pointer"
                          >+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800 text-sm block">Guests</span>
                          <span className="text-[11px] text-slate-400 font-medium">Adults & kids count</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            id="btn-guest-dec"
                            onClick={() => setHotelGuestCount(Math.max(1, hotelGuestCount - 1))}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm cursor-pointer"
                          >-</button>
                          <span className="font-bold w-4 text-center">{hotelGuestCount}</span>
                          <button 
                            id="btn-guest-inc"
                            onClick={() => setHotelGuestCount(hotelGuestCount + 1)}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm cursor-pointer"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  ) : activeTab === 'cabs' ? (
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-sky-600 uppercase tracking-widest pb-1 border-b border-slate-100">Seating Preference</div>
                      {[4, 6].map((cap) => (
                        <div 
                          key={`cap-${cap}`}
                          id={`cab-capacity-${cap}`}
                          onClick={() => { setCabCapacity(cap); setShowClassDropdown(false); }}
                          className={`p-2 hover:bg-sky-50 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${cabCapacity === cap ? 'bg-sky-50 font-bold' : ''}`}
                        >
                          <span className="text-slate-800 text-sm font-semibold">{cap} Passengers Cap</span>
                          {cabCapacity === cap && <span className="w-2 h-2 rounded-full bg-sky-500" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-55 pb-2">
                        <span className="font-bold text-slate-800 text-sm">Travellers</span>
                        <div className="flex items-center gap-2">
                          <button 
                            id="btn-traveller-dec"
                            onClick={() => setTravellers(Math.max(1, travellers - 1))}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm cursor-pointer"
                          >-</button>
                          <span className="font-bold w-4 text-center">{travellers}</span>
                          <button 
                            id="btn-traveller-inc"
                            onClick={() => setTravellers(travellers + 1)}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm cursor-pointer"
                          >+</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{activeTab === 'flights' ? 'Rental Period' : 'Travel Class'}</div>
                        {(activeTab === 'flights' 
                          ? ['1 Day Rental', '3 Days Rental', '5 Days Rental', '1 Week Rental'] 
                          : ['Economy', 'Premium Economy', 'Business Class', 'First Class']
                        ).map((cls) => (
                          <div 
                            key={cls}
                            id={`class-option-${cls.replace(' ', '-')}`}
                            onClick={() => { setTravelClass(cls); setShowClassDropdown(false); }}
                            className={`p-2 hover:bg-sky-50 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${travelClass === cls ? 'bg-sky-50 font-bold' : ''}`}
                          >
                            <span className="text-slate-800 text-xs font-medium">{cls}</span>
                            {travelClass === cls && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* SEARCH INITIATE ACTION */}
      <div className="mt-8 flex justify-center">
        <button
          id="search-button-action"
          onClick={onSearch}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-lg px-12 py-4 rounded-full shadow-xl shadow-orange-500/20 hover:scale-[1.03] active:scale-95 hover:shadow-orange-500/30 transition-all duration-300 transform cursor-pointer uppercase tracking-wide"
        >
          SEARCH {activeTab === 'flights' ? 'RENTALS' : activeTab.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
