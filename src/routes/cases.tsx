import { createFileRoute, Link } from "@tanstack/react-router";
import Lottie from "lottie-react";
import { useMemo } from "react";
import { CASE_IMAGES } from "~/case-images";
import { Logo } from "~/components/icons/logo";
import { useUser } from "~/hooks/useUser";
import { CASES_CONFIG } from "~/lib/configs/cases.config";
import presentData from "../assets/present.json";
export const Route = createFileRoute("/cases")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUser();

  const userItemsWithImages = useMemo(() => {
    return user?.items?.map((item) => {
      const caseImage = CASE_IMAGES.find((image) => image.markethashname === item.name);
      return { ...item, image: caseImage?.itemimage ?? "/fallback.png" };
    });
  }, [user?.items]);

  return (
    <div className="flex w-full flex-col p-4 pt-14">
      <div className="mx-auto h-[150px] w-[150px]">
        <Lottie animationData={presentData} loop={true} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-4xl font-bold">Магазин</div>
        <div className="text-center text-lg">
          Меняй DOTA COINS на кейсы, стикеры и скины для Dota 2
        </div>
      </div>
      <div className="mt-2 flex w-full flex-wrap gap-3">
        {CASES_CONFIG.map((caseItem) => (
          <Link
            key={caseItem.id}
            to={"/case/$id"}
            params={{ id: caseItem.id.toString() }}
            className="flex w-[30%] flex-1 flex-col items-center rounded-lg bg-neutral-800 p-3"
          >
            <img src={caseItem.img} alt={caseItem.name} />
            <div className="font-bold">{caseItem.name}</div>
            <div className="text-subtitle_text_color flex items-center gap-1">
              {caseItem.price} <Logo width={"20px"} height={"20px"} />
            </div>
          </Link>
        ))}
      </div>
      {user?.items && user.items.length > 0 ? (
        <div className="mt-4 flex w-full flex-col gap-2">
          <div className="opacity-50">ПОЛУЧЕННЫЕ ПРЕДМЕТЫ</div>
          <div className="grid w-full grid-cols-3 gap-3">
            {userItemsWithImages?.map((item) => (
              <div
                key={item.id}
                className="flex h-[160px] flex-col items-center justify-start gap-2 rounded-md border-2 border-neutral-700 p-2 text-center"
              >
                <img
                  className="min-h-[100px] w-full rounded-md object-cover"
                  src={item.image}
                  alt={item.name}
                />
                <div className="text-xs">
                  {item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex w-full flex-wrap gap-3">
          <div className="opacity-50">К сожалению, предметов пока нет</div>
        </div>
      )}
    </div>
  );
}
