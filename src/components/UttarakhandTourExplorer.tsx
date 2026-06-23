import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Briefcase, 
  Navigation, 
  Check, 
  Plus, 
  DollarSign, 
  Compass, 
  Flame, 
  Compass as CompassIcon, 
  Users, 
  Activity, 
  Timer, 
  Eye, 
  Info,
  ChevronRight,
  UserCheck,
  Undo,
  Camera,
  Heart,
  Upload,
  X,
  Share2,
  Trash2,
  Phone,
  Mail,
  RefreshCw
} from 'lucide-react';

// Coordinates defined as percentages (x, y) relative to a 100x100 coord grid for seamless scaling
interface MapPinLocation {
  id: string;
  name: string;
  x: number; // percentage coordinate on 100x100 canvas
  y: number; // percentage coordinate on 100x100 canvas
  description: string;
  altitude: string;
  highlight: string;
}

const PIN_LOCATIONS: Record<string, MapPinLocation> = {
  Dehradun: {
    id: 'Dehradun',
    name: 'Dehradun',
    x: 18,
    y: 52,
    description: 'Capital city nestled in the Doon Valley, gates to Mussoorie hills.',
    altitude: '450 meters',
    highlight: 'Daku Cave, Forest Research Institute'
  },
  Mussoorie: {
    id: 'Mussoorie',
    name: 'Mussoorie',
    x: 22,
    y: 40,
    description: 'The spectacular "Queen of Hills" with high falls and colonial mist.',
    altitude: '2,005 meters',
    highlight: 'Kempty Falls, Lal Tibba Scenic Crest'
  },
  Haridwar: {
    id: 'Haridwar',
    name: 'Haridwar',
    x: 20,
    y: 78,
    description: 'Gateway to God where the sacred holy river Ganga enters the plains.',
    altitude: '314 meters',
    highlight: 'Har Ki Pauri Evening Ganga Aarti'
  },
  Rishikesh: {
    id: 'Rishikesh',
    name: 'Rishikesh',
    x: 28,
    y: 70,
    description: 'The global Capital of Yoga, offering pristine adventure river rafting.',
    altitude: '372 meters',
    highlight: 'Lakshman Jhula, Beatles Hermitage Nest'
  },
  Kedarnath: {
    id: 'Kedarnath',
    name: 'Kedarnath',
    x: 52,
    y: 28,
    description: 'Majestic ancient Shiva temple set against massive snow fields.',
    altitude: '3,583 meters',
    highlight: 'Centuries old Jyotirlinga, Peak Glacier Trek'
  },
  Badrinath: {
    id: 'Badrinath',
    name: 'Badrinath',
    x: 64,
    y: 32,
    description: 'Spiritual sanctuary flanked on all sides by Nar & Narayan ranges.',
    altitude: '3,300 meters',
    highlight: 'Tapt Kund Sulphur Springs, Neelkanth Overlook'
  },
  Auli: {
    id: 'Auli',
    name: 'Auli',
    x: 58,
    y: 45,
    description: 'India\'s premier skiing meadow surrounded by high-altitude peak views.',
    altitude: '2,800 meters',
    highlight: 'Gondola Cable Chairlift, Gurso Bugyal trekking'
  },
  'Valley of Flowers': {
    id: 'Valley of Flowers',
    name: 'Valley of Flowers',
    x: 72,
    y: 28,
    description: 'UNESCO heritage alpine valley home to rare orchids, poppies, and leopards.',
    altitude: '3,658 meters',
    highlight: 'River Pushpawati walks, thousands of unique blooms'
  },
  'Jim Corbett': {
    id: 'Jim Corbett',
    name: 'Jim Corbett',
    x: 48,
    y: 86,
    description: 'Legendary ecotourism resort and birthplace of Project Tiger safaris.',
    altitude: '400 meters',
    highlight: 'Dhikala zone night stays, Bengal Tiger spotting'
  },
  Nainital: {
    id: 'Nainital',
    name: 'Nainital',
    x: 62,
    y: 80,
    description: 'Kumaon\'s shimmering pear-shaped lake district surrounded by lush oaks.',
    altitude: '2,084 meters',
    highlight: 'Naini Lake boating, astronomical Observatory'
  },
  Chopta: {
    id: 'Chopta',
    name: 'Chopta',
    x: 44,
    y: 52,
    description: 'A serene hamlet known as the "Mini Switzerland of Uttarakhand" with scenic evergreen meadows.',
    altitude: '2,680 meters',
    highlight: 'Tungnath Temple Hike, Chandrashila Peak'
  },
  Guptkashi: {
    id: 'Guptkashi',
    name: 'Guptkashi',
    x: 43,
    y: 44,
    description: 'A holy town overlooking the beautiful Mandakini river valley.',
    altitude: '1,319 meters',
    highlight: 'Vishwanath Temple, Manikarnika Kund'
  },
  Phata: {
    id: 'Phata',
    name: 'Phata',
    x: 46,
    y: 38,
    description: 'Action-packed valley strip boasting helipads for Kedarnath temple shuttles.',
    altitude: '1,500 meters',
    highlight: 'Scenic Helicopter Rides, Mountain Gorges'
  },
  Sitapur: {
    id: 'Sitapur',
    name: 'Sitapur',
    x: 49,
    y: 34,
    description: 'A base staging hamlet situated right next to Sonprayag along the river rapids.',
    altitude: '1,650 meters',
    highlight: 'Gaurikund trail start point, River side walks'
  },
  Bhimtal: {
    id: 'Bhimtal',
    name: 'Bhimtal',
    x: 68,
    y: 84,
    description: 'An idyllic lake town centered around a massive islet lake matching Nainital\'s charm.',
    altitude: '1,370 meters',
    highlight: 'Lake Island aquarium, Kainchi Dham Ashram'
  },
  Joshimath: {
    id: 'Joshimath',
    name: 'Joshimath',
    x: 58,
    y: 38,
    description: 'Winter seat of Badrinath established by Adi Shankaracharya in high hills.',
    altitude: '1,875 meters',
    highlight: 'Narsingh Temple, Ropeway terminal to Auli'
  },
  Rudraprayag: {
    id: 'Rudraprayag',
    name: 'Rudraprayag',
    x: 39,
    y: 56,
    description: 'Sovereign holy confluence where Alaknanda and Mandakini rivers crash and merge.',
    altitude: '895 meters',
    highlight: 'Koteshwar Mahadev Cave temple'
  }
};

// Permanent regional connecting highway lines for the background topology layer
const REGIONAL_CONNECTIONS = [
  { from: 'Dehradun', to: 'Mussoorie' },
  { from: 'Dehradun', to: 'Haridwar' },
  { from: 'Haridwar', to: 'Rishikesh' },
  { from: 'Rishikesh', to: 'Kedarnath' },
  { from: 'Kedarnath', to: 'Badrinath' },
  { from: 'Badrinath', to: 'Valley of Flowers' },
  { from: 'Badrinath', to: 'Auli' },
  { from: 'Auli', to: 'Rishikesh' },
  { from: 'Rishikesh', to: 'Jim Corbett' },
  { from: 'Jim Corbett', to: 'Nainital' },
  { from: 'Haridwar', to: 'Jim Corbett' },
  { from: 'Rishikesh', to: 'Chopta' },
  { from: 'Chopta', to: 'Kedarnath' }
];

interface ItineraryItem {
  day: string;
  title: string;
  text: string;
  stop: string; // Associated city stop for interactive map bindings
}

export interface PredefinedTour {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  duration: string;
  pricePerPerson: number;
  stops: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  highlights: string[];
  itinerary: ItineraryItem[];
  image?: string;
  popularity?: number;
}

const TOUR_POPULARITY: Record<string, number> = {
  'tour-chardham': 99,
  'tour-kainchi-dham': 98,
  'tour-rishikesh': 96,
  'tour-nainital': 95,
  'tour-mussoorie': 94,
  'tour-jim-corbett': 92,
  'tour-haridwar': 90,
  'tour-auli': 88,
  'tour-valley-of-flowers': 87,
  'tour-chopta': 85,
  'tour-mukteshwar': 82,
  'tour-kausani': 80,
  'tour-ranikhet': 78,
  'tour-almora': 75,
  'tour-lansdowne': 72,
  'tour-munsiyari': 70,
  'tour-hemkund': 68,
  'tour-adi-kailash': 65,
  'tour-haridwar-rishikesh-mussoorie': 91,
  'tour-rishikesh-rafting-2n': 89,
  'tour-kedarnath-pilgrimage-3n': 97,
  'tour-nainital-delhi-bestseller': 93,
  'tour-corbett-getaway-weekend': 86,
  'tour-kedarnath-phata-3n': 94,
  'tour-magical-mussoorie-3d': 88,
  'tour-nainital-ex-delhi-2n': 86,
  'tour-kholi-dehradun-homestay': 83,
  'tour-kedarnath-dham-yatra-trek': 95,
  'tour-heal-farm-sattal': 81,
  'tour-chopta-tungnath-trek': 87,
  'tour-kedarnath-pilgrimage-haridwar': 96,
  'tour-nainital-bhimtal': 92,
  'tour-kedarnath-phata-yatra': 94,
  'tour-badrinath-haridwar': 93,
  'tour-mussoorie-queen-hills': 91,
  'tour-auli-chopta-cable-car': 95
};

