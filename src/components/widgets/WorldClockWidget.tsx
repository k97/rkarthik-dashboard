'use client';

import { useEffect, useState } from 'react';
import { Widget, WidgetContent } from './Widget';
import { AnalogClock } from './AnalogClock';
import { useWidgets } from '@/context/WidgetContext';

interface ClockInfo {
  id: string;
  cityCode: string;
  cityName: string;
  country: string;
  timezone: string;
  dayInfo: string;
  offset: string;
  isDaytime: boolean;
}

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

function getClockInfo(
  id: string,
  cityCode: string,
  cityName: string,
  country: string,
  timezone: string,
  referenceTimezone: string
): ClockInfo {
  const now = new Date();

  // Get day info (Today, Tomorrow, Yesterday)
  const refFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: referenceTimezone,
    day: 'numeric',
  });
  const localFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    day: 'numeric',
  });

  const refDay = parseInt(refFormatter.format(now));
  const localDay = parseInt(localFormatter.format(now));

  let dayInfo = 'Today';
  if (localDay > refDay) {
    dayInfo = 'Tomorrow';
  } else if (localDay < refDay) {
    dayInfo = 'Yesterday';
  }

  // Get timezone offset relative to reference timezone
  const getOffsetHours = (tz: string) => {
    const d = new Date();
    const str = d.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' });
    const match = str.match(/GMT([+-]\d+(?::\d+)?)/);
    if (match) {
      const [hours, minutes] = match[1].split(':').map(Number);
      return hours + (minutes || 0) / 60;
    }
    return 0;
  };

  const refOffset = getOffsetHours(referenceTimezone);
  const localOffset = getOffsetHours(timezone);
  const diff = localOffset - refOffset;

  // Format offset string
  const sign = diff >= 0 ? '+' : '';
  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff);
  const minutes = Math.round((absDiff - hours) * 60);
  const offsetStr = minutes > 0
    ? `${sign}${diff < 0 ? '-' : ''}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`
    : `${sign}${diff < 0 ? '-' : ''}${hours.toString().padStart(2, '0')}00`;

  // Get timezone abbreviation
  const abbrFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  });
  const abbr = abbrFormatter.formatToParts(now).find(p => p.type === 'timeZoneName')?.value || '';

  return {
    id,
    cityCode,
    cityName,
    country,
    timezone,
    dayInfo,
    offset: `${offsetStr} ${abbr}`,
    isDaytime: isDaytime(timezone),
  };
}

interface WorldClockWidgetProps {
  isDragging?: boolean;
}

export function WorldClockWidget({ isDragging }: WorldClockWidgetProps) {
  const { worldClocks, location } = useWidgets();
  const [clockInfos, setClockInfos] = useState<ClockInfo[]>([]);

  // Get reference timezone from location state or fallback to browser timezone
  const referenceTimezone = location.mode === 'manual' && location.manualLocation
    ? location.manualLocation.timezone
    : location.mode === 'auto' && location.resolvedTimezone
    ? location.resolvedTimezone
    : Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const updateClockInfos = () => {
      setClockInfos(
        worldClocks.map((clock) =>
          getClockInfo(
            clock.id,
            clock.cityCode,
            clock.cityName,
            clock.country,
            clock.timezone,
            referenceTimezone
          )
        )
      );
    };

    updateClockInfos();
    const interval = setInterval(updateClockInfos, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [worldClocks, referenceTimezone]);

  if (clockInfos.length === 0) return null;

  return (
    <Widget isDragging={isDragging}>
      <WidgetContent className="h-full flex flex-col justify-between ">
        {clockInfos.map((clock) => (
          <div key={clock.id} className="flex items-center justify-between ">
            <div className="flex-1 min-w-0 m-0 p-0">
              <div className="text-card-foreground text-xl font-semibold mt-[-3px]">
                {clock.cityCode}
              </div>
              <div className="text-muted-foreground text-sm tracking-tight">
                {clock.dayInfo}, {clock.cityName}, {clock.country}
              </div>
              <div className="text-muted-foreground text-xs leading-1 mt-3">
                {clock.offset}
              </div>
            </div>
            <div className="flex-shrink-0">
              <AnalogClock
                size={72}
                timezone={clock.timezone}
                theme={clock.isDaytime ? 'light' : 'dark'}
              />
            </div>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
}
