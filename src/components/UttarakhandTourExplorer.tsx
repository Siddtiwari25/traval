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
  Trash2
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
  { from: 'Haridwar', to: 'Jim Corbett' }
];

interface ItineraryItem {
  day: string;
  title: string;
  text: string;
  stop: string; // Associated city stop for interactive map bindings
}

interface PredefinedTour {
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
}

const UTTARAKHAND_TOURS: PredefinedTour[] = [
  {
    id: 'tour-chardham',
    name: 'Spiritual Char Dham Sacred Trail',
    subtitle: 'Sacred Glaciers & Vedic Portals',
    badge: 'Spiritual Healing',
    duration: '8 Days',
    pricePerPerson: 360,
    stops: ['Haridwar', 'Rishikesh', 'Kedarnath', 'Badrinath'],
    difficulty: 'Hard',
    description: 'The ancient pilgrimage route of Uttarakhand. Absorb river aartis, traverse towering snow peaks, and experience divine tranquility inside stone temples.',
    highlights: [
      'Ganga Aarti prayers in Haridwar',
      'Yoga & healing sessions in Rishikesh',
      '16km high Himalayan Kedarnath trek',
      'Scenic bath in mineral Tapt Kund springs'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Aarti Invocation', text: 'Arrive at Har Ki Pauri, Haridwar. Kindle holy oil lamps as bells echo during the spectacular sunset prayers.', stop: 'Haridwar' },
      { day: 'Day 2-3', title: 'Beatles & Bridges', text: 'Drive to Rishikesh. Participate in beach meditations, traditional hawan rituals, and organic ashram lunches.', stop: 'Rishikesh' },
      { day: 'Day 4-5', title: 'Kedarnath Ascending', text: 'Trek or fly by helicopter up to Kedarnath temple. Feel the powerful mountain winds reflecting the eternal cosmos.', stop: 'Kedarnath' },
      { day: 'Day 6-7', title: 'Altar of Badrinath', text: 'Scenic luxury caravan drive to pristine Badrinath temple at the base of Alaknanda River waterfalls.', stop: 'Badrinath' },
      { day: 'Day 8', title: 'Mountain Confluence', text: 'Homeward return, stopping to witness the sacred Alaknanda & Bhagirathi roaring confluence at Devprayag.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-hillstations',
    name: 'Queen of Hills & Shimmering Lakes',
    subtitle: 'Mist Woodwalks & Pear-Shaped Lakes',
    badge: 'Leisure & Romantic',
    duration: '5 Days',
    pricePerPerson: 195,
    stops: ['Dehradun', 'Mussoorie', 'Nainital'],
    difficulty: 'Easy',
    description: 'Enjoy a leisurely drive spanning Kumaon hills and Garhwal ridges. Discover quaint mountain cafes, misty suspension ropeways, and wooden boat rides.',
    highlights: [
      'Strolls through Mussoorie Mall Road',
      'Boating along emerald Nainital Naini Lake',
      'Waterfalls and caves exploration in Dehradun',
      'Epic sunsets from Landour ridge'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Canyon Escapes', text: 'Arrive at Dehradun vales, explore Robber Cave crevices where fresh mountain springs carve deep walls.', stop: 'Dehradun' },
      { day: 'Day 2-3', title: 'Lal Tibba Pines', text: 'Check-in to Mussoorie resort. Stroll dense oak pathways, explore Landour bakery, view snow peaks.', stop: 'Mussoorie' },
      { day: 'Day 4', title: 'Lake District Crossing', text: 'Drive across terraced citrus farms to Nainital. Sip hot traditional masala chai on the lakeside.', stop: 'Nainital' },
      { day: 'Day 5', title: 'Panoramic Gondola Ride', text: 'Glide inside Nainital cable cars up to Snow View ridge, viewing the giant Himalayan wall Nanda Devi.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-adventure',
    name: 'Ultimate Alpine Ski & Rapids Adventure',
    subtitle: 'White-Water Trails & Snowy Gondolas',
    badge: 'Action & Trekking',
    duration: '6 Days',
    pricePerPerson: 275,
    stops: ['Rishikesh', 'Auli', 'Valley of Flowers'],
    difficulty: 'Medium',
    description: 'An adrenaline-fueled trek engineered for thrill-seekers. Combines high-grade white water river rapids with alpine snowfields and valley flower fields.',
    highlights: [
      'Grade IV Rafting rapids along high Ganga canyon',
      'Riding Asia\'s longest cable Gondola line',
      'Skiing orientation at snowcapped Auli',
      'Flora hikes across the Valley of Flowers'
    ],
    itinerary: [
      { day: 'Day 1', title: 'White-Water Launch', text: 'Brace the roaring 16km rapids in Rishikesh. Wrap the evening with bonfire camp songs on private sandy riverbanks.', stop: 'Rishikesh' },
      { day: 'Day 2-3', title: 'Himalayan ski heights', text: 'Scenic drive to Joshimath, boarding the high-flying tram car into Auli ski slopes.', stop: 'Auli' },
      { day: 'Day 4-5', title: 'Valley of Flowers Trek', text: 'Ascend to the high biosphere reserve. Capture blue poppies, rare mountain lilies, and crystalline streams.', stop: 'Valley of Flowers' },
      { day: 'Day 6', title: 'Joshimath Farewell', text: 'Savor traditional organic spinach and dal mountain lunch prior to return.', stop: 'Rishikesh' }
    ]
  },
  {
    id: 'tour-wildlife',
    name: 'Devbhoomi Wildlife & Mystique Safari',
    subtitle: 'Bengal Tiger Footprints & Foothill Forests',
    badge: 'Eco & Wilderness',
    duration: '4 Days',
    pricePerPerson: 230,
    stops: ['Jim Corbett', 'Nainital'],
    difficulty: 'Easy',
    description: 'Venture deep inside the protected sal woodlands of lower Shivalik hills. Glide behind open jeeps to experience raw ecosystems and majestic wild tigers.',
    highlights: [
      'Morning jeep safari into Corbett Core Zones',
      'Stays at wood-crafted riverside forest cabin resorts',
      'Stargazing workshops in Kumaon mountain observatory',
      'Wild elephant and leopard photographing'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Jungle Cabins', text: 'Arrive in Jim Corbett, check-in to luxurious log cottages by the roaring Ramganga River. Enjoy night wilderness calls.', stop: 'Jim Corbett' },
      { day: 'Day 2', title: 'Dawn Tiger Quest', text: 'Board 4x4 open safari gypsies at 5:00 AM. Cross tall golden grass corridors in search of Bengal Tigers.', stop: 'Jim Corbett' },
      { day: 'Day 3', title: 'High Corbett Trails', text: 'Trek inside Corbett buffer fields to ancient Garjia temple perched precariously on a rock.', stop: 'Jim Corbett' },
      { day: 'Day 4', title: 'Hill Lake Transition', text: 'Scenic transition to Nainital orchards for organic jam tastings and high scenic walks.', stop: 'Nainital' }
    ]
  },
  {
    id: 'tour-auli-ski',
    name: 'Auli Snowboarding & Peaks',
    subtitle: 'Himalayan Winter Playground',
    badge: 'Active Sports',
    duration: '5 Days',
    pricePerPerson: 320,
    stops: ['Dehradun', 'Auli', 'Badrinath'],
    difficulty: 'Medium',
    description: 'Unleash your winter explorer spirits. Glide across deep slopes of Auli with snowcapped peaks of Nanda Devi backing your high chairlifts.',
    highlights: [
      'Gondola cable car ride over pine ridges',
      '1-on-1 certified ski trainer private sessions',
      'Evening hot cocoa in Himalayan resort',
      'Visit holy Badrinath baseline'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Canyon Foothills', text: 'Arrive in Dehradun and transfer up to refreshing high altitude mountains.', stop: 'Dehradun' },
      { day: 'Day 2', title: 'Boarding the Sky', text: 'Take the scenic long cabin cable tram into white snow slopes.', stop: 'Auli' },
      { day: 'Day 3', title: 'Deep Powder Trails', text: 'Personal ski training sessions on pine wood boundaries.', stop: 'Auli' },
      { day: 'Day 4', title: 'Vedic Snow Temple', text: 'Scenic mountain drive to the quiet holy Alaknanda Badrinath shrine.', stop: 'Badrinath' },
      { day: 'Day 5', title: 'Alpine Farewell', text: 'Scenic descend back to Dehradun foothills for departure.', stop: 'Dehradun' }
    ]
  },
  {
    id: 'tour-dev-complete',
    name: 'Devbhoomi Complete Pilgrimage',
    subtitle: 'Divine Sacred Sanctums & Healing',
    badge: 'Spiritual Journey',
    duration: '7 Days',
    pricePerPerson: 399,
    stops: ['Haridwar', 'Rishikesh', 'Badrinath'],
    difficulty: 'Medium',
    description: 'An immersive journey across the absolute spiritual nodes. Savor rivers prayers, Vedic ashram lessons, and sacred mountain sights.',
    highlights: [
      'Holy Ganga river deep cleansing dip',
      'Pristine Vedic ashram staying & organic meals',
      'Personal customized Pooja reservation assistance',
      'Breathtaking sunrise walks over mountain peaks'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Aarti oil oiling', text: 'Watch beautiful brass lamps floating in ancient Haridwar waters.', stop: 'Haridwar' },
      { day: 'Day 2-3', title: 'Yoga Ashram lessons', text: 'Learn sunrise yoga and healing in Rishikesh beach ashrams.', stop: 'Rishikesh' },
      { day: 'Day 4-5', title: 'Foothills of God', text: 'Walk spiritual suspension bridges and explore Beatles hermitage site.', stop: 'Rishikesh' },
      { day: 'Day 6', title: 'Altar of Badrinath', text: 'Climb up to the divine shrine nested between high mountain ranges.', stop: 'Badrinath' },
      { day: 'Day 7', title: 'Final Blessings', text: 'Receive sacred offerings and return back along Ganga rapids.', stop: 'Haridwar' }
    ]
  },
  {
    id: 'tour-kumaon-lakes',
    name: 'Kumaon Shimmering Lakes & Wildlife',
    subtitle: 'Breezy Woods & Deep Safaris',
    badge: 'Adventure & Leisure',
    duration: '6 Days',
    pricePerPerson: 250,
    stops: ['Jim Corbett', 'Nainital', 'Dehradun'],
    difficulty: 'Easy',
    description: 'Relax in the scenic oak forests of Nainital combined with Tiger safaris in Corbett and pristine river waters in Dehradun.',
    highlights: [
      'Dhikala buffer zone jeep exploration',
      'Scenic wooden boat ride on shimmering Naini Lake',
      'Cozy heritage timber cottage staying',
      'Walk inside deep Robbers Cave streams'
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Tiger Footprints', text: 'Search Bengali tigers inside Corbett forest in open 4x4 vehicles.', stop: 'Jim Corbett' },
      { day: 'Day 3-4', title: 'Shimmering Lake', text: 'Classic boat rides and strolls along Nainital Mall Road fruit orchards.', stop: 'Nainital' },
      { day: 'Day 5', title: 'Astronomical observatory', text: 'Star-spotting high Himalayan peaks using high power telescopes.', stop: 'Nainital' },
      { day: 'Day 6', title: 'Cave Springs transition', text: 'Discover secret mountain water channels in Dehradun before departure.', stop: 'Dehradun' }
    ]
  },
  {
    id: 'tour-yoga-rapids',
    name: 'Yoga & White-Water Rapids Blitz',
    subtitle: 'Adrenaline & Inner Stillness',
    badge: 'Action & Spas',
    duration: '4 Days',
    pricePerPerson: 165,
    stops: ['Haridwar', 'Rishikesh', 'Mussoorie'],
    difficulty: 'Medium',
    description: 'A perfect short getaway combining thrilling river rafting, sunrise beach yoga along Ganga sands, and misty walks in Mussoorie hills.',
    highlights: [
      '16km river rafting experience over major rapids',
      'Guided sunrise beach meditation & breathing loops',
      'Rappelling session at Kempty Falls rock walls',
      'Strolling around historic Landour bakeries'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Plains of Gateway', text: 'Enjoy evening river prayers in Haridwar and sound healing session.', stop: 'Haridwar' },
      { day: 'Day 2', title: 'Wild Rapids Raft', text: 'Conquer active Grade III rapids of Ganges canyon in Rishikesh.', stop: 'Rishikesh' },
      { day: 'Day 3', title: 'Beach Yoga sands', text: ' Sunrise breathing and organic pranayama over silver sands.', stop: 'Rishikesh' },
      { day: 'Day 4', title: 'Mist Mountain walk', text: 'Enjoy cool pine air and bakery walk on Mussoorie ridges.', stop: 'Mussoorie' }
    ]
  },
  {
    id: 'tour-flowers-botanical',
    name: 'Valley of Flowers Botanica',
    subtitle: 'UNESCO Floral Heritage Trek',
    badge: 'Nature Botanical',
    duration: '6 Days',
    pricePerPerson: 295,
    stops: ['Rishikesh', 'Valley of Flowers', 'Badrinath'],
    difficulty: 'Hard',
    description: 'Embark on a magnificent flora hike traversing high Himalayan rivers to a pristine alpine biosphere blooming with thousands of rare wild orchids.',
    highlights: [
      'Witness UNESCO biosphere floral reserve in peak bloom',
      'Track rare blue poppies and high alpine orchids',
      'Scenic guided botanical trail walking sessions',
      'Stunning high Badrinath mountain vistas'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Base Assembly', text: 'Arrive in Rishikesh and secure warm-up gear and oxygen level review.', stop: 'Rishikesh' },
      { day: 'Day 2-3', title: 'Ascending the Valley', text: 'Trek inside alpine mountain passes surrounded by cascading rivers.', stop: 'Valley of Flowers' },
      { day: 'Day 4', title: 'The Floral Meadow', text: 'Capture pristine high bio ecosystems containing rare mountain lilies.', stop: 'Valley of Flowers' },
      { day: 'Day 5', title: 'Sacred peak sanctuary', text: 'Relax at Badrinath and take a warm mineral sulfur spring bath.', stop: 'Badrinath' },
      { day: 'Day 6', title: 'Return down the gorge', text: 'Descend along spectacular roaring Confluence views to Haridwar valley.', stop: 'Rishikesh' }
    ]
  },
  {
    id: 'tour-legends-glaciers',
    name: 'Legends & Glaciers Trekking',
    subtitle: 'Eternal Shiva High Slopes',
    badge: 'Active Pilgrimage',
    duration: '6 Days',
    pricePerPerson: 340,
    stops: ['Rishikesh', 'Kedarnath', 'Auli'],
    difficulty: 'Hard',
    description: 'Ascend the pristine ancient Shiva mountain. Witness jaw-dropping mountain glaciers of Kedarnath and return via deep ski fields of Auli.',
    highlights: [
      'Breathtaking Kedarnath ancient stone shrine',
      'Trek beside colossal high altitude mountain glaciers',
      'Panoramic cable gondola ticket in Auli included',
      'Spectacular sunset peaks view from high meadows'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Foothill brief', text: 'Briefing, high elevation fitness assessment, and light rafting warmup.', stop: 'Rishikesh' },
      { day: 'Day 2-3', title: 'Glacial Ascent', text: 'Trek across high elevation bridges and winding valleys up to Kedarnath.', stop: 'Kedarnath' },
      { day: 'Day 4', title: 'Temple Prayers', text: 'Savor spiritual morning prayers in front of the colossal temple rock.', stop: 'Kedarnath' },
      { day: 'Day 5', title: 'Sky Gondola', text: 'Scenic cable carriage landing over snow fields of Auli ski resort.', stop: 'Auli' },
      { day: 'Day 6', title: 'Meadows retreat', text: 'Wander inside quiet pine clearings prior to mountain return.', stop: 'Auli' }
    ]
  },
  {
    id: 'tour-mussoorie-leisure',
    name: 'Misty Mussoorie Leisure Loop',
    subtitle: 'Queen of Hills Heritage',
    badge: 'Chill & Relax',
    duration: '4 Days',
    pricePerPerson: 180,
    stops: ['Dehradun', 'Mussoorie'],
    difficulty: 'Easy',
    description: 'Escape the plains to the tranquil British-era mountain walks. Experience pristine cool air, heritage bakeries, and high cascading waterfalls.',
    highlights: [
      'Discover water currents inside Robbers Cave',
      'Colonial heritage Landour bakery woodwalks',
      'Unmatched panoramic peak sunset from Lal Tibba',
      'Enjoy cold mountain spring splash at Kempty Falls'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Cave Springs', text: 'Check out secret water corridors and canyon springs in Dehradun.', stop: 'Dehradun' },
      { day: 'Day 2', title: 'The Ridge Trail', text: 'Drive to Mussoorie and check into cozy colonial mist hotel.', stop: 'Mussoorie' },
      { day: 'Day 3', title: 'Landour Bakeries', text: 'Hike up to Landour bakery and sample wild berry crepes and tea.', stop: 'Mussoorie' },
      { day: 'Day 4', title: 'High Cascades', text: 'Unwind beside cascading mountain falls before afternoon transition.', stop: 'Mussoorie' }
    ]
  },
  {
    id: 'tour-wild-peaks',
    name: 'Nanda Devi Foothill Wilderness',
    subtitle: 'Rare Leopards & High Valleys',
    badge: 'Eco Forest',
    duration: '5 Days',
    pricePerPerson: 245,
    stops: ['Jim Corbett', 'Auli', 'Badrinath'],
    difficulty: 'Medium',
    description: 'Combine the dense Tiger habitats of Jim Corbett with the alpine meadows of Auli and high mountain ridges near Nanda Devi National park.',
    highlights: [
      'Spot wild elephants and leopards in Corbett reserves',
      'Ride the high speed mountain ropeway up into Auli',
      'Fabulous high altitude photography spots of snow peaks',
      'Visit pristine mountain shrines in quiet holy valleys'
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Jungle Safaris', text: 'Ride open top trucks across Corbett forest paths looking for predators.', stop: 'Jim Corbett' },
      { day: 'Day 3-4', title: 'Alpine Pine Ridges', text: 'Ascend Joshimath up to spectacular high altitude alpine skier heights.', stop: 'Auli' },
      { day: 'Day 5', title: 'Sanctuary Confluence', text: 'Quiet reflection session in Badrinath Alaknanda gorge before return.', stop: 'Badrinath' }
    ]
  }
];

// Beautiful abstract coordinate polyline that forms a boundary map of Uttarakhand
const STATE_BOUNDS = "M 8 50 L 15 28 L 32 18 L 50 14 L 75 19 L 94 34 L 88 62 L 76 85 L 60 93 L 42 90 L 32 82 L 18 84 Z";

interface TourAddon {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
}

const TOUR_ADDONS: Record<string, TourAddon[]> = {
  'tour-chardham': [
    { id: 'vip-darshan', name: 'VIP Temple Darshan Pass', description: 'Skip the line VIP queues at temples + Holy Prasad kit.', pricePerPerson: 35 },
    { id: 'porter', name: 'Sherpa Guide & Porter Support', description: 'Assists with heavy bags and provides certified oxygen route tips.', pricePerPerson: 65 },
    { id: 'yoga', name: 'Vedic Healing & Yoga Session', description: 'Sunrise guided pranayama along the Ganges sands.', pricePerPerson: 25 }
  ],
  'tour-hillstations': [
    { id: 'candlelit', name: 'Lakeside Candlelit Dinner', description: 'Romantic multi-course mountain slow-food meal in Nainital.', pricePerPerson: 45 },
    { id: 'heritage', name: 'Private Landour Heritage Walk', description: 'Explore historic woodwalks and ancient bakeries with an expert guide.', pricePerPerson: 20 },
    { id: 'tea', name: 'Himalayan Organic Tea Tasting', description: 'Artisanal sampling of rare wild mountain herbs, lavender, and rhododendron.', pricePerPerson: 15 }
  ],
  'tour-adventure': [
    { id: 'gopro', name: '4K Action Cam Rental Pack', description: 'Anti-shake camera with helmet and chest harness mounts for rafting/skiing.', pricePerPerson: 30 },
    { id: 'coach', name: 'Personalized 1-on-1 Ski Coach', description: 'Professional instruction sessions by top Auli championship veterans.', pricePerPerson: 75 },
    { id: 'winterwear', name: 'Thermal Active Winterwear Suit', description: 'Insulated snow pants, hooded windbreaker, and thermal gloves.', pricePerPerson: 20 }
  ],
  'tour-wildlife': [
    { id: 'naturalist', name: 'Expert Wildlife Naturalist', description: 'Private buffer zone companion with advanced tracking binoculars.', pricePerPerson: 40 },
    { id: 'lens', name: 'Pro Telephoto Camera Lens (300mm)', description: 'Rent an optical zoom lens for safe capture of tigers from a jeep range.', pricePerPerson: 25 },
    { id: 'camp', name: 'Under-the-Stars Riverside Fireplace', description: 'Rustic evening gathering on the Ramganga River with native acoustic songs.', pricePerPerson: 15 }
  ],
  'tour-auli-ski': [
    { id: 'gopro-auli', name: '4K Action Cam Rental', description: 'Strap a high resolution camera to record skiing.', pricePerPerson: 25 },
    { id: 'private-instructor', name: 'Private Certified Ski Guide', description: 'Professional ski guide lessons on alpine slopes.', pricePerPerson: 60 },
    { id: 'hot-cocoa', name: 'Alpine Fireplace Diners', description: 'Special evening heater fireside dinner serving native sweets.', pricePerPerson: 20 }
  ],
  'tour-dev-complete': [
    { id: 'complete-puja', name: 'Special VIP Puja Registration', description: 'Register early with standard sanctuary pundits for prayers.', pricePerPerson: 30 },
    { id: 'dev-porter', name: 'Ganga Holy Water flask + Porter', description: 'Receive an pure brass copper vessel of sacred river fluids.', pricePerPerson: 25 },
    { id: 'dev-ayurveda', name: 'Ayurveda Herb massage', description: 'Relax high pressure altitude muscles with local oils.', pricePerPerson: 35 }
  ],
  'tour-kumaon-lakes': [
    { id: 'naini-private', name: 'Private Sailboat Evening', description: 'Two hour private luxury yacht boating on Naini Lake.', pricePerPerson: 40 },
    { id: 'birding', name: 'Pangot Himalayan bird tracking', description: 'Walk pine valleys identifying colored local bird nests.', pricePerPerson: 15 },
    { id: 'local-thali', name: 'Traditional Kumaon Thali lunch', description: 'Try native recipes like Gahat soup, Bhatt Chudkani, and sweet Bal Mithai.', pricePerPerson: 20 }
  ],
  'tour-yoga-rapids': [
    { id: 'ganges-rafting', name: 'Supreme High Grade safety kit', description: 'Extra durable helmets and heavy floats for wild rapids.', pricePerPerson: 15 },
    { id: 'sound-healing', name: 'Tibetan Sound healing lesson', description: 'Relieve stress with ancient bronze dynamic chime bowls waves.', pricePerPerson: 25 },
    { id: 'glen-stroll', name: 'Mussoorie Pine forest cycle trail', description: 'Bicycle rent with safety guide around high ridges.', pricePerPerson: 30 }
  ],
  'tour-flowers-botanical': [
    { id: 'botanist-companion', name: 'Private Botanical Scholar', description: 'A licensed flora scientist walking to help detail orchid classes.', pricePerPerson: 45 },
    { id: 'botanical-journal', name: 'Alpine flower guide + dry book', description: 'A custom book containing beautiful sketches of Himalayan plants.', pricePerPerson: 12 },
    { id: 'hamlet-stay', name: 'Scenic organic cottage upgrade', description: 'Timber cabins facing pristine mountain water channels.', pricePerPerson: 35 }
  ],
  'tour-legends-glaciers': [
    { id: 'oxygen-kit', name: 'Premium High altitude Oxygen set', description: 'Refillable lightweight canister with clean safety nozzles.', pricePerPerson: 20 },
    { id: 'temple-priority', name: 'Priority VIP Darshan entrance pass', description: 'Fast lanes bypassing general temple line structures.', pricePerPerson: 35 },
    { id: 'glacier-walk', name: 'Glacial hiking equipment rental', description: 'Thermal boot grips, safety climbing hooks, and walking sticks.', pricePerPerson: 25 }
  ],
  'tour-mussoorie-leisure': [
    { id: 'landour-bakery', name: 'Artisanal landour bakery voucher', description: 'Covers unlimited plum cakes, fresh croissants, and wild coffee.', pricePerPerson: 15 },
    { id: 'cable-car-ticket', name: 'Priority cable car pass', description: 'Skip terminal queue waiting for tourist gondolas.', pricePerPerson: 12 },
    { id: 'sunset-supper', name: 'Scenic sunset ridge dinner', description: 'Candlelit dining on open high altitude outlook balcony.', pricePerPerson: 30 }
  ],
  'tour-wild-peaks': [
    { id: 'forest-jeep', name: 'Private core ring safari gypsy', description: 'Complete vehicle reservation bypassing general tourist trucks.', pricePerPerson: 50 },
    { id: 'night-vision', name: 'High grade night vision tracking', description: 'Track wild predators from high tree deck stations.', pricePerPerson: 22 },
    { id: 'camp-bonfire', name: 'Riverside fire barbeque', description: 'Organic mountain vegetables and grill items over charcoal.', pricePerPerson: 18 }
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
  { id: 'Chalet', name: 'Eco-Resort & Wooden Chalets', description: 'High-comfort pine-wood cabins featuring panoramic valley balconies.', extraCostPerDay: 25 },
  { id: 'Dome', name: 'Luxe Star Domes & Wellness Spa', description: 'Modern geodesic heated transparent domes offering a 360° starlit sky.', extraCostPerDay: 50 }
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
  const [sortBy, setSortBy] = useState<string>('price-low');

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
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.pricePerPerson - b.pricePerPerson;
      } else if (sortBy === 'price-high') {
        return b.pricePerPerson - a.pricePerPerson;
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
      `$${finalPrice}`
    );
    setActiveTab('overview');
  };

  return (
    <div id="uttarakhand-tour-explorer" className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-slate-100 font-sans mt-12">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-8 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            Vibrant Tour Circuit Map & Ledger [1]
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

          <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-4 border border-slate-800 shadow-inner relative overflow-hidden h-[420px] md:h-[500px]">
            {/* Topographic map contours simulator inside map area */}
            <div className="absolute inset-x-0 bottom-0 h-full opacity-5 pointer-events-none select-none">
              <div className="absolute inset-0 border-[6px] border-emerald-500/20 rounded-full scale-110 blur-sm" />
              <div className="absolute inset-10 border-[5px] border-amber-500/10 rounded-full scale-90 blur-sm" />
              <div className="absolute inset-24 border-[4px] border-emerald-500/10 rounded-full scale-75" />
            </div>

            {/* Glowing peak lights representing Himalaya ridges */}
            <div className="absolute top-10 left-[48%] flex flex-col items-center opacity-40 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span className="text-[10px] text-white font-black tracking-widest uppercase">Nanda Devi (7,816m)</span>
            </div>
            <div className="absolute top-16 left-[72%] flex flex-col items-center opacity-30 select-none">
              <span className="w-1 h-1 rounded-full bg-orange-400 animate-ping" style={{ animationDuration: '3.5s' }} />
              <span className="text-[9px] text-slate-300 font-extrabold tracking-wider uppercase">Trisul Peak</span>
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
                  <stop offset="0%" stopColor="#0b2545" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.65" />
                </radialGradient>
              </defs>

              {/* Grid Parallel grid lines for technical dashboard aesthetics */}
              <g opacity="0.32">
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

              {/* BACKGROUND STATE MAP VECTOR POLYGON */}
              <path 
                d={STATE_BOUNDS} 
                fill="url(#stateRadialGrad)" 
                stroke="rgba(255,255,255,0.12)" 
                strokeWidth="0.75" 
                strokeDasharray="4,6"
              />

              {/* FAINT HIGHWAY NETWORK (Showing background infrastructure connections) */}
              <g opacity="0.2">
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
                      strokeDasharray="1,2"
                    />
                  );
                })}
              </g>

              {/* Simulated Divine River Gushing trail (Ganga Flow) */}
              <path
                d="M 52 28 Q 45 48 28 70 T 20 78 T 15 95"
                fill="none"
                stroke="rgba(56, 189, 248, 0.35)"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="animate-river"
              />
              <path
                d="M 64 32 Q 58 45 28 70"
                fill="none"
                stroke="rgba(14, 165, 233, 0.25)"
                strokeWidth="0.8"
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
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.3"
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
                      strokeWidth="1.3"
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
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeDasharray="4,6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.55, strokeDashoffset: [-20, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        strokeDashoffset: { repeat: Infinity, duration: 2, ease: "linear" },
                        opacity: { duration: 0.3 }
                      }}
                    />

                    {/* Traveling pulse cruiser beacon */}
                    <motion.circle
                      key={`cruiser-${selectedTour.id}-${activeItineraryDayIdx}`}
                      r="1.2"
                      fill="#ffffff"
                      stroke="#f97316"
                      strokeWidth="0.6"
                      filter="drop-shadow(0px 0px 3px rgba(249,115,22,0.8))"
                    >
                      <animateMotion 
                        path={activePathString} 
                        dur="4s" 
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
                className="absolute z-20 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 border-2 border-white shadow-xl flex items-center justify-center -ml-4 -mt-4 pointer-events-none"
                style={{ left: `${simulatorPosition.x}%`, top: `${simulatorPosition.y}%` }}
                layout
                transition={{ type: "tween", duration: 1.4, ease: "easeInOut" }}
              >
                <Navigation className="w-4 h-4 text-white fill-current animate-bounce rotate-45" />
              </motion.div>
            )}

            {/* TOUR STATION PINS / HOVER TO INTERACT */}
            {Object.values(PIN_LOCATIONS).map((pin) => {
              const isPartOfRoute = selectedTour.stops.includes(pin.name);
              const isCurrentlyActiveInRoute = visibleStops.includes(pin.name);
              const isActive = activePin.id === pin.id;
              
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
                    triggerToast(`Viewing site profile: ${pin.name} ⛰️`);
                  }}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
                >
                  {/* Glowing core wave rings */}
                  <div className="relative">
                    <span className={`absolute -inset-2.5 rounded-full blur-xs transition-all ${
                      isActive 
                        ? 'bg-orange-500/60 opacity-100 scale-125' 
                        : isCurrentlyActiveInRoute
                        ? 'bg-amber-500/40 opacity-70 group-hover:opacity-100'
                        : isPartOfRoute
                        ? 'bg-orange-400/20 opacity-30 group-hover:opacity-100'
                        : 'bg-slate-400/20 opacity-0 group-hover:opacity-100'
                    }`} />
                    
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 shadow transition-all ${
                      isActive 
                        ? 'bg-orange-500 border-white text-white scale-125' 
                        : isCurrentlyActiveInRoute
                        ? 'bg-amber-400 border-white text-slate-900 font-extrabold'
                        : isPartOfRoute
                        ? 'bg-slate-800 border-orange-500/60 text-orange-400'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}>
                      <MapPin className="w-3 h-3 fill-current" />
                    </div>
                  </div>

                  {/* Tiny text label tags */}
                  <span className={`text-[8px] md:text-[9px] font-black tracking-tighter px-1.5 py-0.5 rounded mt-1 shadow-md border pointer-events-none transition-all truncate max-w-[84px] ${
                    isActive 
                      ? 'bg-orange-500 text-white border-orange-400 scale-110' 
                      : isCurrentlyActiveInRoute
                      ? 'bg-slate-950 text-amber-250 border-amber-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {pin.name}
                  </span>
                </button>
              );
            })}

            {/* Map compass overlay rose */}
            <div className="absolute right-4 bottom-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-2 backdrop-blur-md pointer-events-none select-none">
              <CompassIcon className="w-5 h-5 text-orange-400 animate-spin" style={{ animationDuration: '40s' }} />
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
              <Navigation className="w-3.5 h-3.5" />
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
                      <React.Fragment key={stop}>
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
                      ${selectedTour.pricePerPerson} <span className="text-xs text-slate-400 font-semibold">/ Guest</span>
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
                                {style.extraCostPerDay === 0 ? 'Included' : `+$${style.extraCostPerDay}/night`}
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
                                  +${addon.pricePerPerson} / Guest
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
                    <span>${selectedTour.pricePerPerson * travelersCount}</span>
                  </div>

                  {packageTier !== 'Standard' && (
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>Service Tier Upgrade ({packageTier})</span>
                      <span className="text-slate-700">+${(personBasePrice - selectedTour.pricePerPerson) * travelersCount}</span>
                    </div>
                  )}

                  {personAccomCost > 0 && (
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>Lodging Premium ({durationDays} Nights)</span>
                      <span className="text-slate-700">+${personAccomCost * travelersCount}</span>
                    </div>
                  )}

                  {addonsCost > 0 && (
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>Native Excursions Plan</span>
                      <span className="text-slate-700">+${addonsCost * travelersCount}</span>
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
                      <span>-${discountAmount}</span>
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
                    <span className="font-black text-orange-600">${finalPrice}</span>
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

      {/* COMPREHENSIVE CURATED HOLIDAY PACKAGES CATALOG SECTION */}
      <div className="mt-16 pt-12 border-t border-slate-100" id="curated-holiday-packages">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-extrabold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              New Catalog: Devbhoomi Holiday Packages Catalog
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
            {/* Search filter Input */}
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:border-orange-500 transition-colors w-full sm:w-48 text-slate-800"
            />

            {/* Difficulty tag Filter */}
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

            {/* Price/Duration Sorter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer text-slate-800"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration: Days</option>
              <option value="alphabetical">Alphabetical: A-Z</option>
            </select>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => {
            const isSelected = selectedTour.id === pkg.id;
            const basePackagePrice = pkg.pricePerPerson;
            const calculatedTotalPrice = basePackagePrice * travelersCount;

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
                {/* Visual Accent Colored Header Strip */}
                <div className={`h-2.5 w-full bg-gradient-to-r ${
                  pkg.badge.includes('Spiritual')
                    ? 'from-amber-500 to-orange-500'
                    : pkg.badge.includes('Action') || pkg.badge.includes('Sports')
                    ? 'from-rose-500 to-red-500'
                    : pkg.badge.includes('Nature') || pkg.badge.includes('Eco')
                    ? 'from-emerald-500 to-teal-500'
                    : 'from-sky-500 to-indigo-500'
                }`} />

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Card Main text */}
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

                  {/* Highlights Bullet Tags */}
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

                  {/* Pricing line summaries */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                    <div>
                      <span className="text-[8.5px] text-slate-400 block font-black uppercase tracking-tight">Per Voyager</span>
                      <span className="text-sm font-black text-slate-950 block leading-tight">
                        ${pkg.pricePerPerson} <span className="text-[8.5px] text-slate-400 font-bold">/ guest</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[8.5px] text-slate-400 block font-black uppercase tracking-tight">{travelersCount} Voyager{travelersCount > 1 ? 's' : ''}</span>
                      <span className="text-xs font-black text-orange-600 block leading-tight">
                        ${calculatedTotalPrice} base
                      </span>
                    </div>
                  </div>

                  {/* Operational buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      id={`btn-explore-trail-${pkg.id}`}
                      onClick={() => {
                        setSelectedTour(pkg);
                        setActiveTab('overview');
                        // Scroll up slightly to center the viewport focused on visual map area
                        const element = document.getElementById('uttarakhand-tour-explorer');
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
                      id={`btn-add-ledger-${pkg.id}`}
                      onClick={() => {
                        const bookingDetails = `${pkg.name} (${pkg.duration} Tour), ${travelersCount} Voyagers, Starts: ${selectedDate}${trekkingGearRequired ? ' (Gear Pack Included)' : ''}`;
                        onBookTour(
                          `MMT Exclusive: ${pkg.name}`,
                          bookingDetails,
                          `$${calculatedTotalPrice}`
                        );
                        triggerToast(`Booking registration successfully added to trips! 🎒`);
                      }}
                      className="bg-[#0f172a] hover:bg-slate-800 text-white font-black py-2 rounded-xl transition-transform active:scale-97 cursor-pointer text-[10.5px] flex items-center justify-center gap-1 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Trips</span>
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

        {/* Gallery Grid + Upload Side Form */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Snapshots Grid Area */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              
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
                      : "We can't find anything matching your term. Try typing another location, topic, or add your own photograph side-by-side!"}
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Snapshot Contribution Side Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs space-y-4 sticky top-6">
              <div>
                <h4 className="font-extrabold text-[13px] text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-orange-600" />
                  Contribute Destination Snapshot
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                  Simulate pitching your own photograph to the global travel feed. We will lock it into your client-side inspirations board database.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {/* Title Input field */}
                <div>
                  <label htmlFor="upload-title-input" className="block text-[9px] font-black uppercase text-slate-405 tracking-wider mb-1">Snapshot Title</label>
                  <input
                    id="upload-title-input"
                    type="text"
                    required
                    maxLength={32}
                    placeholder="e.g., Majestic Landour Sunset"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/70 rounded-lg p-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Location Select match mapping field */}
                <div>
                  <label htmlFor="upload-location-select" className="block text-[9px] font-black uppercase text-slate-405 tracking-wider mb-1">Uttarakhand Location</label>
                  <select
                    id="upload-location-select"
                    value={uploadLocation}
                    onChange={(e) => setUploadLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/70 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    {Object.keys(PIN_LOCATIONS).map(locName => (
                      <option key={locName} value={locName}>{locName}</option>
                    ))}
                  </select>
                </div>

                {/* Tag Selection Row */}
                <div>
                  <label htmlFor="upload-tag-select" className="block text-[9px] font-black uppercase text-slate-405 tracking-wider mb-1">Vibe Category</label>
                  <select
                    id="upload-tag-select"
                    value={uploadTag}
                    onChange={(e) => setUploadTag(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200/70 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Spiritual">Spiritual</option>
                    <option value="Lakes & Rivers">Lakes & Rivers</option>
                    <option value="Peaks & Snow">Peaks & Snow</option>
                    <option value="Nature & Parks">Nature & Parks</option>
                    <option value="Wildlife Reserves">Wildlife Reserves</option>
                    <option value="Adventure Paths">Adventure Paths</option>
                  </select>
                </div>

                {/* Drag-&-Drop File Uploader Container */}
                <div>
                  <span className="block text-[9px] font-black uppercase text-slate-405 tracking-wider mb-1">Upload Photo File</span>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-3.5 text-center transition-all cursor-pointer relative flex flex-col items-center justify-center ${
                      isDragOver
                        ? 'border-orange-500 bg-orange-50/50 hover:bg-orange-55/60'
                        : uploadFileBase64
                        ? 'border-emerald-400 bg-emerald-50/10'
                        : 'border-slate-250 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                    onClick={() => document.getElementById('gallery-file-uploader')?.click()}
                  >
                    <input
                      type="file"
                      id="gallery-file-uploader"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />

                    {uploadFileBase64 ? (
                      <div className="space-y-1.5 w-full">
                        <img
                          src={uploadFileBase64}
                          alt="Contribution preview"
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 object-cover rounded-md mx-auto shadow-xs border border-emerald-300"
                        />
                        <span className="block text-[9.5px] font-bold text-emerald-700 leading-none mr-0.5">Photo Loaded!</span>
                        <span className="block text-[7.5px] text-slate-400 font-semibold underline hover:text-orange-600 mt-1">Swap Image</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="block text-[10px] font-black text-slate-700">Drag & Drop Image</span>
                        <span className="block text-[8px] text-slate-400 font-medium mt-0.5">or click to browse folders</span>
                        <span className="block text-[7px] text-slate-400 mt-1">Accepts images up to 4MB</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Form Action Submit Button */}
                <button
                  type="button"
                  onClick={handleAddCustomPhoto}
                  disabled={isPhotoUploading || !uploadFileBase64 || !uploadTitle}
                  className={`w-full font-black py-2.5 rounded-xl text-[10.5px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 mt-2 ${
                    isPhotoUploading 
                      ? 'bg-slate-100 text-slate-400 cursor-wait'
                      : !uploadFileBase64 || !uploadTitle
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-500/10 cursor-pointer active:scale-97'
                  }`}
                >
                  <Camera className="w-4 h-4 shrink-0" />
                  <span>{isPhotoUploading ? 'Publishing...' : 'Pin snapshot'}</span>
                </button>
              </div>
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
