"use client";

import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ClothesDetail } from "@/type/clothesDetail";

type Props = {
  clothesDetail: ClothesDetail[];
};

function mapItemToChinese(item: string, value: number) {
  switch (item) {
    case "humidityClothes":
      return `衣物濕度: ${value.toFixed(2)} %`;
    case "temperatureClothes":
      return `衣物溫度: ${value.toFixed(2)} °C`;
    case "temperatureSurround":
      return `環境溫度: ${value.toFixed(2)} °C`;
    case "humiditySurround":
      return `環境濕度: ${value.toFixed(2)} %`;
    case "weight":
      return `重量: ${value.toFixed(2)} g`;
    case "prediction":
      if (value === 0.0001) {
        return "尚未開始預測";
      }
      return `預測時間: ${value.toFixed(0)} 分鐘`;
    default:
      return item;
  }
}

export default function ClothesChart({ clothesDetail }: Props) {
  clothesDetail = clothesDetail.map((data) => {
    if (data.prediction === -1) {
      data.prediction = 0.0001;
    } else {
      data.prediction = parseFloat(data.prediction.toFixed(0));
    }
    return data;
  });

  return (
    <div className="flex h-full w-full flex-col gap-4 sm:flex-row">
      <div className="flex-grow">
        <span className="text-lg">
          <i>溫溼度數據</i>
        </span>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={100}
          className="max-h-[20vh] rounded-md border-medium border-blue-950 dark:border-blue-50"
        >
          <LineChart
            data={clothesDetail}
            syncId={clothesDetail[0].transactionId + clothesDetail[0].sensorId}
          >
            <Tooltip content={<CustomTooltip />} />
            <Line dataKey="humidityClothes" stroke="#0B967D" dot={false} />
            <Line dataKey="humiditySurround" stroke="#DBAD29" dot={false} />
            <Line dataKey="temperatureClothes" stroke="#1F85AD" dot={false} />
            <Line dataKey="temperatureSurround" stroke="#CC6525" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-grow">
        <span className="text-lg">
          <i>重量數據</i>
        </span>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={100}
          className="max-h-[20vh] rounded-md border-medium border-blue-950 dark:border-blue-50 "
        >
          <AreaChart
            data={clothesDetail}
            syncId={clothesDetail[0].transactionId + clothesDetail[0].sensorId}
          >
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="weight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3182BD" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#3182BD"
              fillOpacity={1}
              fill="url(#weight)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-grow">
        <span className="text-lg">
          <i>預測時間</i>
        </span>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={100}
          className="max-h-[20vh] rounded-md border-medium border-blue-950 dark:border-blue-50"
        >
          <AreaChart
            data={clothesDetail}
            syncId={clothesDetail[0].transactionId + clothesDetail[0].sensorId}
          >
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="prediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F25E86" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="prediction"
              stroke="#F25E86"
              fillOpacity={1}
              fill="url(#prediction)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    if (payload[0].dataKey === "weight") {
      return (
        <div className="rounded-md bg-white p-4 shadow-md dark:bg-slate-800">
          <p style={{ color: payload[0].stroke }}>
            {mapItemToChinese(payload[0].dataKey, payload[0].value)}
          </p>
        </div>
      );
    } else if (payload[0].dataKey === "prediction") {
      return (
        <div className="rounded-md bg-white p-4 shadow-md dark:bg-slate-800">
          <p style={{ color: payload[0].stroke }}>
            {mapItemToChinese(payload[0].dataKey, payload[0].value)}
          </p>
        </div>
      );
    } else {
      return (
        <div className="rounded-md bg-white p-4 shadow-md dark:bg-slate-800">
          <p>{`時間: ${new Date(
            payload[0].payload.createdAt
          ).toLocaleString()}`}</p>
          {payload.map((item: any) => {
            return (
              <p style={{ color: item.stroke }} key={item.dataKey}>
                {mapItemToChinese(item.dataKey, item.value)}
              </p>
            );
          })}
        </div>
      );
    }
  }
  return null;
};
