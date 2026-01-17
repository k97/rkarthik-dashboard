'use client';

import { useEffect, useState } from 'react';
import { Widget, WidgetContent } from './Widget';
import { AnalogClock } from './AnalogClock';
import { Button } from '@/components/ui/button';
import { WeatherData, SunData } from '@/types/weather';
import { Sunrise, Sunset, MapPin } from 'lucide-react';
import { useWidgets } from '@/context/WidgetContext';

// Sunrise yellow and Sunset orange colors from design
const SUNRISE_COLOR = '#FBBF24';
const SUNSET_COLOR = '#F97316';

function isDaytime(timezone: string): boolean {
  const now = new Date();
  const hourFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  });
  const hour = parseInt(hourFormatter.format(now));
  return hour >= 6 && hour < 18;
}

interface TimeInfo {
  dayName: string;
  month: string;
  day: number;
  timezoneAbbr: string;
}

function getTimezoneAbbr(timezone: string): string {
  // Comprehensive timezone mapping for all cities in database
  const timezoneMap: Record<string, string> = {
    // Oceania
    'Australia/Melbourne': 'AEDT/AEST',
    'Australia/Sydney': 'AEDT/AEST',
    'Australia/Brisbane': 'AEST',
    'Australia/Perth': 'AWST',
    'Australia/Adelaide': 'ACDT/ACST',
    'Australia/Hobart': 'AEDT/AEST',
    'Australia/Darwin': 'ACST',
    'Pacific/Auckland': 'NZDT/NZST',
    'Pacific/Fiji': 'FJT',

    // Asia
    'Asia/Tokyo': 'JST',
    'Asia/Hong_Kong': 'HKT',
    'Asia/Singapore': 'SGT',
    'Asia/Seoul': 'KST',
    'Asia/Shanghai': 'CST',
    'Asia/Bangkok': 'ICT',
    'Asia/Manila': 'PHT',
    'Asia/Jakarta': 'WIB',
    'Asia/Kuala_Lumpur': 'MYT',
    'Asia/Taipei': 'CST',
    'Asia/Ho_Chi_Minh': 'ICT',

    // Middle East
    'Asia/Dubai': 'GST',
    'Asia/Riyadh': 'AST',
    'Asia/Jerusalem': 'IST/IDT',
    'Europe/Istanbul': 'TRT',
    'Asia/Qatar': 'AST',
    'Asia/Kuwait': 'AST',
    'Asia/Beirut': 'EET/EEST',

    // Indian Subcontinent
    'Asia/Kolkata': 'IST',
    'Asia/Karachi': 'PKT',
    'Asia/Dhaka': 'BST',
    'Asia/Colombo': 'IST',

    // Europe
    'Europe/London': 'GMT/BST',
    'Europe/Paris': 'CET/CEST',
    'Europe/Berlin': 'CET/CEST',
    'Europe/Madrid': 'CET/CEST',
    'Europe/Rome': 'CET/CEST',
    'Europe/Amsterdam': 'CET/CEST',
    'Europe/Brussels': 'CET/CEST',
    'Europe/Vienna': 'CET/CEST',
    'Europe/Zurich': 'CET/CEST',
    'Europe/Stockholm': 'CET/CEST',
    'Europe/Copenhagen': 'CET/CEST',
    'Europe/Oslo': 'CET/CEST',
    'Europe/Helsinki': 'EET/EEST',
    'Europe/Warsaw': 'CET/CEST',
    'Europe/Prague': 'CET/CEST',
    'Europe/Budapest': 'CET/CEST',
    'Europe/Athens': 'EET/EEST',
    'Europe/Lisbon': 'WET/WEST',
    'Europe/Dublin': 'GMT/IST',
    'Europe/Moscow': 'MSK',

    // North America
    'America/New_York': 'EST/EDT',
    'America/Chicago': 'CST/CDT',
    'America/Denver': 'MST/MDT',
    'America/Los_Angeles': 'PST/PDT',
    'America/Phoenix': 'MST',
    'America/Toronto': 'EST/EDT',
    'America/Vancouver': 'PST/PDT',
    'America/Montreal': 'EST/EDT',
    'America/Mexico_City': 'CST/CDT',

    // South America
    'America/Sao_Paulo': 'BRT/BRST',
    'America/Argentina/Buenos_Aires': 'ART',
    'America/Lima': 'PET',
    'America/Bogota': 'COT',
    'America/Santiago': 'CLT/CLST',
    'America/Caracas': 'VET',

    // Africa
    'Africa/Cairo': 'EET',
    'Africa/Johannesburg': 'SAST',
    'Africa/Lagos': 'WAT',
    'Africa/Nairobi': 'EAT',
    'Africa/Casablanca': 'WET/WEST',
    'Africa/Tunis': 'CET',
    'Africa/Accra': 'GMT',
    'Africa/Addis_Ababa': 'EAT',

    // Pacific
    'Pacific/Honolulu': 'HST',
    'Pacific/Guam': 'ChST',
  };

  // Check if we have a manual mapping
  if (timezoneMap[timezone]) {
    return timezoneMap[timezone];
  }

  // Calculate UTC offset as fallback
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
  });
  const parts = formatter.formatToParts(now);
  const offset = parts.find(p => p.type === 'timeZoneName')?.value || '';

  return offset.replace('GMT', 'UTC');
}

function getTimeInfo(timezone: string): TimeInfo {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const parts = formatter.formatToParts(now);
  const dayName = parts.find(p => p.type === 'weekday')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');

  const timezoneAbbr = getTimezoneAbbr(timezone);

  return { dayName, month, day, timezoneAbbr };
}

