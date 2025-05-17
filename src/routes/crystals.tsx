import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Lottie from "lottie-react";
import dotaAnimation from "~/assets/dota.json";
import { BackButton } from "~/components/BackButton";
import { Logo } from "~/components/icons/logo";
import { TelegramStar } from "~/components/TelegramStar";
import { useBuyCrystals } from "~/hooks/useBuyCrystals";
import { CRYSTAL_PRICE } from "~/lib/configs/crys.price";

export const Route = createFileRoute("/crystals")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { buyCrystals } = useBuyCrystals();

  return (
    <div className="flex h-screen w-full flex-col items-center overflow-y-auto p-4 pt-24 pb-24">
      <BackButton onClick={() => navigate({ to: "/" })} />
      <div className="item mb-4 flex flex-col items-center">
        <div className="h-[88px] w-[88px]">
          <Lottie animationData={dotaAnimation} loop={true} />
        </div>
        <div className="mb-2 text-4xl font-bold">Купить DOTA COINS</div>
        <div className="text-sm">Выбери нужное количество DOTA COINS</div>
      </div>
      <div className="flex w-full flex-col gap-3">
        {CRYSTAL_PRICE.map((crystal) => (
          <div
            onClick={() => buyCrystals.mutate(crystal.stars)}
            key={crystal.stars}
            className="flex cursor-pointer items-center justify-between rounded-xl bg-neutral-800 p-4"
          >
            <div className="flex items-center gap-2">
              <div className="text-blue-400">
                <Logo width="24px" height="24px" />
              </div>
              <div className="text-xl font-medium">{crystal.stars}</div>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-neutral-400">≈ {crystal.price} ₽</div>
              <div className="flex items-center justify-center gap-2">
                <div className="px- flex items-center justify-center rounded-lg font-medium">
                  {crystal.stars}
                </div>
                <TelegramStar />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
