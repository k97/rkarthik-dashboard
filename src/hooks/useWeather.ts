'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherCondition, SunData } from '@/types/weather';
import { createSunData } from '@/lib/utils';

interface WeatherApiResponse {
  temperature: number;
  condition: string;
  description: string;
  sunrise: number;
  sunset: number;
  icon: string;
  cityName: string;
  timezone: number;
  lat: number;
  lon: number;
}

interface WeatherData {
  temperature: number;
  condition: WeatherCondition;
  description: string;
}

interface LocationData {
  cityName: string;
  timezoneOffset: number; // UTC offset in seconds
}

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  sunData: SunData | null;
  locationData: LocationData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

function mapCondition(condition: string, icon: string): WeatherCondition {
  // Map OpenWeather conditions to our WeatherCondition type
  const conditionMap: Record<string, WeatherCondition> = {
    clear: 'clear',
    clouds: icon.includes('04') ? 'overcast' : 'clouds',
    rain: 'rain',
    drizzle: 'rain',
    snow: 'snow',
    thunderstorm: 'thunderstorm',
    mist: 'fog',
    fog: 'fog',
    haze: 'fog',
    smoke: 'fog',
    dust: 'fog',
    sand: 'fog',
    ash: 'fog',
    squall: 'rain',
    tornado: 'thunderstorm',
  };

  return conditionMap[condition] || 'clouds';
}

// Convert UTC offset in seconds to IANA timezone
// For auto-location, prefer browser timezone as it's more accurate
// But validate that the offset matches
function offsetToTimezone(offsetSeconds: number): string {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get current UTC offset of browser timezone in seconds
  const now = new Date();
  const browserOffset = -now.getTimezoneOffset() * 60; // getTimezoneOffset returns minutes, negative

  // If browser offset matches OpenWeather offset, use browser timezone
  // This handles DST correctly
  if (Math.abs(browserOffset - offsetSeconds) < 300) { // Within 5 minutes tolerance
    return browserTimezone;
  }

  // If offsets don't match, log warning and still use browser timezone
  // since we don't have enough info to determine the correct IANA timezone
  console.warn(
    `Timezone offset mismatch: browser offset ${browserOffset}s, OpenWeather offset ${offsetSeconds}s. ` +
    `Using browser timezone ${browserTimezone} for sunrise/sunset times.`
  );

  return browserTimezone;
}

interface UseWeatherOptions {
  city?: string;
  coords?: Coordinates;
  timezone?: string;
}

export function useWeather(options: UseWeatherOptions): UseWeatherReturn {
  const { city, coords, timezone } = options;
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [sunData, setSunData] = useState<SunData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    // Need either city or coordinates
    if (!city && !coords) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build query string based on available data
      const params = new URLSearchParams();
      if (coords) {
        params.set('lat', coords.latitude.toString());
        params.set('lon', coords.longitude.toString());
      } else if (city) {
        params.set('city', city);
      }

      const response = await fetch(`/api/weather?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather');
      }

      const data: WeatherApiResponse = await response.json();

      setWeatherData({
        temperature: data.temperature,
        condition: mapCondition(data.condition, data.icon),
        description: data.description,
      });

      // Use provided timezone or derive from browser/offset
      const effectiveTimezone = timezone || offsetToTimezone(data.timezone);

      // Log detailed sunrise/sunset information for debugging
      console.log('Weather data received:', {
        city: data.cityName,
        lat: data.lat,
        lon: data.lon,
        timezoneOffset: data.timezone,
        sunrise: data.sunrise,
        sunset: data.sunset,
        sunriseUTC: new Date(data.sunrise * 1000).toUTCString(),
        sunsetUTC: new Date(data.sunset * 1000).toUTCString(),
        effectiveTimezone,
      });

      setSunData(createSunData(data.sunrise, data.sunset, effectiveTimezone));

      setLocationData({
        cityName: data.cityName,
        timezoneOffset: data.timezone,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      // Set fallback data
      setWeatherData({
        temperature: 14,
        condition: 'overcast',
        description: 'Weather unavailable',
      });
      setSunData({
        sunrise: '6:00 am',
        sunset: '6:00 pm',
      });
      setLocationData(null);
    } finally {
      setIsLoading(false);
    }
  }, [city, coords?.latitude, coords?.longitude, timezone]);

  useEffect(() => {
    fetchWeather();

    // Refresh every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return {
    weatherData,
    sunData,
    locationData,
    isLoading,
    error,
    refetch: fetchWeather,
  };
}
