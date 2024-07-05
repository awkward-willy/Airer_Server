import { getClothesDetail } from "@/action/getClothesDetail";
import ClothesChart from "@/components/Clothes/ClothesChart";
import Title from "@/components/Title";
import { ClothesDetail } from "@/type/clothesDetail";

type Props = {
  params: {
    id: number;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export const dynamic = "force-dynamic";

export default async function ClothesDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = params;
  const { sensorId } = searchParams;
  const clothesDetail: ClothesDetail[] = await getClothesDetail(
    id.toString(),
    parseInt(sensorId as string)
  );

  let sensorIdDataArray: ClothesDetail[][] = [];

  if (sensorId == null) {
    // 建立 array in array，相同的 sensorId 放在同一個 array
    const sensorIdArray = Array.from(
      new Set(clothesDetail.map((data) => data.sensorId))
    );
    sensorIdDataArray = sensorIdArray.map((sensorId) =>
      clothesDetail.filter((data) => data.sensorId === sensorId)
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Title content="衣物詳情" />
      {clothesDetail.length === 0 ? (
        <p className="text-lg">找不到衣物資訊</p>
      ) : sensorId == null ? (
        <>
          <div className="mb-16 flex flex-col border-blue-950 dark:border-blue-50">
            {sensorIdDataArray.map((sensorIdData, index) => (
              <div key={index} className="h-fit">
                <p className="pb-2 text-xl font-bold">
                  衣物 {sensorIdData[0].sensorId + 1}
                </p>

                <ClothesChart clothesDetail={sensorIdData} />
                {
                  // 除了最後一個衣物，都加上分隔線
                  index !== sensorIdDataArray.length - 1 && (
                    <div className="my-8 border-t border-dashed border-gray-400"></div>
                  )
                }
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="pb-2 text-xl">
            衣物編號：<i>{Number(sensorId) + 1}</i>
          </p>
          {clothesDetail[clothesDetail.length - 1].prediction === -1 ? (
            <p className="text-lg">預計乾燥時間：仍在預測中...</p>
          ) : (
            <p className="text-lg">
              預計乾燥時間：
              {clothesDetail[clothesDetail.length - 1].prediction.toFixed(
                0
              )}{" "}
              分鐘
            </p>
          )}
          <div className="h-fit">
            <ClothesChart clothesDetail={clothesDetail} />
          </div>
        </>
      )}
    </div>
  );
}
