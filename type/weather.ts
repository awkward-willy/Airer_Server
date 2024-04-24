interface Weather {
  time: Date;
  temperature2m: number;
  relativeHumidity2m: number;
  weatherCode: number;
  badWeather?: Weather[];
}

export type { Weather };
