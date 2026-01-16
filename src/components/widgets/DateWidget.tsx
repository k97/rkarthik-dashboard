'use client';

import { useEffect, useState } from 'react';
import { Widget, WidgetContent } from './Widget';
import { Calendar } from '@/components/ui/calendar';
import { X } from 'lucide-react';
import { useWidgets } from '@/context/WidgetContext';

interface DateInfo {
  dayOfWeek: string;
  month: string;
  day: number;
}

function getDateInfo(timezone: string): DateInfo {
  const now = new Date();

  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
  });

  const monthFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    month: 'short',
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    day: 'numeric',
  });

  return {
    dayOfWeek: dayFormatter.format(now),
    month: monthFormatter.format(now),
    day: parseInt(dateFormatter.format(now)),
  };
}

function openGoogleCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const url = `https://calendar.google.com/calendar/r/day/${year}/${month}/${day}`;
  window.open(url, '_blank');
}

interface DateWidgetProps {
  isDragging?: boolean;
}

export function DateWidget({ isDragging }: DateWidgetProps) {
  const { location } = useWidgets();
  const [dateInfo, setDateInfo] = useState<DateInfo | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Get timezone from location state or fallback to browser timezone
  const timezone = location.mode === 'manual' && location.manualLocation
    ? location.manualLocation.timezone
    : location.mode === 'auto' && location.resolvedTimezone
    ? location.resolvedTimezone
    : Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const updateDateInfo = () => {
      setDateInfo(getDateInfo(timezone));
    };

    updateDateInfo();
    // Update at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      updateDateInfo();
      // Then update every 24 hours
      const interval = setInterval(updateDateInfo, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [timezone]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      openGoogleCalendar(date);
      setShowCalendar(false);
    }
  };

  const handleDateClick = () => {
    setShowCalendar(true);
  };

  const handleCloseCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCalendar(false);
  };

  if (!dateInfo) return null;

  return (
    <div className="h-full">
      <Widget
        isDragging={isDragging}
        className={showCalendar ? 'overflow-hidden' : 'cursor-pointer hover:shadow-lg transition-shadow'}
      >
        {showCalendar ? (
          <WidgetContent className="h-full flex flex-col overflow-hidden">
            {/* Close button */}
            <button
              onClick={handleCloseCalendar}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
              aria-label="Close calendar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            {/* Calendar - scaled to fit within card */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="!p-0 [--cell-size:2rem] scale-[0.85] origin-center"
              />
            </div>
          </WidgetContent>
        ) : (
          <WidgetContent
            className="h-full flex flex-col items-center justify-center"
            onClick={handleDateClick}
          >
            {/* Day and Month row */}
            <div className="flex items-baseline gap-2">
              <span className="text-red-500 text-2xl font-semibold">
                {dateInfo.dayOfWeek}
              </span>
              <span className="text-card-foreground text-2xl font-semibold">
                {dateInfo.month}
              </span>
            </div>

            {/* Large date number */}
            <div className="text-card-foreground text-9xl font-bold leading-none mt-2">
              {dateInfo.day}
            </div>
          </WidgetContent>
        )}
      </Widget>
    </div>
  );
}
