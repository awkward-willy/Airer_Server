"use client";

import React, { useEffect, useState } from "react";

import { getWeather } from "@/action/getWeather";
import type { Weather } from "@/type/weather";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";

function mapWeatherCodeToIcon(code: number) {
  switch (code) {
    // Code	Description from OpenMeteo
    // 0	Clear sky
    // 1, 2, 3	Mainly clear, partly cloudy, and overcast
    // 45, 48	Fog and depositing rime fog
    // 51, 53, 55	Drizzle: Light, moderate, and dense intensity
    // 56, 57	Freezing Drizzle: Light and dense intensity
    // 61, 63, 65	Rain: Slight, moderate and heavy intensity
    // 66, 67	Freezing Rain: Light and heavy intensity
    // 71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
    // 77	Snow grains
    // 80, 81, 82	Rain showers: Slight, moderate, and violent
    // 85, 86	Snow showers slight and heavy
    case 0:
      return "☀️";
    case 1:
    case 2:
    case 3:
      return "⛅";
    case 45:
    case 48:
      return "🌁";
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return "🌧️";
    case 56:
    case 57:
    case 66:
    case 67:
      return "🥶";
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return "❄️";
    default:
      return "❓";
  }
}

export default function Weather() {
  const [lat, setLat] = useState(-1);
  const [lon, setLon] = useState(-1);
  const [weather, setWeather] = useState<Weather>({
    time: new Date(),
    temperature2m: -1,
    relativeHumidity2m: -1,
    weatherCode: -1,
  });

  // 確保在瀏覽器環境下才取得經緯度
  if (typeof navigator !== "undefined") {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLat(latitude);
      setLon(longitude);
    });
  }

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
      setWeather({
        time: new Date(),
        temperature2m: NaN,
        relativeHumidity2m: NaN,
        weatherCode: NaN,
      });
      1;
    }, 60000);

    fetchData();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [lat, lon]);

  return (
    <div className="flex flex-wrap gap-4">
      {lat == -1 ||
      lon == -1 ||
      weather.temperature2m == -1 ||
      weather.relativeHumidity2m == -1 ? (
        <>
          <Spinner color="default" />
          <p>正在取得天氣資訊 ...</p>
        </>
      ) : Number.isNaN(weather.temperature2m) ? (
        <p>無法取得天氣資訊</p>
      ) : (
        <>
          <p>經度：{lat.toFixed(2)}</p>
          <p>緯度：{lon.toFixed(2)}</p>
          <p>天氣狀況：{mapWeatherCodeToIcon(weather.weatherCode)}</p>
          <p>溫度：{weather.temperature2m.toFixed(2)}°C</p>
          <p>相對濕度：{weather.relativeHumidity2m.toFixed(2)}%</p>
          <Accordion variant="bordered" isCompact>
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
          </Accordion>
        </>
      )}
    </div>
  );
}
