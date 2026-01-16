# Dashboard Widget App

## Project Overview
A Next.js + shadcn/ui + TypeScript dashboard with draggable widgets, featuring clocks, weather, pomodoro timer, and calendar functionality.

## Current Status
**All Core Features Complete**

### Completed Features
- **AnalogClock Component**: SVG-based clock with light/dark/auto themes, timezone support
- **Home Group Widget**: Combined widget with large clock, city code, date, weather conditions, and sunrise/sunset times
- **World Clocks Widget**: Mini clocks for configurable cities (MAA, BER, DXB)
- **Date Widget**: Shows day/month/date with calendar popup, Google Calendar integration
- **Pomodoro Widget**: Full timer with focus/break cycles, settings panel, notifications, sounds
- **Widget Toggle Overlay**: Settings gear to show/hide widgets
- **Drag & Drop**: Widgets can be reordered via drag and drop
- **localStorage Persistence**: All settings and widget positions are saved

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Font**: Hanken Grotesk (Google Fonts)
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable

## Project Structure
```
src/
├── app/
│   ├── api/weather/route.ts  # OpenWeather API proxy
│   ├── layout.tsx            # Root layout with Hanken Grotesk font
│   ├── page.tsx              # Main dashboard page
│   └── globals.css           # Theme variables, dark background
├── components/
│   ├── ui/                   # shadcn components (button, calendar, card, dialog, input, popover, switch)
│   ├── widgets/
│   │   ├── AnalogClock.tsx       # Reusable SVG clock
│   │   ├── HomeGroupWidget.tsx   # Combined clock, weather, sunrise/sunset
│   │   ├── WorldClockWidget.tsx
│   │   ├── DateWidget.tsx
│   │   ├── WeatherWidget.tsx     # Standalone weather (used by HomeGroup)
│   │   ├── SunriseSunsetWidget.tsx # Standalone sun times (used by HomeGroup)
│   │   ├── PomodoroWidget.tsx
│   │   └── Widget.tsx            # Base widget card
│   ├── WidgetGrid.tsx            # Drag & drop grid
│   └── WidgetToggleOverlay.tsx   # Settings overlay
├── context/
│   └── WidgetContext.tsx     # Widget state management
├── hooks/
│   ├── usePomodoro.ts        # Pomodoro timer logic
│   ├── useWeather.ts         # Weather API hook
│   └── useNotification.ts    # Notifications & sounds
├── types/
│   └── weather.ts            # Weather and sun data types
└── lib/
    └── utils.ts              # shadcn utilities

public/
├── assets/
│   └── clock/
│       ├── light/clockface.png
│       └── dark/clockface.png
└── sounds/                   # Pomodoro notification sounds
```

## Environment Variables
Copy `.env.example` to `.env.local` and add your API key:
```
OPENWEATHER_API_KEY=your_key_here
```

Get your free API key at https://openweathermap.org/api

## Commands
```bash
npm run dev    # Start development server (http://localhost:3000)
npm run build  # Build for production
npm run lint   # Run ESLint
```

## Features

### Widgets
1. **Home Group**: Combined widget featuring:
   - Large analog clock with city code (MEL), full date, timezone
   - Weather conditions and temperature (requires API key)
   - Sunrise/sunset times with sun icons (requires API key)
2. **World Clocks**: 3 configurable mini clocks with city info and time offset
3. **Date Widget**: Click to open calendar, select date to open Google Calendar
4. **Pomodoro Timer**:
   - Focus/Short Break/Long Break cycles
   - Settings: durations, auto-start breaks
   - Audio ding on completion
   - Push notifications (requires permission)

### Interactions
- **Drag & Drop**: Reorder widgets by dragging
- **Widget Toggle**: Click gear icon (top-right) to show/hide widgets
- **Calendar**: Click date widget to see calendar, click date to open Google Calendar

## Design
- Black background
- Light widget cards with rounded corners (1.25rem)
- Subtle shadows on widgets
- Clean, minimal aesthetic
