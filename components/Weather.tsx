"use client";

import React, { useEffect, useState } from "react";

import { getWeather } from "@/action/getWeather";
import type { Weather } from "@/type/weather";
import { mapWeatherCodeToIcon } from "@/util/mapWeatherCodeToIcon";
import { Skeleton } from "@nextui-org/skeleton";
import { Spinner } from "@nextui-org/spinner";

import WeatherInfo from "./WeatherInfo";

export default function Weather() {
  const [lat, setLat] = useState(24.96715701074786);
  const [lon, setLon] = useState(121.1877090747221);
  const [weather, setWeather] = useState<Weather>({
    time: new Date(),
    temperature2m: -1,
    relativeHumidity2m: -1,
    weatherCode: -1,
  });

  // // 確保在瀏覽器環境下才取得經緯度
  // if (typeof navigator !== "undefined") {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const { latitude, longitude } = position.coords;
  //     setLat(latitude);
  //     setLon(longitude);
  //   });
  // }

  useEffect(() => {
    async function fetchData() {
      // 如果沒有取得經緯度，就不要取得天氣資訊
      if (lat == -1 || lon == -1) {
        return;
      }
      try {
        const weatherData = await getWeather(lat, lon);
        setWeather(weatherData);
      } catch (e) {
        setWeather({
          time: new Date(),
          temperature2m: NaN,
          relativeHumidity2m: NaN,
          weatherCode: NaN,
        });
      }
    }

    const timeoutId = setTimeout(() => {
      // 如果 1分鐘後還沒有取得天氣資訊，就顯示無法取得天氣資訊
      if (weather.temperature2m == -1 || weather.relativeHumidity2m == -1) {
        setWeather({
          time: new Date(),
          temperature2m: NaN,
          relativeHumidity2m: NaN,
          weatherCode: NaN,
        });
      }
    }, 60000);

    fetchData();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [lat, lon, weather.relativeHumidity2m, weather.temperature2m]);

  return (
    <div className="flex flex-wrap gap-4">
      {lat == -1 ||
      lon == -1 ||
      weather.temperature2m == -1 ||
      weather.relativeHumidity2m == -1 ? (
        <div className="flex h-56 w-full flex-col items-start gap-2">
          <div className="flex gap-2">
            <Spinner color="default" />
            <p>正在取得天氣資訊 ...</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
          </div>
        </div>
      ) : Number.isNaN(weather.temperature2m) ? (
        <p>無法取得天氣資訊</p>
      ) : (
        <>
          <p>經度：{lat.toFixed(2)}</p>
          <p>緯度：{lon.toFixed(2)}</p>
          <p>天氣狀況：{mapWeatherCodeToIcon(weather.weatherCode)}</p>
          <p>溫度：{weather.temperature2m.toFixed(2)}°C</p>
          <p>相對濕度：{weather.relativeHumidity2m.toFixed(2)}%</p>
          <WeatherInfo weather={weather} />
          {/* <Accordion variant="bordered" isCompact>
            <AccordionItem title="可能會下雨的時間：">
              {weather.badWeather && weather.badWeather.length > 0 ? (
                <ul>
                  {weather.badWeather.map((badWeather: Weather) => (
                    <li key={badWeather.time.toISOString()}>
                      {badWeather.time.toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>沒有下雨的時間</p>
              )}
            </AccordionItem>
          </Accordion> */}
        </>
      )}
    </div>
  );
}
