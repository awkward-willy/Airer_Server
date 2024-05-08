"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getRecentData() {
  try {
    // 取得最新一筆資料中的 transactionId
    const newestData = await prisma.sensorData.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    // 用該筆資料的 id 去找出所有的資料
    const allData = await prisma.sensorData.findMany({
      where: {
        transactionId: newestData?.transactionId,
      },
    });

    // 找出有幾種 sensorId
    const sensorIds = new Set(allData.map((data) => data.sensorId));

    // 只取最新的一筆 allData
    const filteredData = Array.from(sensorIds).map((sensorId) => {
      const sensorData = allData.filter((data) => data.sensorId === sensorId);
      const newestData = sensorData.reduce((prev, current) =>
        prev.createdAt > current.createdAt ? prev : current,
      );
      return newestData;
    });

    return filteredData;
  } catch (error) {
    console.error(error);
    return [];
  }
}
