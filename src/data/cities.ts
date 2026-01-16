// Comprehensive city and timezone database
// Organized by continent/region similar to macOS

export interface CityData {
  name: string;
  code: string;
  country: string;
  countryCode: string;
  timezone: string;
  region: string;
}

export const CITIES: CityData[] = [
  // Africa
  { name: 'Cairo', code: 'CAI', country: 'Egypt', countryCode: 'EGY', timezone: 'Africa/Cairo', region: 'Africa' },
  { name: 'Johannesburg', code: 'JNB', country: 'South Africa', countryCode: 'ZAF', timezone: 'Africa/Johannesburg', region: 'Africa' },
  { name: 'Lagos', code: 'LOS', country: 'Nigeria', countryCode: 'NGA', timezone: 'Africa/Lagos', region: 'Africa' },
  { name: 'Nairobi', code: 'NBO', country: 'Kenya', countryCode: 'KEN', timezone: 'Africa/Nairobi', region: 'Africa' },
  { name: 'Casablanca', code: 'CAS', country: 'Morocco', countryCode: 'MAR', timezone: 'Africa/Casablanca', region: 'Africa' },
  { name: 'Tunis', code: 'TUN', country: 'Tunisia', countryCode: 'TUN', timezone: 'Africa/Tunis', region: 'Africa' },
  { name: 'Accra', code: 'ACC', country: 'Ghana', countryCode: 'GHA', timezone: 'Africa/Accra', region: 'Africa' },
  { name: 'Addis Ababa', code: 'ADD', country: 'Ethiopia', countryCode: 'ETH', timezone: 'Africa/Addis_Ababa', region: 'Africa' },

  // Asia
  { name: 'Tokyo', code: 'TYO', country: 'Japan', countryCode: 'JPN', timezone: 'Asia/Tokyo', region: 'Asia' },
  { name: 'Hong Kong', code: 'HKG', country: 'Hong Kong', countryCode: 'HKG', timezone: 'Asia/Hong_Kong', region: 'Asia' },
  { name: 'Singapore', code: 'SIN', country: 'Singapore', countryCode: 'SGP', timezone: 'Asia/Singapore', region: 'Asia' },
  { name: 'Seoul', code: 'SEL', country: 'South Korea', countryCode: 'KOR', timezone: 'Asia/Seoul', region: 'Asia' },
  { name: 'Shanghai', code: 'SHA', country: 'China', countryCode: 'CHN', timezone: 'Asia/Shanghai', region: 'Asia' },
  { name: 'Beijing', code: 'BJS', country: 'China', countryCode: 'CHN', timezone: 'Asia/Shanghai', region: 'Asia' },
  { name: 'Bangkok', code: 'BKK', country: 'Thailand', countryCode: 'THA', timezone: 'Asia/Bangkok', region: 'Asia' },
  { name: 'Manila', code: 'MNL', country: 'Philippines', countryCode: 'PHL', timezone: 'Asia/Manila', region: 'Asia' },
  { name: 'Jakarta', code: 'JKT', country: 'Indonesia', countryCode: 'IDN', timezone: 'Asia/Jakarta', region: 'Asia' },
  { name: 'Kuala Lumpur', code: 'KUL', country: 'Malaysia', countryCode: 'MYS', timezone: 'Asia/Kuala_Lumpur', region: 'Asia' },
  { name: 'Taipei', code: 'TPE', country: 'Taiwan', countryCode: 'TWN', timezone: 'Asia/Taipei', region: 'Asia' },
  { name: 'Ho Chi Minh City', code: 'SGN', country: 'Vietnam', countryCode: 'VNM', timezone: 'Asia/Ho_Chi_Minh', region: 'Asia' },

  // Middle East
  { name: 'Dubai', code: 'DXB', country: 'UAE', countryCode: 'ARE', timezone: 'Asia/Dubai', region: 'Middle East' },
  { name: 'Riyadh', code: 'RUH', country: 'Saudi Arabia', countryCode: 'SAU', timezone: 'Asia/Riyadh', region: 'Middle East' },
  { name: 'Tel Aviv', code: 'TLV', country: 'Israel', countryCode: 'ISR', timezone: 'Asia/Jerusalem', region: 'Middle East' },
  { name: 'Istanbul', code: 'IST', country: 'Turkey', countryCode: 'TUR', timezone: 'Europe/Istanbul', region: 'Middle East' },
  { name: 'Doha', code: 'DOH', country: 'Qatar', countryCode: 'QAT', timezone: 'Asia/Qatar', region: 'Middle East' },
  { name: 'Kuwait City', code: 'KWI', country: 'Kuwait', countryCode: 'KWT', timezone: 'Asia/Kuwait', region: 'Middle East' },
  { name: 'Beirut', code: 'BEY', country: 'Lebanon', countryCode: 'LBN', timezone: 'Asia/Beirut', region: 'Middle East' },

  // Indian Subcontinent
  { name: 'Mumbai', code: 'BOM', country: 'India', countryCode: 'IND', timezone: 'Asia/Kolkata', region: 'Indian Subcontinent' },
  { name: 'Delhi', code: 'DEL', country: 'India', countryCode: 'IND', timezone: 'Asia/Kolkata', region: 'Indian Subcontinent' },
  { name: 'Bangalore', code: 'BLR', country: 'India', countryCode: 'IND', timezone: 'Asia/Kolkata', region: 'Indian Subcontinent' },
  { name: 'Bengaluru', code: 'BLR', country: 'India', countryCode: 'IND', timezone: 'Asia/Kolkata', region: 'Indian Subcontinent' },
  { name: 'Chennai', code: 'MAA', country: 'India', countryCode: 'IND', timezone: 'Asia/Kolkata', region: 'Indian Subcontinent' },
  { name: 'Kolkata', code: 'CCU', country: 'India', countryCode: 'IND', timezone: 'Asia/Kolkata', region: 'Indian Subcontinent' },
  { name: 'Hyderabad', code: 'HYD', country: 'India', countryCode: 'IND', timezone: 'Asia/Kolkata', region: 'Indian Subcontinent' },
  { name: 'Pune', code: 'PNQ', country: 'India', countryCode: 'IND', timezone: 'Asia/Kolkata', region: 'Indian Subcontinent' },
  { name: 'Karachi', code: 'KHI', country: 'Pakistan', countryCode: 'PAK', timezone: 'Asia/Karachi', region: 'Indian Subcontinent' },
  { name: 'Dhaka', code: 'DAC', country: 'Bangladesh', countryCode: 'BGD', timezone: 'Asia/Dhaka', region: 'Indian Subcontinent' },
  { name: 'Colombo', code: 'CMB', country: 'Sri Lanka', countryCode: 'LKA', timezone: 'Asia/Colombo', region: 'Indian Subcontinent' },

  // Europe
  { name: 'London', code: 'LON', country: 'United Kingdom', countryCode: 'GBR', timezone: 'Europe/London', region: 'Europe' },
  { name: 'Paris', code: 'PAR', country: 'France', countryCode: 'FRA', timezone: 'Europe/Paris', region: 'Europe' },
  { name: 'Berlin', code: 'BER', country: 'Germany', countryCode: 'DEU', timezone: 'Europe/Berlin', region: 'Europe' },
  { name: 'Madrid', code: 'MAD', country: 'Spain', countryCode: 'ESP', timezone: 'Europe/Madrid', region: 'Europe' },
  { name: 'Rome', code: 'ROM', country: 'Italy', countryCode: 'ITA', timezone: 'Europe/Rome', region: 'Europe' },
  { name: 'Amsterdam', code: 'AMS', country: 'Netherlands', countryCode: 'NLD', timezone: 'Europe/Amsterdam', region: 'Europe' },
  { name: 'Brussels', code: 'BRU', country: 'Belgium', countryCode: 'BEL', timezone: 'Europe/Brussels', region: 'Europe' },
  { name: 'Vienna', code: 'VIE', country: 'Austria', countryCode: 'AUT', timezone: 'Europe/Vienna', region: 'Europe' },
  { name: 'Zurich', code: 'ZRH', country: 'Switzerland', countryCode: 'CHE', timezone: 'Europe/Zurich', region: 'Europe' },
  { name: 'Stockholm', code: 'STO', country: 'Sweden', countryCode: 'SWE', timezone: 'Europe/Stockholm', region: 'Europe' },
  { name: 'Copenhagen', code: 'CPH', country: 'Denmark', countryCode: 'DNK', timezone: 'Europe/Copenhagen', region: 'Europe' },
  { name: 'Oslo', code: 'OSL', country: 'Norway', countryCode: 'NOR', timezone: 'Europe/Oslo', region: 'Europe' },
  { name: 'Helsinki', code: 'HEL', country: 'Finland', countryCode: 'FIN', timezone: 'Europe/Helsinki', region: 'Europe' },
  { name: 'Warsaw', code: 'WAW', country: 'Poland', countryCode: 'POL', timezone: 'Europe/Warsaw', region: 'Europe' },
  { name: 'Prague', code: 'PRG', country: 'Czech Republic', countryCode: 'CZE', timezone: 'Europe/Prague', region: 'Europe' },
  { name: 'Budapest', code: 'BUD', country: 'Hungary', countryCode: 'HUN', timezone: 'Europe/Budapest', region: 'Europe' },
  { name: 'Athens', code: 'ATH', country: 'Greece', countryCode: 'GRC', timezone: 'Europe/Athens', region: 'Europe' },
  { name: 'Lisbon', code: 'LIS', country: 'Portugal', countryCode: 'PRT', timezone: 'Europe/Lisbon', region: 'Europe' },
  { name: 'Dublin', code: 'DUB', country: 'Ireland', countryCode: 'IRL', timezone: 'Europe/Dublin', region: 'Europe' },
  { name: 'Moscow', code: 'MOW', country: 'Russia', countryCode: 'RUS', timezone: 'Europe/Moscow', region: 'Europe' },

  // North America
  { name: 'New York', code: 'NYC', country: 'United States', countryCode: 'USA', timezone: 'America/New_York', region: 'North America' },
  { name: 'Los Angeles', code: 'LAX', country: 'United States', countryCode: 'USA', timezone: 'America/Los_Angeles', region: 'North America' },
  { name: 'Chicago', code: 'CHI', country: 'United States', countryCode: 'USA', timezone: 'America/Chicago', region: 'North America' },
  { name: 'San Francisco', code: 'SFO', country: 'United States', countryCode: 'USA', timezone: 'America/Los_Angeles', region: 'North America' },
  { name: 'Seattle', code: 'SEA', country: 'United States', countryCode: 'USA', timezone: 'America/Los_Angeles', region: 'North America' },
  { name: 'Boston', code: 'BOS', country: 'United States', countryCode: 'USA', timezone: 'America/New_York', region: 'North America' },
  { name: 'Washington DC', code: 'WAS', country: 'United States', countryCode: 'USA', timezone: 'America/New_York', region: 'North America' },
  { name: 'Miami', code: 'MIA', country: 'United States', countryCode: 'USA', timezone: 'America/New_York', region: 'North America' },
  { name: 'Dallas', code: 'DFW', country: 'United States', countryCode: 'USA', timezone: 'America/Chicago', region: 'North America' },
  { name: 'Houston', code: 'HOU', country: 'United States', countryCode: 'USA', timezone: 'America/Chicago', region: 'North America' },
  { name: 'Denver', code: 'DEN', country: 'United States', countryCode: 'USA', timezone: 'America/Denver', region: 'North America' },
  { name: 'Phoenix', code: 'PHX', country: 'United States', countryCode: 'USA', timezone: 'America/Phoenix', region: 'North America' },
  { name: 'Atlanta', code: 'ATL', country: 'United States', countryCode: 'USA', timezone: 'America/New_York', region: 'North America' },
  { name: 'Toronto', code: 'YTO', country: 'Canada', countryCode: 'CAN', timezone: 'America/Toronto', region: 'North America' },
  { name: 'Vancouver', code: 'YVR', country: 'Canada', countryCode: 'CAN', timezone: 'America/Vancouver', region: 'North America' },
  { name: 'Montreal', code: 'YMQ', country: 'Canada', countryCode: 'CAN', timezone: 'America/Montreal', region: 'North America' },
  { name: 'Mexico City', code: 'MEX', country: 'Mexico', countryCode: 'MEX', timezone: 'America/Mexico_City', region: 'North America' },

  // South America
  { name: 'São Paulo', code: 'SAO', country: 'Brazil', countryCode: 'BRA', timezone: 'America/Sao_Paulo', region: 'South America' },
  { name: 'Rio de Janeiro', code: 'RIO', country: 'Brazil', countryCode: 'BRA', timezone: 'America/Sao_Paulo', region: 'South America' },
  { name: 'Buenos Aires', code: 'BUE', country: 'Argentina', countryCode: 'ARG', timezone: 'America/Argentina/Buenos_Aires', region: 'South America' },
  { name: 'Lima', code: 'LIM', country: 'Peru', countryCode: 'PER', timezone: 'America/Lima', region: 'South America' },
  { name: 'Bogotá', code: 'BOG', country: 'Colombia', countryCode: 'COL', timezone: 'America/Bogota', region: 'South America' },
  { name: 'Santiago', code: 'SCL', country: 'Chile', countryCode: 'CHL', timezone: 'America/Santiago', region: 'South America' },
  { name: 'Caracas', code: 'CCS', country: 'Venezuela', countryCode: 'VEN', timezone: 'America/Caracas', region: 'South America' },

  // Oceania
  { name: 'Sydney', code: 'SYD', country: 'Australia', countryCode: 'AUS', timezone: 'Australia/Sydney', region: 'Oceania' },
  { name: 'Melbourne', code: 'MEL', country: 'Australia', countryCode: 'AUS', timezone: 'Australia/Melbourne', region: 'Oceania' },
  { name: 'Brisbane', code: 'BNE', country: 'Australia', countryCode: 'AUS', timezone: 'Australia/Brisbane', region: 'Oceania' },
  { name: 'Perth', code: 'PER', country: 'Australia', countryCode: 'AUS', timezone: 'Australia/Perth', region: 'Oceania' },
  { name: 'Adelaide', code: 'ADL', country: 'Australia', countryCode: 'AUS', timezone: 'Australia/Adelaide', region: 'Oceania' },
  { name: 'Canberra', code: 'CBR', country: 'Australia', countryCode: 'AUS', timezone: 'Australia/Sydney', region: 'Oceania' },
  { name: 'Auckland', code: 'AKL', country: 'New Zealand', countryCode: 'NZL', timezone: 'Pacific/Auckland', region: 'Oceania' },
  { name: 'Wellington', code: 'WLG', country: 'New Zealand', countryCode: 'NZL', timezone: 'Pacific/Auckland', region: 'Oceania' },
  { name: 'Fiji', code: 'NAN', country: 'Fiji', countryCode: 'FJI', timezone: 'Pacific/Fiji', region: 'Oceania' },

  // Pacific Islands
  { name: 'Honolulu', code: 'HNL', country: 'United States', countryCode: 'USA', timezone: 'Pacific/Honolulu', region: 'Pacific' },
  { name: 'Guam', code: 'GUM', country: 'Guam', countryCode: 'GUM', timezone: 'Pacific/Guam', region: 'Pacific' },
];

// Helper function to get cities by region
export function getCitiesByRegion(): Record<string, CityData[]> {
  return CITIES.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = [];
    }
    acc[city.region].push(city);
    return acc;
  }, {} as Record<string, CityData[]>);
}

// Helper function to search cities
export function searchCities(query: string): CityData[] {
  const lowerQuery = query.toLowerCase();
  return CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.code.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery) ||
      city.timezone.toLowerCase().includes(lowerQuery)
  );
}

// Region display order
export const REGION_ORDER = [
  'Oceania',
  'Asia',
  'Indian Subcontinent',
  'Middle East',
  'Europe',
  'Africa',
  'North America',
  'South America',
  'Pacific',
];
