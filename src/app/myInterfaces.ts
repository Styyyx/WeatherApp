export interface IweatherData {
  location: string;
  stationName: string;

  weather: string;
  icon: string;

  windSpeed: string;
  humidity: string;

  sunrise: string;
  sunset: string;

  temp: number;
  temp_max: number;
  temp_min: number;

  date: number;
  time: string;
  weekday: string;
  day: string;
  monthLong: string;
  monthNum: number;
}

export interface Icity {
  city_name: string;
  lat: any;
  lon: any;
  locality: string;
}

export interface IforecastDay {
  weekday: string;
  temp_max: number;
  temp_min: number;
}