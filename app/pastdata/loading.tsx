import { Skeleton } from "@nextui-org/react";

export default function PastDataLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-9 w-1/4" />
      <Skeleton className="h-6 w-1/6" />
      <Skeleton className="h-6 w-1/6" />
      <Skeleton className="h-6 w-1/6" />
      <Skeleton className="h-[50vh] w-full" />
    </div>
  );
}
