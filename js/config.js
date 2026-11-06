// ============================================================
// SITE CONFIGURATION — Weather Tomorrow (Global Meteorologic Platform)
// ============================================================
const SITE_NAME = "Weather Tomorrow";
const CONTACT_EMAIL = ""; // No contact email set — removed on the owner's instruction (2026-11-06). Do not put any email here without his say-so.

const CONFIG = {
  SITE_NAME: SITE_NAME,
  CONTACT_EMAIL: CONTACT_EMAIL,

  DEFAULT_CITY: {
    slug: "london",
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    lat: 51.5074,
    lon: -0.1278,
    region: "England",
    elevation: "25 m"
  },

  // Worldwide Countries with their top cities & coordinates
  COUNTRIES: [
    {
      code: "GB",
      name: "United Kingdom",
      region: "Europe",
      capital: "London",
      cities: [
        { slug: "london", name: "London", lat: 51.5074, lon: -0.1278, region: "Greater London", elevation: "25 m" },
        { slug: "manchester", name: "Manchester", lat: 53.4808, lon: -2.2426, region: "Greater Manchester", elevation: "38 m" },
        { slug: "birmingham", name: "Birmingham", lat: 52.4862, lon: -1.8904, region: "West Midlands", elevation: "140 m" },
        { slug: "edinburgh", name: "Edinburgh", lat: 55.9533, lon: -3.1883, region: "Scotland", elevation: "47 m" }
      ]
    },
    {
      code: "US",
      name: "United States",
      region: "Americas",
      capital: "Washington, D.C.",
      cities: [
        { slug: "new-york", name: "New York", lat: 40.7128, lon: -74.0060, region: "New York", elevation: "10 m" },
        { slug: "los-angeles", name: "Los Angeles", lat: 34.0522, lon: -118.2437, region: "California", elevation: "71 m" },
        { slug: "chicago", name: "Chicago", lat: 41.8781, lon: -87.6298, region: "Illinois", elevation: "181 m" },
        { slug: "miami", name: "Miami", lat: 25.7617, lon: -80.1918, region: "Florida", elevation: "2 m" },
        { slug: "san-francisco", name: "San Francisco", lat: 37.7749, lon: -122.4194, region: "California", elevation: "16 m" }
      ]
    },
    {
      code: "AE",
      name: "United Arab Emirates",
      region: "Middle East",
      capital: "Abu Dhabi",
      cities: [
        { slug: "dubai", name: "Dubai", lat: 25.2048, lon: 55.2708, region: "Dubai", elevation: "5 m" },
        { slug: "abu-dhabi", name: "Abu Dhabi", lat: 24.4539, lon: 54.3773, region: "Abu Dhabi", elevation: "10 m" },
        { slug: "sharjah", name: "Sharjah", lat: 25.3463, lon: 55.4209, region: "Sharjah", elevation: "4 m" }
      ]
    },
    {
      code: "FR",
      name: "France",
      region: "Europe",
      capital: "Paris",
      cities: [
        { slug: "paris", name: "Paris", lat: 48.8566, lon: 2.3522, region: "Île-de-France", elevation: "35 m" },
        { slug: "marseille", name: "Marseille", lat: 43.2965, lon: 5.3698, region: "Provence", elevation: "12 m" },
        { slug: "lyon", name: "Lyon", lat: 45.7640, lon: 4.8357, region: "Auvergne-Rhône-Alpes", elevation: "173 m" },
        { slug: "nice", name: "Nice", lat: 43.7102, lon: 7.2620, region: "French Riviera", elevation: "10 m" }
      ]
    },
    {
      code: "DE",
      name: "Germany",
      region: "Europe",
      capital: "Berlin",
      cities: [
        { slug: "berlin", name: "Berlin", lat: 52.5200, lon: 13.4050, region: "Berlin", elevation: "34 m" },
        { slug: "munich", name: "Munich", lat: 48.1351, lon: 11.5820, region: "Bavaria", elevation: "519 m" },
        { slug: "frankfurt", name: "Frankfurt", lat: 50.1109, lon: 8.6821, region: "Hesse", elevation: "112 m" },
        { slug: "hamburg", name: "Hamburg", lat: 53.5511, lon: 9.9937, region: "Hamburg", elevation: "6 m" }
      ]
    },
    {
      code: "JP",
      name: "Japan",
      region: "Asia",
      capital: "Tokyo",
      cities: [
        { slug: "tokyo", name: "Tokyo", lat: 35.6762, lon: 139.6503, region: "Kanto", elevation: "40 m" },
        { slug: "osaka", name: "Osaka", lat: 34.6937, lon: 135.5023, region: "Kansai", elevation: "15 m" },
        { slug: "kyoto", name: "Kyoto", lat: 35.0116, lon: 135.7681, region: "Kansai", elevation: "50 m" },
        { slug: "sapporo", name: "Sapporo", lat: 43.0618, lon: 141.3545, region: "Hokkaido", elevation: "29 m" }
      ]
    },
    {
      code: "CA",
      name: "Canada",
      region: "Americas",
      capital: "Ottawa",
      cities: [
        { slug: "toronto", name: "Toronto", lat: 43.6532, lon: -79.3832, region: "Ontario", elevation: "76 m" },
        { slug: "vancouver", name: "Vancouver", lat: 49.2827, lon: -123.1207, region: "British Columbia", elevation: "4 m" },
        { slug: "montreal", name: "Montreal", lat: 45.5017, lon: -73.5673, region: "Quebec", elevation: "36 m" },
        { slug: "calgary", name: "Calgary", lat: 51.0447, lon: -114.0719, region: "Alberta", elevation: "1,045 m" }
      ]
    },
    {
      code: "AU",
      name: "Australia",
      region: "Oceania",
      capital: "Canberra",
      cities: [
        { slug: "sydney", name: "Sydney", lat: -33.8688, lon: 151.2093, region: "New South Wales", elevation: "19 m" },
        { slug: "melbourne", name: "Melbourne", lat: -37.8136, lon: 144.9631, region: "Victoria", elevation: "31 m" },
        { slug: "brisbane", name: "Brisbane", lat: -27.4698, lon: 153.0251, region: "Queensland", elevation: "28 m" },
        { slug: "perth", name: "Perth", lat: -31.9505, lon: 115.8605, region: "Western Australia", elevation: "20 m" }
      ]
    },
    {
      code: "SA",
      name: "Saudi Arabia",
      region: "Middle East",
      capital: "Riyadh",
      cities: [
        { slug: "riyadh", name: "Riyadh", lat: 24.7136, lon: 46.6753, region: "Riyadh Province", elevation: "612 m" },
        { slug: "jeddah", name: "Jeddah", lat: 21.5433, lon: 39.1728, region: "Makkah Province", elevation: "12 m" },
        { slug: "mecca", name: "Mecca", lat: 21.3891, lon: 39.8579, region: "Makkah Province", elevation: "277 m" },
        { slug: "medina", name: "Medina", lat: 24.5247, lon: 39.5692, region: "Medina Province", elevation: "608 m" }
      ]
    },
    {
      code: "TR",
      name: "Turkey",
      region: "Europe/Asia",
      capital: "Ankara",
      cities: [
        { slug: "istanbul", name: "Istanbul", lat: 41.0082, lon: 28.9784, region: "Marmara", elevation: "40 m" },
        { slug: "ankara", name: "Ankara", lat: 39.9334, lon: 32.8597, region: "Central Anatolia", elevation: "938 m" },
        { slug: "antalya", name: "Antalya", lat: 36.8969, lon: 30.7133, region: "Mediterranean", elevation: "30 m" }
      ]
    },
    {
      code: "IT",
      name: "Italy",
      region: "Europe",
      capital: "Rome",
      cities: [
        { slug: "rome", name: "Rome", lat: 41.9028, lon: 12.4964, region: "Lazio", elevation: "21 m" },
        { slug: "milan", name: "Milan", lat: 45.4642, lon: 9.1900, region: "Lombardy", elevation: "120 m" },
        { slug: "florence", name: "Florence", lat: 43.7696, lon: 11.2558, region: "Tuscany", elevation: "50 m" },
        { slug: "venice", name: "Venice", lat: 45.4408, lon: 12.3155, region: "Veneto", elevation: "1 m" }
      ]
    },
    {
      code: "ES",
      name: "Spain",
      region: "Europe",
      capital: "Madrid",
      cities: [
        { slug: "madrid", name: "Madrid", lat: 40.4168, lon: -3.7038, region: "Community of Madrid", elevation: "667 m" },
        { slug: "barcelona", name: "Barcelona", lat: 41.3879, lon: 2.1699, region: "Catalonia", elevation: "12 m" },
        { slug: "seville", name: "Seville", lat: 37.3891, lon: -5.9845, region: "Andalusia", elevation: "7 m" }
      ]
    },
    {
      code: "SG",
      name: "Singapore",
      region: "Asia",
      capital: "Singapore",
      cities: [
        { slug: "singapore", name: "Singapore", lat: 1.3521, lon: 103.8198, region: "Central", elevation: "15 m" }
      ]
    },
    {
      code: "EG",
      name: "Egypt",
      region: "Africa",
      capital: "Cairo",
      cities: [
        { slug: "cairo", name: "Cairo", lat: 30.0444, lon: 31.2357, region: "Cairo Governorate", elevation: "23 m" },
        { slug: "alexandria", name: "Alexandria", lat: 31.2001, lon: 29.9187, region: "Alexandria", elevation: "5 m" }
      ]
    },
    {
      code: "BR",
      name: "Brazil",
      region: "Americas",
      capital: "Brasília",
      cities: [
        { slug: "sao-paulo", name: "São Paulo", lat: -23.5505, lon: -46.6333, region: "Southeast", elevation: "760 m" },
        { slug: "rio-de-janeiro", name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, region: "Southeast", elevation: "2 m" }
      ]
    },
    {
      code: "IN",
      name: "India",
      region: "Asia",
      capital: "New Delhi",
      cities: [
        { slug: "new-delhi", name: "New Delhi", lat: 28.6139, lon: 77.2090, region: "Delhi", elevation: "216 m" },
        { slug: "mumbai", name: "Mumbai", lat: 19.0760, lon: 72.8777, region: "Maharashtra", elevation: "14 m" },
        { slug: "bengaluru", name: "Bengaluru", lat: 12.9716, lon: 77.5946, region: "Karnataka", elevation: "920 m" }
      ]
    },
    {
      code: "PK",
      name: "Pakistan",
      region: "Asia",
      capital: "Islamabad",
      cities: [
        { slug: "karachi", name: "Karachi", lat: 24.8607, lon: 67.0011, region: "Sindh", elevation: "10 m" },
        { slug: "lahore", name: "Lahore", lat: 31.5497, lon: 74.3436, region: "Punjab", elevation: "217 m" },
        { slug: "islamabad", name: "Islamabad", lat: 33.6844, lon: 73.0479, region: "Federal Capital", elevation: "540 m" },
        { slug: "rawalpindi", name: "Rawalpindi", lat: 33.5651, lon: 73.0169, region: "Punjab", elevation: "508 m" },
        { slug: "multan", name: "Multan", lat: 30.1575, lon: 71.5249, region: "Punjab", elevation: "122 m" },
        { slug: "faisalabad", name: "Faisalabad", lat: 31.4504, lon: 73.135, region: "Punjab", elevation: "183 m" },
        { slug: "peshawar", name: "Peshawar", lat: 34.0151, lon: 71.5249, region: "Khyber Pakhtunkhwa", elevation: "331 m" },
        { slug: "quetta", name: "Quetta", lat: 30.1798, lon: 66.975, region: "Balochistan", elevation: "1,680 m" },
        { slug: "gujrat", name: "Gujrat", lat: 32.5736, lon: 74.1005, region: "Punjab", elevation: "233 m" },
        { slug: "sialkot", name: "Sialkot", lat: 32.4945, lon: 74.5229, region: "Punjab", elevation: "256 m" },
        { slug: "hyderabad", name: "Hyderabad", lat: 25.396, lon: 68.3578, region: "Sindh", elevation: "13 m" },
        { slug: "bahawalpur", name: "Bahawalpur", lat: 29.3956, lon: 71.6722, region: "Punjab", elevation: "117 m" },
        { slug: "sargodha", name: "Sargodha", lat: 32.0836, lon: 72.6711, region: "Punjab", elevation: "189 m" },
        { slug: "murree", name: "Murree", lat: 33.9047, lon: 73.3919, region: "Punjab", elevation: "2,291 m" },
        { slug: "mardan", name: "Mardan", lat: 34.1986, lon: 72.0231, region: "Khyber Pakhtunkhwa", elevation: "311 m" },
        { slug: "layyah", name: "Layyah", lat: 30.9613, lon: 70.9397, region: "Punjab", elevation: "143 m" },
        { slug: "mansehra", name: "Mansehra", lat: 34.3313, lon: 73.1966, region: "Khyber Pakhtunkhwa", elevation: "1,088 m" },
        { slug: "haripur", name: "Haripur", lat: 33.9999, lon: 72.9344, region: "Khyber Pakhtunkhwa", elevation: "610 m" },
        { slug: "jhelum", name: "Jhelum", lat: 32.9425, lon: 73.7278, region: "Punjab", elevation: "234 m" },
        { slug: "mirpur", name: "Mirpur", lat: 33.1489, lon: 73.7537, region: "Azad Jammu & Kashmir", elevation: "459 m" },
        { slug: "rawalakot", name: "Rawalakot", lat: 33.8578, lon: 73.7604, region: "Azad Jammu & Kashmir", elevation: "1,638 m" },
        { slug: "narowal", name: "Narowal", lat: 32.0993, lon: 74.8736, region: "Punjab", elevation: "245 m" },
        { slug: "toba-tek-singh", name: "Toba Tek Singh", lat: 30.9748, lon: 72.4826, region: "Punjab", elevation: "183 m" },
        { slug: "rahim-yar-khan", name: "Rahim Yar Khan", lat: 28.4195, lon: 70.302, region: "Punjab", elevation: "83 m" },
        { slug: "abbottabad", name: "Abbottabad", lat: 34.1688, lon: 73.2215, region: "Khyber Pakhtunkhwa", elevation: "1,260 m" },
        { slug: "khushab", name: "Khushab", lat: 32.2904, lon: 72.3516, region: "Punjab", elevation: "187 m" },
        { slug: "attock", name: "Attock", lat: 33.7695, lon: 72.3611, region: "Punjab", elevation: "361 m" },
        { slug: "dera-ghazi-khan", name: "Dera Ghazi Khan", lat: 30.0321, lon: 70.6401, region: "Punjab", elevation: "125 m" },
        { slug: "kamoke", name: "Kamoke", lat: 31.9818, lon: 74.2259, region: "Punjab", elevation: "223 m" },
        { slug: "karak", name: "Karak", lat: 33.116, lon: 71.0951, region: "Khyber Pakhtunkhwa", elevation: "585 m" },
        { slug: "nowshera", name: "Nowshera", lat: 34.0156, lon: 71.9813, region: "Khyber Pakhtunkhwa", elevation: "294 m" },
        { slug: "swabi", name: "Swabi", lat: 34.1262, lon: 72.4743, region: "Khyber Pakhtunkhwa", elevation: "341 m" },
        { slug: "taxila", name: "Taxila", lat: 33.7423, lon: 72.8145, region: "Punjab", elevation: "516 m" },
        { slug: "bahawalnagar", name: "Bahawalnagar", lat: 29.9936, lon: 73.2528, region: "Punjab", elevation: "159 m" },
        { slug: "bannu", name: "Bannu", lat: 32.9857, lon: 70.6036, region: "Khyber Pakhtunkhwa", elevation: "380 m" },
        { slug: "chichawatni", name: "Chichawatni", lat: 30.5317, lon: 72.6914, region: "Punjab", elevation: "165 m" },
        { slug: "dera-ismail-khan", name: "Dera Ismail Khan", lat: 31.8275, lon: 70.9091, region: "Khyber Pakhtunkhwa", elevation: "178 m" },
        { slug: "shikarpur", name: "Shikarpur", lat: 27.9579, lon: 68.6467, region: "Sindh", elevation: "60 m" },
        { slug: "thatta", name: "Thatta", lat: 24.7469, lon: 67.924, region: "Sindh", elevation: "17 m" },
        { slug: "turbat", name: "Turbat", lat: 26.0028, lon: 63.0506, region: "Balochistan", elevation: "142 m" },
        { slug: "wazirabad", name: "Wazirabad", lat: 32.4417, lon: 74.1182, region: "Punjab", elevation: "236 m" },
        { slug: "ahmadpur-east", name: "Ahmadpur East", lat: 29.2612, lon: 71.4765, region: "Punjab", elevation: "113 m" },
      ]
    },
    {
      code: "CH",
      name: "Switzerland",
      region: "Europe",
      capital: "Bern",
      cities: [
        { slug: "zurich", name: "Zurich", lat: 47.3769, lon: 8.5417, region: "Zurich", elevation: "408 m" },
        { slug: "geneva", name: "Geneva", lat: 46.2044, lon: 6.1432, region: "Geneva", elevation: "375 m" }
      ]
    },
    {
      code: "ZA",
      name: "South Africa",
      region: "Africa",
      capital: "Pretoria",
      cities: [
        { slug: "cape-town", name: "Cape Town", lat: -33.9249, lon: 18.4241, region: "Western Cape", elevation: "25 m" },
        { slug: "johannesburg", name: "Johannesburg", lat: -26.2041, lon: 28.0473, region: "Gauteng", elevation: "1,753 m" }
      ]
    },
    {
      code: "NL",
      name: "Netherlands",
      region: "Europe",
      capital: "Amsterdam",
      cities: [
        { slug: "amsterdam", name: "Amsterdam", lat: 52.3676, lon: 4.9041, region: "North Holland", elevation: "2 m" },
        { slug: "rotterdam", name: "Rotterdam", lat: 51.9244, lon: 4.4777, region: "South Holland", elevation: "0 m" }
      ]
    }
  ],

  // Popular Top World Cities for quick suggestion pills & home grid
  FEATURED_CITIES: [
    { slug: "london", name: "London", country: "United Kingdom", countryCode: "GB", lat: 51.5074, lon: -0.1278, region: "England", elevation: "25 m" },
    { slug: "new-york", name: "New York", country: "United States", countryCode: "US", lat: 40.7128, lon: -74.0060, region: "New York", elevation: "10 m" },
    { slug: "tokyo", name: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.6762, lon: 139.6503, region: "Kanto", elevation: "40 m" },
    { slug: "paris", name: "Paris", country: "France", countryCode: "FR", lat: 48.8566, lon: 2.3522, region: "Île-de-France", elevation: "35 m" },
    { slug: "dubai", name: "Dubai", country: "United Arab Emirates", countryCode: "AE", lat: 25.2048, lon: 55.2708, region: "Dubai", elevation: "5 m" },
    { slug: "sydney", name: "Sydney", country: "Australia", countryCode: "AU", lat: -33.8688, lon: 151.2093, region: "New South Wales", elevation: "19 m" },
    { slug: "toronto", name: "Toronto", country: "Canada", countryCode: "CA", lat: 43.6532, lon: -79.3832, region: "Ontario", elevation: "76 m" },
    { slug: "berlin", name: "Berlin", country: "Germany", countryCode: "DE", lat: 52.5200, lon: 13.4050, region: "Berlin", elevation: "34 m" },
    { slug: "rome", name: "Rome", country: "Italy", countryCode: "IT", lat: 41.9028, lon: 12.4964, region: "Lazio", elevation: "21 m" },
    { slug: "singapore", name: "Singapore", country: "Singapore", countryCode: "SG", lat: 1.3521, lon: 103.8198, region: "Central", elevation: "15 m" },
    { slug: "istanbul", name: "Istanbul", country: "Turkey", countryCode: "TR", lat: 41.0082, lon: 28.9784, region: "Marmara", elevation: "40 m" },
    { slug: "riyadh", name: "Riyadh", country: "Saudi Arabia", countryCode: "SA", lat: 24.7136, lon: 46.6753, region: "Riyadh Province", elevation: "612 m" },
    { slug: "cairo", name: "Cairo", country: "Egypt", countryCode: "EG", lat: 30.0444, lon: 31.2357, region: "Cairo", elevation: "23 m" },
    { slug: "madrid", name: "Madrid", country: "Spain", countryCode: "ES", lat: 40.4168, lon: -3.7038, region: "Community of Madrid", elevation: "667 m" },
    { slug: "karachi", name: "Karachi", country: "Pakistan", countryCode: "PK", lat: 24.8607, lon: 67.0011, region: "Sindh", elevation: "10 m" },
    { slug: "lahore", name: "Lahore", country: "Pakistan", countryCode: "PK", lat: 31.5497, lon: 74.3436, region: "Punjab", elevation: "217 m" },
    { slug: "islamabad", name: "Islamabad", country: "Pakistan", countryCode: "PK", lat: 33.6844, lon: 73.0479, region: "Federal Capital", elevation: "540 m" },
    { slug: "rawalpindi", name: "Rawalpindi", country: "Pakistan", countryCode: "PK", lat: 33.5651, lon: 73.0169, region: "Punjab", elevation: "508 m" },
    { slug: "multan", name: "Multan", country: "Pakistan", countryCode: "PK", lat: 30.1575, lon: 71.5249, region: "Punjab", elevation: "122 m" },
    { slug: "faisalabad", name: "Faisalabad", country: "Pakistan", countryCode: "PK", lat: 31.4504, lon: 73.135, region: "Punjab", elevation: "183 m" },
    { slug: "peshawar", name: "Peshawar", country: "Pakistan", countryCode: "PK", lat: 34.0151, lon: 71.5249, region: "Khyber Pakhtunkhwa", elevation: "331 m" },
    { slug: "quetta", name: "Quetta", country: "Pakistan", countryCode: "PK", lat: 30.1798, lon: 66.975, region: "Balochistan", elevation: "1,680 m" },
    { slug: "gujrat", name: "Gujrat", country: "Pakistan", countryCode: "PK", lat: 32.5736, lon: 74.1005, region: "Punjab", elevation: "233 m" },
    { slug: "sialkot", name: "Sialkot", country: "Pakistan", countryCode: "PK", lat: 32.4945, lon: 74.5229, region: "Punjab", elevation: "256 m" },
    { slug: "hyderabad", name: "Hyderabad", country: "Pakistan", countryCode: "PK", lat: 25.396, lon: 68.3578, region: "Sindh", elevation: "13 m" },
    { slug: "bahawalpur", name: "Bahawalpur", country: "Pakistan", countryCode: "PK", lat: 29.3956, lon: 71.6722, region: "Punjab", elevation: "117 m" },
    { slug: "sargodha", name: "Sargodha", country: "Pakistan", countryCode: "PK", lat: 32.0836, lon: 72.6711, region: "Punjab", elevation: "189 m" },
    { slug: "murree", name: "Murree", country: "Pakistan", countryCode: "PK", lat: 33.9047, lon: 73.3919, region: "Punjab", elevation: "2,291 m" },
    { slug: "mardan", name: "Mardan", country: "Pakistan", countryCode: "PK", lat: 34.1986, lon: 72.0231, region: "Khyber Pakhtunkhwa", elevation: "311 m" },
    { slug: "layyah", name: "Layyah", country: "Pakistan", countryCode: "PK", lat: 30.9613, lon: 70.9397, region: "Punjab", elevation: "143 m" },
    { slug: "mansehra", name: "Mansehra", country: "Pakistan", countryCode: "PK", lat: 34.3313, lon: 73.1966, region: "Khyber Pakhtunkhwa", elevation: "1,088 m" },
    { slug: "haripur", name: "Haripur", country: "Pakistan", countryCode: "PK", lat: 33.9999, lon: 72.9344, region: "Khyber Pakhtunkhwa", elevation: "610 m" },
    { slug: "jhelum", name: "Jhelum", country: "Pakistan", countryCode: "PK", lat: 32.9425, lon: 73.7278, region: "Punjab", elevation: "234 m" },
    { slug: "mirpur", name: "Mirpur", country: "Pakistan", countryCode: "PK", lat: 33.1489, lon: 73.7537, region: "Azad Jammu & Kashmir", elevation: "459 m" },
    { slug: "rawalakot", name: "Rawalakot", country: "Pakistan", countryCode: "PK", lat: 33.8578, lon: 73.7604, region: "Azad Jammu & Kashmir", elevation: "1,638 m" },
    { slug: "narowal", name: "Narowal", country: "Pakistan", countryCode: "PK", lat: 32.0993, lon: 74.8736, region: "Punjab", elevation: "245 m" },
    { slug: "toba-tek-singh", name: "Toba Tek Singh", country: "Pakistan", countryCode: "PK", lat: 30.9748, lon: 72.4826, region: "Punjab", elevation: "183 m" },
    { slug: "rahim-yar-khan", name: "Rahim Yar Khan", country: "Pakistan", countryCode: "PK", lat: 28.4195, lon: 70.302, region: "Punjab", elevation: "83 m" },
    { slug: "abbottabad", name: "Abbottabad", country: "Pakistan", countryCode: "PK", lat: 34.1688, lon: 73.2215, region: "Khyber Pakhtunkhwa", elevation: "1,260 m" },
    { slug: "khushab", name: "Khushab", country: "Pakistan", countryCode: "PK", lat: 32.2904, lon: 72.3516, region: "Punjab", elevation: "187 m" },
    { slug: "attock", name: "Attock", country: "Pakistan", countryCode: "PK", lat: 33.7695, lon: 72.3611, region: "Punjab", elevation: "361 m" },
    { slug: "dera-ghazi-khan", name: "Dera Ghazi Khan", country: "Pakistan", countryCode: "PK", lat: 30.0321, lon: 70.6401, region: "Punjab", elevation: "125 m" },
    { slug: "kamoke", name: "Kamoke", country: "Pakistan", countryCode: "PK", lat: 31.9818, lon: 74.2259, region: "Punjab", elevation: "223 m" },
    { slug: "karak", name: "Karak", country: "Pakistan", countryCode: "PK", lat: 33.116, lon: 71.0951, region: "Khyber Pakhtunkhwa", elevation: "585 m" },
    { slug: "nowshera", name: "Nowshera", country: "Pakistan", countryCode: "PK", lat: 34.0156, lon: 71.9813, region: "Khyber Pakhtunkhwa", elevation: "294 m" },
    { slug: "swabi", name: "Swabi", country: "Pakistan", countryCode: "PK", lat: 34.1262, lon: 72.4743, region: "Khyber Pakhtunkhwa", elevation: "341 m" },
    { slug: "taxila", name: "Taxila", country: "Pakistan", countryCode: "PK", lat: 33.7423, lon: 72.8145, region: "Punjab", elevation: "516 m" },
    { slug: "bahawalnagar", name: "Bahawalnagar", country: "Pakistan", countryCode: "PK", lat: 29.9936, lon: 73.2528, region: "Punjab", elevation: "159 m" },
    { slug: "bannu", name: "Bannu", country: "Pakistan", countryCode: "PK", lat: 32.9857, lon: 70.6036, region: "Khyber Pakhtunkhwa", elevation: "380 m" },
    { slug: "chichawatni", name: "Chichawatni", country: "Pakistan", countryCode: "PK", lat: 30.5317, lon: 72.6914, region: "Punjab", elevation: "165 m" },
    { slug: "dera-ismail-khan", name: "Dera Ismail Khan", country: "Pakistan", countryCode: "PK", lat: 31.8275, lon: 70.9091, region: "Khyber Pakhtunkhwa", elevation: "178 m" },
    { slug: "shikarpur", name: "Shikarpur", country: "Pakistan", countryCode: "PK", lat: 27.9579, lon: 68.6467, region: "Sindh", elevation: "60 m" },
    { slug: "thatta", name: "Thatta", country: "Pakistan", countryCode: "PK", lat: 24.7469, lon: 67.924, region: "Sindh", elevation: "17 m" },
    { slug: "turbat", name: "Turbat", country: "Pakistan", countryCode: "PK", lat: 26.0028, lon: 63.0506, region: "Balochistan", elevation: "142 m" },
    { slug: "wazirabad", name: "Wazirabad", country: "Pakistan", countryCode: "PK", lat: 32.4417, lon: 74.1182, region: "Punjab", elevation: "236 m" },
    { slug: "ahmadpur-east", name: "Ahmadpur East", country: "Pakistan", countryCode: "PK", lat: 29.2612, lon: 71.4765, region: "Punjab", elevation: "113 m" },
  ]
};

// Helper methods
CONFIG.getCountry = function(code) {
  return CONFIG.COUNTRIES.find(c => c.code.toUpperCase() === (code || '').toUpperCase()) || null;
};

CONFIG.getCitiesForCountry = function(code) {
  const c = CONFIG.getCountry(code);
  return c ? c.cities : [];
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SITE_NAME, CONTACT_EMAIL, CONFIG };
}
