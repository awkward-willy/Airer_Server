import { NextRequest, NextResponse } from "next/server";

import { getPrediction } from "@/action/getPrediction";
import { Prisma, PrismaClient } from "@prisma/client";

type receivedData =
  | {
      sensor_data: SensorData[];
    }
  | string;

type SensorData = {
  uuid: string;
  temperature_sur: number | string;
  temperature_clothes: number;
  humidity_sur: number;
  humidity_clothes: number;
  weight: number;
};

const prisma = new PrismaClient();

type PredictionData =
  | {
      prediction: number;
    }
  | { error: string; dataAmount?: number };

export async function POST(request: NextRequest) {
  try {
    let requestData: receivedData = await request.json();
    requestData = JSON.stringify(requestData).replace(/\\"/g, '"');
    requestData = requestData.replace(/\\/g, "");
    requestData = requestData.replace(/"\["/g, "[");
    requestData = requestData.replace(/"\]"/g, "]");
    requestData = requestData.replace(/}","{/g, "},{");
    requestData = JSON.parse(requestData);
    const sensorData: SensorData[] =
      typeof requestData === "string"
        ? JSON.parse(requestData).sensor_data
        : requestData.sensor_data;
    for (let i = 0; i < sensorData.length; i++) {
      const data = sensorData[i];

      data.temperature_sur = parseFloat(data.temperature_sur.toString());
      data.temperature_clothes = parseFloat(
        data.temperature_clothes.toString()
      );
      data.humidity_sur = parseFloat(data.humidity_sur.toString());
      data.humidity_clothes = parseFloat(data.humidity_clothes.toString());
      data.weight = parseFloat(data.weight.toString());

      // 如果任一數據為 -1，則不保存
      if (
        data.temperature_clothes === -1 ||
        data.humidity_clothes === -1 ||
        data.weight === -1
      ) {
        continue;
      }

      const predictionJSON: PredictionData = await getPrediction({
        uuid: data.uuid,
        sensorId: i,
        temperature_sur: data.temperature_sur,
        temperature_clothes: data.temperature_clothes,
        humidity_sur: data.humidity_sur,
        humidity_clothes: data.humidity_clothes,
        weight: data.weight,
      });

      let prediction: number = NaN;
      if ("prediction" in predictionJSON) {
        prediction = predictionJSON.prediction;
      } else if ("error" in predictionJSON) {
        prediction = -1;
      }

      await prisma.sensorData.create({
        data: {
          transactionId: data.uuid,
          sensorId: i,
          temperatureClothes: data.temperature_clothes,
          temperatureSurround: data.temperature_sur,
          humidityClothes: data.humidity_clothes,
          humiditySurround: data.humidity_sur,
          weight: data.weight,
          prediction: prediction,
        },
      });
    }
    return NextResponse.json({ message: "Sensor data saved" });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { error: "Missing sensor data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An error occurred while saving sensor data" },
      { status: 500 }
    );
  }
}
