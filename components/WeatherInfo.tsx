import { useMemo } from "react";

import { Weather } from "@/type/weather";
import { mapWeatherCodeToIcon } from "@/util/mapWeatherCodeToIcon";
import { Card, CardBody } from "@nextui-org/card";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Spinner } from "@nextui-org/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";

type Props = {
  weather: Weather;
};

function findBestTime(weather: Weather) {
  // 以日為單位，比 weather.time 以後的時間，且當天下雨最少
  if (!weather.allWeather) {
    return undefined;
  }

  // Array 儲存每天的下雨次數
  const rainCount = new Array(7).fill(0);

  if (weather.badWeather) {
    weather.badWeather.forEach((badWeather) => {
      const day = badWeather.time.getDay();
      rainCount[day] += 1;
    });
  }

  // 找出下雨次數最少的日期
  const minIndex = rainCount.indexOf(Math.min(...rainCount));

  // 找出該日期的所有時間
  const time = weather.allWeather.time.filter(
    (time: { getDay: () => number }) => time.getDay() === minIndex
  );

  // 找出最早的時間
  const minTime = time.reduce((a: number, b: number) => (a < b ? a : b));

  return { time: minTime, count: rainCount[minIndex] };
}

export default function WeatherInfo({ weather }: Props) {
  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: [
        "bg-content1",
        "text-black dark:text-white",
        "border-b",
        "border-divider",
        "dark:border-gray-400",
      ],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      <Card>
        <CardBody>
          <fieldset className="h-full rounded-lg border border-gray-400 px-4">
            <legend className="px-2 text-lg font-bold">
              適合晾衣服日期 👔
            </legend>
            <p className="p-2">
              {findBestTime(weather)?.time.toLocaleDateString()}
              ，當天下雨小時數：
              {" " + findBestTime(weather)?.count}
            </p>
          </fieldset>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <fieldset className="h-full rounded-lg border border-gray-400 px-4">
            <legend className="px-2 text-lg font-bold">可能下雨時間 🌧️</legend>
            <ScrollShadow className="h-40 p-2" hideScrollBar>
              {weather.badWeather && weather.badWeather.length > 0 ? (
                <ul>
                  {weather.badWeather.map((badWeather: Weather) => (
                    <li key={badWeather.time.toISOString()}>
                      {badWeather.time.toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>一周內無下雨的時間</p>
              )}
            </ScrollShadow>
          </fieldset>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <fieldset className="h-full rounded-lg border border-gray-400 px-4">
            <legend className="px-2 text-lg font-bold">
              未來每小時天氣資訊 🌡️
            </legend>
            <ScrollShadow isEnabled={false} className="h-40" hideScrollBar>
              <Table
                aria-label="weather"
                removeWrapper
                classNames={classNames}
                isHeaderSticky
              >
                <TableHeader>
                  <TableColumn>時間</TableColumn>
                  <TableColumn>溫度</TableColumn>
                  <TableColumn>濕度</TableColumn>
                  <TableColumn className="text-center">天氣狀況</TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={"無法取得天氣資訊"}
                  loadingContent={<Spinner color="default" />}
                >
                  {weather.allWeather && weather.allWeather.time.length > 0 ? (
                    weather.allWeather.time.map(
                      (
                        time: {
                          toISOString: () => string;
                          toLocaleString: () => string;
                        },
                        index: string | number
                      ) => (
                        <TableRow key={time.toISOString()}>
                          <TableCell>{time.toLocaleString()}</TableCell>
                          <TableCell>
                            {weather.allWeather.temperature2m[index].toFixed(2)}
                            °C
                          </TableCell>
                          <TableCell>
                            {weather.allWeather.relativeHumidity2m[
                              index
                            ].toFixed(0)}
                            %
                          </TableCell>
                          <TableCell className="text-center">
                            {mapWeatherCodeToIcon(
                              weather.allWeather.weatherCode[index]
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>無法取得天氣資訊</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollShadow>
          </fieldset>
        </CardBody>
      </Card>
    </div>
  );
}
