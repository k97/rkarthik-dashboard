# Dash

A small dashboard of widgets, the kind of thing you leave open on a second screen. Most component libraries are full of tables and charts; this one is for the things you actually glance at during the day — a clock, world clocks, today's date, a pomodoro timer, and a combined home view with weather and sunrise/sunset.

Each widget is built as its own component: the analog clock is drawn from SVG paths so it scales cleanly and eases between positions instead of snapping, the date card computes its own ISO week number, and the timer keeps running through a closed tab and can chime or notify when a phase ends. Widgets can be dragged into whatever order you like, and layout and settings persist in localStorage.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, and dnd-kit for drag and drop.

## Running locally

```
npm install
npm run dev
```

Open http://localhost:3000. Weather and sunrise/sunset data need an OpenWeather key — copy .env.example to .env.local and set OPENWEATHER_API_KEY (get one free at openweathermap.org).

## License

CC0 1.0 Universal — see LICENSE.
