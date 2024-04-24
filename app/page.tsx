import { Suspense } from "react";

import ClothesCard from "@/components/ClothesCard";
import Title from "@/components/Title";
import Weather from "@/components/Weather";
import { Clothes } from "@/type/clothes";

const clothes: Clothes[] = [
  {
    id: 1,
    time: 10,
  },
  {
    id: 2,
    time: 20,
  },
  {
    id: 3,
    time: 30,
  },
  {
    id: 4,
    time: 40,
  },
];

export default async function Home() {
  const time = 0;

  return (
    <div className="flex flex-col gap-4">
      <Title content="您的衣物" />
      <p>最長等待時間：{time}</p>
      <Weather />
      <div className="grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<p>Loading...</p>}>
          {clothes.map((clothes) => (
            <ClothesCard key={clothes.id} clothes={clothes} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
