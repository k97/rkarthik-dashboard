export type WeatherCondition =
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'fog'
  | 'overcast';

export interface WeatherData {
  temperature: number;
  condition: WeatherCondition;
  description: string;
}

export interface SunData {
  sunrise: string; // formatted time like "6:12 am"
  sunset: string;  // formatted time like "7:43 pm"
}
