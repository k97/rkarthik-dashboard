'use client';

import { useEffect, useState } from 'react';
import { Widget, WidgetContent } from './Widget';
import { AnalogClock } from './AnalogClock';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
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

  // Get timezone abbreviation using the manual mapping
  const abbr = getTimezoneAbbr(timezone);

  return {
    id,
    cityCode,
    cityName,
    country,
    timezone,
    dayInfo,
    offset: `${offsetStr}, ${abbr}`,
    isDaytime: isDaytime(timezone),
  };
}

interface WorldClockWidgetProps {
  isDragging?: boolean;
}

export function WorldClockWidget({ isDragging }: WorldClockWidgetProps) {
  const { worldClocks, location, openSettings } = useWidgets();
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

  // Show empty state if no clocks are configured
  if (clockInfos.length === 0) {
    return (
      <Widget isDragging={isDragging}>
        <WidgetContent className="h-full flex flex-col items-center justify-center gap-4">
          <Globe className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-card-foreground">No World Clocks</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add cities to track time around the world
            </p>
          </div>
          <Button
           variant="outline"
            onClick={() => openSettings('cities', 'world')}
            className="cursor-pointer"
          >
            Add Cities
          </Button>
        </WidgetContent>
      </Widget>
    );
  }

  return (
    <Widget isDragging={isDragging}>
      <WidgetContent className="h-full flex flex-col overflow-y-auto scrollbar-hidden">
        {clockInfos.map((clock) => (
          <div key={clock.id} className="flex items-center justify-between py-1">
            <div className="flex-1 min-w-0 m-0 p-0">
              <div className="text-card-foreground text-xl font-semibold -mt-0.25">
                {clock.cityCode}
              </div>
              <div className="text-muted-foreground text-sm tracking-tight">
                {clock.cityName}, {clock.country}
              </div>
              <div className="text-muted-foreground text-xs mt-1 truncate">
                {clock.dayInfo}, {clock.offset}
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
