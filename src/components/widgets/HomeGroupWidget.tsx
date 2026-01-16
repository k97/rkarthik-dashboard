'use client';

import { useEffect, useState } from 'react';
import { Widget, WidgetContent } from './Widget';
import { AnalogClock } from './AnalogClock';
import { LocationPicker } from './LocationPicker';
import { WeatherData, SunData } from '@/types/weather';
import { Sunrise, Sunset, MapPin } from 'lucide-react';

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

  const abbrFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  });
  const abbrParts = abbrFormatter.formatToParts(now);
  const abbr = abbrParts.find(p => p.type === 'timeZoneName')?.value || '';

  return { dayName, month, day, timezoneAbbr: abbr };
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
  isLoading?: boolean;
  cityName?: string | null;
  timezone?: string | null;
  showLocationPicker?: boolean;
  onSelectLocation?: (cityName: string, timezone: string) => void;
  onRetryGeolocation?: () => void;
}

export function HomeGroupWidget({
  isDragging,
  weatherData,
  sunData,
  isLoading,
  cityName,
  timezone,
  showLocationPicker,
  onSelectLocation,
  onRetryGeolocation,
}: HomeGroupWidgetProps) {
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
  if (showLocationPicker && onSelectLocation) {
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
          <LocationPicker
            onSelectCity={onSelectLocation}
            onRetryGeolocation={onRetryGeolocation}
            showRetryOption={!!onRetryGeolocation}
          />
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
            <div className="text-muted-foreground text-base mt-1">
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
