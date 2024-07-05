"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getClothesDetail(filename: string, sensorId: number) {
  try {
    // if sensorId is NaN, and filename exists, return all sensor data
    if (isNaN(sensorId)) {
      const sensorData = await prisma.sensorData.findMany({
        where: {
          transactionId: filename,
        },
      });

      if (sensorData.length === 0) {
        return [];
      }

      // sort by sensorId
      sensorData.sort((a, b) => a.sensorId - b.sensorId);

      return sensorData;
    }

    const sensorData = await prisma.sensorData.findMany({
      where: {
        transactionId: filename,
      },
    });

    if (sensorData.length === 0) {
      return [];
    }

    // filiter the data by sensorId
    return sensorData.filter((data) => data.sensorId === sensorId);
  } catch (error) {
    console.error(error);
    return [];
  }
}
