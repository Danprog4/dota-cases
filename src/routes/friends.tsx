import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { shareURL } from "@telegram-apps/sdk";
import Lottie from "lottie-react";
import { useMemo } from "react";
import duckAnimation from "~/assets/duck.json";
import { BackButton } from "~/components/BackButton";
import { Logo } from "~/components/icons/logo";
import { useUser } from "~/hooks/useUser";
export const Route = createFileRoute("/friends")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { user } = useUser();
  const text = "Приглашаю тебя в игру Dota Cases!";
  const link = useMemo((): string => {
    return `https://t.me/DotaCases_bot?startapp=ref_${user?.id || ""}`;
  }, [user?.id]);
  return (
    <div className="flex flex-col items-center gap-2 p-4 pt-14">
      <BackButton onClick={() => navigate({ to: "/" })} />
      <div className="flex flex-col items-center gap-2">
        <div className="h-[150px] w-[150px]">
          <Lottie animationData={duckAnimation} loop={true} />
        </div>
        <div className="text-center text-4xl font-bold">
          Приглашай друзей <br />и получай кристаллы
        </div>
      </div>
      <div
        onClick={() => {
          if (shareURL.isAvailable()) {
            shareURL(link, text);
          }
        }}
        className="fixed right-0 bottom-20 left-0 mx-4 mb-4 flex w-auto cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-white"
      >
        Пригласить друга 500 <Logo width="20px" height="20px" />
      </div>
    </div>
  );
}
