'use client';

import { useEffect, useState } from 'react';

interface AnalogClockProps {
  size?: number;
  timezone?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export function AnalogClock({
  size = 200,
  timezone = 'local',
  theme = 'auto'
}: AnalogClockProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      let now: Date;
      if (timezone === 'local') {
        now = new Date();
      } else {
        now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
      }
      setTime(now);

      const hours = now.getHours();
      setIsDaytime(hours >= 6 && hours < 18);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  if (!time) return null;

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate rotation angles (0 degrees = 12 o'clock, clockwise)
  const hourRotation = (hours % 12) * 30 + minutes * 0.5;
  const minuteRotation = minutes * 6;  // Only moves when minutes change
  const secondRotation = seconds * 6;

  // Determine which theme to use
  const useLight = theme === 'light' || (theme === 'auto' && isDaytime);
  const themeFolder = useLight ? 'light' : 'dark';

  // Colors based on theme
  const handStroke = useLight ? '#1a1a1a' : '#fff';
  const handFill = useLight ? '#e4e4e9' : '#000000';
  const secondsColor = useLight ? '#1a1a1a' : '#ffffff';
  const centerDotColor = useLight ? '#1a1a1a' : '#ffffff';

  const center = size / 2;

  // Hand dimensions relative to size
  const hourLength = size * 0.25;
  const hourWidth = size * 0.032;  // 20% thinner
  const hourTail = size * 0.08;

  const minuteLength = size * 0.35;
  const minuteWidth = size * 0.024;  // 20% thinner
  const minuteTail = size * 0.1;

  const secondLength = size * 0.38;
  const secondTail = size * 0.12;
  const secondWidth = size * 0.01;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Clock face */}
      <img
        src={`/assets/clock/${themeFolder}/clockface.png`}
        alt="Clock face"
        className="absolute inset-0 w-full h-full"
        draggable={false}
      />

      {/* SVG overlay for hands */}
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Hour hand */}
        <g
          style={{
            transform: `rotate(${hourRotation}deg)`,
            transformOrigin: `${center}px ${center}px`,
            transition: 'transform 0.5s ease-out'
          }}
        >
          {/* Hour hand shape - pointed rectangle with tail */}
          <path
            d={`
              M ${center - hourWidth/2} ${center + hourTail}
              L ${center - hourWidth/2} ${center - hourLength + hourWidth}
              L ${center} ${center - hourLength}
              L ${center + hourWidth/2} ${center - hourLength + hourWidth}
              L ${center + hourWidth/2} ${center + hourTail}
              Z
            `}
            fill={handFill}
            stroke={handStroke}
            strokeWidth={size * 0.01}
          />
        </g>

        {/* Minute hand */}
        <g
          style={{
            transform: `rotate(${minuteRotation}deg)`,
            transformOrigin: `${center}px ${center}px`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          {/* Minute hand shape - pointed rectangle with tail */}
          <path
            d={`
              M ${center - minuteWidth/2} ${center + minuteTail}
              L ${center - minuteWidth/2} ${center - minuteLength + minuteWidth}
              L ${center} ${center - minuteLength}
              L ${center + minuteWidth/2} ${center - minuteLength + minuteWidth}
              L ${center + minuteWidth/2} ${center + minuteTail}
              Z
            `}
            fill={handFill}
            stroke={handStroke}
            strokeWidth={size * 0.008}
          />
        </g>

        {/* Seconds hand */}
        <g
          style={{
            transform: `rotate(${secondRotation}deg)`,
            transformOrigin: `${center}px ${center}px`,
          }}
        >
          <line
            x1={center}
            y1={center + secondTail}
            x2={center}
            y2={center - secondLength}
            stroke={secondsColor}
            strokeWidth={secondWidth}
            strokeLinecap="round"
          />
        </g>

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r={size * 0.025}
          fill={centerDotColor}
        />
      </svg>
    </div>
  );
}
