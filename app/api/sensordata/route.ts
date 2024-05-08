import { NextRequest, NextResponse } from "next/server";

import { getPrediction } from "@/action/getPrediction";
import { Prisma, PrismaClient } from "@prisma/client";

type receivedData = {
  sensor_data: SensorData[];
};

type SensorData = {
  uuid: string;
  temperature_sur: number;
  temperature_clothes: number;
  humidity_sur: number;
  humidity_clothes: number;
  weight: number;
};

const prisma = new PrismaClient();

type PredictionData = {
  prediction: number;
  error?: string;
};

export async function POST(request: NextRequest) {
  try {
    const requestData: receivedData = await request.json();
    const sensorData: SensorData[] = requestData.sensor_data;
    for (let i = 0; i < sensorData.length; i++) {
      const data = sensorData[i];

      const predictionJSON: PredictionData = await getPrediction({
        temperature_sur: data.temperature_sur,
        temperature_clothes: data.temperature_clothes,
        humidity_sur: data.humidity_sur,
        humidity_clothes: data.humidity_clothes,
        weight: data.weight,
      });

      if (predictionJSON.error) {
        return NextResponse.json(
          { error: "An error occurred while fetching prediction data" },
          { status: 500 },
        );
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
          prediction: predictionJSON.prediction,
        },
      });
    }
    return NextResponse.json({ message: "Sensor data saved" });
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        { error: "Missing sensor data" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "An error occurred while saving sensor data" },
      { status: 500 },
    );
  }
}
