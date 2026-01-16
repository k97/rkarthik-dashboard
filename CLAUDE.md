# Dashboard Widget App

## Project Overview
A Next.js + shadcn/ui + TypeScript dashboard with draggable widgets, featuring clocks, weather, pomodoro timer, and calendar functionality.

## Current Status
**All Core Features Complete + Comprehensive Settings System**

### Completed Features
- **AnalogClock Component**: SVG-based clock with light/dark/auto themes, timezone support
- **Home Group Widget**: Combined widget with large clock, city code, date, weather conditions, and sunrise/sunset times
  - Empty state when location permission denied
  - Click "Select Location" to open settings
- **World Clocks Widget**: Configurable mini clocks with city info and time offset
  - Empty state when no cities configured
  - Click "Add Cities" to open settings
- **Date Widget**: Shows day/month/date with calendar popup, Google Calendar integration
- **Pomodoro Widget**: Full timer with focus/break cycles, notifications, sounds
  - Bolt icon opens settings to Timer tab
- **Comprehensive Settings Overlay**: Centralized settings with three tabs:
  - **Widgets Tab**: Show/hide widgets
  - **Cities Tab**: City selection with Home City and World Clocks sub-tabs
  - **Timer Tab**: Pomodoro timer configuration
- **City Database**: 100+ cities organized by region (macOS-style)
- **City Selector**: Search and browse cities by region with "Use My Location" feature
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
│   ├── ui/                   # shadcn components (button, calendar, card, dialog, input, popover, switch, tabs)
│   ├── widgets/
│   │   ├── AnalogClock.tsx       # Reusable SVG clock
│   │   ├── HomeGroupWidget.tsx   # Combined clock, weather, sunrise/sunset
│   │   ├── WorldClockWidget.tsx  # Configurable world clocks with empty state
│   │   ├── DateWidget.tsx        # Calendar widget
│   │   ├── PomodoroWidget.tsx    # Timer with settings icon
│   │   └── Widget.tsx            # Base widget card
│   ├── WidgetGrid.tsx            # Drag & drop grid
│   ├── SettingsOverlay.tsx       # Main settings dialog with tabs
│   └── CitySelector.tsx          # City search and selection component
├── context/
│   └── WidgetContext.tsx     # Widget state management (widgets, locations, clocks, settings)
├── data/
│   └── cities.ts             # 100+ cities database with timezones
├── hooks/
│   ├── usePomodoro.ts        # Pomodoro timer logic
│   ├── useWeather.ts         # Weather API hook
│   ├── useGeolocation.ts     # Browser geolocation hook
│   └── useNotification.ts    # Notifications & sounds
├── types/
│   └── weather.ts            # Weather and sun data types
└── lib/
    └── utils.ts              # shadcn utilities + sun data formatters

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
   - Large analog clock with city code, full date, timezone
   - Weather conditions and temperature (requires API key)
   - Sunrise/sunset times with sun icons (requires API key)
   - Empty state with "Select Location" button when location permission denied
2. **World Clocks**: Configurable mini clocks with city info and time offset
   - Add/remove cities through settings
   - Empty state with "Add Cities" button when no cities configured
   - Displays relative day (Today/Tomorrow/Yesterday) and timezone offset
3. **Date Widget**: Click to open calendar, select date to open Google Calendar
4. **Pomodoro Timer**:
   - Focus/Break cycles with configurable durations
   - Auto-start breaks option
   - Audio ding on completion
   - Push notifications (requires permission)
   - Bolt icon to quickly access timer settings

### Settings System
**Comprehensive Settings Overlay** (Settings2 icon, top-right):

1. **Widgets Tab**:
   - Toggle widget visibility
   - Show/hide any widget from the dashboard

2. **Cities Tab**:
   - **Home City Sub-Tab**:
     - Search 100+ cities organized by region
     - "Use My Location" button for automatic location detection
     - Browse cities grouped by: Oceania, Asia, Indian Subcontinent, Middle East, Europe, Africa, North America, South America, Pacific
   - **World Clocks Sub-Tab**:
     - Add cities to track time around the world
     - Remove cities with X button
     - Prevents duplicate entries
     - Search and filter by city name, country, or region

3. **Timer Tab**:
   - Focus duration (1-60 minutes)
   - Break duration (1-30 minutes)
   - Auto-start breaks toggle

### Interactions
- **Drag & Drop**: Reorder widgets by dragging
- **Settings Access**:
  - Click Settings2 icon (top-right) to open main settings
  - Click Bolt icon in Pomodoro widget to open Timer settings
  - Click "Select Location" in Home widget to open Cities settings (Home tab)
  - Click "Add Cities" in World Clocks widget to open Cities settings (World tab)
- **Calendar**: Click date widget to see calendar, click date to open Google Calendar
- **Location**: Browser geolocation with manual city selection fallback

## Design
- Black background
- Light widget cards with rounded corners (1.25rem)
- Subtle shadows on widgets
- Clean, minimal aesthetic
