import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

interface WeatherResponse {
  temperature: number;
  condition: string;
  description: string;
  sunrise: number;
  sunset: number;
  icon: string;
  cityName: string;
  timezone: number; // UTC offset in seconds
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // Require either city or lat/lon
  if (!city && (!lat || !lon)) {
    return NextResponse.json(
      { error: 'Either city or lat/lon parameters are required' },
      { status: 400 }
    );
  }

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { error: 'OpenWeather API key is not configured' },
      { status: 500 }
    );
  }

  try {
    // Build URL based on available parameters (prefer lat/lon if both provided)
    const locationParam = lat && lon
      ? `lat=${lat}&lon=${lon}`
      : `q=${encodeURIComponent(city!)}`;
    const url = `${OPENWEATHER_BASE_URL}?${locationParam}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'City not found' },
          { status: 404 }
        );
      }
      throw new Error(`OpenWeather API error: ${response.status}`);
    }

    const data = await response.json();

    const weatherData: WeatherResponse = {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main.toLowerCase(),
      description: data.weather[0].description,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      icon: data.weather[0].icon,
      cityName: data.name,
      timezone: data.timezone, // UTC offset in seconds
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
