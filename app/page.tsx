import { getRecentData } from "@/action/getRecentData";
import ClothesCard from "@/components/Clothes/ClothesCard";
import Title from "@/components/Title";
import Weather from "@/components/Weather";
import { ClothesDetail } from "@/type/clothesDetail";

export const dynamic = "force-dynamic";

export default async function Home() {
  const recentData: ClothesDetail[] = await getRecentData();

  const time = Math.max(...recentData.map((data) => data.prediction)).toFixed(
    0
  );

  return (
    <div className="flex flex-col gap-4">
      <Title content="您的衣物" />
      {Number(time) === -1 ? (
        <p className="text-lg">
          最長等待時間：
          <strong className="underline underline-offset-4">
            仍在預測中...
          </strong>
        </p>
      ) : (
        <p className="text-lg">
          最長等待時間：
          <strong className="underline underline-offset-4 text-xl">
            {time}
          </strong>{" "}
          分鐘
        </p>
      )}
      <Weather />
      <div className="flex flex-wrap items-center justify-center gap-4">
        {recentData.map((data) => (
          <ClothesCard key={data.id} clothes={data} />
        ))}
      </div>
    </div>
  );
}
