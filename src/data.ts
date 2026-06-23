import { City, Flight, Hotel, Train, Cab, Coupon } from "./types";

export const CITIES: City[] = [
  { name: 'Mukteshwar Town', code: 'MUK', hotels: 'Mohan Bazaar Main Stand' },
  { name: 'Bhatelia Office', code: 'BHT', hotels: 'Bhatelia-Mukteshwar Crossing Office' },
  { name: 'Bhimtal', code: 'BML', hotels: 'Bhimtal Lake Side Stand' },
  { name: 'Kainchi Dham', code: 'KCD', hotels: 'Neem Karoli Baba Ashram Gate' },
  { name: 'Nainital', code: 'NTL', hotels: 'Tallital Bus Station & Lake Yard' },
  { name: 'Sattal', code: 'STL', hotels: 'Sattal Lake Camping Ground' },
  { name: 'Almora & Kasar Devi', code: 'AKD', hotels: 'Kasar Devi Temple Ridge Stand' },
  { name: 'Haridwar', code: 'HW', hotels: 'Haridwar Railway Station / Ghats' },
  { name: 'Rishikesh', code: 'RK', hotels: 'Laxman Jhula & Tapovan Crossing' },
  { name: 'Dehradun', code: 'DDN', hotels: 'Jolly Grant Hotels / Town Center' },
  { name: 'Mussoorie', code: 'MSO', hotels: 'Library Chowk & Mall Road Stand' },
  { name: 'Dhanaulti', code: 'DHT', hotels: 'Eco Park Main Entrance' },
  { name: 'Lansdowne', code: 'LDN', hotels: 'Gandhi Chowk cantonment town' }
];

export const FLIGHTS: Flight[] = [
  { id: 'f1', airline: 'Honda Activa 6G', logoCode: 'COOT', flightNo: 'ACT-6G', fromTime: '08:00 AM', toTime: '08:00 PM', duration: '110cc Automatic', stops: 'Petrol (Self-Start)', price: 499 },
  { id: 'f2', airline: 'Royal Enfield Classic 350', logoCode: 'BIKE', flightNo: 'RE-350', fromTime: '09:00 AM', toTime: '09:00 PM', duration: '350cc Manual Gear', stops: 'Petrol (Royal Feel)', price: 599 },
  { id: 'f3', airline: 'Yamaha FZ-S FI', logoCode: 'BIKE', flightNo: 'YAM-149', fromTime: '08:00 AM', toTime: '08:00 PM', duration: '149cc Manual Gear', stops: 'Petrol (Fuel Injected)', price: 599 },
  { id: 'f4', airline: 'TVS Jupiter 125', logoCode: 'COOT', flightNo: 'JUP-125', fromTime: '08:30 AM', toTime: '08:30 PM', duration: '124cc Automatic', stops: 'Petrol (Eco Mode)', price: 499 },
  { id: 'f5', airline: 'Bajaj Avenger Cruise 220', logoCode: 'BIKE', flightNo: 'AVG-220', fromTime: '07:30 AM', toTime: '07:30 PM', duration: '220cc Manual Gear', stops: 'Petrol (Cruiser Bike)', price: 599 },
];

export const HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'The Mukteshwar Pine Resort',
    rating: 4.8,
    location: 'Bhatelia-Mukteshwar Rd, Mukteshwar',
    pricePerNight: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
    amenities: ['Free WiFi', 'Valley View Balcony', 'Local Organic Kitchen', '24h Hot Water', 'Bonfire Pit']
  },
  {
    id: 'h2',
    name: 'Mountain Crest Homestay',
    rating: 4.6,
    location: 'Mohan Bazaar Ridge, Mukteshwar',
    pricePerNight: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
    amenities: ['Himachali Fireplace', 'Traditional Kumaoni Meals', 'Free Breakfast', 'Himalaya Terrace']
  },
  {
    id: 'h3',
    name: 'Rudra Heights Wellness Lodge',
    rating: 4.5,
    location: 'Darima Orchards Side, Mukteshwar',
    pricePerNight: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=80',
    amenities: ['Free WiFi', 'Yoga Room', 'Apple Picking Orchard Tour', 'Organic Tea Bar', 'Soundproof Suite']
  },
  {
    id: 'h4',
    name: 'The Nanda Devi Dome Stay',
    rating: 4.9,
    location: 'Chauli Ki Jali Cliffs, Mukteshwar',
    pricePerNight: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80',
    amenities: ['360° Geodesic Skylight glass', 'Outdoor Deck', 'Gourmet Chef Diner', 'Luxury Bath Tub']
  },
  {
    id: 'h5',
    name: 'Devbhoomi Pine Chalets',
    rating: 4.2,
    location: 'Sargakhet Pine Ridge, Mukteshwar',
    pricePerNight: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=400&q=80',
    amenities: ['Free Valley Shuttle', 'Traditional Wood Chimney', 'Outdoor Grill Garden', 'Organic Apple Farm']
  },
];

export const TRAINS: Train[] = []; // Empty since train service and pickup is removed per instruction

export const CABS: Cab[] = [
  { id: 'c1', type: 'Economy Sedan', model: 'Suzuki Dzire', pricePerKm: 12, estimatedPrice: 1800, rating: 4.6, capacity: 4 },
  { id: 'c2', type: 'Spacious SUV', model: 'Toyota Innova Crysta', pricePerKm: 18, estimatedPrice: 3500, rating: 4.8, capacity: 6 },
  { id: 'c3', type: 'Premium Luxury Tourer', model: 'Mahindra Scorpio-N', pricePerKm: 22, estimatedPrice: 4800, rating: 4.9, capacity: 6 },
  { id: 'c4', type: 'Himalayan 4x4 Gypsy', model: 'Maruti Suzuki Gypsy', pricePerKm: 25, estimatedPrice: 4000, rating: 4.7, capacity: 4 },
];

export const COUPONS: Coupon[] = [
  {
    code: 'MMTSUPER',
    title: 'Up to 20% Off Rentals',
    desc: 'Instant 15% discount on eco scooty and cruiser bikes, capping at ₹350 with local pre-bookings.',
    category: 'flights',
    discount: '15% Off',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=120&q=80'
  },
  {
    code: 'MMTLUXSTAY',
    title: 'Stay 3, Pay for 2 Nights',
    desc: 'Book select custom pine-wood suites and enjoy your 3rd night entirely complimentary with native welcome drinks.',
    category: 'hotels',
    discount: 'Free Night',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=120&q=80'
  },
  {
    code: 'MMTINTELECT',
    title: 'Save ₹500 on Week Rentals',
    desc: 'Get flat ₹500 off on weekly bike hires exceeding ₹2,500 total value.',
    category: 'flights',
    discount: 'Flat ₹500 Off',
    imageUrl: 'https://images.unsplash.com/photo-1444492442247-4053ae6b0a29?auto=format&fit=crop&w=120&q=80'
  },
];
