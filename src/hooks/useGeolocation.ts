'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

export type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error' | 'denied';

interface UseGeolocationReturn {
  coords: GeolocationCoords | null;
  status: GeolocationStatus;
  error: string | null;
  retry: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Geolocation is not supported by your browser');
      return;
    }

    setStatus('loading');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('success');
        setError(null);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setStatus('denied');
            setError('Location permission denied');
            break;
          case err.POSITION_UNAVAILABLE:
            setStatus('error');
            setError('Location information unavailable');
            break;
          case err.TIMEOUT:
            setStatus('error');
            setError('Location request timed out');
            break;
          default:
            setStatus('error');
            setError('Failed to get location');
        }
      },
      {
        enableHighAccuracy: false, // We don't need high accuracy for weather
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // Cache for 5 minutes
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    coords,
    status,
    error,
    retry: requestLocation,
  };
}
