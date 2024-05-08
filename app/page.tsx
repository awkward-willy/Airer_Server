import { Suspense } from "react";

import { getRecentData } from "@/action/getRecentData";
import ClothesCard from "@/components/ClothesCard";
import Title from "@/components/Title";
import Weather from "@/components/Weather";
import { ClothesDetail } from "@/type/clothesDetail";

export default async function Home() {
  const recentData: ClothesDetail[] = await getRecentData();

  const time = Math.max(...recentData.map((data) => data.prediction));

  return (
    <div className="flex flex-col gap-4">
      <Title content="您的衣物" />
      <p>最長等待時間：{time}</p>
      <Weather />
      <div className="grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<p>Loading...</p>}>
          {recentData.map((data) => (
            <ClothesCard key={data.id} clothes={data} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
