import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { ChevronRight } from "lucide-react";
import { useUser } from "~/hooks/useUser";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleOpenTelegramLink = (link: string) => {
    if (openTelegramLink.isAvailable()) {
      openTelegramLink(link);
    }
  };
  return (
    <div className="flex flex-col items-center gap-2 p-4 pt-14">
      <div className="flex flex-col items-center gap-2">
        <div className="aspect-square w-32 rounded-full bg-neutral-800">
          <img
            src={user?.photoUrl || ""}
            alt=""
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="text-2xl font-bold">{user?.name}</div>
      </div>
      <div
        onClick={() => navigate({ to: "/trade" })}
        className="mt-8 flex w-full flex-col items-start rounded-xl bg-neutral-800"
      >
        <div className="flex w-full items-center justify-between p-4">
          <div>Ссылка обмена</div>
          <div>
            <ChevronRight />
          </div>
        </div>
      </div>
      <div
        onClick={() => handleOpenTelegramLink("https://t.me/dota_cases")}
        className="flex w-full flex-col items-start rounded-xl bg-neutral-800"
      >
        <div className="flex w-full items-center justify-between p-4">
          <div>Сообщество DOTA CASES</div>
          <div>
            <ChevronRight />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <div className="text-md text-neutral-300">ТОП 3 ПРЕДМЕТА</div>
        <div className="flex gap-2">
          {user?.items
            ?.sort((a, b) => b.price - a.price)
            .slice(0, 3)
            .map((item) => (
              <div key={item.id} className="rounded-md border-2 border-neutral-700 p-2">
                <div>{item.name}</div>
                <div>{item.price}</div>
              </div>
            ))}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <div className="text-md text-neutral-300">ТОП 3 ПРЕДМЕТА</div>
        <div className="flex flex-wrap gap-2">
          {user?.items?.map((item) => (
            <div key={item.id} className="rounded-md border-2 border-neutral-700 p-2">
              <div>{item.name}</div>
              <div>{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
