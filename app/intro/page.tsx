import NextImage from "next/image";

import Title from "@/components/Title";
import { Image } from "@nextui-org/image";
import { Tooltip } from "@nextui-org/tooltip";

export default function IntroPage() {
  return (
    <div className="flex flex-col gap-4">
      <Title content="專題介紹" />

      <section>
        <h2 className="mb-4 text-2xl font-bold">專題名稱</h2>
        <p className="text-lg">
          受夠中央的天氣 ~ 陰晴不定 – 基於類神經網路之晾曬時間預測系統
        </p>
        <p className="text-lg">
          Clothing Dry Time Prediction System Based on Neural Network Model
        </p>

        <h2 className="my-4 text-2xl font-bold">指導教授</h2>
        <ul className="list-inside list-disc">
          <li className="text-lg">蘇木春 教授</li>
        </ul>

        <h2 className="my-4 text-2xl font-bold">專題成員</h2>
        <ul className="list-inside list-disc">
          <li className="text-lg">盧韋仲</li>
          <li className="text-lg">劉韶颺</li>
        </ul>

        <h2 className="my-4 text-2xl font-bold">特別感謝</h2>
        <ul className="list-inside list-disc">
          <li className="text-lg">
            <Tooltip content="😢" delay={15000}>
              <span>唐崇祐</span>
            </Tooltip>
          </li>
          <li className="text-lg">呂宗祐</li>
          <li className="text-lg">陳俊宇</li>
          <li className="text-lg">Cilab 的學長姐們</li>
          <li className="text-lg">以及曾幫助我們的所有人 ...</li>
        </ul>
      </section>

      <div className="my-4 border-t border-dashed border-gray-400"></div>

      <section>
        <h2 className="mb-4 text-2xl font-bold">簡介</h2>
        <p className="text-lg">
          本研究旨在開發基於類神經網路的智慧型衣物晾曬時間預測系統，其以 ESP32
          作為主體，連接數個感測器持續監控環境參數後送至伺服器進行數據分析，透過預訓練模型準確預測衣物完全乾燥所需時間。此外，前述裝置皆結合
          3D
          列印技術，打造滑軌和收納盒，提供更加美觀且人性化的設計。本系統能在開始晾衣第十分鐘後，顯示使用者衣物的預計乾燥時間，幫助使用者做出更準確的判斷與時間上的安排。
        </p>
      </section>
      <div className="my-4 border-t border-dashed border-gray-400"></div>
      <section>
        <h2 className="mb-4 text-2xl font-bold">研究方法</h2>
        <h3 className="mb-2 text-xl font-semibold">資料收集</h3>
        <p className="my-4 text-lg">
          使用 ESP32 開發版連接 DHT22 溫濕度感測器、HX711
          重量感測器，以及土壤感測器作為訓練資料的收集裝置，並且用 Arduino IDE
          將偵測程式燒錄進 ESP32 中，讓量測資料在能夠透過 Wi-Fi
          每分鐘將資料整理成 JSON 格式後傳送至遠端伺服器進行儲存與分析。
        </p>
        <h3 className="mb-2 text-xl font-semibold">資料處理</h3>
        <p className="my-4 text-lg">
          使用重量曲線的斜率變化是否趨於平緩以及土壤感測器所量測的導電度是否趨近於
          0
          作為判定完全乾燥時間之依據，且為了使模型預測值盡可能大於目標值，添加了
          45
          分鐘之偏移量，接著將距離完全乾燥的剩餘時間作為模型預測的目標值。訓練資料每筆為連續
          10 分鐘的環境濕度、衣服濕度、環境溫度、環境濕度、衣服重量、初始重量共
          60 個特徵所組成之向量。
        </p>
        <h3 className="mb-2 text-xl font-semibold">模型預測</h3>
        <p className="my-4 text-lg">
          使用 Keras 設計一個七層神經網路。以前述之 60
          維特徵值作為輸入。首先，資料會進入包含 200 個節點之輸入層。接著經由 5
          個隱藏層，且每個隱藏層包含 200
          個節點，其中每兩層隱藏層會加入一個丟棄率為 0.2 的 Dropout
          層，以防止過度擬合的發生。上述節點的激勵函數皆採非線性函數
          ReLU，最終輸出至單一節點的輸出層，激勵函數採
          Linear，做線性的回歸預測。
        </p>
      </section>
      <div className="my-4 border-t border-dashed border-gray-400"></div>
      <section>
        <h2 className="mb-4 text-2xl font-bold">實驗結果</h2>
        <ul className="list-inside list-disc">
          <li className="text-lg">最大誤差時間: 64 分鐘</li>
          <li className="text-lg">誤差45分鐘內正確率: 83.9%</li>
          <Image
            as={NextImage}
            alt="Card background"
            className="my-4 h-full w-full rounded-xl object-cover"
            src={`/model.png`}
            priority={true}
            width={500}
            height={480}
          />
        </ul>
      </section>
      <div className="my-4 border-t border-dashed border-gray-400"></div>
      <section>
        <h2 className="mb-4 text-2xl font-bold">系統架構</h2>
        <Image
          as={NextImage}
          alt="Card background"
          className="my-4 h-full w-full rounded-xl object-cover"
          src={`/flowChart.png`}
          priority={true}
          width={800}
          height={400}
        />
      </section>
      <div className="my-4 border-t border-dashed border-gray-400"></div>
      <section>
        <h2 className="mb-4 text-2xl font-bold">專題特色</h2>
        <ul className="list-inside list-disc">
          <li className="text-lg">隨時讓使用者掌握曬衣狀況，增進生活效率</li>
          <li className="text-lg">綜合未來天氣資訊，給予最佳曬衣時間之建議</li>
          <li className="text-lg">可拆卸之衣架設計、可快速插拔之插槽設計</li>
          <li className="text-lg">
            友善的使用者界面，用戶可以隨時掌握曬衣資訊，實現智慧生活
          </li>
        </ul>
      </section>
      <div className="my-4 border-t border-dashed border-gray-400"></div>
      <section>
        <h2 className="mb-4 text-2xl font-bold">結論</h2>
        <p className="text-lg">
          本專題成功開發出一套基於類神經網路的智慧型衣物晾曬時間預測系統，有效解決某些環境下（ex.
          宿舍）衣物晾曬時間難以掌握的問題。系統具備實時性、智慧化與使用者友善等特色，為使用者帶來更便利、智慧的晾衣體驗。
        </p>
      </section>
      <div className="my-4 border-t border-dashed border-gray-400"></div>
      <section>
        <h2 className="mb-4 text-2xl font-bold">未來可進步方向</h2>
        <ul className="list-inside list-decimal">
          <li className="text-lg">持續收集並搭配資料增強技巧取得更多數據</li>
          <li className="text-lg">
            收集不同環境（如：開放或密閉空間、密閉冷氣房等）下的數據資料
          </li>
          <li className="text-lg">系統優化與模型調參空間</li>
        </ul>
      </section>

      <div className="mb-4"></div>
    </div>
  );
}
