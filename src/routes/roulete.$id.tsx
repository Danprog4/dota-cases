import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CASES_CONFIG } from "~/lib/configs/cases.config";
import { getArray } from "~/lib/utils/getArray";

export const Route = createFileRoute("/roulete/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/roulete/$id" });

  const arrayWithWinningItem = useMemo(() => getArray(Number(id)), [id]);
  const items = CASES_CONFIG.find((caseItem) => caseItem.id === Number(id))?.items;

  console.log(arrayWithWinningItem[arrayWithWinningItem.length - 1]);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!arrayWithWinningItem) return;
    const timer = setTimeout(() => {
      const distance = (arrayWithWinningItem.length - 1) * 49;
      setOffset(distance);
    }, 100);
    return () => clearTimeout(timer);
  }, [arrayWithWinningItem]);

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full">
        <div className="absolute top-1/2 left-2 z-10 -translate-y-1/2 transform">
          <div className="h-0 w-0 border-t-[20px] border-b-[20px] border-l-[30px] border-t-transparent border-r-red-500 border-b-transparent"></div>
        </div>

        <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2 transform">
          <div className="h-0 w-0 border-t-[20px] border-r-[30px] border-b-[20px] border-t-transparent border-b-transparent border-l-red-500"></div>
        </div>

        <div className="h-[100vh] overflow-hidden">
          <div
            className="flex flex-col"
            style={{
              transform: `translateY(-${offset}vh)`,
              transition: "transform 4s ease-out",
            }}
          >
            {arrayWithWinningItem?.map((item, index) => (
              <div
                key={index}
                className="flex h-[50vh] w-full items-center justify-center border"
              >
                {item.name}
              </div>
            ))}
            {items?.map((item, index) => (
              <div
                key={index}
                className="flex h-[50vh] w-full items-center justify-center border"
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
