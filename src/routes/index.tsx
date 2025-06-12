import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { shareURL } from "@telegram-apps/sdk";
import { useEffect, useMemo, useState } from "react";
import { Carousel } from "~/components/Carousel";
import { ClickMe } from "~/components/ClickMe";
import { CompletedTasks } from "~/components/CompletedTasks";
import { Logo } from "~/components/icons/logo";
import { TapButton } from "~/components/TapButton";
import { TasksList } from "~/components/Tasks";
import { useUser } from "~/hooks/useUser";
import { getCasesWithImages } from "~/lib/utils/getItemsImages";
import { useTRPC } from "~/trpc/init/react";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { user } = useUser();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const text = "Приглашаю тебя в игру Dota Cases!";
  const [isOnboarded, setIsOnboarded] = useState(false);
  const link = useMemo((): string => {
    return `https://t.me/DotaCases_bot?startapp=ref_${user?.id || ""}`;
  }, [user?.id]);
  const setOnboarded = useMutation(trpc.main.setOnboarded.mutationOptions({}));

  useEffect(() => {
    getCasesWithImages();
  }, []);

  useEffect(() => {
    if (!user?.isOnboarded) {
      setIsOnboarded(false);
    } else {
      setIsOnboarded(true);
    }
  }, [user?.isOnboarded]);

  console.log(user?.isOnboarded, isOnboarded);

  const onFinish = () => {
    setIsOnboarded(true);
    setOnboarded.mutate();
    queryClient.setQueryData(["user"], (old: any) => {
      return {
        ...old,
        isOnboarded: true,
      };
    });
  };

  if (!user?.isOnboarded && !isOnboarded) {
    return <Carousel onFinish={onFinish} />;
  }

  return (
    <div className="flex w-full flex-col items-center overflow-x-hidden overflow-y-auto p-4 pt-24 pb-24">
      <div className="flex flex-col items-center gap-2 pb-4">
        <div className="relative flex w-full items-center justify-center">
          <TapButton />
          <div className="absolute top-4 right-0 bottom-0 left-50 flex h-34 w-34 items-center justify-center">
            <ClickMe />
          </div>
        </div>
        <h1 className="text-4xl font-bold">DOTA COINS</h1>

        <p className="text-md w-[68vw] text-center">
          Зарабатывай DOTA COINS и меняй их на кейсы, стикеры и скины для Dota 2
        </p>
      </div>
      <div className="mb-2 flex w-full flex-col items-center justify-center rounded-2xl bg-neutral-800 p-4">
        <div className="flex items-center justify-center gap-2 text-4xl">
          <Logo width="30px" height="30px" /> {user?.crystalBalance}
        </div>
        <div className="text-muted-foreground mb-3 text-sm">твой баланс</div>
        <div
          className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-red-500 py-4 text-white"
          onClick={() => navigate({ to: "/crystals" })}
        >
          Купить DOTA COINS
        </div>
      </div>
      <div className="mb-4 flex w-full flex-col gap-2">
        <div className="opacity-50">Задания</div>
        <div className="flex h-fit w-full items-center justify-start rounded-xl bg-neutral-800 px-4 py-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <div className="max-w-50">Пригласи друга, который играет в Dota 2</div>
              <div className="flex items-center gap-2">
                + 500 <Logo width="20px" height="20px" />
              </div>
            </div>
            <div
              onClick={() => {
                if (shareURL.isAvailable()) {
                  shareURL(link, text);
                }
              }}
              className="rounded-full bg-red-500 px-4 py-2 text-white"
            >
              Пригласить
            </div>
          </div>
        </div>

        <TasksList />
      </div>
      <div className="flex w-full flex-col gap-2">
        <CompletedTasks />
      </div>
    </div>
  );
}
