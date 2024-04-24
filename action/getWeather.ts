"use server";

import { fetchWeatherApi } from "openmeteo";

import { Weather } from "@/type/weather";

export const getWeather = async (lat: number, lon: number) => {
  const params = {
    latitude: lat.toFixed(2),
    longitude: lon.toFixed(2),
    hourly: ["temperature_2m", "relative_humidity_2m", "weather_code"],
    timezone: "Asia/Singapore",
    past_days: 1,
    forecast_days: 7,
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();
  const hourly = response.hourly()!;
  const weatherData = {
    hourly: {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval(),
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
      weatherCode: hourly.variables(2)!.valuesArray()!,
    },
  };

  // 取得目前時間的天氣資料
  const now = new Date();
  const currentTime = now.getTime() / 1000;
  const currentIndex = weatherData.hourly.time.findIndex(
    (t) => t.getTime() / 1000 >= currentTime,
  );

  // 取得會下雨的時間
  let badWeatherList = [];
  for (let i = currentIndex; i < weatherData.hourly.time.length; i++) {
    if (weatherData.hourly.weatherCode[i] >= 20) {
      badWeatherList.push({
        time: weatherData.hourly.time[i],
        temperature2m: weatherData.hourly.temperature2m[i],
        relativeHumidity2m: weatherData.hourly.relativeHumidity2m[i],
        weatherCode: weatherData.hourly.weatherCode[i],
      });
    }
  }

  const packedWeatherData: Weather = {
    time: weatherData.hourly.time[currentIndex],
    temperature2m: weatherData.hourly.temperature2m[currentIndex],
    relativeHumidity2m: weatherData.hourly.relativeHumidity2m[currentIndex],
    weatherCode: weatherData.hourly.weatherCode[currentIndex],
    badWeather: badWeatherList,
  };

  return packedWeatherData;
};
