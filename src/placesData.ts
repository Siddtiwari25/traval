import { City } from './types';

export interface CategorizedPlace extends City {
  category: string;
}

export const CATEGORIZED_PLACES: CategorizedPlace[] = [
  // Hill Stations
  { name: 'Mussoorie', code: 'MSO', hotels: 'Library Chowk & Mall Road', category: 'Hill Stations' },
  { name: 'Nainital', code: 'NTL', hotels: 'Tallital Bus Station & Lake Yard', category: 'Hill Stations' },
  { name: 'Auli', code: 'AUL', hotels: 'Ski Resort Cable Car Point', category: 'Hill Stations' },
  { name: 'Ranikhet', code: 'RNK', hotels: 'Cantonment Pine Forest Ridge', category: 'Hill Stations' },
  { name: 'Kausani', code: 'KSN', hotels: 'Trishul Peak Himalayan View Stand', category: 'Hill Stations' },
  { name: 'Almora', code: 'ALM', hotels: 'Kasar Devi & Lala Bazaar Stand', category: 'Hill Stations' },
  { name: 'Chakrata', code: 'CHK', hotels: 'Chirmiri Sunset Peak Point', category: 'Hill Stations' },
  { name: 'Munsiyari', code: 'MSY', hotels: 'Panchachuli Peak Base Point', category: 'Hill Stations' },
  { name: 'Lansdowne', code: 'LDN', hotels: 'Gandhi Chowk Cantonment Town', category: 'Hill Stations' },
  { name: 'Dhanaulti', code: 'DHT', hotels: 'Eco Park Main Entrance', category: 'Hill Stations' },
  { name: 'Kanatal', code: 'KNT', hotels: 'Apple Orchard Ridge Point', category: 'Hill Stations' },
  { name: 'Chaukori', code: 'CKR', hotels: 'Tea Gardens Himalayan Viewpoint', category: 'Hill Stations' },

  // Religious Places
  { name: 'Kedarnath', code: 'KDR', hotels: 'Sacred Temple Shrine Base (Gaurikund)', category: 'Religious Places' },
  { name: 'Badrinath', code: 'BDR', hotels: 'Alaknanda River Sacred Ghats Temple', category: 'Religious Places' },
  { name: 'Gangotri', code: 'GGT', hotels: 'Origin of Ganga Holy Shrine', category: 'Religious Places' },
  { name: 'Yamunotri', code: 'YMT', hotels: 'Yamuna River Holy Source', category: 'Religious Places' },
  { name: 'Haridwar', code: 'HW', hotels: 'Har Ki Pauri Ghat & Station', category: 'Religious Places' },
  { name: 'Rishikesh', code: 'RK', hotels: 'Laxman Jhula & Tapovan Crossing', category: 'Religious Places' },
  { name: 'Hemkund Sahib', code: 'HKS', hotels: 'Sikh Pilgrimage Valley Base', category: 'Religious Places' },
  { name: 'Jageshwar Temples', code: 'JGW', hotels: 'Heritage Stone Shiva Temples', category: 'Religious Places' },
  { name: 'Neelkanth Mahadev Temple', code: 'NMT', hotels: 'Forest Peak Lord Shiva Shrine', category: 'Religious Places' },
  { name: 'Tungnath Temple', code: 'TNT', hotels: 'Highest Lord Shiva Temple Peak', category: 'Religious Places' },
  { name: 'Baijnath Temple', code: 'BJT', hotels: 'Garur Valley Gomti Confluence', category: 'Religious Places' },
  { name: 'Purnagiri Temple', code: 'PGT', hotels: 'Sharda River Shaktipeeth Border', category: 'Religious Places' },
  { name: 'Kartik Swami Temple', code: 'KST', hotels: '360 Degree Ridge View Sanctuary', category: 'Religious Places' },

  // National Parks & Wildlife
  { name: 'Jim Corbett National Park', code: 'JCN', hotels: 'Ramnagar Safari Entry Gate', category: 'National Parks & Wildlife' },
  { name: 'Rajaji National Park', code: 'RJP', hotels: 'Chilla Range Elephant Sanctuary', category: 'National Parks & Wildlife' },
  { name: 'Valley of Flowers National Park', code: 'VOF', hotels: 'UNESCO World Heritage Flora Base', category: 'National Parks & Wildlife' },
  { name: 'Nanda Devi National Park', code: 'NDN', hotels: 'High Himalayan Biosphere Reserve', category: 'National Parks & Wildlife' },
  { name: 'Binsar Wildlife Sanctuary', code: 'BWS', hotels: 'Zero Point Oak Forest Ridge', category: 'National Parks & Wildlife' },
  { name: 'Askot Wildlife Sanctuary', code: 'AWS', hotels: 'Pithoragarh Musk Deer Habitat', category: 'National Parks & Wildlife' },
  { name: 'Govind Wildlife Sanctuary', code: 'GWS', hotels: 'High Altitude Wilderness Base', category: 'National Parks & Wildlife' },

  // Lakes
  { name: 'Naini Lake', code: 'NLK', hotels: 'Nainital Lake Circle Boating Station', category: 'Lakes' },
  { name: 'Bhimtal', code: 'BML', hotels: 'Bhimtal Lake Side Stand', category: 'Lakes' },
  { name: 'Naukuchiatal', code: 'NKT', hotels: '9-Cornered Lake Paragliding Spot', category: 'Lakes' },
  { name: 'Sattal', code: 'STL', hotels: 'Sattal Lake Camping Ground', category: 'Lakes' },
  { name: 'Khurpatal', code: 'KPT', hotels: 'Emerald Green Lake Basin', category: 'Lakes' },
  { name: 'Tehri Lake', code: 'TLK', hotels: 'Colossal Water Sports Reservoir', category: 'Lakes' },
  { name: 'Deoria Tal', code: 'DTL', hotels: 'Chopta Reflection Lake Summit', category: 'Lakes' },
  { name: 'Hemkund Lake', code: 'HKL', hotels: 'High Altitude Glacial Sacred Lake', category: 'Lakes' },
  { name: 'Dodital', code: 'DDL', hotels: 'Ganesh Holy Lake Pine Forest Trek', category: 'Lakes' },

  // Adventure Destinations
  { name: 'Chopta', code: 'CHP', hotels: 'Switzerland of Uttarakhand & Base Trek', category: 'Adventure Destinations' },
  { name: 'Tungnath', code: 'TNG', hotels: 'Trekking & Pilgrimage Peaks', category: 'Adventure Destinations' },
  { name: 'Chandrashila', code: 'CSL', hotels: 'Peak Summit High Wilderness', category: 'Adventure Destinations' },
  { name: 'Valley of Flowers', code: 'VFL', hotels: 'High Valley Trek & Meadow', category: 'Adventure Destinations' },
  { name: 'Har Ki Dun', code: 'HKD', hotels: 'Garhwal Valley of Gods Trek', category: 'Adventure Destinations' },
  { name: 'Kedarkantha Trek', code: 'KKT', hotels: 'Winter Snow Trekking Peak', category: 'Adventure Destinations' },
  { name: 'Roopkund Trek', code: 'RPT', hotels: 'Mystery Skeletal High Glacial Lake', category: 'Adventure Destinations' },
  { name: 'Pindari Glacier', code: 'PGL', hotels: 'Kumaon Glacial Wilderness Trek', category: 'Adventure Destinations' },
  { name: 'Gaumukh Glacier', code: 'GGL', hotels: 'Holy Source of River Ganges Trek', category: 'Adventure Destinations' },
  { name: 'Kuari Pass', code: 'KPS', hotels: 'Curzon Trail Snow Peak Vista', category: 'Adventure Destinations' },
  { name: 'Nag Tibba', code: 'NTB', hotels: 'Serpents Peak Mussoorie Weekend Trek', category: 'Adventure Destinations' },
  { name: 'Rishikesh (River Rafting & Bungee Jumping)', code: 'RRB', hotels: 'Adventure Hub Rapids Base', category: 'Adventure Destinations' },

  // Scenic Valleys
  { name: 'Harsil Valley', code: 'HSV', hotels: 'Apple Orchards Bhagirathi River', category: 'Scenic Valleys' },
  { name: 'Johar Valley', code: 'JHV', hotels: 'Milam Glacier Ancient Trade Route', category: 'Scenic Valleys' },
  { name: 'Har Ki Dun Valley', code: 'HDV', hotels: 'Tons River Cradle Valley', category: 'Scenic Valleys' },
  { name: 'Pindar Valley', code: 'PDV', hotels: 'Pindar River Scenic Gorge', category: 'Scenic Valleys' },
  { name: 'Mandal Valley', code: 'MDV', hotels: 'Chopta Route Lush Canopy Valley', category: 'Scenic Valleys' },
  { name: 'Tons Valley', code: 'TSV', hotels: 'Garhwal Pine Forest Border Valley', category: 'Scenic Valleys' },

  // Waterfalls & Caves
  { name: 'Kempty Falls', code: 'KMF', hotels: 'Mussoorie Scenic Cascading Pool', category: 'Waterfalls & Caves' },
  { name: 'Tiger Falls', code: 'TGF', hotels: 'Chakrata Deep Forest Towering Waterfall', category: 'Waterfalls & Caves' },
  { name: 'Bhatta Falls', code: 'BTF', hotels: 'Mussoorie Eco Park Adventure Falls', category: 'Waterfalls & Caves' },
  { name: 'Sahastradhara', code: 'SDR', hotels: 'Sulphur Springs Healing Water Caves', category: 'Waterfalls & Caves' },
  { name: 'Robber\'s Cave (Gucchu Pani)', code: 'RBC', hotels: 'Dehradun River Canyon Cave', category: 'Waterfalls & Caves' },

  // Cities & Towns
  { name: 'Dehradun', code: 'DDN', hotels: 'State Capital Academic Gateway', category: 'Cities & Towns' },
  { name: 'Haridwar', code: 'HW', hotels: 'Ganga Aarti Pilgrimage Town', category: 'Cities & Towns' },
  { name: 'Rishikesh', code: 'RK', hotels: 'Yoga Capital River Rafting Crossing', category: 'Cities & Towns' },
  { name: 'Nainital', code: 'NTL', hotels: 'Emerald Lake Hill Station Basin', category: 'Cities & Towns' },
  { name: 'Haldwani', code: 'HLD', hotels: 'The Gateway to Kumaon Business Hub', category: 'Cities & Towns' },
  { name: 'Almora', code: 'ALM', hotels: 'Heritage Town Kumaoni Culture Ridge', category: 'Cities & Towns' },
  { name: 'Mussoorie', code: 'MSO', hotels: 'Queen of Hills Colonial Ridge', category: 'Cities & Towns' },
  { name: 'Roorkee', code: 'RRK', hotels: 'IIT Engineering Canal Town', category: 'Cities & Towns' },
  { name: 'Kashipur', code: 'KSP', hotels: 'Industrial Town Ancient Ruins', category: 'Cities & Towns' },
  { name: 'Rudrapur', code: 'RDP', hotels: 'Industrial Commercial Hub', category: 'Cities & Towns' },
  { name: 'Kotdwar', code: 'KTD', hotels: 'Gateway to Garhwal River Base', category: 'Cities & Towns' },
  { name: 'Ramnagar', code: 'RMN', hotels: 'Jim Corbett National Park Safari Hub', category: 'Cities & Towns' },
  { name: 'Pithoragarh', code: 'PTH', hotels: 'Himalayan Valley Little Kashmir', category: 'Cities & Towns' },
  { name: 'Bageshwar', code: 'BAG', hotels: 'Sacred Bagnath Temple Confluence', category: 'Cities & Towns' },
  { name: 'Champawat', code: 'CPT', hotels: 'Historical Chand Dynasty Town', category: 'Cities & Towns' },
  { name: 'Uttarkashi', code: 'UTK', hotels: 'Pilgrimage and Trekking Hub Base', category: 'Cities & Towns' },
  { name: 'Srinagar (Garhwal)', code: 'SNG', hotels: 'Educational Cultural Alaknanda Valley', category: 'Cities & Towns' },
  { name: 'Joshimath', code: 'JMT', hotels: 'Gateway to Badrinath & Auli Slopes', category: 'Cities & Towns' },
  { name: 'Ranikhet', code: 'RNK', hotels: 'Quiet Cantonment Hill Station', category: 'Cities & Towns' },
  { name: 'New Tehri', code: 'NTH', hotels: 'Tehri Lake Water Sports Modern City', category: 'Cities & Towns' }
];

export const CATEGORIES = [
  'Hill Stations',
  'Religious Places',
  'National Parks & Wildlife',
  'Lakes',
  'Adventure Destinations',
  'Scenic Valleys',
  'Waterfalls & Caves',
  'Cities & Towns'
];
