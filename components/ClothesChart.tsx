"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

import { ClothesDetail } from "@/type/clothesDetail";

type Props = {
  clothesDetail: ClothesDetail[];
};

function mapItemToChinese(item: string, value: number) {
  switch (item) {
    case "humidity_clothes":
      return `衣物濕度: ${value} %`;
    case "temperature_clothes":
      return `衣物溫度: ${value} °C`;
    case "temperature_sur":
      return `環境溫度: ${value} °C`;
    case "humidity_sur":
      return `環境濕度: ${value} %`;
    case "weight":
      return `重量: ${value} g`;
    default:
      return item;
  }
}

export default function ClothesChart({ clothesDetail }: Props) {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <span>溫溼度數據</span>
      <ResponsiveContainer
        width="100%"
        height="100%"
        className="rounded-md border-medium"
      >
        <LineChart data={clothesDetail} syncId="anyId">
          <Tooltip content={<CustomTooltip />} />
          <Line dataKey="humidity_clothes" stroke="#0B967D" dot={false} />
          <Line dataKey="temperature_clothes" stroke="#1F85AD" dot={false} />
          <Line dataKey="temperature_sur" stroke="#CC6525" dot={false} />
          <Line dataKey="humidity_sur" stroke="#DBAD29" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <span>重量數據</span>
      <ResponsiveContainer
        width="100%"
        height="100%"
        className="rounded-md border-medium"
      >
        <LineChart data={clothesDetail} syncId="anyId">
          <Tooltip content={<CustomTooltip />} />
          <Line dataKey="weight" stroke="#F25E86" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    if (payload[0].dataKey === "weight") {
      const textcolor = `text-[${payload[0].stroke}]`;
      return (
        <div className="rounded-md bg-white p-4 shadow-md dark:bg-slate-800">
          <p>{`索引值: ${label}`}</p>
          <p style={{ color: payload[0].stroke }}>
            {mapItemToChinese(payload[0].dataKey, payload[0].value)}
          </p>
        </div>
      );
    } else {
      return (
        <div className="rounded-md bg-white p-4 shadow-md dark:bg-slate-800">
          <p>{`索引值: ${label}`}</p>
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
