import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SunData } from "@/types/weather"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sun data utilities
function formatTime(timestamp: number, timezone: string): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}

export function createSunData(
  sunriseTimestamp: number,
  sunsetTimestamp: number,
  timezone: string
): SunData {
  const sunrise = formatTime(sunriseTimestamp, timezone);
  const sunset = formatTime(sunsetTimestamp, timezone);

  console.log('createSunData:', {
    sunriseTimestamp,
    sunsetTimestamp,
    timezone,
    sunriseFormatted: sunrise,
    sunsetFormatted: sunset,
  });

  return { sunrise, sunset };
}