function getCityCode(city: string, timezone?: string | null): string {
  // Exact matches for city names
  const cityCodes: Record<string, string> = {
    'Melbourne': 'MEL',
    'Sydney': 'SYD',
    'Brisbane': 'BNE',
    'Perth': 'PER',
    'Adelaide': 'ADL',
    'Canberra': 'CBR',
    'London': 'LON',
    'New York': 'NYC',
    'Los Angeles': 'LAX',
    'San Francisco': 'SFO',
    'Chicago': 'CHI',
    'Tokyo': 'TYO',
    'Singapore': 'SIN',
    'Hong Kong': 'HKG',
    'Dubai': 'DXB',
    'Chennai': 'MAA',
    'Berlin': 'BER',
    'Paris': 'PAR',
    'Mumbai': 'BOM',
    'Delhi': 'DEL',
    'Bangalore': 'BLR',
    'Bengaluru': 'BLR',
    'Kolkata': 'CCU',
    'Hyderabad': 'HYD',
  };

  // Timezone to city code mapping (for when OpenWeather returns suburb names)
  const timezoneCodes: Record<string, string> = {
    'Australia/Melbourne': 'MEL',
    'Australia/Sydney': 'SYD',
    'Australia/Brisbane': 'BNE',
    'Australia/Perth': 'PER',
    'Australia/Adelaide': 'ADL',
    'Europe/London': 'LON',
    'America/New_York': 'NYC',
    'America/Los_Angeles': 'LAX',
    'America/Chicago': 'CHI',
    'Asia/Tokyo': 'TYO',
    'Asia/Singapore': 'SIN',
    'Asia/Hong_Kong': 'HKG',
    'Asia/Dubai': 'DXB',
    'Asia/Kolkata': 'MAA', // Default to Chennai for India
    'Europe/Berlin': 'BER',
    'Europe/Paris': 'PAR',
  };

  // Check exact match first
  if (cityCodes[city]) {
    return cityCodes[city];
  }

  // Check if city name contains a known city (for suburbs like "South Melbourne")
  const cityLower = city.toLowerCase();
  for (const [knownCity, code] of Object.entries(cityCodes)) {
    if (cityLower.includes(knownCity.toLowerCase())) {
      return code;
    }
  }

  // Fall back to timezone-based code
  if (timezone && timezoneCodes[timezone]) {
    return timezoneCodes[timezone];
  }

  // Last resort: first 3 characters
  return city.substring(0, 3).toUpperCase();
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface HomeGroupWidgetProps {
  isDragging?: boolean;
  weatherData?: WeatherData | null;
  sunData?: SunData | null;
  cityName?: string | null;
  timezone?: string | null;
  showLocationPicker?: boolean;
}

export function HomeGroupWidget({
  isDragging,
  weatherData,
  sunData,
  cityName,
  timezone,
  showLocationPicker,
}: HomeGroupWidgetProps) {
  const { openSettings } = useWidgets();
  const effectiveTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null);

  useEffect(() => {
    const updateTimeInfo = () => {
      setTimeInfo(getTimeInfo(effectiveTimezone));
    };

    updateTimeInfo();
    const interval = setInterval(updateTimeInfo, 1000);
    return () => clearInterval(interval);
  }, [effectiveTimezone]);

  const weather: WeatherData = weatherData || {
    temperature: 14,
    condition: 'overcast',
    description: 'Overcast clouds',
  };

  const sun: SunData = sunData || {
    sunrise: '6:12 am',
    sunset: '7:43 pm',
  };

  const displayCity = cityName || 'Loading...';
  const cityCode = getCityCode(displayCity, effectiveTimezone);

  if (!timeInfo) return null;

  // Show location picker prompt if needed
  if (showLocationPicker) {
    return (
      <Widget isDragging={isDragging}>
        <WidgetContent className="h-full flex flex-col items-center justify-center gap-4">
          <MapPin className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-card-foreground">Location Required</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select your location to see local time and weather
            </p>
          </div>
          <Button
            variant={"outline"}
            onClick={() => openSettings('cities')}
            className="cursor-pointer"
          >
            Select Location
          </Button>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget isDragging={isDragging}>
      <WidgetContent className="h-full flex flex-col">
        {/* Top section - City info and clock */}
        <div className="flex-1 flex items-center justify-between">
          {/* Left side - City info */}
          <div className="flex flex-col">
            <div className="text-card-foreground text-5xl font-bold tracking-wide">
              {cityCode}
            </div>
            <div className="text-card-foreground text-xl font-medium mt-1">
              {timeInfo.dayName}, {timeInfo.month} {timeInfo.day}
            </div>
            <div className="text-muted-foreground text-base mt-1 truncate max-w-[200px]">
              {timeInfo.timezoneAbbr}
            </div>
          </div>

          {/* Right side - Analog clock */}
          <div className="flex-shrink-0">
            <AnalogClock
              size={160}
              timezone={effectiveTimezone}
              theme={isDaytime(effectiveTimezone) ? 'light' : 'dark'}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-border/30 my-3" />

        {/* Bottom section - Weather info */}
        <div className="flex items-center justify-between">
          {/* Temperature */}
          <div className="flex flex-col">
            <span className="text-card-foreground text-2xl font-medium">{weather.temperature}°</span>
            <span className="text-muted-foreground text-md">{capitalizeFirst(weather.description)}</span>
          </div>

          {/* Sunrise */}
          <div className="flex flex-col items-center gap-1">
            <Sunrise className="w-6 h-6" style={{ color: SUNRISE_COLOR }} />
            <span className="text-card-foreground text-md">{sun.sunrise}</span>
          </div>

          {/* Sunset */}
          <div className="flex flex-col items-center gap-1">
            <Sunset className="w-6 h-6" style={{ color: SUNSET_COLOR }} />
            <span className="text-card-foreground text-md">{sun.sunset}</span>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
}