export const UTTARAKHAND_TOURS: PredefinedTour[] = [
  {
    id: 'tour-kainchi-dham',
    name: 'Kainchi Dham Neem Karoli Baba Tour',
    subtitle: 'Journey of Devotion & Sacred Tranquility',
    badge: 'Spiritual Darshan',
    duration: '2 Days',
    pricePerPerson: 4500,
    stops: ['Haridwar', 'Nainital'],
    difficulty: 'Easy',
    description: 'Seek blessings at the famous Kainchi Dham Ashram of Neem Karoli Baba, a spiritual sanctuary loved by global leaders and seekers alike.',
    highlights: [
      'Attend peaceful morning prayer services at Kainchi Dham Ashram',
      'Meditate by the quiet waters of Kshipra River stream',
      'Receive warm blessed prasad of the ashram',
      'Scenic forest drive through lush pine woods'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Forest Drive', text: 'Arrive at the base, drive through beautiful pine-wood slopes to Nainital foothill station.', stop: 'Nainital' },
      { day: 'Day 2', title: 'Kainchi Dham Divine Darshan', text: 'Visit Neem Karoli Baba Ashram, sit by the river stream, feel deep spiritual solace, and accept holy prasad before the return journey.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-nainital',
    name: 'Scenic Nainital & Lake District Escape',
    subtitle: 'Emerald Boating, Sunsets & Pine-wood walks',
    badge: 'Leisure Lakefront',
    duration: '3 Days',
    pricePerPerson: 7500,
    stops: ['Nainital'],
    difficulty: 'Easy',
    description: 'Relax next to the shimmering pear-shaped Naini Lake, explore beautiful wood paths, and ride panoramic cable cars.',
    highlights: [
      'Boating along the emerald Naini Lake',
      'Enjoy spectacular views of Nanda Devi from Snow View point',
      'Strolls through Mall Road and Tibetan Market',
      'Sunset hike to scenic Tiffin Top cliffs'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Lakefront Stroll', text: 'Check in, walk across Nainital Mall Road, and enjoy a traditional sailboat ride under the evening breeze.', stop: 'Nainital' },
      { day: 'Day 2', title: 'Mountain View Cable Ride', text: 'Board the aerial gondola to Snow View peak to capture the mighty Himalayan wall.', stop: 'Nainital' },
      { day: 'Day 3', title: 'Tiffin Top Sunrise', text: 'Witness spectacular mountain sunrise from Dorothy Seat before departure.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-chardham',
    name: 'Sacred Char Dham Yatra Pilgrimage',
    subtitle: 'The Ultimate Spiritual Journey of a Lifetime',
    badge: 'Divine Pilgrimage',
    duration: '10 Days',
    pricePerPerson: 28000,
    stops: ['Haridwar', 'Rishikesh', 'Kedarnath', 'Badrinath'],
    difficulty: 'Hard',
    description: 'An auspicious journey spanning the four holiest shrines: Yamunotri, Gangotri, Kedarnath, and Badrinath. Deeply wash away life worries.',
    highlights: [
      'Bespoke VIP puja arrangement at Kedarnath and Badrinath temples',
      'Dip in the sacred mineral-rich sulfuric Tapt Kund springs',
      'Beautiful sunrise and sunset prayers in pristine settings',
      'All inclusive stays, nutritious sattvik meals, and expert guides'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Aarti Haridwar Welcome', text: 'Assemble in Haridwar, witness beautiful floating oil lamps at Har Ki Pauri ghat.', stop: 'Haridwar' },
      { day: 'Day 2-3', title: 'Yamunotri & Gangotri Valleys', text: 'Drive to sacred rivers and hot springs, offering deep prayers.', stop: 'Rishikesh' },
      { day: 'Day 4-6', title: 'Kedarnath Valley Trek', text: 'Embark on the 16km majestic trek or fly by helicopter up to Lord Shiva sacred temple.', stop: 'Kedarnath' },
      { day: 'Day 7-8', title: 'Holy Badrinath Altar', text: 'Cross rivers to reach the high Badrinath deity nestled at Nilkantha mountain foot.', stop: 'Badrinath' },
      { day: 'Day 9-10', title: 'Rishikesh Confluence return', text: 'Descend through Devprayag water junction back to Haridwar with prasad.', stop: 'Rishikesh' }
    ]
  },
  {
    id: 'tour-haridwar',
    name: 'Spiritual Haridwar Gateway Tour',
    subtitle: 'Holy River Cleansing Dip & Ancient Rituals',
    badge: 'Spiritual Plains',
    duration: '2 Days',
    pricePerPerson: 3500,
    stops: ['Haridwar'],
    difficulty: 'Easy',
    description: 'Visit the gateway of Gods. Experience pure spirituality on the shores of the Ganges and pray during the iconic river aarti.',
    highlights: [
      'Prime seats for Ganga Aarti at Har Ki Pauri ghat',
      'Ride the high Mansa Devi ropeway to hilltop shrines',
      'Local market heritage sweet-tasting tour',
      'Cleansing holy dip in clean designated canal bays'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Ganga Ceremony', text: 'Arrive in Haridwar, browse local Vedic stores, enjoy delicious Kadhai milk and pedas, then sit for Ganga prayers.', stop: 'Haridwar' },
      { day: 'Day 2', title: 'Ropeway Temple Sights', text: 'Glide up Mansa Devi temple hills, capturing the full aerial scene of the plains before return.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-rishikesh',
    name: 'Rishikesh Yoga & White-Water Rapids',
    subtitle: 'Capital of Yoga, River Camping & Thrills',
    badge: 'Yoga & Adventure',
    duration: '3 Days',
    pricePerPerson: 4800,
    stops: ['Rishikesh'],
    difficulty: 'Medium',
    description: 'Balance your body and soul. Indulge in exhilarating river rafting over wild rapids and heal yourself with riverside meditations.',
    highlights: [
      'Exciting 16km rafting down grade III/IV rapids of Ganges',
      'Riverside beach camping with overnight stargazing & bonfire',
      'Hone yoga stances under certified local master guides',
      'Soothe your soul at the historic Beatles Ashram'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Ashram Solace & Aarti', text: 'Check into riverside camp, explore Beatles hermitage site, and join peaceful sand-side chants.', stop: 'Rishikesh' },
      { day: 'Day 2', title: 'Roaring River Thrills', text: 'Raft down cold glacier rapids, jump from cliffs, and savor beach hot meals by a bonfire.', stop: 'Rishikesh' },
      { day: 'Day 3', title: 'Sunrise Hatha Yoga', text: 'Breathe deep in a morning pranayama session prior to departure.', stop: 'Rishikesh' }
    ]
  },
  {
    id: 'tour-jim-corbett',
    name: 'Jim Corbett National Park Wild Safari',
    subtitle: 'Track Majestic Bengal Tigers in Foothill Forests',
    badge: 'Wildlife Forest',
    duration: '3 Days',
    pricePerPerson: 8200,
    stops: ['Jim Corbett'],
    difficulty: 'Easy',
    description: 'Venture inside India oldest national park. Glide across sal forests, watch elephants, and trace secret spots of tigers.',
    highlights: [
      'Morning and afternoon jeep safaris into Corbett core zones',
      'Overnight stay in wood-framed forest riverside resorts',
      'Acoustic evening live folk gather with local naturalists',
      'Guided birdwatching tours by Ramganga reservoir'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Jungle Foothill Stays', text: 'Arrive at the forest buffer zone, check-in to quiet luxury lodges, and listen to night forest bird calls.', stop: 'Jim Corbett' },
      { day: 'Day 2', title: 'Dawn Tiger Safari', text: 'Set out at 5:30 AM on a 4x4 open safari gypsy searching for the hidden Bengal Tiger.', stop: 'Jim Corbett' },
      { day: 'Day 3', title: 'Garjia Temple Walk', text: 'Walk ancient rocky forest tracks up to Garjia shrine nested on a boulder by Koshi river.', stop: 'Jim Corbett' }
    ]
  },
  {
    id: 'tour-mukteshwar',
    name: 'Mukteshwar Dham Tranquil Ridge Tour',
    subtitle: 'Vast Snowy peaks, Apple Orchards & Rock Cliffs',
    badge: 'Misty Solitude',
    duration: '3 Days',
    pricePerPerson: 6500,
    stops: ['Nainital'],
    difficulty: 'Easy',
    description: 'Explore the 350-year-old temple of Lord Shiva and see spectacular views of the wide Himalayan high peaks.',
    highlights: [
      'Walk to Mukteshwar Dham and see the beautiful mountain cliffs',
      'Scenic photography at Chauli-ki-Jali rock projections',
      'Explore local fruit orchards brimming with juicy plums, apples and peaches',
      'Cozy fireplace dining inside high mountain stone retreats'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Quiet Pine Woods Drive', text: 'Scenic drive to Mukteshwar ridge, sipping local fruit juices on arrival.', stop: 'Nainital' },
      { day: 'Day 2', title: 'Cliffs & Mukteshwar Shrine', text: 'Offer prayers at Mukteshwar Dham temple, then watch adventure climbing on Chauli ki Jali cliffs.', stop: 'Nainital' },
      { day: 'Day 3', title: 'Local Orchard Walk & return', text: 'Stroll through organic farms, hand-pluck mountain apples, and depart.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-almora',
    name: 'Almora Heritage & Cultural Loop',
    subtitle: 'Brighten Your Mind with Ancient Kumaoni Craft',
    badge: 'Cultural Heritage',
    duration: '3 Days',
    pricePerPerson: 5800,
    stops: ['Nainital'],
    difficulty: 'Easy',
    description: 'Unwind in the cultural heart of Kumaon. Walk unique cobblestone markets, witness traditional weaver villages, and taste local sweets.',
    highlights: [
      'Wander through the historic 200-year-old Almora Lal Bazaar',
      'Indulge in authentic Bal Mithai and Singori chocolates',
      'Visit the unique cosmic magnetic fields of Kasar Devi Temple',
      'Guided walks around traditional coppersmith lanes'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Cobblestone Markets', text: 'Arrive and check in to heritage stay. Walk Almora streets and savor traditional Bal Mithai sweets coated in sugar.', stop: 'Nainital' },
      { day: 'Day 2', title: 'Kasar Devi Cosmic Peak', text: 'Meditate at Kasar Devi, a pine peak with high magnetic energy loved by Swami Vivekananda.', stop: 'Nainital' },
      { day: 'Day 3', title: 'Bright End Corner sunset', text: 'Watch a striking panoramic sunset casting orange light across snowy peaks.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-ranikhet',
    name: 'Ranikhet Meadows & Pine Woods',
    subtitle: 'Quiet Orchid Gardens & Golf Course Ridges',
    badge: 'Quiet Meadows',
    duration: '3 Days',
    pricePerPerson: 6200,
    stops: ['Nainital'],
    difficulty: 'Easy',
    description: 'A soothing escape to a quiet cantonment town. Walk lush greens, visit apple orchards, and capture high snow-clad mountain vistas.',
    highlights: [
      'Stroll across the beautiful Ranikhet Golf Course',
      'Tour of the legendary Kumaon Regiment museum and war memorials',
      'See beautiful orchards at Chaubatia Gardens',
      'Quiet mountain hikes among towering cedar forests'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Pine Wood strolls', text: 'Cottage check-in, peaceful walks in the pine and cedar woods.', stop: 'Nainital' },
      { day: 'Day 2', title: 'Golf Links & Museum', text: 'Play golf on the high rolling greens, explore army hero histories, and visit holy Jhula Devi temple.', stop: 'Nainital' },
      { day: 'Day 3', title: 'Chaubatia Apple orchards', text: 'Inspect local honey farms and pick ripe fruits prior to departure.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-kausani',
    name: 'Kausani - Switzerland of India',
    subtitle: 'Breathtaking 300km view of Himalayan Range',
    badge: 'Scenics Peak',
    duration: '3 Days',
    pricePerPerson: 6900,
    stops: ['Nainital'],
    difficulty: 'Easy',
    description: 'Experience what Mahatma Gandhi called the Switzerland of India. Rest on high pine terraces looking directly at Trishul and Nanda Devi.',
    highlights: [
      'Witness stunning wide sunset colors over snow peaks',
      'Tour of local aromatic Kausani Tea Gardens',
      'Peaceful walk inside Anasakti Ashram, where Gandhi wrote books',
      'Explore local handloom shawl weaving centers'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Anasakti Stillness', text: 'Walk up to Anasakti Ashram, watch mountain sunset, and listen to calming prayers.', stop: 'Nainital' },
      { day: 'Day 2', title: 'Tea Gardens & Valley Trek', text: 'Tour tea estates, taste organic green tea, and learn traditional shawl weaving.', stop: 'Nainital' },
      { day: 'Day 3', title: 'Sunrise Mountain Glow', text: 'Capture the peak gold beam on Panchachuli mountains before heading home.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-mussoorie',
    name: 'Misty Mussoorie Queen of Hills',
    subtitle: 'Suspension Cascades, Ropeways & Mall Road Walks',
    badge: 'Leisure Hills',
    duration: '3 Days',
    pricePerPerson: 6800,
    stops: ['Dehradun', 'Mussoorie'],
    difficulty: 'Easy',
    description: 'Unwind in the majestic hills of Garhwal. Taste fine bakeries of Landour, walk mist covered paths, and feel cool mountain spray.',
    highlights: [
      'Plunge in cold mountain cascades of Kempty Falls',
      'Taste amazing apple pies at historical Landour bakeries',
      'Walk dense oak forests of Lal Tibba peaks',
      'Shop at the energetic Mall Road bazaar'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Robber Cave Foothills', text: 'Stop by Dehradun water channels and climb up to Mussoorie mist.', stop: 'Dehradun' },
      { day: 'Day 2', title: 'Landour Bakery & Sunsets', text: 'Dine in Landour, hike forest trails, and view Himalayan peaks from Lal Tibba.', stop: 'Mussoorie' },
      { day: 'Day 3', title: 'Kempty Cascades Splash', text: 'Splash in refreshing falls before driving back to the plains.', stop: 'Mussoorie' }
    ]
  },
  {
    id: 'tour-munsiyari',
    name: 'Munsyari Himalayan Wilderness Adventure',
    subtitle: 'Gateway to Pristine Panchachuli Glaciers',
    badge: 'Extreme Alpine',
    duration: '5 Days',
    pricePerPerson: 12500,
    stops: ['Nainital'],
    difficulty: 'Hard',
    description: 'Venture deep into Kumaon high edges. Experience unmatched alpine serenity near huge glaciers and roaring waterfalls.',
    highlights: [
      'Stunning close views of the five peaks of Panchachuli',
      'Moderate trek to mysterious high altitude Mesar Kund lake',
      'Guided photography around Birthi Falls cascade',
      'Stay in heritage Johar tribe shepherd villages'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Birthi Water Falls', text: 'Drive to Munsyari, pause at the giant 400ft Birthi Falls casting cold water spray.', stop: 'Nainital' },
      { day: 'Day 2-3', title: 'Panchachuli Majestic Sights', text: 'Explore pristine Johar valley and trek up to scenic views facing icy peaks.', stop: 'Nainital' },
      { day: 'Day 4', title: 'Mesar Kund Trek', text: 'Hike pristine oak forests containing rich mountain birds to a hidden sacred pond.', stop: 'Nainital' },
      { day: 'Day 5', title: 'Valley Descent', text: 'Return from high borders with lovely woolen carpets made by native weavers.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-adi-kailash',
    name: 'Adi Kailash & Om Parvat Sacred Yatra',
    subtitle: 'Holy Inner Himalayan Ridge Pilgrimage',
    badge: 'Epic Pilgrimage',
    duration: '8 Days',
    pricePerPerson: 35000,
    stops: ['Haridwar', 'Badrinath'],
    difficulty: 'Hard',
    description: 'A powerful spiritual journey to the sacred Om Parvat, where snow naturally creates the holy "OM" symbol on mountain rock.',
    highlights: [
      'Behold the mystical snow-formed OM symbol on Om Parvat',
      'Holy dip in the pristine high altitude Gauri Kund lake',
      'Inner-Line permit support and custom 4x4 mountain vehicles',
      'Spiritual prayers led by local Vedic priests'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Mountain Road Launch', text: 'Briefing and permit validation prior to setting off into the high valleys.', stop: 'Haridwar' },
      { day: 'Day 2-3', title: 'Pithoragarh Gorges', text: 'Traverse roaring river gorges in high stability private 4x4 vehicles.', stop: 'Haridwar' },
      { day: 'Day 4-5', title: 'Beholding Adi Kailash', text: 'Stand before the holy peak, looking at its reflection in reflective lakes.', stop: 'Badrinath' },
      { day: 'Day 6-7', title: 'The Om Parvat Miracle', text: 'Offer morning prayers facing the wonderful sacred snow script.', stop: 'Badrinath' },
      { day: 'Day 8', title: 'Valleys return', text: 'Descend along spectacular pine fields back to base camp.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-auli',
    name: 'Auli Skiing & Alpine Meadows',
    subtitle: 'Ride High Aerial Gondolas & Ski Powder Snow',
    badge: 'Ski Snowboard',
    duration: '4 Days',
    pricePerPerson: 11000,
    stops: ['Rishikesh', 'Auli'],
    difficulty: 'Medium',
    description: 'Unleash your winter spirit. Board the longest ropeway in India and ski down beautiful snow fields backdropped by Nanda Devi.',
    highlights: [
      'Scenic ride on Asia\'s longest cable car ropeway',
      'One on one lessons with certified winter skiing guides',
      'Breathtaking close up views of high peak snow walls',
      'Chai next to high altitude synthetic lake shores'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Joshimath Foothill', text: 'Arrive at the base, ride up through dense oak forests to cold Auli ridge.', stop: 'Rishikesh' },
      { day: 'Day 2-3', title: 'Ski Slope Training', text: 'Rent professional skis, slide down deep powder pistes, and learn techniques.', stop: 'Auli' },
      { day: 'Day 4', title: 'High Lake Sunrise', text: 'Capture pristine blue waters reflecting snow peaks before departing.', stop: 'Auli' }
    ]
  },
  {
    id: 'tour-valley-of-flowers',
    name: 'Valley of Flowers UNESCO Biosphere',
    subtitle: 'Trek inside thousands of Wild Alpine Blooms',
    badge: 'UNESCO Heritage',
    duration: '4 Days',
    pricePerPerson: 9500,
    stops: ['Rishikesh', 'Valley of Flowers'],
    difficulty: 'Hard',
    description: 'Walk across a fairytale valley blooming with rare Himalayan blue poppies, red lilies, and high altitude rivers.',
    highlights: [
      'Scenic walks inside the protected biosphere reserve',
      'Spot beautiful high altitude mountain flowers',
      'Cross pristine mountain streams on rustic logs',
      'Stay in comforting local eco cottages'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Mountain River Drive', text: 'Scenic drive along rushing confluences to high base camps.', stop: 'Rishikesh' },
      { day: 'Day 2-3', title: 'Glorious Blooms Hike', text: 'Wander deep inside the UNESCO floral sanctuary, capturing majestic fields.', stop: 'Valley of Flowers' },
      { day: 'Day 4', title: 'Gorge return', text: 'Hike back downstream with fresh memory logs of spectacular petals.', stop: 'Rishikesh' }
    ]
  },
  {
    id: 'tour-chopta',
    name: 'Chopta Tungnath Mini Switzerland Trek',
    subtitle: 'Hike up to the highest Shiva Temple in the World',
    badge: 'Active Trek',
    duration: '4 Days',
    pricePerPerson: 7800,
    stops: ['Rishikesh', 'Kedarnath'],
    difficulty: 'Medium',
    description: 'Discover lush meadows named Chopta Bugyal and hike up to Tungnath temple, perched at more than 12,000 feet height.',
    highlights: [
      'Walk to Tungnath, the highest Shiva temple on earth',
      'Reach Chandrashila Peak for standard 360° Himalayan panoramas',
      'Camp inside lush meadows under starry sky views',
      'Observe gorgeous high altitude birds like Monal'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Chopta Green Meadows', text: 'Arrive at Chopta, check in to geodesic domes nested on emerald grass.', stop: 'Rishikesh' },
      { day: 'Day 2-3', title: 'Tungnath & Chandrashila Peak', text: 'Climb stone mountain trails to the ancient temple, continuing to the breezy highest peak ridge.', stop: 'Kedarnath' },
      { day: 'Day 4', title: 'Monal Trails return', text: 'Walk lush rhododendron paths capturing red monal birds before departure.', stop: 'Rishikesh' }
    ]
  },
  {
    id: 'tour-hemkund',
    name: 'Sacred Hemkund Sahib Yatra',
    subtitle: 'Pristine Starry Lake & High Sikh Gurudwara',
    badge: 'Devout Trail',
    duration: '4 Days',
    pricePerPerson: 8800,
    stops: ['Rishikesh', 'Badrinath'],
    difficulty: 'Hard',
    description: 'Embark on a devout hike up to Hemkund Sahib Gurudwara, next to a pristine high altitude lake surrounded by seven snow peaks.',
    highlights: [
      'Take holy prayers at the highest Sikh Gurudwara on earth',
      'Sit beside the crystalline Hemkund lake reflecting snow peaks',
      'Taste blessed hot Prasad and nourishing lentil soup',
      'Ascend through forests of blossoming birch and pine'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Base assembly', text: 'Drive riverside canyons to Ghangaria base, checking safety stats.', stop: 'Rishikesh' },
      { day: 'Day 2-3', title: 'Ascending Hemkund', text: 'Trek up stone path lanes. Reach the spectacular holy lake surrounded by glaciers.', stop: 'Badrinath' },
      { day: 'Day 4', title: 'Downstream trek', text: 'Hike back down with spiritual clarity and sweet prasad memory logs.', stop: 'Rishikesh' }
    ]
  },
  {
    id: 'tour-lansdowne',
    name: 'Quiet Lansdowne Colonial Escape',
    subtitle: 'Peaceful Pine Hills, Old Churches & Lakes',
    badge: 'Relax Loop',
    duration: '3 Days',
    pricePerPerson: 5500,
    stops: ['Haridwar'],
    difficulty: 'Easy',
    description: 'A serene cantonment town established by the British. Enjoy pine breezes, pleasant water boating, and nostalgic heritage walks.',
    highlights: [
      'Relax in the quiet pine-wood lanes of Lansdowne',
      'Boating along high altitude Bhulla Lake pond',
      'Tours of historical St. John church and museum sites',
      'Panoramic sunset walks around Tip-in-Top ridges'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Heritage Pines', text: 'Check in to cozy pine resort. Take walks through oak woods looking at wild iris.', stop: 'Haridwar' },
      { day: 'Day 2', title: 'Tip-In-Top Sunset View', text: 'See marvelous snow peaks, explore British era stone churches, and boat at Bhulla Lake.', stop: 'Haridwar' },
      { day: 'Day 3', title: 'War History and Return', text: 'Tour military history museums prior to journey back to plains.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-haridwar-rishikesh-mussoorie',
    name: '3N/4D Haridwar, Rishikesh & Mussoorie Tour',
    subtitle: 'Rishikesh (1N) → Mussoorie (2N)',
    badge: 'Popular Hills',
    duration: '4 Days',
    pricePerPerson: 8999,
    stops: ['Haridwar', 'Rishikesh', 'Mussoorie'],
    difficulty: 'Medium',
    description: 'Explore India\'s spiritual holy lands in Haridwar and Rishikesh before relaxing in the misty colonial "Queen of Hills" Mussoorie with breathtaking views.',
    highlights: [
      'Chandi Devi, Mansa Devi Temple, and Har Ki Pauri Ganga Aarti',
      'Triveni Ghat, Ram Jhula, and Laxman Jhula sightseeing in Rishikesh',
      'Forest Research Institute, Tapkeshwar Temple, and Robber\'s Cave in Dehradun',
      'Kempty Falls, Gun Hill, Camel\'s Back Road, and Mall Road in Mussoorie'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrive at Haridwar - Rishikesh', text: 'Explore Haridwar\'s well-known sites, including Chandi Devi Temple, Mansa Devi Temple, and Har Ki Pauri. Proceed to Rishikesh and visit Triveni Ghat, Ram Jhula, and Laxman Jhula. Watch the Ganga Aarti at Triveni Ghat in the evening before checking into your accommodation for the night in Rishikesh. Overnight stay in Rishikesh.', stop: 'Rishikesh' },
      { day: 'Day 2', title: 'Rishikesh - Mussoorie', text: 'Visit Dehradun and explore attractions such as the Forest Research Institute, Tapkeshwar Temple, Sahastradhara, and Robber\'s Cave. Continue your journey to Mussoorie and check into your accommodation. Spend the evening relaxing in Mussoorie. Enjoy an overnight stay in Mussoorie.', stop: 'Mussoorie' },
      { day: 'Day 3', title: 'Mussoorie Sightseeing', text: 'For shopping and relaxation, visit Kempty Falls, Gun Hill, Camel\'s Back Road, Company Garden, and Mall Road. In the evening, return to your hotel and unwind. Enjoy an overnight stay in Mussoorie.', stop: 'Mussoorie' },
      { day: 'Day 4', title: 'Departure', text: 'You will be dropped off at your chosen location or train station upon arrival. You will take beautiful memories of your journey with you.', stop: 'Dehradun' }
    ]
  },
  {
    id: 'tour-rishikesh-rafting-2n',
    name: 'Rishikesh Rafting Adventure Package',
    subtitle: 'Rishikesh (2N) River Camping',
    badge: 'Rafting Special',
    duration: '3 Days',
    pricePerPerson: 4500,
    stops: ['Rishikesh'],
    difficulty: 'Medium',
    description: 'Enjoy high-adrenaline white-water rafting, serene jungle camping, adventure sports, bonfires, and birdwatching on the pristine banks of the Ganges.',
    highlights: [
      'Action-packed Grade II White Water Rafting from Shivpuri to NIM beach',
      'Overnight jungle camp stay with evening bonfires and buffet meals',
      'Adrenaline sports: Rappelling, cliff jumping, kayaking & beach volleyball',
      'Scenic forest nature hikes and native wilderness birdwatching'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrive at the Camp', text: 'Arrive at the road of the rafting point at Shivpuri by 10:00 AM. After a brief briefing, commence rafting from Shivpuri to NIM beach. Packed lunch is served upon completion. At 2:00 PM, head to the camp via a 30-minute hike. Enjoy warm welcome tea, camp registration, tent allotment, bonfire with snacks, and dinner.', stop: 'Rishikesh' },
      { day: 'Day 2', title: 'Adventure Camp Activities', text: 'Post breakfast, indulge in various adventure activities and sports, such as rappelling, cliff jumping, swimming in the river, kayaking, and playing beach volleyball. Dinner is served under the stars with live bonfire music vibes.', stop: 'Rishikesh' },
      { day: 'Day 3', title: 'White Water Rafting & Departure', text: 'Bids adieu to the camp. Commences recommended rafting stretch from Camp to Shivpuri which saves time and is highly hassle-free, spotting beautiful native birds and facing rapids. Shift into dry clothes prior to departure.', stop: 'Rishikesh' }
    ]
  },
  {
    id: 'tour-kedarnath-pilgrimage-3n',
    name: 'Kedarnath Pilgrimage Tour 4D/3N',
    subtitle: 'Guptkashi (2N) → Kedarnath (1N)',
    badge: 'Spiritual Yatra',
    duration: '4 Days',
    pricePerPerson: 7500,
    stops: ['Haridwar', 'Rishikesh', 'Kedarnath'],
    difficulty: 'Hard',
    description: 'A devout pilgrimage trek to the sacred Kedarnath shrine, one of India\'s most revered Shiva temples flanked by glorious snow glaciers.',
    highlights: [
      'Holy prayer darshans of Maa Ganga and Har Ki Pauri in Haridwar',
      'Ride past scenic confluences of the Alaknanda at Devprayag and Rudraprayag',
      'Uphill 16 km devotional trek from Gaurikund up to Kedarnath temple',
      'Visit Adi Shankaracharya Samadhi monument and Bhairavnath shrine'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Haridwar to Guptakashi', text: 'Arrival and pick up at Haridwar. Stop for holy darshan of Har Ki Pauri and brief holy snan. Start a scenic drive through mountain valleys to Guptkashi, witnessing sacred confluences at Devprayag and Rudraprayag, and stop at Dhari Devi Temple. Reach Guptkashi by evening. Dinner and overnight stay in Guptkashi.', stop: 'Haridwar' },
      { day: 'Day 2', title: 'Guptakashi to Kedarnath', text: 'Early morning drive to Sonprayag, taking a local shuttle to Gaurikund. Begin the 16 km uphill trek to Kedarnath, surrounded by waterfalls and snowy views. Reach by late afternoon to experience the divine evening Kedarnath Aarti, where prayers rise and bells echo through the valley. Dinner and overnight stay in Kedarnath camps.', stop: 'Kedarnath' },
      { day: 'Day 3', title: 'Kedarnath Darshan & Drive to Guptakashi', text: 'Early morning darshan at the sacred Kedarnath Temple. Explore Adi Shankaracharya Samadhi and Bhairavnath Temple offering panoramic views. Begin the 16 km downhill trek back to Gaurikund and Sonprayag. Drive back to Guptkashi for dinner and overnight stay.', stop: 'Kedarnath' },
      { day: 'Day 4', title: 'Departure', text: 'After breakfast, begin the return journey towards Haridwar. Enjoy scenic views of the Alaknanda River, a brief halt at Rishikesh to visit iconic Ram and Laxman Jhulas, before comfortable evening placement drop-off in Haridwar or Dehradun.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-nainital-delhi-bestseller',
    name: 'Nainital Best-seller Holiday from Delhi',
    subtitle: 'Nainital (2N) Lakeside Bliss',
    badge: 'Lakeside Holiday',
    duration: '3 Days',
    pricePerPerson: 4999,
    stops: ['Nainital'],
    difficulty: 'Easy',
    description: 'An affordable and highly scenic Lakeside holiday. Experience boating on the pristine pear-shaped Naini Lake, explore beautiful wood paths, and shop custom candles.',
    highlights: [
      'Private boating along the shimmering emerald-green Naini Lake',
      'Walks across Mall Road and vibrant local Tibetan Market stalls',
      'Scenic mountain views of Snow View Peak and Eco Cave Gardens',
      'Shop beautiful hand-carved candles and organic plum jellies'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Delhi to Nainital', text: 'Transfer from Delhi to Nainital. Check in, walk across Nainital Mall Road, and enjoy a traditional sailboat ride under the evening breeze.', stop: 'Nainital' },
      { day: 'Day 2', title: 'Nainital Sightseeing', text: 'Visit must-see spots around Nainital like Snow View Point, Eco Cave Gardens, and scenic peaks. Check out local views and oak forests.', stop: 'Nainital' },
      { day: 'Day 3', title: 'Departure to Delhi', text: 'After breakfast, shop for handmade wooden souvenirs and candles at the local Tibetan market. Depart Nainital in the afternoon for a comfortable drive back to Delhi.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-corbett-getaway-weekend',
    name: 'Corbett Weekend Getaway Tour',
    subtitle: 'Corbett National Park (1N) Wilderness Adventure',
    badge: 'Wildlife Getaway',
    duration: '3 Days',
    pricePerPerson: 2000,
    stops: ['Jim Corbett'],
    difficulty: 'Easy',
    description: 'A thrilling jungle escape to Jim Corbett National Park. Spot Royal Bengal tigers, enjoy wilderness jeep safaris, and visit scenic forest falls.',
    highlights: [
      'Overnight comfortable sleeper class train journey from Delhi to Ramnagar',
      'Thrilling open Jeep Safari in Corbett National Park to see tigers and deer',
      'Sightseeing tours visiting Garjia Mata Temple, Corbett Falls, and Dhangarhi Museum',
      'Quiet evening stay inside lush forest-side resort with gourmet dining'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Delhi to Ramnagar', text: 'Board an overnight train from Delhi to Ramnagar around 10:30 PM. Relax in the comfortable sleeper cabins as you travel to the foothills of the Himalayan wildlife reserve.', stop: 'Jim Corbett' },
      { day: 'Day 2', title: 'Arrive Ramnagar to Corbett & Safari', text: 'Arrive around 5:00 AM, meet our representative and register at your pre-booked resort. Explore local Corbett sights like Corbett Falls and Garjia Temple. In the afternoon, embark on an exciting open jeep safari inside the reserve to spot Royal Bengal Tigers and wildlife.', stop: 'Jim Corbett' },
      { day: 'Day 3', title: 'Corbett to Delhi Departure', text: 'Post breakfast, transfer to Ramnagar Railway Station and board the return train back to Delhi, arriving in the evening with outstanding safari photographs and wilderness memories.', stop: 'Jim Corbett' }
    ]
  },
  {
    id: 'tour-kedarnath-phata-3n',
    name: 'Kedarnath Tour Package: Phata (2N) → Kedarnath (1N)',
    subtitle: 'Phata (2N) → Kedarnath (1N)',
    badge: 'Spiritual pilgrimage',
    duration: '4 Days',
    pricePerPerson: 6500,
    stops: ['Haridwar', 'Kedarnath'],
    difficulty: 'Medium',
    description: 'A classic pilgrimage to Kedarnath. Travel comfortably from Haridwar to Phata, and trek upwards to experience the divine holy vibrations of Lord Shiva\'s shrine.',
    highlights: [
      'Transfer comfortably from Haridwar to Phata with Ganga River scenery',
      'Exciting trek from Gaurikund uphill to Kedarnath Temple',
      'Feel the power of divine prayers echoing inside Kedarnath valley',
      'Smooth return journey to Haridwar with beautiful Dhari Devi Darshan'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Pick up from Haridwar and Transfer to Phata', text: 'Our representative will pick you up from Haridwar and transfer you to Phata/Guptkashi. En route, witness the scenic view of the Ganga River. Stop for lunch at Srinagar or another recommended location by the driver. Take all your essentials from here, as there are no shops ahead. Continue your journey and see Agastmuni along the way. Once you reach Phata, check in at the property and rest. Overnight stay in Phata.', stop: 'Haridwar' },
      { day: 'Day 2', title: 'Phata to Kedarnath trek', text: 'Wake up and leave early in the morning to start the trek. Our driver will take you to Sonprayag. From Sonprayag, you need to take a local cab to reach Gaurikund, which will cost around 50 Rs. The trek will start from Gaurikund. Once you arrive, praise the almighty Lord Shiva. Witness the entire valley echoing with the sounds of ringing bells and religious prayers. Overnight stay in Kedarnath camps.', stop: 'Kedarnath' },
      { day: 'Day 3', title: 'Kedarnath to Phata', text: 'Wake up and leave early in the morning to start the trek back to Gaurikund. Take a local cab to Sonprayag. Our driver will pick you up from Sonprayag and drop you off at the hotel for an overnight stay at the Phata property.', stop: 'Kedarnath' },
      { day: 'Day 4', title: 'Phata / Guptkashi – Haridwar drop Via Dhari Devi', text: 'After breakfast, check out from the hotel. Transfer to Haridwar, with a stop at Dhari Devi. After the Dhari Devi Darshan, you will be dropped off in Haridwar.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-magical-mussoorie-3d',
    name: 'Magical Mussoorie Getaway: 3 Days Tour',
    subtitle: 'Mussoorie (2N)',
    badge: 'Scenic Hills',
    duration: '3 Days',
    pricePerPerson: 8400,
    stops: ['Mussoorie'],
    difficulty: 'Easy',
    description: 'Enjoy a fast, comfortable getaway from Delhi to the charming hill station of Mussoorie by private cab, exploring local falls and viewing majestic snow vistas.',
    highlights: [
      'Hassle-free comfortable private cab roundtrip transport from Delhi',
      'Two comfortable nights in Mussoorie surrounded by alpine pines',
      'Explore popular scenic spots, local waterfalls, and viewpoints',
      'Leisure activities and shopping along the legendary Mall Road'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Delhi to Musoorie (By Private Cab)', text: 'Depart from Delhi in the morning and drive to Mussoorie. Arrive in Mussoorie and check into your pre-booked hotel. Freshen up and take some rest. Enjoy the evening at leisure for personal activities. Have dinner and stay overnight at the hotel in Mussoorie.', stop: 'Mussoorie' },
      { day: 'Day 2', title: 'Mussoorie Sightseeing', text: 'Have breakfast at the hotel. Proceed for a full-day sightseeing tour of Mussoorie. Explore popular attractions and enjoy the scenic beauty. Return to the hotel in the evening. Have dinner and stay overnight at the hotel in Mussoorie.', stop: 'Mussoorie' },
      { day: 'Day 3', title: 'Mussoorie to Delhi departure', text: 'Have breakfast at the hotel. Check out and drive back to Delhi. Upon arrival in Delhi, our driver will drop you at your home, railway station, or hotels for your onward journey.', stop: 'Dehradun' }
    ]
  },
  {
    id: 'tour-nainital-ex-delhi-2n',
    name: 'Nainital Tour Package: Ex- Delhi',
    subtitle: 'Nainital (2N) AC Coach Holiday',
    badge: 'Lakeside Bliss',
    duration: '4 Days',
    pricePerPerson: 4200,
    stops: ['Nainital'],
    difficulty: 'Easy',
    description: 'Unwind with a budget-friendly AC coach journey from Delhi to the gorgeous lakeside town of Nainital. Explore floating rowboats, eco cave gardens, and local heritage.',
    highlights: [
      'Comfortable roundtrip overnight AC Coach travel from Delhi (Ex-Delhi)',
      'Explore mystical Eco Cave Gardens and walk along Mall Road',
      'Rowboat adventures on Naini Lake and blessings at Naina Devi Temple',
      'Convenient budget hotel accommodation with standard double-sharing'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Delhi - Nainital (Overnight journey By AC coach)', text: 'Board the AC coach from RK Ashram Marg Metro Station, Delhi, for an overnight journey to Nainital.', stop: 'Nainital' },
      { day: 'Day 2', title: 'Arrival Nainital', text: 'Arrive at the Nainital bus stand, where the driver will pick you up and transfer you to the hotel. Check in, freshen up, and relax for a while. Proceed for a local sightseeing tour of Nainital. Return to the hotel in the evening for dinner and an overnight stay.', stop: 'Nainital' },
      { day: 'Day 3', title: 'Nainital Sightseeing', text: 'After breakfast, set out for a full-day sightseeing tour of Nainital. Visit Naini Lake, Naina Devi Temple, Eco Cave, and other local attractions. Spend the evening at leisure. Return to the hotel for dinner and an overnight stay.', stop: 'Nainital' },
      { day: 'Day 4', title: 'Naintal to Delhi (Overnight journey by AC coach)', text: 'Check out from the hotel and enjoy the day at leisure. In the evening, board the AC coach from Nainital bus stand for an overnight journey back to Delhi.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-kholi-dehradun-homestay',
    name: 'Serene 3N Homestay Retreat at The Kholi in Dehradun',
    subtitle: 'Dehradun (3N) Slow-Life Retreat',
    badge: 'Nature Retreat',
    duration: '4 Days',
    pricePerPerson: 7200,
    stops: ['Dehradun'],
    difficulty: 'Easy',
    description: 'Savor the slow, mindful life inside a beautiful legacy family homestay in Dehradun. Dip your feet in freshwater pools, walk oak trails, and unplug completely.',
    highlights: [
      'Traditional family homestay architecture with handcrafted wooden pillars',
      'Natural garden pool dip, hidden mountain trails, and lush green views',
      '100% organic locally-sourced homemade meals and warm hospitality',
      'Ditch the screens with relaxing book-reading, bonfires, and star watching'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival and Immersion', text: 'Afternoon: Arrive at The Kholi and immediately feel a sense of nostalgia and calm. Settle into your room, noticing the intricate wooden carvings and traditional architecture. Late Afternoon: Your only task for the day is to unwind. Find a spot on the veranda or in the garden. Dip your feet in the natural pool, or simply sit and soak in the soothing scent of the earth after a recent rain. The property encourages you to wander through its hidden trails without a specific destination in mind. Evening: Enjoy a simple, home-cooked meal featuring fresh, local dishes. The in-house restaurant is a place for quiet conversation or to enjoy your food in peaceful solitude.', stop: 'Dehradun' },
      { day: 'Day 2', title: 'The Art of Slow Observation', text: 'Morning: Wake up when you feel rested. After a leisurely breakfast, take a slow, unhurried walk to the nearby forest. This is not a hike, but an exploration at your own pace. Observe the flora and fauna, listen to the birds, and breathe in the crisp mountain air. Afternoon: Return to The Kholi for a long, quiet lunch. The rest of the afternoon is dedicated to your personal form of rest -whether it\'s a nap, some quiet time with a book, or a conversation by the river. Evening: Gather by a bonfire to share stories or simply watch the stars emerge. The goal is to reconnect, not with a Wi-Fi signal, but with the people around you and with yourself.', stop: 'Dehradun' },
      { day: 'Day 3', title: 'A Gentle Glimpse of Culture', text: 'Morning: If you feel the urge to leave the farm, do so with a purpose of quiet appreciation. Visit a nearby village or a local temple to experience the culture without the rush of typical tourists. The journey itself should be part of the experience. Afternoon: Head back to The Kholi for a relaxing afternoon. Engage in a low-key activity, such as a local handicraft workshop, or simply read a book from the small library. Evening: Enjoy a final dinner at the homestay.', stop: 'Dehradun' },
      { day: 'Day 4', title: 'The Peaceful Deparature', text: 'Morning: Take one last walk around the property, savoring the tranquility you have found. Departure: Head home, not with a list of things you have done, but with a renewed sense of peace and a mind that feels truly rested.', stop: 'Dehradun' }
    ]
  },
  {
    id: 'tour-kedarnath-dham-yatra-trek',
    name: '4-Day Only Kedarnath Dham Yatra with Trekking',
    subtitle: 'Guptkashi (2N) → Kedarnath (1N)',
    badge: 'Pilgrimage Special',
    duration: '4 Days',
    pricePerPerson: 8000,
    stops: ['Haridwar', 'Kedarnath'],
    difficulty: 'Hard',
    description: 'A heavy mountain trek pilgrimage to the sacred Kedarnath Dham. Ascend Gaurikund on foot or pony to stand amidst floating high-altitude clouds and feel the spiritual divine aura of Lord Shiva.',
    highlights: [
      'Seamless roundtrip transport from Haridwar via scenic Tilwada valleys',
      'Exhilarating 16 km mountain trek from Gaurikund up to Kedarnath Dham',
      'Experience a spiritual night high up in Kedarnath tents under towering glaciers',
      'Comfortable back-down transfer to Guptkashi and Haridwar drops'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Guptkashi Stay', text: 'Pick up from Haridwar and transfer to Phata/Guptkashi (270 km / 9-10 hours travel). Drive from Haridwar to Phata, enjoying the scenic view of the Ganga River along the way. Stop for lunch at Tilwada. Take all your essentials from Tilwada, as there are no shops ahead. Continue your journey and see Agastmuni en route. Overnight stay in Guptkashi. Distance: 280 km (Travel Time: 6-7 hours).', stop: 'Haridwar' },
      { day: 'Day 2', title: 'Kedarnath Stay', text: 'Phase 1: Travel from Guptkashi to Sonprayag (16 km). Phase 2: Travel from Sonprayag to Gaurikund (5.5 km) by local government cabs. Phase 3: Trek from Gaurikund to Kedarnath (16 km) on foot, by horse, pony ride, palki, or porter. Wake up and leave early in the morning to start the trek. Our driver will take you to Sonprayag. From there, you will need to take a local cab, which will cost approximately 50 Rs, to reach Gaurikund. The trek will begin from Gaurikund. Once you reach Kedarnath, pay your respects to the almighty Lord Shiva. Experience the entire valley echoing with the sounds of ringing bells and religious prayers. Overnight stay in Kedarnath.', stop: 'Kedarnath' },
      { day: 'Day 3', title: 'Guptkashi Stay', text: 'Kedarnath to Gaurikund to Sonprayag and return to Guptkashi for an overnight stay. Wake up early in the morning to start the trek back to Gaurikund. Take a local cab to Sonprayag. Our driver will pick you up from Sonprayag and drop you off at the hotel for an overnight stay in Guptkashi.', stop: 'Kedarnath' },
      { day: 'Day 4', title: 'Drop to D.Dun Hotels/Haridwar', text: 'After having breakfast, check out from the hotel. Our representative will drop you off at your desired location. The tour ends with divine and unforgettable memories.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-heal-farm-sattal',
    name: '3N Mindful Retreat at The Heal Farm in Sattal',
    subtitle: 'Sattal (3N) Digital Detox',
    badge: 'Wellness Retreat',
    duration: '4 Days',
    pricePerPerson: 9500,
    stops: ['Nainital'],
    difficulty: 'Easy',
    description: 'Reclaim your focus and sanity at The Heal Farm in Sattal. A screen-free sanctuary featuring skylit rooms, organic food, barefoot walks, and yoga.',
    highlights: [
      'Intentionally phone-free environment for deep digital detox',
      'Skylit rustic cabins designed to wake up with natural sunlight',
      'Guided barefoot forest walking and deep sound healing sessions',
      'Lovely communitarian meals and quiet library corners near Sattal lake'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Un-Plug', text: 'The Heal Farm: A unique destination for a refreshing holiday, designed for a digital detox and a deep reconnection with nature. Settle in and leave your phone in the common area. Enjoy organic, healthy home-cooked meals.', stop: 'Nainital' },
      { day: 'Day 2', title: 'The Rhythm of Nature', text: 'Wake up with the natural light that filters through your room\'s skylights. Find a quiet corner to read or sit and watch the sun rise over the mountains. Take an unhurried barefoot walk on the forest trails to feel the earth beneath your feet. Participate in optional sound healing or yoga.', stop: 'Nainital' },
      { day: 'Day 3', title: 'A Glimpse of the World, Slowly', text: 'Take a slow walk to a nearby village or a quiet part of the Sattal Reserve Forest. Enjoy a long, quiet lunch and quiet reflection. Gather with hosts and other guests to build a sense of community.', stop: 'Nainital' },
      { day: 'Day 4', title: 'The Mindful Return', text: 'Enjoy one last quiet breakfast and take a moment to reflect on the feeling of being completely unhurried before departing re-centered and restored.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-chopta-tungnath-trek',
    name: 'Chopta, Tungnath & Chandrashila Trek Package',
    subtitle: 'Chopta (2N) Alpine Hiking',
    badge: 'Peak Trekker',
    duration: '3 Days',
    pricePerPerson: 7299,
    stops: ['Chopta'],
    difficulty: 'Medium',
    description: 'Stand on Chandrashila Peak at 4,090m and pay homage at 1,000-year-old Tungnath, the highest Shiva Temple in the world, amidst breathtaking Himalayan views.',
    highlights: [
      'Witness holy river confluences at Dev Prayag and Rudraprayag',
      'Trek the majestic rhododendron forests up to 1,000-year-old Tungnath Temple',
      'Climb to Chandrashila Peak (4,090m) for a 360-degree snow panorama',
      'Comfortable basecamp alpine tents in Chopta, the \'Mini Switzerland of India\''
    ],
    itinerary: [
      { day: 'Day 1', title: 'Haridwar to Chopta (225km/06-07hrs Approx)', text: 'Meet at Haridwar, Rishikesh, or Dehradun. Travel to Chopta, a 225 km journey showcasing the beauty of Uttarakhand. Visit Dev Prayag Sangam and Rudraprayag Sangam. Arrive at Chopta Camps or Resort/Homestay for dinner and overnight stay.', stop: 'Chopta' },
      { day: 'Day 2', title: 'Chopta – Tungnath Temple – Chandrashilla – Chopta', text: 'After breakfast, proceed to Chopta Tungnath (3 km trek one way), situated at a height of 3,680 meters. Then start trekking to Chandrashila (2 km trek from Tungnath Temple) at a height of 4,090 meters offering a 360-degree panoramic view of the Himalayas. Night stay in Chopta.', stop: 'Chopta' },
      { day: 'Day 3', title: 'Chopta Departure', text: 'After a delicious morning breakfast, checkout from camps. Drive back through gorgeous evergreen valleys to Haridwar or Dehradun for final drop-off.', stop: 'Chopta' }
    ]
  },
  {
    id: 'tour-kedarnath-pilgrimage-haridwar',
    name: '4-Day Kedarnath Pilgrimage Yatra from Haridwar',
    subtitle: 'Guptkashi (2N) → Kedarnath (1N) Deluxe Yatra',
    badge: 'Spiritual Darshan',
    duration: '4 Days',
    pricePerPerson: 6900,
    stops: ['Haridwar', 'Guptkashi', 'Kedarnath'],
    difficulty: 'Hard',
    description: 'A complete spiritual pilgrimage to Lord Shiva\'s sanctum at Kedarnath. Witness high Himalayan glacier valleys and attend the magnificent evening basecamp prayers.',
    highlights: [
      'Scenic trip crossing historic confluences at Rudraprayag and Deoprayag',
      'Scenic stopovers at Augustmuni Rishi Temple and Ardhnareshwar Temple',
      'Enjoy beautiful chants and Evening Bhajan Sandhya at Kedarnath',
      'Option for convenient helicopter rides or a holy 22 KM mountain trek'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Haridwar – Rudraprayag – Guptkashi/Phata (208km)', text: 'Warm meetup, then drive towards Guptkashi / Phata via Rudraprayag. Along the route, visit the historic Augustmuni Temple and the Ardhnareshwar Temple. Check-in to your Sitapur or Sonprayag hotel for dinner and overnight stay.', stop: 'Guptkashi' },
      { day: 'Day 2', title: 'Sonprayag – Gourikund – Sri Kedarnath Baba (22km Trek)', text: 'Board local connection cabs to Gaurikund. Start the majestic 22km trek to Kedarnath. Arrive at Kedarnath Ji Temple by evening, attend the divine singing of prayers (Bhajan Sandhya), and lodge right next to the temple.', stop: 'Kedarnath' },
      { day: 'Day 3', title: 'Sri Kedarnath Baba – Guptkashi/Phata', text: 'Wake up early at 5:00 AM for spiritual Darshan of Baba Kedar. Complete prayers and descend back to Sonprayag/Gaurikund. Return to the Guptkashi comfort hotel for a warm gourmet dinner and overnight stay.', stop: 'Guptkashi' },
      { day: 'Day 4', title: 'Guptkashi – Haridwar Departure', text: 'Enjoy breakfast, checkout from the hotel, and take your return private drive back to Haridwar Railway Station or Dehradun to catch your onward transit.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-nainital-bhimtal',
    name: 'Nainital Tour Package with Kainchi Dham',
    subtitle: 'Bhimtal (2N) Romantic Lakeside Escape',
    badge: 'Leisure Lakefront',
    duration: '3 Days',
    pricePerPerson: 9999,
    stops: ['Bhimtal', 'Nainital'],
    difficulty: 'Easy',
    description: 'Immerse in Kumaon\'s tranquil lake district, staying at lovely Bhimtal. Visit revered Kainchi Dham Ashram of Neem Karoli Baba, and enjoy classic Nainital sightseeing.',
    highlights: [
      'Relax next to the serene, peaceful waters of Bhimtal lake region',
      'Seek quiet meditation time at Neem Karoli Baba\'s Kainchi Dham Ashram',
      'Enjoy sail boating on Naini Lake and visit historical Naina Devi Temple',
      'Experience stellar panoramic Himalayan views via Snow View ropeways'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Kathgodam Pickup – Bhimtal Stay & Kainchi Dham Visit', text: 'Warm pickup at Kathgodam Station and transfer to Bhimtal (25 km). Check-in and relax before heading out to Kainchi Dham, the sacred ashram of Neem Karoli Baba, for direct darshan. Enjoy lake walks in the evening.', stop: 'Bhimtal' },
      { day: 'Day 2', title: 'Bhimtal to Nainital Local Sightseeing', text: 'After breakfast, take a full-day sightseeing tour in Nainital. Boating across the emerald Naini Lake, explore Naina Devi temple, stroll the Mall Road, and ride the aerial ropeway up to Snow View Point.', stop: 'Nainital' },
      { day: 'Day 3', title: 'Bhimtal Check-out – Lake Tour – Haldwani Drop', text: 'Morning lake tour including beautiful nine-cornered Naukuchiatal and Sattal lake cluster nestled in thick woods. Conclude your tour with an evening drop-off at Haldwani Railway Station by 7:00 PM.', stop: 'Bhimtal' }
    ]
  },
  {
    id: 'tour-kedarnath-phata-yatra',
    name: 'Kedarnath ji Tour Package - 3 Nights/4 Days',
    subtitle: 'Phata(2N) → Kedarnath(1N) Premium Yatra',
    badge: 'Pilgrimage Special',
    duration: '4 Days',
    pricePerPerson: 8000,
    stops: ['Haridwar', 'Phata', 'Kedarnath'],
    difficulty: 'Hard',
    description: 'Witness Lord Shiva\'s ancient temple flanked by mighty peak ridges. Stage from Phata with helicopter boarding access.',
    highlights: [
      'Convenient travel base stays at Phata or Guptkashi hotels',
      'Spiritual pooja and prayers inside the pristine Kedarnath Temple',
      'High proximity access to scenic glacier valleys and mountain gorges',
      'Passes through ancient confluences - Devprayag and Rudraprayag'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Haridwar – Guptkashi – Phata (210 Kms)', text: 'Arrival in Haridwar and drive towards Sitapur/Phata. Pass through scenic confluence points at Devprayag and Rudraprayag. Check-in to your hotel for dinner and rest.', stop: 'Phata' },
      { day: 'Day 2', title: 'Phata/Sitapur – Sonprayag – Kedarnath Ji', text: 'Drive to Sonprayag staging point, then start the 18 km mountain trek or helicopter transfer to Kedarnath. Perform direct Pooja/darshan at Kedarnath Temple and overnight stay in Base camp.', stop: 'Kedarnath' },
      { day: 'Day 3', title: 'Kedarnath Ji – Sitapur / Phata', text: 'Awake amidst spectacular glacier views, perform final prayers, and embark on your return trek back to Sonprayag. Check-in to your Sitapur/Phata hotel.', stop: 'Phata' },
      { day: 'Day 4', title: 'Phata – Deoprayag – Haridwar', text: 'Drive back to Haridwar via Deoprayag confluence and Rishikesh. Catch your train or flight with everlasting spiritual memories.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-badrinath-haridwar',
    name: 'Haridwar to Badrinath: 3 Days Tour Package',
    subtitle: 'Badrinath(2N) Holy Chardham Shrine',
    badge: 'Divine Pilgrimage',
    duration: '3 Days',
    pricePerPerson: 8000,
    stops: ['Haridwar', 'Joshimath', 'Badrinath'],
    difficulty: 'Medium',
    description: 'Bask in the spiritual light of Badrivishal, taking a sulfur bath at Tapt Kund, exploring high Himalayan borders, and visiting Mana Village.',
    highlights: [
      'Holy dip in geothermal warm sulfur Tapt Kund waters',
      'Complete VIP Darshan of Shree Badrivishal deity inside the main sanctum',
      'Explore Mana Village (the last Indian Border Village), Vyas Gufa, and Saraswati mouth',
      'Traverse Devprayag and Rudraprayag, the beautiful formation rivers of the Ganges'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Haridwar – Rudraprayag – Joshimath (280 Kms)', text: 'Warm pickup at Haridwar. Drive through beautiful mountain trails and confluences. Arrive in Joshimath, the winter seat founded by Adi Shankaracharya. Spend the night here in clean hill hotels.', stop: 'Joshimath' },
      { day: 'Day 2', title: 'Joshimath – Badrinath Temple & Mana Excursion', text: 'Drive 45 KM of scenic gorge curves to Badrinath. Dip in warm Taptkund, seek Darshan of Badrivishal, and visit Vyas Gufa, the last Indian village Mana, and the start of River Saraswati.', stop: 'Badrinath' },
      { day: 'Day 3', title: 'Badrinath – Rudraprayag – Haridwar Drop', text: 'Proceed on your return journey to Haridwar. Observe where Alaknanda meets Bhagirathi in Devprayag before final drops.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-mussoorie-queen-hills',
    name: 'Mussoorie Tour: The Queen of Hills Package',
    subtitle: 'Mussoorie (2N) Panoramic Pines & Waterfalls',
    badge: 'Popular Hills',
    duration: '3 Days',
    pricePerPerson: 8500,
    stops: ['Dehradun', 'Mussoorie'],
    difficulty: 'Easy',
    description: 'Immerse in the cool altitude woodlands of Mussoorie, visit roaring Kempty Falls, explore Dhanaulti Chamba valley, and view majestic high snow peaks.',
    highlights: [
      'Paddle boating at Mussoorie Lake and cooling down at Kempty Falls',
      'Walk Dhanaulti\'s serene Eco-Parks and view majestic snow peaks at 2,250m elevation',
      'Seek blessings at mountain Surkanda Devi temple with a scenic ridge walk',
      'Shop local crafts and taste artisan foods on Mall Road'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Dehradun Arrival – Mussoorie Sightseeing (35 Km)', text: 'Arrival meeting in Dehradun, drive directly up to Mussoorie hills. Settle into the hotel, post-lunch visit Mussoorie Lake and Kempty Falls, and complete your evening with a pleasant stroll on Mall Road.', stop: 'Mussoorie' },
      { day: 'Day 2', title: 'Mussoorie – Dhanaulti Sightseeing – Mussoorie', text: 'Take a scenic day excursion to Dhanaulti. Hike to Surkanda Devi temple for stunning views, explore the quiet Pine Eco Park, and enjoy the snow range vista.', stop: 'Mussoorie' },
      { day: 'Day 3', title: 'Mussoorie – Dehradun Departure', text: 'Check out of your hotel. Take a refreshing final valley drive back to Dehradun Hotels or Railway Station for your departure.', stop: 'Dehradun' }
    ]
  },
  {
    id: 'tour-auli-chopta-cable-car',
    name: 'Auli & Chopta Package with Cable Car & Skiing',
    subtitle: 'Joshimath(1N) → Auli(1N) → Rudraprayag(1N)',
    badge: 'Adventure Alpine',
    duration: '4 Days',
    pricePerPerson: 11700,
    stops: ['Haridwar', 'Joshimath', 'Auli', 'Rudraprayag', 'Chopta'],
    difficulty: 'Medium',
    description: 'Enjoy India\'s best skiing meadows in Auli via Asia s longest cable car, and trek the gorgeous rolling bugyals of Chopta.',
    highlights: [
      'Ride Asia\'s longest cable car from Joshimath up to alpine Auli meadows',
      'Ski across world-famous pristine snowy slopes with towering Nanda Devi vistas',
      'Explore Chopta, the gorgeous "Mini Switzerland of India" alpine forest meadows',
      'Tour spiritual Rishikesh confluences including Lakshman Jhula and Ram Jhula'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Haridwar to Joshimath/Auli', text: 'Meet at Haridwar and travel to Joshimath, passing Devprayag and Rudraprayag. Settle into your hotel and enjoy evening leisure shopping in Joshimath\'s local bazaar.', stop: 'Joshimath' },
      { day: 'Day 2', title: 'Joshimath to Auli by Cable Car Gondola', text: 'Drive to the terminal and take the spectacular cable car ride to Auli. Explore alpine slopes, skiing, and overnight stay in Auli hill lodges.', stop: 'Auli' },
      { day: 'Day 3', title: 'Auli to Rudraprayag via Chopta Sightseeing', text: 'Descend back and depart for Rudraprayag via the gorgeous rolling meadows of Chopta. Spend a beautiful day in Chopta forest trails, then check-in at Rudraprayag.', stop: 'Rudraprayag' },
      { day: 'Day 4', title: 'Rudraprayag – Rishikesh Sightseeing – Haridwar Departure', text: 'Drive via Rishikesh. Take a walking temple tour across Laxman Jhula, Ram Jhula, and Parmarth Niketan. Deliver final drops at Haridwar in the evening.', stop: 'Rishikesh' }
    ]
  }
];

const TOUR_IMAGES: Record<string, string> = {
  'tour-kainchi-dham': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  'tour-nainital': 'https://images.unsplash.com/photo-1572883454114-1cf0031ed2a1?auto=format&fit=crop&w=600&q=80',
  'tour-chardham': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
  'tour-haridwar': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
  'tour-rishikesh': 'https://images.unsplash.com/photo-1598977123418-45f04b01fe14?auto=format&fit=crop&w=600&q=80',
  'tour-jim-corbett': 'https://images.unsplash.com/photo-1615959189197-48f8de675111?auto=format&fit=crop&w=600&q=80',
  'tour-mukteshwar': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'tour-almora': 'https://images.unsplash.com/photo-1582531633534-118df2835a8f?auto=format&fit=crop&w=600&q=80',
  'tour-ranikhet': 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80',
  'tour-kausani': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'tour-mussoorie': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
  'tour-munsiyari': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80',
  'tour-adi-kailash': 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80',
  'tour-auli': 'https://images.unsplash.com/photo-1551829142-d9ec6b41215b?auto=format&fit=crop&w=600&q=80',
  'tour-valley-of-flowers': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80',
  'tour-chopta': 'https://images.unsplash.com/photo-1486873249359-2731bd6dafc7?auto=format&fit=crop&w=600&q=80',
  'tour-hemkund': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  'tour-lansdowne': 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
  'tour-haridwar-rishikesh-mussoorie': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
  'tour-rishikesh-rafting-2n': 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=600&q=80',
  'tour-kedarnath-pilgrimage-3n': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
  'tour-nainital-delhi-bestseller': 'https://images.unsplash.com/photo-1611003228941-98852ba61887?auto=format&fit=crop&w=600&q=80',
  'tour-corbett-getaway-weekend': 'https://images.unsplash.com/photo-1552410260-0fd9b577afa6?auto=format&fit=crop&w=600&q=80',
  'tour-kedarnath-phata-3n': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
  'tour-magical-mussoorie-3d': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
  'tour-nainital-ex-delhi-2n': 'https://images.unsplash.com/photo-1572883454114-1cf0031ed2a1?auto=format&fit=crop&w=600&q=80',
  'tour-kholi-dehradun-homestay': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
  'tour-kedarnath-dham-yatra-trek': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
  'tour-heal-farm-sattal': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  'tour-chopta-tungnath-trek': 'https://images.unsplash.com/photo-1486873249359-2731bd6dafc7?auto=format&fit=crop&w=600&q=80',
  'tour-kedarnath-pilgrimage-haridwar': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
  'tour-nainital-bhimtal': 'https://images.unsplash.com/photo-1611003228941-98852ba61887?auto=format&fit=crop&w=600&q=80',
  'tour-kedarnath-phata-yatra': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
  'tour-badrinath-haridwar': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
  'tour-mussoorie-queen-hills': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
  'tour-auli-chopta-cable-car': 'https://images.unsplash.com/photo-1551829142-d9ec6b41215b?auto=format&fit=crop&w=600&q=80'
};

UTTARAKHAND_TOURS.forEach((tour) => {
  tour.image = TOUR_IMAGES[tour.id] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80';
});

// Beautiful abstract coordinate polyline that forms a boundary map of Uttarakhand
const STATE_BOUNDS = "M 8 50 L 15 28 L 32 18 L 50 14 L 75 19 L 94 34 L 88 62 L 76 85 L 60 93 L 42 90 L 32 82 L 18 84 Z";

interface TourAddon {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
}

const TOUR_ADDONS: Record<string, TourAddon[]> = {
  'tour-kainchi-dham': [
    { id: 'vip-darshan', name: 'VIP Kainchi Ashram Entry', description: 'Priority lane Ashram entrance with sacred photo book & sweet prasad kit.', pricePerPerson: 500 },
    { id: 'guide', name: 'Local spiritual guide companion', description: 'Learn histories of Neem Karoli Baba and famous global visitors.', pricePerPerson: 1000 }
  ],
  'tour-nainital': [
    { id: 'sailing', name: 'Private Sailboat Yacht Evening', description: 'Premium sailboat lake navigation under a cozy canvas top.', pricePerPerson: 1500 },
    { id: 'tiffin-high-tea', name: 'Tiffin Top Ridge High-Tea', description: 'Freshly brewed rhododendron tea with artisan mountain cookies.', pricePerPerson: 800 }
  ],
  'tour-chardham': [
    { id: 'priority-darshan', name: 'VIP Priority Temple Pass (All Dhams)', description: 'Fast lanes at the busy sanctums with customized group Puja slots.', pricePerPerson: 3500 },
    { id: 'porter-help', name: 'Sherpa Porter Support (Kedarnath Trek)', description: 'Assists carrying heavy backpacks up the steep mountain heights.', pricePerPerson: 2500 },
    { id: 'hot-spring', name: 'Premium Mineral Bath Access', description: 'VIP reserved slot in refreshing private copper-fed thermal water basins.', pricePerPerson: 1000 }
  ],
  'tour-haridwar': [
    { id: 'priority-aarti', name: 'Ganga Aarti Front-Row Seat Pass', description: 'Sought-after riverfront seats with a certified master prayer priest.', pricePerPerson: 1000 },
    { id: 'cable-express', name: 'Mansa Devi Cable Car Express Ticket', description: 'Zero-waiting priority express lane entry for the aerial ropeway.', pricePerPerson: 500 }
  ],
  'tour-rishikesh': [
    { id: 'gopro-rafting', name: '4K GoPro Helmet Action Video Pack', description: 'Includes raw video logs of your Grade IV white-water rapids ride.', pricePerPerson: 1200 },
    { id: 'ganges-meditation', name: 'Private Tibetan Healing Ceremony', description: 'Heal stress with ancient bronze dynamic chime bowls on silver beaches.', pricePerPerson: 1500 }
  ],
  'tour-jim-corbett': [
    { id: 'dhikala-upgrade', name: 'Dhikala Buffer Zone Jeep Safari', description: 'Deeper core safari inside dense forests with senior trackers.', pricePerPerson: 3000 },
    { id: 'lenses-cam', name: 'Pro Wildlife Zoom Lens Cam Voucher', description: 'High definition zoom camera rental to capture tigers safely.', pricePerPerson: 1800 }
  ],
  'tour-mukteshwar': [
    { id: 'mountain-climb', name: 'Chauli ki Jali Rappelling Adventure', description: 'Thrill rope descent down dramatic vertical cliff walls with pros.', pricePerPerson: 1500 }
  ],
  'tour-almora': [
    { id: 'shawl-weaver', name: 'Kasar weavers custom shawl customizer', description: 'Witness real coppersmiths and have weavers prepare a custom wool scarf.', pricePerPerson: 1000 }
  ],
  'tour-ranikhet': [
    { id: 'golf-instructor', name: 'Ranikhet Golf Lessons with Veteran', description: 'Learn high-altitude swinging with military pro instructors.', pricePerPerson: 1500 }
  ],
  'tour-kausani': [
    { id: 'tea-tasting', name: 'Curated Organic Tea blend basket', description: 'Gourmet box of rare lavender, chamomile & orthodox black leaves.', pricePerPerson: 1200 }
  ],
  'tour-mussoorie': [
    { id: 'bakery-voucher', name: 'Historic Landour Bakeries Lunch Feast', description: 'Includes wildberry crepes, fresh hand-rolled pies, and gourmet coffee.', pricePerPerson: 800 }
  ],
  'tour-munsiyari': [
    { id: 'glacier-guide', name: 'Panchachuli base glacier scout', description: 'Private hiking guide down high streams with thermal gear kits.', pricePerPerson: 2500 }
  ],
  'tour-adi-kailash': [
    { id: 'yatra-insurance', name: 'High-Altitude Medical & Permit Cover', description: 'Full coverage of permissions, inner-line cards, and oxygen setups.', pricePerPerson: 3000 }
  ],
  'tour-auli': [
    { id: 'ski-instructor', name: 'Certified 1-on-1 Ski Trainer Session', description: 'Championship veteran skiing lesson on steep powdery runs.', pricePerPerson: 2500 },
    { id: 'snow-gear', name: 'Thermal Active insulated skiwear bundle', description: 'Heated waterproof coat, premium snow Pants, and safety goggles.', pricePerPerson: 1200 }
  ],
  'tour-valley-of-flowers': [
    { id: 'botanist', name: 'UNESCO Scholar Botanical Companion', description: 'Private expert explaining names of hundreds of endemic high orchids.', pricePerPerson: 2000 }
  ],
  'tour-chopta': [
    { id: 'tungnath-pony', name: 'Traditional mountain pony ride help', description: 'Assists elderly or weary travelers up the steep stone temple stairs.', pricePerPerson: 1800 }
  ],
  'tour-hemkund': [
    { id: 'oxygen-flask', name: 'Oxygen Canister + Holy baseline flask', description: 'Refillable lightweight canister with clean safety nozzles.', pricePerPerson: 800 }
  ],
  'tour-lansdowne': [
    { id: 'lake-boating', name: 'Private Rowboat on Bhulla Lake', description: 'Escape the crowds on a quiet personal woodboat row.', pricePerPerson: 400 }
  ],
  'tour-haridwar-rishikesh-mussoorie': [
    { id: 'priority-aarti', name: 'Premium Ganges Aarti Front Row Seats', description: 'VVIP front-row seats on the steps of Triveni Ghat with divine prasad basket.', pricePerPerson: 1000 },
    { id: 'mussoorie-ropeway', name: 'Gun Hill Ropeway Cable Car Passes', description: 'Avoid queues with pre-booked aerial cabin tickets for stunning peak views.', pricePerPerson: 450 }
  ],
  'tour-rishikesh-rafting-2n': [
    { id: 'bungee-jump', name: '83m Giant Bungee Jumping ticket', description: 'Pre-book India\'s highest fixed platform bungy jump at Mohan Chatti.', pricePerPerson: 3550 },
    { id: 'gopro-helmet', name: '4K GoPro Rafting Action Footage', description: 'Raw action cameras footage of your heavy rapids raft ride.', pricePerPerson: 1000 }
  ],
  'tour-kedarnath-pilgrimage-3n': [
    { id: 'helicopter-one-way', name: 'Phata to Kedarnath Heli Ride (One-Way)', description: 'Avoid the heavy trek with a scenic 10-min helicopter shuttle valley transfer.', pricePerPerson: 4800 },
    { id: 'vip-darshan-pass', name: 'VIP Kedarnath Temple Darshan Ticket', description: 'Express priority bypass line cards for temple sanctum blessings.', pricePerPerson: 1500 }
  ],
  'tour-nainital-delhi-bestseller': [
    { id: 'candle-making', name: 'Handcrafted Candle-making masterclass', description: 'Learn how Nainital\'s classic multi-color wax candles are poured.', pricePerPerson: 600 },
    { id: 'bhimtal-paragliding', name: 'Bhimtal High Fly Tandem Paragliding', description: 'Glide over turquoise lakes with certified paragliding pilots.', pricePerPerson: 2500 }
  ],
  'tour-corbett-getaway-weekend': [
    { id: 'canter-safari', name: 'Dhikala Core Zone Canter Safari Upgrade', description: 'Deepest core-forest access with maximum probability of tiger sightings.', pricePerPerson: 1500 },
    { id: 'binoculars-rental', name: 'Pro Nikon Wilderness Binoculars Rental', description: 'Pre-booked dual-lens zoom glass to spot bird nests and leopards.', pricePerPerson: 500 }
  ],
  'tour-kedarnath-phata-3n': [
    { id: 'helicopter-one-way', name: 'Phata to Kedarnath Heli Ride (One-Way)', description: 'Avoid the heavy trek with a scenic 10-min helicopter shuttle valley transfer.', pricePerPerson: 4800 },
    { id: 'vip-darshan-pass', name: 'VIP Kedarnath Temple Darshan Ticket', description: 'Express priority bypass line cards for temple sanctum blessings.', pricePerPerson: 1500 }
  ],
  'tour-magical-mussoorie-3d': [
    { id: 'bakery-voucher', name: 'Historic Landour Bakeries Lunch Feast', description: 'Includes wildberry crepes, fresh hand-rolled pies, and gourmet coffee.', pricePerPerson: 800 }
  ],
  'tour-nainital-ex-delhi-2n': [
    { id: 'candle-making', name: 'Handcrafted Candle-making masterclass', description: 'Learn how Nainital\'s classic multi-color wax candles are poured.', pricePerPerson: 600 },
    { id: 'bhimtal-paragliding', name: 'Bhimtal High Fly Tandem Paragliding', description: 'Glide over turquoise lakes with certified paragliding pilots.', pricePerPerson: 2500 }
  ],
  'tour-kholi-dehradun-homestay': [
    { id: 'cooking-workshop', name: 'Traditional Garhwali Cooking Masterclass', description: 'Learn to cook with local grains, fresh cottage cheeses, and local herbs.', pricePerPerson: 1000 },
    { id: 'private-shuttle', name: 'Reserved Dehradun Hotels Pick-up & Shuttle', description: 'Comfortable air-conditioned private sedan transfer directly to the farm.', pricePerPerson: 1500 }
  ],
  'tour-kedarnath-dham-yatra-trek': [
    { id: 'porter-help', name: 'Sherpa Porter Support (Kedarnath Trek)', description: 'Assists carrying heavy backpacks up the steep mountain heights.', pricePerPerson: 2500 },
    { id: 'vip-darshan-pass', name: 'VIP Kedarnath Temple Darshan Ticket', description: 'Express priority bypass line cards for temple sanctum blessings.', pricePerPerson: 1500 }
  ],
  'tour-heal-farm-sattal': [
    { id: 'sound-healing-up', name: 'Premium Tibetan Sound Healing Session', description: 'Indulge in an exclusive private therapeutic gong & chime sound bathing experience.', pricePerPerson: 1200 }
  ],
  'tour-chopta-tungnath-trek': [
    { id: 'tungnath-pony', name: 'Traditional mountain pony ride help', description: 'Assists elderly or weary travelers up the steep stone temple stairs.', pricePerPerson: 1800 }
  ],
  'tour-kedarnath-pilgrimage-haridwar': [
    { id: 'vip-darshan', name: 'VIP Kedarnath Darshan Ticket', description: 'Priority lane cards for fast and seamless deity darshan blessings.', pricePerPerson: 1500 },
    { id: 'heli-option', name: 'One-Way Helicopter Ride', description: 'Scenic and effortless heli shuttle boarding from Guptkashi or Phata.', pricePerPerson: 4800 }
  ],
  'tour-nainital-bhimtal': [
    { id: 'paragliding', name: 'Tandem Paragliding in Bhimtal', description: 'Glide high over serene blue lakes with an experienced pilot.', pricePerPerson: 2500 },
    { id: 'candle-craft', name: 'Nainital Handcrafted Wax Candle Session', description: 'Make and print your own colorful classic designer wax candles.', pricePerPerson: 600 }
  ],
  'tour-kedarnath-phata-yatra': [
    { id: 'vip-darshan', name: 'VIP Kedarnath Darshan Pass', description: 'Express priority bypass line for the deity sanctum.', pricePerPerson: 1500 },
    { id: 'heli-ride', name: 'Phata to Kedarnath Heli Ride (One-Way)', description: 'Avoid the mountain trek with a stunning 10-minute helicopter transfer.', pricePerPerson: 4800 }
  ],
  'tour-badrinath-haridwar': [
    { id: 'vip-pass', name: 'VIP Priority Badrinath Temple Pass', description: 'Fast lanes inside the main temple with private group puja slots.', pricePerPerson: 1000 },
    { id: 'mana-guide', name: 'Local Border Villages Guide Companion', description: 'A senior guide telling stories of Mahabharata, Vyas Gufa, and Mana.', pricePerPerson: 800 }
  ],
  'tour-mussoorie-queen-hills': [
    { id: 'dhanaulti-zipline', name: 'Dhanaulti Mountain Ziplining', description: 'Fly across deep mountain gorges on high-tension safety steel ropes.', pricePerPerson: 1200 },
    { id: 'high-tea', name: 'Scenic Valley Ridge High Tea', description: 'Enjoy warm rhododendron tea paired with local artisan valley cookies.', pricePerPerson: 800 }
  ],
  'tour-auli-chopta-cable-car': [
    { id: 'ski-instructor', name: 'Curated 1-on-1 Pro Ski Instructor', description: 'Exclusive skiing session with high safety training on snow slopes.', pricePerPerson: 2500 },
    { id: 'snow-suit', name: 'Insulated Winter Ski Suit Rental', description: 'Stay dry and cozy with premium warm insulated outerwear, boots, and goggles.', pricePerPerson: 1200 }
  ]
};

interface AccommodationStyle {
  id: string;
  name: string;
  description: string;
  extraCostPerDay: number;
}

const ACCOMMODATION_STYLES: AccommodationStyle[] = [
  { id: 'Homestay', name: 'Cozy Mountain Homestays', description: 'Immersive family-run timber cottages with traditional wood chimneys.', extraCostPerDay: 0 },
  { id: 'Chalet', name: 'Eco-Resort & Wooden Chalets', description: 'High-comfort pine-wood cabins featuring panoramic valley balconies.', extraCostPerDay: 1500 },
  { id: 'Dome', name: 'Luxe Star Domes & Wellness Spa', description: 'Modern geodesic heated transparent domes offering a 360° starlit sky.', extraCostPerDay: 3000 }
];

interface ServiceTier {
  id: 'Standard' | 'Deluxe' | 'Luxury';
  name: string;
  multiplier: number;
  description: string;
}

const SERVICE_TIERS: ServiceTier[] = [
  { id: 'Standard', name: 'Standard Explorer', multiplier: 1.0, description: 'Comfortable standard shared transfers, curated group hikes.' },
  { id: 'Deluxe', name: 'Elite Deluxe Tier', multiplier: 1.25, description: 'Comfortable 4x4 private transport, high-priority fast entrance passes.' },
  { id: 'Luxury', name: 'Royal Ultra-Luxury', multiplier: 1.55, description: 'Helicopter transfers where available, dedicated local concierge, VIP lounges.' }
];

interface UttarakhandTourExplorerProps {
  onBookTour: (provider: string, details: string, price: string) => void;
  appliedPromoCode: string | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  tag: 'Spiritual' | 'Lakes & Rivers' | 'Peaks & Snow' | 'Nature & Parks' | 'Wildlife Reserves' | 'Adventure Paths';
  imageUrl: string;
  altitude: string;
  bestTime: string;
  secretTip: string;
  photographer: string;
  favoritesCount: number;
}

const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-rishikesh',
    title: 'Ganges River Sands',
    location: 'Rishikesh',
    tag: 'Lakes & Rivers',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    altitude: '372 meters',
    bestTime: 'October to April',
    secretTip: 'Visit the abandoned historic Beatles Ashram early at 7:00 AM to hear rare yellow-throated pine martens singing in the sub-tropical foliage.',
    photographer: 'Aarav Sharma',
    favoritesCount: 245
  },
  {
    id: 'gal-kedarnath',
    title: 'Eternal Kedarnath Temple Ridge',
    location: 'Kedarnath',
    tag: 'Peaks & Snow',
    imageUrl: 'https://images.unsplash.com/photo-1626618012641-fcb11119fd2e?auto=format&fit=crop&w=800&q=80',
    altitude: '3,583 meters',
    bestTime: 'May to October',
    secretTip: 'Watch the sunset behind the giant temple from Mount Bhairav temple ridge, 1km up the mountain pathway, for a breathtaking glowing skyline shot.',
    photographer: 'Siddharth Negi',
    favoritesCount: 389
  },
  {
    id: 'gal-auli',
    title: 'High Altitude Auli Ski Meadows',
    location: 'Auli',
    tag: 'Peaks & Snow',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    altitude: '2,800 meters',
    bestTime: 'December to March',
    secretTip: 'Ride the highest level of chairlift inside tower ridge 8 to capture perfect macro close-ups of snowcapped pine needles reflecting blue light.',
    photographer: 'Priya Rawat',
    favoritesCount: 198
  },
  {
    id: 'gal-haridwar',
    title: 'Golden River Lamp Aarti Prayers',
    location: 'Haridwar',
    tag: 'Spiritual',
    imageUrl: 'https://images.unsplash.com/photo-1561361062-12870493db3a?auto=format&fit=crop&w=800&q=80',
    altitude: '314 meters',
    bestTime: 'Year-Round',
    secretTip: 'Secure a vantage wooden seat at the Malviya Island bridge exactly at 5:30 PM for a full perpendicular view of the brass lamps reflecting in the waters.',
    photographer: 'Kabir Dewan',
    favoritesCount: 312
  },
  {
    id: 'gal-valley',
    title: 'Bloomed Valleys & Blue Lilies',
    location: 'Valley of Flowers',
    tag: 'Nature & Parks',
    imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80',
    altitude: '3,658 meters',
    bestTime: 'July to September',
    secretTip: 'The extreme upper reaches of the river Pushpawati valley contain the densest beds of the rare blue poppy - ideal for morning lighting macro lenses.',
    photographer: 'Meera Johar',
    favoritesCount: 421
  },
  {
    id: 'gal-corbett',
    title: 'Golden Bengal Tiger Thickets',
    location: 'Jim Corbett',
    tag: 'Wildlife Reserves',
    imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80',
    altitude: '400 meters',
    bestTime: 'November to May',
    secretTip: 'Book an open-top gypsy safari in the lesser-visited Jhirna or Dhela zones during late afternoon to capture leopards basking in large fig trees.',
    photographer: 'Vikram Bist',
    favoritesCount: 287
  },
  {
    id: 'gal-mussoorie',
    title: 'Misty Landour Forest Pines',
    location: 'Mussoorie',
    tag: 'Adventure Paths',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    altitude: '2,005 meters',
    bestTime: 'September to June',
    secretTip: 'Stroll past the historical Landour cemetery after rain storms to capture shafts of golden sunrays piercing the massive wet Himalayan cedar canopies.',
    photographer: 'Karan Mehra',
    favoritesCount: 156
  },
  {
    id: 'gal-nainital',
    title: 'Pear-shaped Naini Shimmering Lake',
    location: 'Nainital',
    tag: 'Lakes & Rivers',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    altitude: '2,084 meters',
    bestTime: 'March to June',
    secretTip: 'Visit Snow View Peak via aerial cable car during early sunrise for an breathtaking mirror reflection of the grand Nanda Devi peak on the water.',
    photographer: 'Neha Joshi',
    favoritesCount: 224
  },
  {
    id: 'gal-badrinath',
    title: 'Neelkanth Peak over Badrinath',
    location: 'Badrinath',
    tag: 'Spiritual',
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    altitude: '3,300 meters',
    bestTime: 'May to November',
    secretTip: 'Walk exactly 200 meters up the river Alaknanda past the colorful main temple gate to capture it silhouetted perfectly against the towering Neelkanth snow cone.',
    photographer: 'Rohan Dimri',
    favoritesCount: 305
  }
];

export default function UttarakhandTourExplorer({ onBookTour, appliedPromoCode }: UttarakhandTourExplorerProps) {
  const [selectedTour, setSelectedTour] = useState<PredefinedTour>(UTTARAKHAND_TOURS[0]);
  const [activePin, setActivePin] = useState<MapPinLocation>(PIN_LOCATIONS.Rishikesh);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'booking'>('overview');
  
  // Interactive Itinerary Day selection. -1 means show the full tour path
  const [activeItineraryDayIdx, setActiveItineraryDayIdx] = useState<number>(-1);
  
  // Travelers state for customization list
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-10');
  const [trekkingGearRequired, setTrekkingGearRequired] = useState<boolean>(true);
  
  // Tour package premium customization states
  const [packageTier, setPackageTier] = useState<'Standard' | 'Deluxe' | 'Luxury'>('Standard');
  const [accommodationType, setAccommodationType] = useState<string>('Homestay');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Animation simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatorStep, setSimulatorStep] = useState<number>(0);
  const [simulatorPosition, setSimulatorPosition] = useState<{ x: number; y: number }>({ x: 20, y: 78 });

  // Tour packages list state as requested (with at least 10 packages)
  const [tourPackages, setTourPackages] = useState<PredefinedTour[]>(UTTARAKHAND_TOURS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [selectedStopFilter, setSelectedStopFilter] = useState<string | null>(null);
  const [miniMapHoveredStop, setMiniMapHoveredStop] = useState<string | null>(null);

  // Local package section states
  const [localPackagePromoCode, setLocalPackagePromoCode] = useState<string>('');
  const [bookingPackage, setBookingPackage] = useState<PredefinedTour | null>(null);
  const [packagesExpanded, setPackagesExpanded] = useState<boolean>(false);

  // Auto-expand packages if search or filter states are activated externally
  useEffect(() => {
    if (searchTerm || difficultyFilter !== 'All' || selectedStopFilter) {
      setPackagesExpanded(true);
    }
  }, [searchTerm, difficultyFilter, selectedStopFilter]);
  
  // Custom states inside the active booking modal
  const [modalTravelers, setModalTravelers] = useState<number>(2);
  const [modalDate, setModalDate] = useState<string>('2026-08-10');
  const [modalTier, setModalTier] = useState<'Standard' | 'Deluxe' | 'Luxury'>('Standard');
  const [modalTrekkingGear, setModalTrekkingGear] = useState<boolean>(true);
  const [modalAddonIds, setModalAddonIds] = useState<string[]>([]);

  // Schedule Call Expert Form states
  const [expertName, setExpertName] = useState<string>('');
  const [expertEmail, setExpertEmail] = useState<string>('');
  const [expertPhone, setExpertPhone] = useState<string>('');
  const [expertCity, setExpertCity] = useState<string>('');
  const [expertComment, setExpertComment] = useState<string>('');

  const getPackageDiscountInfo = (pkgPrice: number, promo: string | null) => {
    let discountPercent = 0;
    if (!promo) return { percent: 0, amount: 0, finalPrice: pkgPrice };

    const code = promo.toUpperCase().trim();
    if (code === 'DEVBHOOMI30') {
      discountPercent = 30;
    } else if (code === 'RUDRA25') {
      discountPercent = 25;
    } else if (code === 'MMTSUPER') {
      discountPercent = 15;
    } else if (code === 'MMTINTELECT' && pkgPrice > 500) {
      discountPercent = 20;
    }

    const amount = Math.round((pkgPrice * discountPercent) / 100);
    return {
      percent: discountPercent,
      amount,
      finalPrice: pkgPrice - amount
    };
  };

  // Destination Photo Gallery state parameters
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('mmt_destination_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY_ITEMS;
  });
  const [galleryCategory, setGalleryCategory] = useState<string>('All');
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mmt_gallery_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  // Simulated upload contribution states
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadLocation, setUploadLocation] = useState<string>('Rishikesh');
  const [uploadTag, setUploadTag] = useState<'Spiritual' | 'Lakes & Rivers' | 'Peaks & Snow' | 'Nature & Parks' | 'Wildlife Reserves' | 'Adventure Paths'>('Lakes & Rivers');
  const [uploadFileBase64, setUploadFileBase64] = useState<string>('');
  const [isPhotoUploading, setIsPhotoUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Synchronize dynamic updates back to local storage
  useEffect(() => {
    localStorage.setItem('mmt_destination_gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('mmt_gallery_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Listen for the global clear-tour-filters event to show all packages
  useEffect(() => {
    const handleClearFilters = () => {
      setSelectedStopFilter(null);
      setSearchTerm('');
      setDifficultyFilter('All');
    };
    window.addEventListener('clear-tour-filters', handleClearFilters);
    return () => {
      window.removeEventListener('clear-tour-filters', handleClearFilters);
    };
  }, []);

  // Handle auto pin update based on selected tour
  useEffect(() => {
    // Set active pin to the first stop of the selected tour
    const firstStopName = selectedTour.stops[0];
    if (PIN_LOCATIONS[firstStopName]) {
      setActivePin(PIN_LOCATIONS[firstStopName]);
    }
    // Reset day-by-day filter and product customizations when switching tour presets
    setActiveItineraryDayIdx(-1);
    setSelectedAddonIds([]);
    setPackageTier('Standard');
    setAccommodationType('Homestay');
  }, [selectedTour]);

  // Toggle custom favorites in destination photo gallery
  const handleToggleFavorite = (id: string, name: string) => {
    if (favoriteIds.includes(id)) {
      setFavoriteIds(favoriteIds.filter(fId => fId !== id));
      triggerToast(`Removed "${name}" from your visual inspirations! 🤍`);
    } else {
      setFavoriteIds([...favoriteIds, id]);
      triggerToast(`Added "${name}" to your visual inspirations! 🧡`);
    }
  };

  // Image input process triggers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      triggerToast('Please load a valid image format (.png, .jpg, .webp)! ❌');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      triggerToast('Image is too large! Please choose an image under 4MB. ⚠️');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadFileBase64(event.target.result as string);
        triggerToast('Image processed and attached successfully! 📸');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleAddCustomPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      triggerToast('Please provide a descriptive title for your snapshot! ⚠️');
      return;
    }
    if (!uploadFileBase64) {
      triggerToast('Please drag/drop or tap to select a photo! 📸');
      return;
    }

    setIsPhotoUploading(true);

    setTimeout(() => {
      const newItem: GalleryItem = {
        id: `gal-custom-${Date.now()}`,
        title: uploadTitle.trim(),
        location: uploadLocation,
        tag: uploadTag,
        imageUrl: uploadFileBase64,
        altitude: PIN_LOCATIONS[uploadLocation]?.altitude || 'Avg elevation',
        bestTime: 'Post-monsoon season',
        secretTip: `Guest visitor snapshot contribution. Captured at scenic ${uploadLocation}.`,
        photographer: 'You (Explorer)',
        favoritesCount: 1
      };

      setGalleryItems([newItem, ...galleryItems]);
      setUploadTitle('');
      setUploadFileBase64('');
      setIsPhotoUploading(false);
      triggerToast('Your gorgeous snapshot has been successfully pinned to the Inspiration Gallery! 🌟');
    }, 1200);
  };

  const handleDeleteCustomPhoto = (id: string, name: string) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
    setFavoriteIds(favoriteIds.filter(fId => fId !== id));
    triggerToast(`Permanently deleted your snapshot "${name}". 🗑️`);
  };

  // When clicking an itinerary day, highlight its associated stop pin
  const handleSelectDay = (idx: number, stopName: string) => {
    setActiveItineraryDayIdx(idx);
    if (PIN_LOCATIONS[stopName]) {
      setActivePin(PIN_LOCATIONS[stopName]);
      triggerToast(`Focused on Day ${idx+1} Stop: ${stopName} 🗺️`);
    }
  };

  // Helper to calculate the active subset of stops based on selected itinerary day
  const getVisibleStops = (): string[] => {
    if (activeItineraryDayIdx === -1) {
      return selectedTour.stops;
    }
    
    const focusedStop = selectedTour.itinerary[activeItineraryDayIdx]?.stop;
    if (!focusedStop) {
      return selectedTour.stops;
    }
    
    // Find the sequence of stops up to the focused stop
    const stopIndex = selectedTour.stops.indexOf(focusedStop);
    if (stopIndex === -1) {
      // If the stop is not explicitly in stops array, return up to what we can
      return [selectedTour.stops[0], focusedStop];
    }
    
    return selectedTour.stops.slice(0, stopIndex + 1);
  };

  const visibleStops = getVisibleStops();

  // Generates a beautiful curved SVG path (using quadratic bezier) for winding mountain valleys
  const getCurvePathData = (stops: string[]): string => {
    if (stops.length < 2) return '';
    let pathStr = '';
    
    stops.forEach((stopName, idx) => {
      const pin = PIN_LOCATIONS[stopName];
      if (!pin) return;
      
      if (idx === 0) {
        pathStr = `M ${pin.x} ${pin.y}`;
      } else {
        const prevPin = PIN_LOCATIONS[stops[idx - 1]];
        if (!prevPin) return;

        // Calculate mid point
        const midX = (prevPin.x + pin.x) / 2;
        const midY = (prevPin.y + pin.y) / 2;
        
        // Perpendicular offset factor to represent mountain roads winding uniquely
        const dx = pin.x - prevPin.x;
        const dy = pin.y - prevPin.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // 5-unit wiggle alternate by stop index
        const angleModifier = (idx % 2 === 0 ? 1 : -1);
        const offsetX = length > 0 ? (-dy / length) * 5 * angleModifier : 0;
        const offsetY = length > 0 ? (dx / length) * 5 * angleModifier : 0;
        
        const controlX = midX + offsetX;
        const controlY = midY + offsetY;
        
        pathStr += ` Q ${controlX} ${controlY}, ${pin.x} ${pin.y}`;
      }
    });
    
    return pathStr;
  };

  const activePathString = getCurvePathData(visibleStops);

  // Route traversal simulation utilizing active stops
  const handleSimulateRoute = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulatorStep(0);
    
    const targets = visibleStops.map(stop => PIN_LOCATIONS[stop]).filter(Boolean);
    if (targets.length === 0) {
      setIsSimulating(false);
      return;
    }

    let currentStep = 0;
    setSimulatorPosition({ x: targets[0].x, y: targets[0].y });
    setActivePin(targets[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= targets.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulatorStep(0);
        triggerToast("Route simulation finished successfully! 🌄");
        return;
      }
      
      setSimulatorStep(currentStep);
      setSimulatorPosition({ x: targets[currentStep].x, y: targets[currentStep].y });
      setActivePin(targets[currentStep]);
    }, 1500);
  };

  // Cost calculation applying active promo coupons if any
  const getPricingData = () => {
    const tierObj = SERVICE_TIERS.find(t => t.id === packageTier) || SERVICE_TIERS[0];
    const accomObj = ACCOMMODATION_STYLES.find(a => a.id === accommodationType) || ACCOMMODATION_STYLES[0];
    const durationDays = parseInt(selectedTour.duration) || 5;
    const activeAddons = TOUR_ADDONS[selectedTour.id] || [];
    const addonsCost = activeAddons
      .filter(a => selectedAddonIds.includes(a.id))
      .reduce((sum, a) => sum + a.pricePerPerson, 0);

    const personBasePrice = Math.round(selectedTour.pricePerPerson * tierObj.multiplier);
    const personAccomCost = accomObj.extraCostPerDay * durationDays;
    
    const singlePersonTotal = personBasePrice + personAccomCost + addonsCost;
    const rawPrice = singlePersonTotal * travelersCount;

    // Apply promo factors based on coupon categories
    let discountPercent = 0;
    if (appliedPromoCode === 'MMTSUPER') discountPercent = 15;
    else if (appliedPromoCode === 'MMTINTELECT' && rawPrice > 500) discountPercent = 20;
    
    const discountAmount = Math.round((rawPrice * discountPercent) / 100);
    const finalPrice = rawPrice - discountAmount;
    
    return {
      personBasePrice,
      personAccomCost,
      addonsCost,
      durationDays,
      rawPrice,
      discountPercent,
      discountAmount,
      finalPrice
    };
  };

  const { 
    personBasePrice, 
    personAccomCost, 
    addonsCost, 
    durationDays, 
    rawPrice, 
    discountPercent, 
    discountAmount, 
    finalPrice 
  } = getPricingData();

  // Curated tour catalog search, filter & sort logic
  const filteredPackages = tourPackages
    .filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            pkg.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'All' || pkg.difficulty === difficultyFilter;
      const matchesStopFilter = !selectedStopFilter || pkg.stops.includes(selectedStopFilter);
      return matchesSearch && matchesDifficulty && matchesStopFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.pricePerPerson - b.pricePerPerson;
      } else if (sortBy === 'price-high') {
        return b.pricePerPerson - a.pricePerPerson;
      } else if (sortBy === 'popularity') {
        const popA = a.popularity ?? TOUR_POPULARITY[a.id] ?? 50;
        const popB = b.popularity ?? TOUR_POPULARITY[b.id] ?? 50;
        return popB - popA;
      } else if (sortBy === 'duration') {
        const durA = parseInt(a.duration) || 0;
        const durB = parseInt(b.duration) || 0;
        return durA - durB;
      } else if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const handleBookingConfirm = () => {
    const uniqueTourRef = selectedTour.name;
    const tierObj = SERVICE_TIERS.find(t => t.id === packageTier) || SERVICE_TIERS[0];
    const accomObj = ACCOMMODATION_STYLES.find(a => a.id === accommodationType) || ACCOMMODATION_STYLES[0];
    const activeAddons = TOUR_ADDONS[selectedTour.id] || [];
    const selectedAddonNames = activeAddons
      .filter(a => selectedAddonIds.includes(a.id))
      .map(a => a.name)
      .join(', ');

    const bookingDetails = `${selectedTour.duration} Tour (${tierObj.name}), ${travelersCount} Guests, Lodging: ${accomObj.name}, Add-ons: [${selectedAddonNames || 'None'}], Starts: ${selectedDate}${trekkingGearRequired ? ' (Incl. Trek Kit)' : ''}`;
    
    onBookTour(
      `MMT Exclusive: ${uniqueTourRef}`,
      bookingDetails,
      `₹${finalPrice.toLocaleString('en-IN')}`
    );
    setActiveTab('overview');
  };

  return (
    <div id="uttarakhand-tour-explorer" className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100 font-sans mt-12">
      {/* COMPREHENSIVE CURATED HOLIDAY PACKAGES CATALOG SECTION */}
      <div className="pt-2" id="curated-holiday-packages">
        {!packagesExpanded ? (
          <motion.div
            id="master-package-portfolio-card"
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="group relative cursor-pointer bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950 border border-slate-800 rounded-3xl p-6 md:p-10 text-left overflow-hidden shadow-2xl transition-all duration-300 hover:border-orange-500/50 hover:shadow-orange-950/25"
            onClick={() => {
              setPackagesExpanded(true);
              triggerToast("Unveiled all 18 premium custom-curated Himalayan packages! 🗻✨");
            }}
          >
            {/* Visual background atmospheric highlights */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/15 via-amber-500/5 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-extrabold text-xs uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  Devbhoomi Consolidated Portfolio
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  Uttarakhand Devbhoomi Master Package Portfolio
                </h3>
                
                <p className="text-slate-300 text-sm md:text-base font-semibold leading-relaxed">
                  Click to open the consolidated catalog of all <span className="text-orange-400 font-black">18 customized tour packages</span> designed by local Himalayan travel desk experts. Covers spiritual sanctuaries, Tiger safaris, and high-altitude treks starting at only <span className="text-emerald-400 font-black font-mono">₹4,000/person</span>.
                </p>

                {/* Bullets grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs md:text-sm font-semibold text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 text-lg">🕉️</span>
                    <span>Chardham & Spiritual Tours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 text-lg">🐯</span>
                    <span>Wildlife Jim Corbett Safaris</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sky-400 text-lg">⛵</span>
                    <span>Nainital & Mussoorie Escapes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 text-lg">🎒</span>
                    <span>Valley of Flowers Trekking</span>
                  </div>
                </div>
              </div>

              {/* Massive CTA Interactive Box */}
              <div className="shrink-0 flex flex-col items-center lg:items-end justify-center">
                <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-6 text-center shadow-lg group-hover:border-orange-500/40 transition-all w-full lg:w-64">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">
                    Packages Folder
                  </span>
                  <div className="text-2xl font-black text-orange-400 font-mono tracking-tight mb-3">
                    18 Active Packages
                  </div>
                  <span className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-orange-600 group-hover:bg-orange-550 text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/10">
                    <span>Open All Packages</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    New Catalog: Devbhoomi Holiday Packages Catalog
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPackagesExpanded(false);
                      triggerToast("Folded vacation packages catalog back to master view! 📁");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 font-black text-[10px] uppercase transition-colors shrink-5 cursor-pointer border border-slate-200"
                  >
                    <Undo className="w-3 h-3 text-orange-500" />
                    <span>Fold Back Catalog</span>
                  </button>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Curated Uttarakhand Vacation Packages
                </h3>
                <p className="text-slate-400 text-xs md:text-sm font-semibold mt-1">
                  Select from {tourPackages.length} expert-designed holiday options. Click "Explore on Map" to draft their physical path or click "Add to Trips" to register/sync below.
                </p>
              </div>

              {/* Search, Filter & Sorters */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:border-orange-500 transition-colors w-full sm:w-48 text-slate-800"
                />

                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer text-slate-800"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy Grade</option>
                  <option value="Medium">Medium Grade</option>
                  <option value="Hard">Hard Grade</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer text-slate-800"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Duration: Days</option>
                  <option value="alphabetical">Alphabetical: A-Z</option>
                </select>

                {(searchTerm || difficultyFilter !== 'All' || selectedStopFilter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStopFilter(null);
                      setSearchTerm('');
                      setDifficultyFilter('All');
                      triggerToast("Showing all vacation packages with no active filters! 🌸");
                    }}
                    className="px-4 py-2.5 bg-orange-650 hover:bg-orange-700 text-white leading-none rounded-xl text-xs font-black transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1.5"
                    title="Reset search and filters to view all packages"
                  >
                    <span>Clear & Show All Packages</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[10.5px] font-black uppercase text-orange-750 bg-orange-100/60 px-2.5 py-0.5 rounded-md inline-block">
                  Exclusive Package Deals
                </span>
                <h4 className="font-extrabold text-[#0f172a] text-sm tracking-tight flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  Claim 15% to 30% Package Discounts
                </h4>
                <p className="text-[11px] text-slate-400 font-semibold">
                  Type or select code. Offers apply automatically to your final bookings instantly on confirm checkout.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { code: 'DEVBHOOMI30', label: '30% Off' },
                    { code: 'RUDRA25', label: '25% Off' },
                    { code: 'MMTSUPER', label: '15% Off' }
                  ].map((voucher) => {
                    const isActive = (localPackagePromoCode || appliedPromoCode || '').toUpperCase().trim() === voucher.code;
                    return (
                      <button
                        key={voucher.code}
                        type="button"
                        onClick={() => {
                          setLocalPackagePromoCode(voucher.code);
                          triggerToast(`Coupon ${voucher.code} applied successfully! 🎁`);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all tracking-wide border cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {voucher.code} ({voucher.label})
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Enter Promo Code"
                    value={localPackagePromoCode}
                    onChange={(e) => setLocalPackagePromoCode(e.target.value.toUpperCase())}
                    className="px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider focus:outline-none focus:border-orange-500 text-slate-800 w-28 sm:w-32"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (localPackagePromoCode.trim()) {
                        triggerToast(`Promo Coupon [${localPackagePromoCode.trim()}] active! 🌟`);
                      } else {
                        triggerToast('Enter a promo code first!');
                      }
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                  {(localPackagePromoCode || appliedPromoCode) && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocalPackagePromoCode('');
                        triggerToast('Coupon cleared.');
                      }}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-400 rounded-xl cursor-pointer"
                      title="Clear active promo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPackages.map((pkg) => {
                const isSelected = selectedTour.id === pkg.id;
                const basePackagePrice = pkg.pricePerPerson;
                const calculatedTotalPrice = basePackagePrice * travelersCount;

                const activePromo = localPackagePromoCode || appliedPromoCode;
                const promoInfo = getPackageDiscountInfo(calculatedTotalPrice, activePromo);
                const discountPercent = promoInfo.percent;
                const discountAmount = promoInfo.amount;
                const finalPackagePrice = promoInfo.finalPrice;

                return (
                  <motion.div
                    key={pkg.id}
                    id={`pkg-card-${pkg.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={`flex flex-col bg-white rounded-3xl border transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500/10 shadow-lg'
                        : 'border-slate-200/60 hover:border-slate-350 shadow-xs'
                    }`}
                  >
                    <div className={`h-2.5 w-full bg-gradient-to-r ${
                      pkg.badge.includes('Spiritual')
                        ? 'from-amber-500 to-orange-500'
                        : pkg.badge.includes('Action') || pkg.badge.includes('Sports')
                        ? 'from-rose-500 to-red-500'
                        : pkg.badge.includes('Nature') || pkg.badge.includes('Eco')
                        ? 'from-emerald-500 to-teal-500'
                        : 'from-sky-500 to-indigo-500'
                    }`} />

                    {pkg.image && (
                      <div className="h-40 w-full relative overflow-hidden shrink-0">
                        <img 
                          src={pkg.image} 
                          alt={pkg.name} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        
                        <span className="absolute bottom-2.5 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/10 shadow">
                          {pkg.badge}
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md ${
                            pkg.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                              : pkg.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                          }`}>
                            {pkg.difficulty}
                          </span>
                          <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-450" />
                            {pkg.duration}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-[#0f172a] text-[13.5px] leading-snug hover:text-orange-600 transition-colors">
                            {pkg.name}
                          </h4>
                          <p className="text-[9.5px] text-slate-400 italic mt-0.5 font-bold">"{pkg.subtitle}"</p>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed font-semibold">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider block">Scenic Highlights</span>
                        <div className="space-y-1">
                          {pkg.highlights.slice(0, 3).map((h, i) => (
                            <div key={i} className="flex gap-1.5 items-center">
                              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span className="text-[10px] text-slate-600 font-extrabold truncate">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                        <div>
                          <span className="text-[8.5px] text-slate-400 block font-black uppercase tracking-tight">Per Voyager</span>
                          <span className="text-sm font-black text-slate-950 block leading-tight">
                            ₹{pkg.pricePerPerson.toLocaleString('en-IN')} <span className="text-[8.5px] text-slate-450 font-bold">/ guest</span>
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[8.5px] text-slate-400 block font-black uppercase tracking-tight">{travelersCount} Voyager{travelersCount > 1 ? 's' : ''}</span>
                          {discountAmount > 0 ? (
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-slate-400 line-through leading-none font-bold">
                                ₹{calculatedTotalPrice.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs font-black text-emerald-600 block leading-tight mt-0.5">
                                ₹{finalPackagePrice.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[7.5px] font-black text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-sm uppercase tracking-tight mt-1 border border-emerald-100">
                                Save {discountPercent}% applied
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs font-black text-orange-600 block leading-tight">
                              ₹{calculatedTotalPrice.toLocaleString('en-IN')} base
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          id={`btn-explore-trail-${pkg.id}`}
                          onClick={() => {
                            setSelectedTour(pkg);
                            setActiveTab('overview');
                            const element = document.getElementById('himalayan-map-section');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                            triggerToast(`Loading path map trace for: ${pkg.name}! 🗺️`);
                          }}
                          className={`py-2 rounded-xl text-[10px] font-black transition-colors cursor-pointer border flex items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-orange-600 border-orange-500 text-white shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isSelected ? 'Viewing Now' : 'Explore Trail'}</span>
                        </button>

                        <button
                          type="button"
                          id={`btn-add-booking-${pkg.id}`}
                          onClick={() => {
                            const basePackagePrice = pkg.pricePerPerson;
                            const calculatedTotalPrice = basePackagePrice * travelersCount;
                            const activePromo = localPackagePromoCode || appliedPromoCode;
                            const promoInfo = getPackageDiscountInfo(calculatedTotalPrice, activePromo);
                            const finalPrice = promoInfo.finalPrice;

                            onBookTour(
                              "Local Travel Desk Experts",
                              `Package Tour Pass: ${pkg.name} (${pkg.duration} custom Himalayan guide layout included, ${travelersCount} Voyager${travelersCount > 1 ? 's' : ''})`,
                              `₹${finalPrice.toLocaleString('en-IN')}`
                            );
                            triggerToast(`Successfully registered ${pkg.name}! Your package reservation has been confirmed. 🗻🎫`);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 rounded-xl transition-transform active:scale-97 cursor-pointer text-[10.5px] flex items-center justify-center gap-1 shadow-md w-full"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Book Package</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredPackages.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Map className="w-8 h-8 mx-auto text-slate-300 mb-2 animate-bounce" />
                  <span className="text-xs font-black uppercase tracking-wider block">No Matching Vacation Packages Found</span>
                  <p className="text-[10px] text-slate-400 mt-1">Try relaxing your search query terms or changing the difficulty filter dropdown.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* INTERACTIVE HIMALAYAN EXPLORER MAP FUNCTION (Moved below packages) */}
      <div className="mt-16 pt-12 border-t border-slate-100" id="himalayan-map-section">
        {/* Dynamic Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-8 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              Vibrant Tour Circuit Map [1]
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Uttarakhand Himalayan Explorer Map
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-semibold mt-1">
              Toggle different tour itinerary tabs to draw animated curved paths dynamically between major cities on our interactive SVG terrain.
            </p>
          </div>

          {/* Actions bar */}
          <div className="flex flex-wrap gap-2">
            {UTTARAKHAND_TOURS.slice(0, 4).map((tour) => (
              <button
                key={tour.id}
                id={`btn-tour-select-${tour.id}`}
                onClick={() => {
                  setSelectedTour(tour);
                  setActiveTab('overview');
                }}
                className={`px-4 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer border ${
                  selectedTour.id === tour.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-white shadow-lg'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tour.badge}
              </button>
            ))}
          </div>
        </div>

         {/* BIDIRECTIONAL CONTROL & INTERACTIVE INFO BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8">
          <div className="flex items-center gap-2">
            <div className="p-1 px-2.5 rounded-lg bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Compass className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>Interactive Guide Map Info</span>
            </div>
            <p className="text-slate-400 text-[11px] font-semibold hidden md:inline-block">
              Choose a map pin to filter vacation packages or a curated package to center it on the map!
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Active bidirectional pin filter indicator */}
            {selectedStopFilter && (
              <div className="bg-sky-50 text-sky-800 border border-sky-200 rounded-xl py-1 px-3 text-[11px] font-extrabold flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                <span>Visits: {selectedStopFilter}</span>
                <button 
                  onClick={() => {
                    setSelectedStopFilter(null);
                    triggerToast("Cleared stop filter! Showing all packages. 🌸");
                  }} 
                  className="text-sky-500 hover:text-sky-700 font-black scale-125 ml-1 select-none pointer-events-auto cursor-pointer"
                  title="Clear filter"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: INTERACTIVE VISUAL TOURIST MAP (LG COLUMN 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Quick Info bar above map */}
          <div className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/40 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block animate-pulse" />
              <span>Active Trail: <span className="text-orange-600">{selectedTour.name}</span></span>
            </div>
            {activeItineraryDayIdx !== -1 && (
              <button 
                id="btn-reset-map-day-filter"
                onClick={() => {
                  setActiveItineraryDayIdx(-1);
                  triggerToast("Reset map to full circuit route!");
                }}
                className="text-orange-500 hover:text-orange-600 font-extrabold flex items-center gap-1 text-[11px] transition-all bg-orange-50 hover:bg-orange-100/70 px-2 py-1 rounded-lg border border-orange-200"
              >
                <Undo className="w-3 h-3" />
                <span>Show Full Route</span>
              </button>
            )}
          </div>

          <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-4 border border-slate-800 shadow-[0_0_50px_-12px_rgba(249,115,22,0.18)] relative overflow-hidden h-[450px] md:h-[530px]">
            {/* Topographic map contours simulator inside map area */}
            <div className="absolute inset-x-0 bottom-0 h-full opacity-10 pointer-events-none select-none">
              <div className="absolute inset-0 border-[6px] border-emerald-500/10 rounded-full scale-110 blur-md" />
              <div className="absolute inset-10 border-[5px] border-amber-500/10 rounded-full scale-95 blur-md" />
              <div className="absolute inset-24 border-[4px] border-emerald-500/5 rounded-full scale-75 blur-xs" />
              <div className="absolute inset-40 border-[3px] border-sky-500/10 rounded-full scale-50 blur-sm" />
            </div>

            {/* Glowing peak lights representing Himalaya ridges with beautiful mini beacons */}
            <div className="absolute top-8 left-[48%] flex flex-col items-center opacity-50 select-none z-10">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="text-[9px] text-white font-black tracking-widest uppercase filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Nanda Devi (7,816m)</span>
            </div>
            <div className="absolute top-14 left-[72%] flex flex-col items-center opacity-40 select-none z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" style={{ animationDuration: '3.5s' }} />
              <span className="text-[8px] text-slate-300 font-extrabold tracking-wider uppercase filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Trisul Peak</span>
            </div>

            {/* Floating Soft Atmospheric Mist Clouds drifting across valleys */}
            <div className="absolute inset-0 pointer-events-none select-none opacity-25 z-10">
              <div className="absolute top-[22%] left-[-10%] w-48 h-10 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl animate-mist-slow" />
              <div className="absolute top-[48%] right-[-10%] w-56 h-12 bg-gradient-to-r from-transparent via-white/12 to-transparent blur-xl animate-mist-fast" />
              <div className="absolute top-[70%] left-[15%] w-52 h-10 bg-gradient-to-r from-transparent via-white/8 to-transparent blur-xl animate-mist-slow" style={{ animationDelay: '4s' }} />
            </div>

            {/* Soaring Golden Eagle Silhouette (Flying across Uttarakhand hills) */}
            <div className="absolute pointer-events-none select-none left-0 top-[28%] animate-soaring opacity-40 z-10">
              <svg className="w-5 h-5 text-amber-300 fill-current" viewBox="0 0 24 24">
                <path d="M1 8 C 4 4, 8 4, 12 8 C 16 4, 20 4, 23 8 C 18 11, 14 11, 12 8 C 10 11, 6 11, 1 8" />
              </svg>
            </div>

            {/* Curated Interactive Map Legend Overlay */}
            <div className="absolute top-4 right-4 bg-slate-950/85 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-md pointer-events-none select-none z-20 hidden sm:block max-w-[170px] shadow-2xl">
              <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-widest border-b border-slate-800 pb-1.5 mb-1.5">MAP LEGEND</span>
              <div className="space-y-1.5 text-[8.5px] font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] shrink-0">🕉️</span>
                  <span>Sacred Shrines & Temples</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] shrink-0">💧</span>
                  <span>Shimmering Alpine Lakes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] shrink-0">🌲</span>
                  <span>Forest & Tiger Reserve</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] shrink-0">🏔️</span>
                  <span>Peaks & High Meadows</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 inline-block rounded" />
                  <span>Curated Tour Circuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-sky-400/40 inline-block border-t border-dashed" />
                  <span>Sacred Gushing Rivers</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE COMPREHENSIVE SVG MAP COMPONENT */}
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ pointerEvents: 'none' }}
            >
              {/* Gradients and Filters definition definitions */}
              <defs>
                {/* Neon route glow linear gradient */}
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
                </linearGradient>

                {/* State outline fill pattern */}
                <radialGradient id="stateRadialGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.85" />
                </radialGradient>

                {/* High Peaks Snowy Glaciers Gradient */}
                <linearGradient id="glacierGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Parallel grid lines for technical dashboard aesthetics */}
              <g opacity="0.22">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((coord) => (
                  <line 
                    key={`v-${coord}`} 
                    x1={coord} y1="0" x2={coord} y2="100" 
                    stroke="rgba(255,255,255,0.06)" strokeWidth="0.15" strokeDasharray="3,3" 
                  />
                ))}
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((coord) => (
                  <line 
                    key={`h-${coord}`} 
                    x1="0" y1={coord} x2="100" y2={coord} 
                    stroke="rgba(255,255,255,0.06)" strokeWidth="0.15" strokeDasharray="3,3" 
                  />
                ))}
              </g>

              {/* HIGH HIMALAYAN GLACIER RIDGE BACKGROUND WALL */}
              <path
                d="M 5 35 L 18 18 L 32 26 L 50 12 L 68 25 L 82 10 L 95 32"
                fill="url(#glacierGrad)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.6"
                strokeLinecap="round"
              />

              {/* SHIMMERING KUMAON LAKES AREA (Nainital, Bhimtal, Sattal Region) */}
              <path
                d="M 61 77 Q 64 81 67 80 T 69 85 Q 66 88 62 84 Z"
                fill="rgba(56, 189, 248, 0.22)"
                stroke="rgba(56, 189, 248, 0.45)"
                strokeWidth="0.4"
                className="animate-pulse"
                style={{ animationDuration: '4s' }}
              />

              {/* JIM CORBETT FOREST CONSERVATION CANOPY BOUNDARY */}
              <path
                d="M 40 82 Q 46 77 53 82 T 48 91 Q 41 89 40 82 Z"
                fill="rgba(34, 197, 94, 0.12)"
                stroke="rgba(34, 197, 94, 0.3)"
                strokeWidth="0.3"
                strokeDasharray="2,2"
              />

              {/* BACKGROUND STATE MAP VECTOR POLYGON */}
              <path 
                d={STATE_BOUNDS} 
                fill="url(#stateRadialGrad)" 
                stroke="rgba(255,255,255,0.15)" 
                strokeWidth="1.2" 
                strokeDasharray="2,4"
              />

              {/* STATE GLOW SHADOW BORDER */}
              <path 
                d={STATE_BOUNDS} 
                fill="none"
                stroke="rgba(249,115,22,0.12)" 
                strokeWidth="4" 
                style={{ filter: 'blur(4px)' }}
              />

              {/* FAINT HIGHWAY NETWORK (Showing background infrastructure connections) */}
              <g opacity="0.25">
                {REGIONAL_CONNECTIONS.map((conn, idx) => {
                  const p1 = PIN_LOCATIONS[conn.from];
                  const p2 = PIN_LOCATIONS[conn.to];
                  if (!p1 || !p2) return null;
                  return (
                    <line 
                      key={`highway-${idx}`}
                      x1={p1.x} y1={p1.y}
                      x2={p2.x} y2={p2.y}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="0.5"
                      strokeDasharray="1,3"
                    />
                  );
                })}
              </g>

              {/* Simulated Divine River Gushing trail (Ganga Flow) */}
              <path
                d="M 52 28 Q 45 48 28 70 T 20 78 T 15 95"
                fill="none"
                stroke="rgba(56, 189, 248, 0.4)"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="animate-river"
              />
              <path
                d="M 64 32 Q 58 45 28 70"
                fill="none"
                stroke="rgba(14, 165, 233, 0.3)"
                strokeWidth="0.9"
                strokeLinecap="round"
                className="animate-river"
                style={{ animationDelay: '2s' }}
              />

              {/* DYNAMIC, ANIMATED TOUR ROUTES (Drawn dynamically when users toggle different options) */}
              <AnimatePresence>
                {activePathString && (
                  <g>
                    {/* Shadow base glowing trail */}
                    <motion.path
                      key={`glow-${selectedTour.id}-${activeItineraryDayIdx}`}
                      d={activePathString}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      opacity="0.4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                      style={{ filter: 'blur(3px)' }}
                    />

                    {/* Master Route path line */}
                    <motion.path
                      key={`trail-${selectedTour.id}-${activeItineraryDayIdx}`}
                      d={activePathString}
                      fill="none"
                      stroke="url(#routeGrad)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: "easeInOut" }}
                    />

                    {/* Dynamic flowing traffic dash simulation */}
                    <motion.path
                      key={`dashflow-${selectedTour.id}-${activeItineraryDayIdx}`}
                      d={activePathString}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeDasharray="4,6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7, strokeDashoffset: [-20, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        strokeDashoffset: { repeat: Infinity, duration: 1.8, ease: "linear" },
                        opacity: { duration: 0.3 }
                      }}
                    />

                    {/* Traveling pulse cruiser beacon */}
                    <motion.circle
                      key={`cruiser-${selectedTour.id}-${activeItineraryDayIdx}`}
                      r="1.4"
                      fill="#ffffff"
                      stroke="#f97316"
                      strokeWidth="0.8"
                      filter="drop-shadow(0px 0px 4px rgba(249,115,22,0.95))"
                    >
                      <animateMotion 
                        path={activePathString} 
                        dur="3.5s" 
                        repeatCount="indefinite" 
                        rotate="auto"
                      />
                    </motion.circle>
                  </g>
                )}
              </AnimatePresence>
            </svg>

            {/* SIMULATOR FLOATING VEHICLE AVATAR */}
            {isSimulating && (
              <motion.div
                className="absolute z-20 w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 border-2 border-white shadow-2xl flex items-center justify-center -ml-4.5 -mt-4.5 pointer-events-none"
                style={{ left: `${simulatorPosition.x}%`, top: `${simulatorPosition.y}%` }}
                layout
                transition={{ type: "tween", duration: 1.4, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 rounded-full border border-orange-400 animate-ping opacity-60" />
                <Navigation className="w-4 h-4 text-white fill-current animate-bounce rotate-45" />
              </motion.div>
            )}

            {/* TOUR STATION PINS / HOVER TO INTERACT */}
            {Object.values(PIN_LOCATIONS).map((pin) => {
              const isPartOfRoute = selectedTour.stops.includes(pin.name);
              const isCurrentlyActiveInRoute = visibleStops.includes(pin.name);
              const isActive = activePin.id === pin.id;
              
              // Custom category helper for icons and styles
              const pinLower = pin.name.toLowerCase();
              let categoryIcon = '🏔️';
              if (pinLower.includes('kedarnath') || pinLower.includes('badrinath') || pinLower.includes('haridwar') || pinLower.includes('rishikesh') || pinLower.includes('kainchi') || pinLower.includes('kasar') || pinLower.includes('guptkashi')) {
                categoryIcon = '🕉️';
              } else if (pinLower.includes('nainital') || pinLower.includes('bhimtal') || pinLower.includes('sattal') || pinLower.includes('flowers')) {
                categoryIcon = '💧';
              } else if (pinLower.includes('corbett')) {
                categoryIcon = '🌲';
              }

              return (
                <button
                  key={pin.id}
                  id={`map-pin-${pin.id}`}
                  onClick={() => {
                    setActivePin(pin);
                    // Locate if this pin represents a stop in active itinerary
                    const matchingDayIdx = selectedTour.itinerary.findIndex(step => step.stop === pin.name);
                    if (matchingDayIdx !== -1) {
                      setActiveItineraryDayIdx(matchingDayIdx);
                    }
                    // Filter the packages below dynamically
                    setSelectedStopFilter(pin.name);
                    triggerToast(`Filtering vacation packages visiting ${pin.name}! 🗺️`);
                    
                    // Smoothly scroll down to focused packages section
                    setTimeout(() => {
                      const element = document.getElementById('curated-holiday-packages');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 400);
                  }}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
                >
                  {/* Beautiful Animated Tooltip on Hover */}
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-52 bg-slate-950/95 border border-slate-800 rounded-2xl p-3 shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-30 flex flex-col gap-1 backdrop-blur-md">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-1.5">
                      <span className="font-extrabold text-[11px] text-white tracking-tight">{pin.name}</span>
                      <span className="font-mono text-[8px] bg-sky-950/60 text-sky-400 border border-sky-900 px-1.5 py-0.5 rounded font-bold">{pin.altitude}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 font-semibold leading-normal mt-1">{pin.description}</p>
                    <div className="text-[8.5px] text-orange-400 font-black mt-1.5 tracking-tight flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">"{pin.highlight}"</span>
                    </div>
                  </div>

                  {/* Glowing core wave rings */}
                  <div className="relative">
                    <span className={`absolute -inset-3.5 rounded-full blur-sm transition-all ${
                      isActive 
                        ? 'bg-orange-500/50 opacity-100 scale-125' 
                        : isCurrentlyActiveInRoute
                        ? 'bg-amber-500/35 opacity-70 group-hover:opacity-100'
                        : isPartOfRoute
                        ? 'bg-orange-400/15 opacity-30 group-hover:opacity-100'
                        : 'bg-slate-400/10 opacity-0 group-hover:opacity-100'
                    }`} />

                    {/* Double Ping Ring for active pins */}
                    {isCurrentlyActiveInRoute && (
                      <span className="absolute -inset-2.5 rounded-full border border-amber-400/40 animate-ping" style={{ animationDuration: '2.5s' }} />
                    )}
                    {isActive && (
                      <span className="absolute -inset-3.5 rounded-full border border-orange-500/55 animate-ping" style={{ animationDuration: '1.6s' }} />
                    )}
                    
                    <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 shadow-xl transition-all transform group-hover:scale-115 ${
                      isActive 
                        ? 'bg-gradient-to-tr from-orange-500 to-rose-600 border-white text-white scale-110 shadow-orange-500/35' 
                        : isCurrentlyActiveInRoute
                        ? 'bg-gradient-to-tr from-amber-400 to-amber-500 border-white text-slate-900 font-extrabold shadow-amber-500/20'
                        : isPartOfRoute
                        ? 'bg-slate-900 border-orange-500/60 text-orange-400'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}>
                      <span className="text-[11px] md:text-xs">{categoryIcon}</span>
                    </div>
                  </div>

                  {/* Tiny text label tags */}
                  <span className={`text-[8px] md:text-[9px] font-black tracking-tighter px-1.5 py-0.5 rounded mt-1.5 shadow-md border pointer-events-none transition-all truncate max-w-[88px] ${
                    isActive 
                      ? 'bg-orange-500 text-white border-orange-400 scale-110' 
                      : isCurrentlyActiveInRoute
                      ? 'bg-slate-950 text-amber-200 border-amber-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {pin.name}
                  </span>
                </button>
              );
            })}

            {/* Map compass overlay rose */}
            <div className="absolute right-4 bottom-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-2.5 flex items-center gap-2 backdrop-blur-md pointer-events-none select-none z-25 shadow-2xl">
              <CompassIcon className="w-5 h-5 text-orange-400 animate-spin" style={{ animationDuration: '30s' }} />
              <div>
                <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-widest leading-none">Garhwal</span>
                <span className="text-[10px] text-white font-extrabold block uppercase tracking-wider mt-0.5">North Sector</span>
              </div>
            </div>

            {/* Simulate button trigger */}
            <button
              id="btn-simulate-hike"
              disabled={isSimulating}
              onClick={handleSimulateRoute}
              className="absolute left-4 bottom-4 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs px-4 py-2.5 rounded-xl border border-orange-500 shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed z-20"
            >
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span>{isSimulating ? 'Simulating...' : 'Simulate Circuit Route'}</span>
            </button>
          </div>

          {/* QUICK CARD: ACTIVE SELECTED PIN FACTBOX */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50 flex gap-4 items-start">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 border border-orange-200 text-orange-600">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-800 text-base">{activePin.name} Spot</h4>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold px-2 py-0.5 rounded">
                    El: {activePin.altitude}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Position: {activePin.x}°N , {activePin.y}°E</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{activePin.description}</p>
              <div className="text-[10px] text-orange-600 font-black mt-1.5 flex items-center gap-1">
                <span>Must Experience:</span>
                <span className="text-slate-700 italic font-medium">"{activePin.highlight}"</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TOUR DETAILS, ITINERARY AND STATE BOOKING ENGINE (LG COLUMN 5) */}
        <div className="lg:col-span-5 bg-slate-50/50 rounded-3xl p-5 md:p-6 border border-slate-200/60">
          
          {/* Internal detail tabs */}
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl mb-6">
            <button
              id="details-tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              id="details-tab-itinerary"
              onClick={() => setActiveTab('itinerary')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Daily Stops ({selectedTour.duration})
            </button>
            <button
              id="details-tab-booking"
              onClick={() => setActiveTab('booking')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                activeTab === 'booking'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Bookings
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="tour-overview"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div>
                  <span className="text-[10px] bg-slate-900 text-slate-100 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                    {selectedTour.badge}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedTour.name}
                  </h3>
                  <p className="text-xs text-slate-400 italic mt-0.5 font-bold">"{selectedTour.subtitle}"</p>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {selectedTour.description}
                </p>

                {/* Grid attributes */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Difficulty Factor</span>
                    <span className="font-extrabold text-sm text-slate-700 block mt-0.5">{selectedTour.difficulty} Grade</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Trip Duration</span>
                    <span className="font-extrabold text-sm text-slate-700 block mt-0.5">{selectedTour.duration}</span>
                  </div>
                </div>

                {/* Circuit Stops listing */}
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Circuit Route Sequence</h4>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedTour.stops.map((stop, i) => (
                      <React.Fragment key={`${stop}-${i}`}>
                        {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                        <button
                          type="button"
                          onClick={() => {
                            if (PIN_LOCATIONS[stop]) {
                              setActivePin(PIN_LOCATIONS[stop]);
                              // Look up matching day mapping
                              const dayIndex = selectedTour.itinerary.findIndex(item => item.stop === stop);
                              if (dayIndex !== -1) {
                                setActiveItineraryDayIdx(dayIndex);
                              }
                              triggerToast(`Highlighting stop sequence: ${stop}`);
                            }
                          }}
                          className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors ${
                            activePin.name === stop 
                              ? 'bg-orange-500 text-white shadow-sm font-black' 
                              : visibleStops.includes(stop)
                              ? 'bg-orange-50 border border-orange-200 text-slate-800'
                              : 'bg-white hover:bg-slate-150 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {stop}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Highlights checkboxes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Unmissable Highlights</h4>
                  <div className="space-y-1.5">
                    {selectedTour.highlights.map((h, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-slate-600 font-medium leading-normal">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Trigger Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Price starting from</span>
                    <span className="text-xl font-black text-slate-900 block leading-none mt-0.5">
                      ₹{selectedTour.pricePerPerson.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-semibold">/ Guest</span>
                    </span>
                  </div>

                  <button
                    id="btn-trigger-book-tab"
                    onClick={() => setActiveTab('booking')}
                    className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs px-6 py-3.5 rounded-full shadow-lg shadow-orange-500/10 cursor-pointer uppercase tracking-widest transition-transform hover:scale-103"
                  >
                    Configure Booking
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ITINERARY DETAILS (INTERACTIVE TRIGGER BINDS) */}
            {activeTab === 'itinerary' && (
              <motion.div
                key="tour-itinerary"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 max-h-[460px] overflow-y-auto pr-1"
              >
                <div className="flex flex-col justify-between md:flex-row gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800">Sequential Stops Map Outline</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Click any card to draw path & focused GPS trail up to that day!</p>
                  </div>
                  {activeItineraryDayIdx !== -1 && (
                    <button
                      type="button"
                      id="itinerary-clear-filter"
                      onClick={() => setActiveItineraryDayIdx(-1)}
                      className="text-xs text-orange-600 hover:text-orange-500 font-extrabold self-start shrink-0"
                    >
                      Clear Filter (Show All)
                    </button>
                  )}
                </div>

                <div className="relative border-l border-slate-200 ml-2.5 pl-4 py-2 space-y-4">
                  {selectedTour.itinerary.map((step, idx) => {
                    const isFocused = activeItineraryDayIdx === idx;
                    return (
                      <div 
                        key={idx} 
                        className="relative cursor-pointer group"
                        onClick={() => handleSelectDay(idx, step.stop)}
                      >
                        {/* Timeline Node dot */}
                        <span className={`absolute -left-[21.5px] top-4 w-3.5 h-3.5 rounded-full border-2 shadow transition-all ${
                          isFocused 
                            ? 'bg-orange-600 border-white scale-125' 
                            : 'bg-white border-slate-350 hover:bg-orange-100'
                        }`} />
                        
                        <div className={`p-3.5 rounded-xl border transition-all ${
                          isFocused 
                            ? 'bg-orange-50/50 border-orange-400 shadow-md translate-x-1' 
                            : 'bg-white hover:bg-slate-50/80 border-slate-200/70 shadow-xs group-hover:border-slate-300'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded ${
                              isFocused 
                                ? 'bg-orange-500 text-white' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {step.day}
                            </span>
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-tight flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-orange-500 inline" />
                              {step.stop}
                            </span>
                          </div>
                          
                          <h4 className="font-extrabold text-slate-800 text-sm mt-1.5 leading-snug">{step.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-1.1 line-clamp-3 leading-relaxed font-medium">
                            {step.text}
                          </p>
                          
                          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-orange-600 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span>Draw journey to this check point</span>
                            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: BOOKING PORTAL CONTROLS */}
            {activeTab === 'booking' && (
              <motion.div
                key="tour-booking"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 max-h-[500px] overflow-y-auto pr-1"
              >
                <div>
                  <h3 className="font-black text-lg text-slate-900">Configure Trip Reservation</h3>
                  <p className="text-xs text-slate-400 font-medium font-semibold">Customise service range, lodging quality and local experiences.</p>
                </div>

                {/* Controls */}
                <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200/50">
                  {/* Date picker */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Departure Date</label>
                    <input
                      id="tour-departure-date-control"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-black text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Guests selector */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1 flex justify-between">
                      <span>Total Voyagers</span>
                      <span className="text-orange-600 font-extrabold">{travelersCount} Guests</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        id="btn-guests-minus"
                        onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-sm text-slate-800">{travelersCount} Traveller(s)</span>
                      <button
                        type="button"
                        id="btn-guests-plus"
                        onClick={() => setTravelersCount(Math.min(10, travelersCount + 1))}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Service Class Selection */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[10.5px] font-black uppercase text-slate-400 tracking-wider mb-1.5 flex justify-between">
                      <span>Service Class</span>
                      <span className="text-orange-600 font-extrabold">Active: {packageTier}</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {SERVICE_TIERS.map(tier => {
                        const isSelected = packageTier === tier.id;
                        return (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => {
                              setPackageTier(tier.id);
                              triggerToast(`Selected ${tier.name}! 🌟`);
                            }}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-400/20 shadow-xs'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span className="block font-black text-[10px] uppercase tracking-wide leading-tight">{tier.id}</span>
                            <span className="block text-[8px] text-slate-400 font-extrabold mt-0.5">x{tier.multiplier}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">
                      {SERVICE_TIERS.find(t => t.id === packageTier)?.description}
                    </p>
                  </div>

                  {/* Lodging Select */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-[10.5px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Lodging Style ({durationDays} Nights)</label>
                    <div className="space-y-1.5">
                      {ACCOMMODATION_STYLES.map(style => {
                        const isSelected = accommodationType === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => {
                              setAccommodationType(style.id);
                              triggerToast(`Lodging changed to: ${style.name}! 🏡`);
                            }}
                            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50/20 text-orange-950 shadow-xs'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex-1 pr-2">
                              <span className="block font-black text-[11px] text-slate-800 leading-tight">{style.name}</span>
                              <span className="block text-[8px] text-slate-400 font-semibold mt-0.5 leading-snug">{style.description}</span>
                            </div>
                            <div className="text-right shrink-0 ml-1">
                              <span className="block font-black text-[10px] text-orange-600">
                                {style.extraCostPerDay === 0 ? 'Included' : `+₹${style.extraCostPerDay.toLocaleString('en-IN')}/night`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Local Excursion Addons */}
                  {TOUR_ADDONS[selectedTour.id] && TOUR_ADDONS[selectedTour.id].length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-[10.5px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Handpicked Local Excursions</label>
                      <div className="space-y-1.5">
                        {TOUR_ADDONS[selectedTour.id].map(addon => {
                          const isSelected = selectedAddonIds.includes(addon.id);
                          return (
                            <button
                              key={addon.id}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedAddonIds(selectedAddonIds.filter(id => id !== addon.id));
                                  triggerToast(`Removed excursion: ${addon.name}`);
                                } else {
                                  setSelectedAddonIds([...selectedAddonIds, addon.id]);
                                  triggerToast(`Added excursion: ${addon.name}`);
                                }
                              }}
                              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 shadow-xs'
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex-1 pr-2">
                                <span className="block font-black text-[11px] text-slate-800 leading-tight">
                                  {addon.name}
                                </span>
                                <span className="block text-[8px] text-slate-400 font-semibold mt-0.5 leading-snug">{addon.description}</span>
                              </div>
                              <div className="text-right shrink-0 ml-1">
                                <span className={`block font-black text-[10px] ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`}>
                                  +₹{addon.pricePerPerson.toLocaleString('en-IN')} / Guest
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Option Switch toggler */}
                  <div className="flex items-center justify-between p-1 pt-2 border-t border-slate-150">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block">Pro Trekking Gear Pack</span>
                      <span className="text-[9px] text-slate-400 block font-medium">Includes walking sticks, ropes, safety hooks</span>
                    </div>
                    <button
                      type="button"
                      id="toggle-gear-pack"
                      onClick={() => setTrekkingGearRequired(!trekkingGearRequired)}
                      className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 flex items-center cursor-pointer ${
                        trekkingGearRequired ? 'bg-orange-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
                    </button>
                  </div>
                </div>

                {/* Coupons/Pricing summary board */}
                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200/50 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 font-bold">
                    <span>Base Fare ({travelersCount} voyager{travelersCount > 1 ? 's' : ''})</span>
                    <span>₹{(selectedTour.pricePerPerson * travelersCount).toLocaleString('en-IN')}</span>
                  </div>

                  {packageTier !== 'Standard' && (
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>Service Tier Upgrade ({packageTier})</span>
                      <span className="text-slate-700">+₹{((personBasePrice - selectedTour.pricePerPerson) * travelersCount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {personAccomCost > 0 && (
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>Lodging Premium ({durationDays} Nights)</span>
                      <span className="text-slate-700">+₹{(personAccomCost * travelersCount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {addonsCost > 0 && (
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>Native Excursions Plan</span>
                      <span className="text-slate-700">+₹{(addonsCost * travelersCount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {trekkingGearRequired && (
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>Gear Rental Pack</span>
                      <span className="text-emerald-700 font-black">FREE Promo Included</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-bold">
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {appliedPromoCode ? (
                    <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1.5 p-1 bg-emerald-50 rounded">
                      <Check className="w-3 h-3 shrink-0" />
                      <span>Coupon code [{appliedPromoCode}] is active on checkout layout!</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 font-medium">
                      💡 Tip: Click any offer card in the handpicked coupons section above to apply discounts.
                    </div>
                  )}

                  <div className="border-t border-dashed border-orange-200 my-2 pt-2 flex justify-between text-sm">
                    <span className="font-extrabold text-slate-800">Total Booking Cost</span>
                    <span className="font-black text-orange-600">₹{finalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Final Submit action button */}
                <button
                  id="btn-confirm-tour-checkout"
                  onClick={handleBookingConfirm}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black py-3 rounded-xl transition-transform active:scale-97 cursor-pointer text-xs uppercase tracking-widest shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Reserve & Sync to My Trips</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>

      {/* IMMERSIVE DESTINATION PHOTO GALLERY SECTION */}
      <div className="mt-16 pt-12 border-t border-slate-100" id="devbhoomi-inspiration-gallery">
        {/* Gallery Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-extrabold text-xs uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              Visual Inspirations board
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Devbhoomi Expedition Photo Gallery
            </h3>
            <p className="text-slate-400 text-xs md:text-sm font-semibold mt-1">
              Explore the raw, scenic contours of Uttarakhand through real traveller photographs. Click on any frame to reveal master explorer tips or center on the map.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs font-bold leading-none shrink-0 self-start md:self-end">
            <div className="px-3 py-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-955 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <span>{galleryItems.length} Snapshots Pinned</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-955 flex items-center gap-1.5 shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>{favoriteIds.length} Inspirations Bookmarked</span>
            </div>
          </div>
        </div>

        {/* Categories Selector & Search Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/50 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative flex-1">
              <label htmlFor="gallery-search-input" className="sr-only">Search inspiration photos</label>
              <input
                id="gallery-search-input"
                type="text"
                placeholder="Search snapshots by location, tag, name, or explorer..."
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                className="w-full pl-9 pr-8"
                style={{
                  height: '42px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  outline: 'none',
                  color: '#1e293b'
                }}
              />
              <Camera className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              {gallerySearch && (
                <button
                  type="button"
                  id="btn-clear-gallery-search"
                  onClick={() => setGallerySearch('')}
                  className="absolute right-2.5 top-2.5 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 cursor-pointer text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Category Tabs scroll row */}
            <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-none max-w-full -mx-4 px-4 md:mx-0 md:px-0">
              {['All', 'Favorites', 'Spiritual', 'Lakes & Rivers', 'Peaks & Snow', 'Nature & Parks', 'Wildlife Reserves', 'Adventure Paths'].map(cat => {
                const isSelected = galleryCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setGalleryCategory(cat);
                      triggerToast(`Viewing category: ${cat}`);
                    }}
                    className={`px-3 py-2 rounded-xl text-[11px] font-black tracking-tight uppercase whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-500 border border-slate-200/40 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    {cat === 'Favorites' ? '❤️ Favorites' : cat}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Gallery Grid */}
        <div className="w-full">
          
          {/* Snapshots Grid Area */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              
              <AnimatePresence mode="popLayout">
                {galleryItems.filter(item => {
                  const matchesSearch = item.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                                        item.location.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                                        item.tag.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                                        item.photographer.toLowerCase().includes(gallerySearch.toLowerCase());
                  
                  const matchesCategory = galleryCategory === 'All' || 
                                          (galleryCategory === 'Favorites' ? favoriteIds.includes(item.id) : item.tag === galleryCategory);
                                          
                  return matchesSearch && matchesCategory;
                }).map((item, index) => {
                  const isFavorited = favoriteIds.includes(item.id);
                  const isCustom = item.id.startsWith('gal-custom-');

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.2) }}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/50 shadow-xs hover:shadow-lg transition-all flex flex-col h-full relative"
                    >
                      {/* Photo Thumbnail Wrapper */}
                      <div className="relative aspect-4/3 overflow-hidden bg-slate-900 select-none cursor-pointer" onClick={() => setSelectedGalleryItem(item)}>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />
                        
                        {/* Tags Header overlays */}
                        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1">
                          <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-black/50 text-white backdrop-blur-md">
                            {item.tag}
                          </span>
                        </div>

                        {/* Hover Overlay Stats */}
                        <div className="absolute bottom-3 left-3 right-3 z-10 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform">
                          <span className="block text-[9px] font-bold text-orange-400 uppercase tracking-wider">{item.location}</span>
                          <h4 className="font-extrabold text-sm text-white overflow-hidden text-overflow-ellipsis whitespace-nowrap">{item.title}</h4>
                        </div>
                      </div>

                      {/* Photo details line footer */}
                      <div className="p-3 bg-slate-50/50 flex items-center justify-between gap-1.5 border-t border-slate-150 text-[10.5px]">
                        <span className="text-slate-400 font-bold truncate">
                          By <span className="text-slate-600">{item.photographer}</span>
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Delete local post if applicable */}
                          {isCustom && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCustomPhoto(item.id, item.title);
                              }}
                              className="w-7 h-7 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-850 flex items-center justify-center transition-colors cursor-pointer"
                              title="Delete snapshot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Favorite heart toggle button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(item.id, item.title);
                            }}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                              isFavorited
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                            }`}
                            title="Boomark snapshot inspiration"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-red-600' : ''}`} />
                          </button>
                          
                          {/* Lightbox Trigger button */}
                          <button
                            type="button"
                            onClick={() => setSelectedGalleryItem(item)}
                            className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                            title="Reveal explorer card info"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Empty display block */}
              {galleryItems.filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                                      item.location.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                                      item.tag.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                                      item.photographer.toLowerCase().includes(gallerySearch.toLowerCase());
                
                const matchesCategory = galleryCategory === 'All' || 
                                        (galleryCategory === 'Favorites' ? favoriteIds.includes(item.id) : item.tag === galleryCategory);
                                        
                return matchesSearch && matchesCategory;
              }).length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-4">
                  <Camera className="w-7 h-7 text-slate-350 mb-2 animate-bounce" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">No matching snapshots</span>
                  <p className="text-[10px] text-slate-400 max-w-xs mt-0.5">
                    {galleryCategory === 'Favorites' 
                      ? "You haven't bookmarked any snapshots yet. Tap the heart icons on standard cards to populate this drawer!"
                      : "We can't find anything matching your term. Try typing another location or topic."}
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* LIGHTBOX DETAIL ZOOM DIALOG PANEL MODAL */}
      <AnimatePresence>
        {selectedGalleryItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setSelectedGalleryItem(null)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto flex flex-col border border-slate-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Box Image view */}
              <div className="relative aspect-16/10 bg-slate-950 select-none">
                <img
                  src={selectedGalleryItem.imageUrl}
                  alt={selectedGalleryItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  id="btn-close-gallery-modal"
                  onClick={() => setSelectedGalleryItem(null)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
                <div className="absolute top-4 left-4 z-10 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-600/90 hover:bg-orange-600 text-white shadow-md">
                    {selectedGalleryItem.tag}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                    Alt: {selectedGalleryItem.altitude}
                  </span>
                </div>
              </div>

              {/* Informational Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-orange-600 underline font-black uppercase tracking-wider">{selectedGalleryItem.location}</span>
                    <h3 className="font-black text-xl text-slate-900 leading-tight mt-0.5">{selectedGalleryItem.title}</h3>
                  </div>
                  <span className="shrink-0 text-[10.5px] font-extrabold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    By {selectedGalleryItem.photographer}
                  </span>
                </div>

                {/* Secret Tip Block */}
                <div className="bg-amber-50/50 border border-amber-200/55 p-4 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-amber-800 text-xs font-black uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Insider Local Explorer Tip</span>
                  </div>
                  <p className="text-[11.5px] text-slate-700 font-medium leading-relaxed italic">
                    "{selectedGalleryItem.secretTip}"
                  </p>
                </div>

                {/* Metadata Line parameters */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-1.5">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <span className="block text-[8px] text-slate-400 font-black uppercase tracking-wider">Elevation Height</span>
                    <span className="block text-[11px] font-black text-slate-800 mt-0.5">{selectedGalleryItem.altitude}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <span className="block text-[8px] text-slate-400 font-black uppercase tracking-wider">Best Season Period</span>
                    <span className="block text-[11px] font-black text-slate-800 mt-0.5">{selectedGalleryItem.bestTime}</span>
                  </div>
                </div>

                {/* Interaction Actions */}
                <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                  {/* Explore on Map action button */}
                  <button
                    type="button"
                    id="btn-modal-explore-map"
                    onClick={() => {
                      const loc = PIN_LOCATIONS[selectedGalleryItem.location];
                      if (loc) {
                        setActivePin(loc);
                        setSelectedGalleryItem(null);
                        
                        // Scroll to the main map section smooth
                        const el = document.getElementById('uttarakhand-tour-explorer');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        triggerToast(`Interactive map successfully centered on: ${loc.name}! 🗺️`);
                      } else {
                        triggerToast(`Could not trace map pin for the custom spot "${selectedGalleryItem.location}".`);
                      }
                    }}
                    className="flex-1 bg-[#0f172a] hover:bg-slate-800 text-white font-black py-2.5 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md animate-none"
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-orange-500 animate-none" />
                    <span>Center Map Spot</span>
                  </button>

                  {/* Share button simulation */}
                  <button
                    type="button"
                    onClick={() => {
                      triggerToast(`Inspirations card URL shortlink copied to clipboard! 📋`);
                    }}
                    className="w-11 h-11 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                    title="Copy inspirational share link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Heart Like button */}
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(selectedGalleryItem.id, selectedGalleryItem.title)}
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
                      favoriteIds.includes(selectedGalleryItem.id)
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                    title="Bookmark inspiration"
                  >
                    <Heart className={`w-4 h-4 ${favoriteIds.includes(selectedGalleryItem.id) ? 'fill-red-600' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
}

// Simple internal helper to notify user without blocking iframe restrictions
function triggerToast(message: string) {
  const customEvent = new CustomEvent('mmt-toast-raise', { detail: message });
  window.dispatchEvent(customEvent);
}
