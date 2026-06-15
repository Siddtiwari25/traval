export interface City {
  name: string;
  code: string;
  airport: string;
}

export type TravelTab = 'flights' | 'hotels' | 'trains' | 'cabs';

export interface Booking {
  id: string;
  type: TravelTab;
  provider: string; // Airline, Hotel name, Train name/number, Cab operator
  routeDetails: string; // DEL -> BOM, Deluxe Room, Sleeper Class, etc.
  date: string;
  price: string;
  code?: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
}

export interface Flight {
  id: string;
  airline: string;
  logoCode: string;
  flightNo: string;
  fromTime: string;
  toTime: string;
  duration: string;
  stops: string;
  price: number;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number; // e.g. 4.5
  location: string;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
}

export interface Train {
  id: string;
  name: string;
  trainNo: string;
  fromTime: string;
  toTime: string;
  duration: string;
  classes: string[];
  price: number;
}

export interface Cab {
  id: string;
  type: string; // e.g., Sedan, SUV, Premium Hatchback
  model: string; // e.g., Toyota Innova, Dzire
  pricePerKm: number;
  estimatedPrice: number;
  rating: number;
  capacity: number;
}

export interface Coupon {
  code: string;
  title: string;
  desc: string;
  category: string;
  discount: string;
  imageUrl: string;
}

export interface AIItineraryActivity {
  time: string;
  title: string;
  description: string;
  cost: string;
  tip: string;
}

export interface AIItineraryDay {
  day: number;
  theme: string;
  activities: AIItineraryActivity[];
}

export interface AIItineraryResponse {
  destination: string;
  tagline: string;
  summary: string;
  estimatedBudget: string;
  highlights: string[];
  itinerary: AIItineraryDay[];
  error?: string;
}
