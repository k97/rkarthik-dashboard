'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherCondition, SunData } from '@/types/weather';
import { createSunData } from '@/components/widgets/SunriseSunsetWidget';

interface WeatherApiResponse {
  temperature: number;
  condition: string;
  description: string;
  sunrise: number;
  sunset: number;
  icon: string;
  cityName: string;
  timezone: number;
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

// Convert UTC offset in seconds to IANA timezone (approximate)
function offsetToTimezone(offsetSeconds: number): string {
  // Use browser's timezone as it's more accurate for the user's location
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
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
