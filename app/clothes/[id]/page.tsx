import React from "react";

import { getClothesDetail } from "@/action/getClothesDetail";
import ClothesChart from "@/components/ClothesChart";
import Title from "@/components/Title";
import { ClothesDetail } from "@/type/clothesDetail";

type Props = {
  params: {
    id: number;
  };
};

export default async function ClothesDetailPage({ params }: Props) {
  const clothesDetail: ClothesDetail[] = await getClothesDetail();
  const time = 0;

  return (
    <div className="flex flex-col gap-4">
      <Title content="衣物詳情" />
      <p>衣物 ID: {params.id}</p>
      <p>衣物名稱: {clothesDetail[0].name}</p>
      <p>預計乾燥時間：{time}</p>
      <p>衣物數據:</p>
      <div className="h-[50vh] min-h-40 rounded-md border-medium p-4">
        <ClothesChart clothesDetail={clothesDetail} />
      </div>
    </div>
  );
}
