"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AutoRefresher() {
  const router = useRouter();
  const [Refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshed(!Refreshed);
      router.refresh();
    }, 60000);
    return () => clearInterval(interval);
  }, [Refreshed]);

  return <></>;
}
