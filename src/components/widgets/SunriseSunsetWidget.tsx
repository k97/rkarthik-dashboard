'use client';

import { Widget, WidgetContent } from './Widget';
import { Sunrise, Sunset } from 'lucide-react';
import { SunData } from '@/types/weather';

function formatTime(timestamp: number, timezone: string): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}

interface SunriseSunsetWidgetProps {
  isDragging?: boolean;
  data?: SunData | null;
  isLoading?: boolean;
  compact?: boolean;
}

export function SunriseSunsetWidget({ isDragging, data, isLoading, compact }: SunriseSunsetWidgetProps) {
  // Placeholder data until API is integrated
  const sunData: SunData = data || {
    sunrise: '6:12 am',
    sunset: '7:43 pm',
  };

  if (compact) {
    // Compact version for grouped display
    return (
      <div className="flex items-center justify-center gap-8">
        {isLoading ? (
          <div className="animate-pulse flex gap-8">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-muted rounded" />
              <div className="w-14 h-5 bg-muted rounded" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-muted rounded" />
              <div className="w-14 h-5 bg-muted rounded" />
            </div>
          </div>
        ) : (
          <>
            {/* Sunrise */}
            <div className="flex flex-col items-center">
              <Sunrise className="w-8 h-8 text-muted-foreground" />
              <span className="text-card-foreground text-base font-medium mt-1">
                {sunData.sunrise}
              </span>
            </div>

            {/* Sunset */}
            <div className="flex flex-col items-center">
              <Sunset className="w-8 h-8 text-muted-foreground" />
              <span className="text-card-foreground text-base font-medium mt-1">
                {sunData.sunset}
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Widget isDragging={isDragging}>
      <WidgetContent>
        <div className="flex items-center justify-center gap-8">
          {isLoading ? (
            <div className="animate-pulse flex gap-8">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-muted rounded" />
                <div className="w-14 h-5 bg-muted rounded" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-muted rounded" />
                <div className="w-14 h-5 bg-muted rounded" />
              </div>
            </div>
          ) : (
            <>
              {/* Sunrise */}
              <div className="flex flex-col items-center">
                <Sunrise className="w-8 h-8 text-muted-foreground" />
                <span className="text-card-foreground text-base font-medium mt-1">
                  {sunData.sunrise}
                </span>
              </div>

              {/* Sunset */}
              <div className="flex flex-col items-center">
                <Sunset className="w-8 h-8 text-muted-foreground" />
                <span className="text-card-foreground text-base font-medium mt-1">
                  {sunData.sunset}
                </span>
              </div>
            </>
          )}
        </div>
      </WidgetContent>
    </Widget>
  );
}

// Helper to convert API response to SunData
export function createSunData(
  sunriseTimestamp: number,
  sunsetTimestamp: number,
  timezone: string
): SunData {
  return {
    sunrise: formatTime(sunriseTimestamp, timezone),
    sunset: formatTime(sunsetTimestamp, timezone),
  };
}
