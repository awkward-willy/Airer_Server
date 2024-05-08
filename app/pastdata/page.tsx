import Link from "next/link";
import { Suspense } from "react";

import { getAllTransactionId } from "@/action/getAllTransactionId";
import PastDataTable from "@/components/PastData/PastDataTable";
import PastDataWrapper from "@/components/PastData/PastDataWrapper";
import Title from "@/components/Title";
import { Skeleton } from "@nextui-org/skeleton";

export default async function PastdataPage() {
  const files = await getAllTransactionId();
  return (
    <div className="flex flex-col gap-4">
      <Title content="過往資料" />
      {files.length === 0 ? (
        <p>沒有資料</p>
      ) : (
        <Suspense
          fallback={
            <div className="flex flex-col gap-2">
              {[...Array(10)].map((_, index) => (
                <Skeleton key={index} className="h-11 w-full" />
              ))}
            </div>
          }
        >
          <PastDataWrapper data={files} />
        </Suspense>
      )}
    </div>
  );
}
