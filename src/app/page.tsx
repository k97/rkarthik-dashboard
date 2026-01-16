'use client';

import { useEffect } from 'react';
import { WidgetGrid } from '@/components/WidgetGrid';
import { SettingsOverlay } from '@/components/SettingsOverlay';
import { HomeGroupWidget } from '@/components/widgets/HomeGroupWidget';
import { WorldClockWidget } from '@/components/widgets/WorldClockWidget';
import { DateWidget } from '@/components/widgets/DateWidget';
import { PomodoroWidget } from '@/components/widgets/PomodoroWidget';
import { useWidgets, WidgetId } from '@/context/WidgetContext';
import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNotification } from '@/hooks/useNotification';
import { Footer } from '@/components/Footer';

export default function Home() {
  const { location, setAutoLocation } = useWidgets();
  const { coords, status: geoStatus } = useGeolocation();

  // Determine weather fetch parameters based on location state
  const weatherOptions = location.mode === 'manual' && location.manualLocation
    ? { city: location.manualLocation.cityName, timezone: location.manualLocation.timezone }
    : location.mode === 'auto' && location.coords
    ? { coords: location.coords, timezone: location.resolvedTimezone || undefined }
    : coords
    ? { coords: { latitude: coords.latitude, longitude: coords.longitude } }
    : {};

  const { weatherData, sunData, locationData, isLoading } = useWeather(weatherOptions);
  const { notifyPomodoroComplete, requestPermission } = useNotification();

  // Update location state when geolocation succeeds and we get weather data
  useEffect(() => {
    if (
      geoStatus === 'success' &&
      coords &&
      locationData &&
      location.mode === 'pending'
    ) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setAutoLocation(
        { latitude: coords.latitude, longitude: coords.longitude },
        locationData.cityName,
        timezone
      );
    }
  }, [geoStatus, coords, locationData, location.mode, setAutoLocation]);

  // Request notification permission on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      requestPermission();
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [requestPermission]);

  // Get display city name based on location mode
  const displayCityName = location.mode === 'manual'
    ? location.manualLocation?.cityName
    : location.mode === 'auto'
    ? location.resolvedCityName
    : locationData?.cityName;

  // Get timezone based on location mode
  const displayTimezone = location.mode === 'manual'
    ? location.manualLocation?.timezone
    : Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Determine if we need to show location picker
  const needsLocationPicker = geoStatus === 'denied' || geoStatus === 'error';

  const renderWidget = (widgetId: WidgetId, isDragging: boolean) => {
    switch (widgetId) {
      case 'home-group':
        return (
          <HomeGroupWidget
            isDragging={isDragging}
            weatherData={weatherData}
            sunData={sunData}
            isLoading={isLoading || geoStatus === 'loading'}
            cityName={displayCityName}
            timezone={displayTimezone}
            showLocationPicker={needsLocationPicker && location.mode === 'pending'}
          />
        );
      case 'world-clocks':
        return <WorldClockWidget isDragging={isDragging} />;
      case 'date':
        return <DateWidget isDragging={isDragging} />;
      case 'pomodoro':
        return (
          <PomodoroWidget
            isDragging={isDragging}
            onPhaseComplete={(phase) => notifyPomodoroComplete(phase)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <SettingsOverlay />
      <div className="mx-auto max-w-3xl mt-10">
        <WidgetGrid>{renderWidget}</WidgetGrid>
      </div>
      <Footer />
    </div>
  );
}
