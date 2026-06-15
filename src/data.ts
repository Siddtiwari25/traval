import { City, Flight, Hotel, Train, Cab, Coupon } from "./types";

export const CITIES: City[] = [
  { name: 'Delhi', code: 'DEL', airport: 'Indira Gandhi International Airport' },
  { name: 'Mumbai', code: 'BOM', airport: 'Chhatrapati Shivaji Maharaj Intl Airport' },
  { name: 'Bengaluru', code: 'BLR', airport: 'Kempegowda International Airport' },
  { name: 'Goa', code: 'GOI', airport: 'Dabolim Airport' },
  { name: 'Dubai', code: 'DXB', airport: 'Dubai International Airport' },
  { name: 'Singapore', code: 'SIN', airport: 'Changi Airport' },
  { name: 'London', code: 'LHR', airport: 'Heathrow Airport' },
];

export const FLIGHTS: Flight[] = [
  { id: 'f1', airline: 'IndiAir', logoCode: 'IA', flightNo: 'IA-302', fromTime: '06:00 AM', toTime: '08:15 AM', duration: '2h 15m', stops: 'Non Stop', price: 110 },
  { id: 'f2', airline: 'StarAirways', logoCode: 'SA', flightNo: 'SA-109', fromTime: '11:45 AM', toTime: '02:00 PM', duration: '2h 15m', stops: 'Non Stop', price: 125 },
  { id: 'f3', airline: 'VistaraFly', logoCode: 'VF', flightNo: 'VF-740', fromTime: '04:15 PM', toTime: '06:35 PM', duration: '2h 20m', stops: 'Non Stop', price: 140 },
  { id: 'f4', airline: 'ExpressFly', logoCode: 'EF', flightNo: 'EF-891', fromTime: '08:30 PM', toTime: '11:15 PM', duration: '2h 45m', stops: '1 Stop', price: 95 },
  { id: 'f5', airline: 'JetConnect', logoCode: 'JC', flightNo: 'JC-221', fromTime: '10:00 PM', toTime: '12:15 AM', duration: '2h 15m', stops: 'Non Stop', price: 105 },
];

export const HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'The Grand Taj Palace',
    rating: 4.8,
    location: 'Colaba, Mumbai',
    pricePerNight: 280,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
    amenities: ['Free WiFi', 'Infinity Pool', 'Luxury Spa', '24h Gym', 'Sea View']
  },
  {
    id: 'h2',
    name: 'Zuri Beach Resort & Villas',
    rating: 4.6,
    location: 'Calangute, Goa',
    pricePerNight: 160,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
    amenities: ['Private Beach', 'Cocktail Bar', 'Free Breakfast', 'Watersports', 'Eco-friendly']
  },
  {
    id: 'h3',
    name: 'Roseate House Tech-Metro',
    rating: 4.5,
    location: 'Aerocity, Delhi',
    pricePerNight: 195,
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=80',
    amenities: ['Free WiFi', 'Rooftop Bar', 'Business Lounge', 'Spa', 'Soundproof Rooms']
  },
  {
    id: 'h4',
    name: 'Marina Sands Bay Resort',
    rating: 4.9,
    location: 'Marina Bay, Singapore',
    pricePerNight: 450,
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80',
    amenities: ['Rooftop Pool', 'Casino Access', ' Michelin Star Dining', 'Full Butler Service']
  },
  {
    id: 'h5',
    name: 'The Oasis Hideaway',
    rating: 4.2,
    location: 'Downtown, Dubai',
    pricePerNight: 140,
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=400&q=80',
    amenities: ['Free Shuttle', 'Kids Club', 'Outdoor Pool', 'Middle Eastern Lounge']
  },
];

export const TRAINS: Train[] = [
  { id: 't1', name: 'Rajdhani Express', trainNo: '12952', fromTime: '04:55 PM', toTime: '08:35 AM', duration: '15h 40m', classes: ['1A', '2A', '3A'], price: 45 },
  { id: 't2', name: 'Duronto Express', trainNo: '12268', fromTime: '11:15 PM', toTime: '03:10 PM', duration: '15h 55m', classes: ['2A', '3A', 'SL'], price: 38 },
  { id: 't3', name: 'Shatabdi Pro-Express', trainNo: '12010', fromTime: '06:10 AM', toTime: '01:20 PM', duration: '7h 10m', classes: ['CC', 'EC'], price: 25 },
  { id: 't4', name: 'Tejas Premium Bullet', trainNo: '82902', fromTime: '03:40 PM', toTime: '09:55 PM', duration: '6h 15m', classes: ['EC', 'CC'], price: 32 },
];

export const CABS: Cab[] = [
  { id: 'c1', type: 'Economy Sedan', model: 'Suzuki Dzire', pricePerKm: 0.18, estimatedPrice: 28, rating: 4.6, capacity: 4 },
  { id: 'c2', type: 'Spacious SUV', model: 'Toyota Innova Crysta', pricePerKm: 0.28, estimatedPrice: 42, rating: 4.8, capacity: 6 },
  { id: 'c3', type: 'Premium Luxury', model: 'Mercedes C-Class', pricePerKm: 0.75, estimatedPrice: 110, rating: 4.9, capacity: 4 },
  { id: 'c4', type: 'Electric Green', model: 'Tata Nexon EV', pricePerKm: 0.22, estimatedPrice: 34, rating: 4.7, capacity: 4 },
];

export const COUPONS: Coupon[] = [
  {
    code: 'MMTSUPER',
    title: 'Up to 20% Off Flights',
    desc: 'Instant 15% discount on domestic flights, capping at $40 with selected credit card providers.',
    category: 'flights',
    discount: '15% Off',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=120&q=80'
  },
  {
    code: 'MMTLUXSTAY',
    title: 'Stay 3, Pay for 2 Nights',
    desc: 'Book select premium luxury suites and get your 3rd night entirely complimentary with direct room upgrades.',
    category: 'hotels',
    discount: 'Free Night',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=120&q=80'
  },
  {
    code: 'MMTINTELECT',
    title: 'Save $100 on International',
    desc: 'Get flat $100 off on international bookings value exceeding $500. Perfect for family getaways.',
    category: 'flights',
    discount: 'Flat $100 Off',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=120&q=80'
  },
];
