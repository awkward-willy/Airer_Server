import { Skeleton } from "@nextui-org/skeleton";

export default function loading() {
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
