import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 產生新的 UUID
    let uuid = uuidv4();
    let count = 0;

    // 確保 UUID 是唯一的
    while (await prisma.sensorData.findUnique({ where: { id: uuid } })) {
      uuid = uuidv4();
      count++;
      if (count > 20) {
        return NextResponse.json(
          { error: "Failed to generate a unique UUID" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ uuid });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while generating a new UUID" },
      { status: 500 },
    );
  }
}
