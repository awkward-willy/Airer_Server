import { Suspense } from "react";

import { getRecentData } from "@/action/getRecentData";
import ClothesCard from "@/components/Clothes/ClothesCard";
import Title from "@/components/Title";
import Weather from "@/components/Weather";
import { ClothesDetail } from "@/type/clothesDetail";

export default async function Home() {
  const recentData: ClothesDetail[] = await getRecentData();

  const time = Math.max(...recentData.map((data) => data.prediction)).toFixed(
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <Title content="您的衣物" />
      <p>最長等待時間：{time} 分鐘</p>
      <Weather />
      <div className="flex flex-wrap items-center justify-around gap-4">
        {recentData.map((data) => (
          <ClothesCard key={data.id} clothes={data} />
        ))}
      </div>
    </div>
  );
}
