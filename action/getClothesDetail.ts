"use server";

import fs from "fs";

import { ClothesDetail } from "@/type/clothesDetail";

export async function getClothesDetail(): Promise<ClothesDetail[]> {
  const data = fs.readFileSync("data/0410.csv", "utf8");
  const lines = data.split("\n");
  const clothesDetail: ClothesDetail[] = [];
  for (const line of lines) {
    const [
      time,
      humidity_clothes,
      temperatureC_clothes,
      temperatureF_clothes,
      humidity_sur,
      temperatureC_sur,
      temperatureF_sur,
      weight,
      _,
      __,
    ] = line.split(",");
    clothesDetail.push({
      id: 1,
      name: "衣物1",
      humidity_clothes: Number(humidity_clothes),
      temperature_clothes: Number(temperatureC_clothes),
      temperature_sur: Number(temperatureC_sur),
      humidity_sur: Number(humidity_sur),
      weight: Number(weight),
    });
  }

  return clothesDetail;
}
