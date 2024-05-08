"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllTransactionId() {
  try {
    const transId = await prisma.sensorData.findMany({
      distinct: ["transactionId"],
      select: { transactionId: true },
      orderBy: { createdAt: "desc" },
    });
    // get time according to transactionId
    const timestamps = [];
    for (let i = 0; i < transId.length; i++) {
      const timestamp = await prisma.sensorData.findFirst({
        where: {
          transactionId: transId[i].transactionId,
        },
        select: { createdAt: true },
      });
      timestamps.push({
        transactionId: transId[i].transactionId,
        createdAt: timestamp?.createdAt,
      });
    }
    return timestamps;
  } catch (error) {
    console.error(error);
    return [];
  }
}
