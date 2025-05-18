import { createFileRoute } from "@tanstack/react-router";
import Lottie from "lottie-react";
import { Logo } from "~/components/icons/logo";
import { CASES_CONFIG } from "~/lib/configs/cases.config";
import presentData from "../assets/present.json";
export const Route = createFileRoute("/cases")({
  component: RouteComponent,
});

function RouteComponent() {
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
          <div
            key={caseItem.id}
            className="flex w-[30%] flex-1 flex-col items-center rounded-lg bg-neutral-800 p-3"
          >
            <img src={caseItem.img} alt={caseItem.name} />
            <div className="font-bold">{caseItem.name}</div>
            <div className="text-subtitle_text_color flex items-center gap-1">
              {caseItem.price} <Logo width={"20px"} height={"20px"} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex w-full flex-wrap gap-3">
        <div className="opacity-50">ПОЛУЧЕННЫЕ ПРЕДМЕТЫ</div>
        <div className="flex h-14 w-full items-center justify-start rounded-xl bg-neutral-800 p-4">
          <div className="opacity-50">К сожалению, предметов пока нет</div>
        </div>
      </div>
    </div>
  );
}
