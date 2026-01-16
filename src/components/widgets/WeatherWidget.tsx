'use client';

import { Widget, WidgetContent } from './Widget';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import { WeatherCondition, WeatherData } from '@/types/weather';

const weatherIcons: Record<WeatherCondition, typeof Sun> = {
  clear: Sun,
  clouds: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
  fog: CloudFog,
  overcast: Cloud,
};

const conditionLabels: Record<WeatherCondition, string> = {
  clear: 'Clear',
  clouds: 'Cloudy',
  rain: 'Rainy',
  snow: 'Snowy',
  thunderstorm: 'Stormy',
  fog: 'Foggy',
  overcast: 'Overcast',
};

interface WeatherWidgetProps {
  isDragging?: boolean;
  data?: WeatherData | null;
  isLoading?: boolean;
}

export function WeatherWidget({ isDragging, data, isLoading }: WeatherWidgetProps) {
  // Placeholder data until API is integrated
  const weatherData: WeatherData = data || {
    temperature: 14,
    condition: 'overcast',
    description: 'Overcast clouds',
  };

  const Icon = weatherIcons[weatherData.condition];
  const label = conditionLabels[weatherData.condition];

  return (
    <Widget isDragging={isDragging}>
      <WidgetContent>
        <div className="flex flex-col items-center">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-full mb-2" />
              <div className="w-16 h-8 bg-muted rounded mb-1" />
              <div className="w-12 h-4 bg-muted rounded" />
            </div>
          ) : (
            <>
              {/* Weather icon */}
              <Icon className="w-10 h-10 text-muted-foreground mb-2" strokeWidth={1.5} />

              {/* Temperature */}
              <div className="text-card-foreground text-4xl font-light">
                {weatherData.temperature}°
              </div>

              {/* Condition */}
              <div className="text-muted-foreground text-sm">
                {label}
              </div>
            </>
          )}
        </div>
      </WidgetContent>
    </Widget>
  );
}
