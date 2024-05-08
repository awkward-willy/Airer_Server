interface ClothesDetail {
  id: string;
  transactionId: string;
  sensorId: number;
  createdAt: Date;
  humidityClothes: number;
  temperatureClothes: number;
  temperatureSurround: number;
  humiditySurround: number;
  weight: number;
  prediction: number;
}

export type { ClothesDetail };
