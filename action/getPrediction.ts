"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Props = {
  uuid: string;
  sensorId: number;
  temperature_sur: number;
  temperature_clothes: number;
  humidity_sur: number;
  humidity_clothes: number;
  weight: number;
};

export async function getPrediction(POSTSensorData: Props) {
  const latestData = await prisma.sensorData.findMany({
    where: {
      transactionId: POSTSensorData.uuid,
      sensorId: POSTSensorData.sensorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 9,
  });

  const initWeight = await prisma.sensorData.findFirst({
    where: {
      transactionId: POSTSensorData.uuid,
      sensorId: POSTSensorData.sensorId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (latestData.length === 0) {
    return { error: "No data found", dataAmount: 0 };
  }

  // 如果小於 10 筆資料，則回傳錯誤
  const SLIDING_WINDOW_SIZE = 9;
  if (latestData.length < SLIDING_WINDOW_SIZE) {
    return {
      error: "Not enough data to make a prediction",
      dataAmount: latestData.length,
    };
  }

  // 反轉最後 10 筆資料
  const slidingWindowData = latestData.reverse();

  let data = {
    temperature_sur: slidingWindowData.map((data) => data.temperatureSurround),
    temperature_clothes: slidingWindowData.map(
      (data) => data.temperatureClothes
    ),
    humidity_sur: slidingWindowData.map((data) => data.humiditySurround),
    humidity_clothes: slidingWindowData.map((data) => data.humidityClothes),
    weight: slidingWindowData.map((data) => data.weight),
    initWeight: initWeight?.weight,
  };

  // 把資料加在 array 的頭
  data = {
    temperature_sur: [POSTSensorData.temperature_sur, ...data.temperature_sur],
    temperature_clothes: [
      POSTSensorData.temperature_clothes,
      ...data.temperature_clothes,
    ],
    humidity_sur: [POSTSensorData.humidity_sur, ...data.humidity_sur],
    humidity_clothes: [
      POSTSensorData.humidity_clothes,
      ...data.humidity_clothes,
    ],
    weight: [POSTSensorData.weight, ...data.weight],
    initWeight: data.initWeight,
  };

  // 打 /predict 這個 endpoint
  const response = await fetch("http://140.115.51.163:40005/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const prediction = await response.json();
    return {
      prediction: prediction.prediction,
    };
  } else {
    return { error: "An error occurred while fetching prediction data" };
  }
}
