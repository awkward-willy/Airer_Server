import { getClothesDetail } from "@/action/getClothesDetail";
import ClothesChart from "@/components/Clothes/ClothesChart";
import Title from "@/components/Title";
import { ClothesDetail } from "@/type/clothesDetail";
import { Divider } from "@nextui-org/divider";

type Props = {
  params: {
    id: number;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ClothesDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = params;
  const { sensorId } = searchParams;
  const clothesDetail: ClothesDetail[] = await getClothesDetail(
    id.toString(),
    parseInt(sensorId as string),
  );
  const time = 0;

  let sensorIdDataArray: ClothesDetail[][] = [];

  if (sensorId == null) {
    // 建立 array in array，相同的 sensorId 放在同一個 array
    const sensorIdArray = Array.from(
      new Set(clothesDetail.map((data) => data.sensorId)),
    );
    sensorIdDataArray = sensorIdArray.map((sensorId) =>
      clothesDetail.filter((data) => data.sensorId === sensorId),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Title content="衣物詳情" />
      {clothesDetail.length === 0 ? (
        <p>找不到衣物資訊</p>
      ) : sensorId == null ? (
        <>
          <div className="mb-16 flex min-h-40 flex-col gap-20 border-blue-950 dark:border-blue-50">
            {sensorIdDataArray.map((sensorIdData, index) => (
              <div key={index} className="h-96">
                <p>衣物 {index + 1}</p>
                <ClothesChart clothesDetail={sensorIdData} />
                {
                  // 除了最後一個衣物，都加上分隔線
                  index !== sensorIdDataArray.length - 1 && (
                    <Divider className="my-8 h-0.5 bg-blue-950 dark:bg-blue-50" />
                  )
                }
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p>衣物編號：{sensorId}</p>
          <p>預計乾燥時間：{time}</p>
          <div className="h-96">
            <ClothesChart clothesDetail={clothesDetail} />
          </div>
        </>
      )}
    </div>
  );
}
