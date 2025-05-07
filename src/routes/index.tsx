import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUser } from "~/components/hooks/useUser";
import { Logo } from "~/components/icons/logo";
import { TapButton } from "~/components/TapButton";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="flex h-screen w-full flex-col items-center overflow-y-auto p-4 pt-20 pb-14">
      <div className="flex flex-col items-center gap-2 pb-4">
        <TapButton />
        <h1 className="text-4xl font-bold">Dota Crystals</h1>
        <p className="text-md w-[68vw] text-center">
          Зарабатывай кристаллы и меняй их на кейсы, стикеры и скины для Dota 2
        </p>
      </div>
      <div className="mb-2 flex w-full flex-col items-center justify-center rounded-2xl bg-neutral-800 p-4">
        <div className="flex items-center justify-center gap-2 text-4xl">
          <Logo width="30px" height="30px" /> {user?.crystalBalance}
        </div>
        <div className="text-muted-foreground mb-3 text-sm">твой баланс</div>
        <div
          className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-blue-600 py-4 text-white"
          onClick={() => navigate({ to: "/crystals" })}
        >
          Купить кристаллы
        </div>
      </div>
      <div className="mb-4 flex w-full flex-col gap-2">
        <div className="opacity-50">Задания</div>
        <div className="flex h-14 w-full items-center justify-start rounded-xl bg-neutral-800 p-4">
          <div>Заданий пока нет</div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="opacity-50">Выполненные задания</div>
        <div className="flex h-14 w-full items-center justify-start rounded-xl bg-neutral-800 p-4">
          <div>Заданий пока нет</div>
        </div>
      </div>
    </div>
  );
}
