import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useUser } from "~/hooks/useUser";
import { User } from "~/lib/db/schema";
import { useTRPC } from "~/trpc/init/react";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const trpc = useTRPC();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const sellItem = useMutation(trpc.main.sellItem.mutationOptions({}));

  const handleOpenTelegramLink = (link: string) => {
    if (openTelegramLink.isAvailable()) {
      openTelegramLink(link);
    }
  };

  const handleSellItem = (itemId: number) => {
    const item = user?.items?.find((item) => item.id === itemId);
    if (!item) {
      toast.error("Предмет не найден");
      return;
    }

    if (item.isSold) {
      toast.error("Предмет уже продан");
      return;
    }

    sellItem.mutate({
      id: itemId,
    });

    toast.success("Предмет продан за " + item.price + " DOTA COINS");
    queryClient.setQueryData(trpc.main.getUser.queryKey(), (user: User | undefined) => {
      if (!user || !user.items) {
        toast.error("Ошибка при продаже предмета");
        return undefined;
      }
      return {
        ...user,
        items: user.items?.map((item) =>
          item.id === itemId ? { ...item, isSold: true } : item,
        ),
        crystalBalance: user.crystalBalance + item.price,
      };
    });
  };

  const topItems = useMemo(() => {
    return user?.items?.sort((a, b) => b.price - a.price).slice(0, 3);
  }, [user?.items]);

  const gotItems = useMemo(() => {
    return user?.items?.filter((item) => !item.isSold);
  }, [user?.items]);

  const soldItems = useMemo(() => {
    return user?.items?.filter((item) => item.isSold);
  }, [user?.items]);

  console.log(gotItems?.length !== 0);
  console.log(gotItems);

  return (
    <div className="flex flex-col items-center gap-2 p-4 pt-14 pb-32">
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
      <div className="mt-6 flex w-full flex-col items-start gap-2">
        <div className="text-md text-left text-neutral-300">ТОП 3 ПРЕДМЕТА</div>
        <div className="grid w-full grid-cols-3 gap-2">
          {topItems && topItems?.length !== 0 ? (
            topItems.map((item) => (
              <div
                key={item.id}
                className="flex h-[180px] flex-col items-center justify-end gap-1 rounded-md border-2 border-neutral-700 p-2 text-center"
              >
                <div className="text-sm">{item.name}</div>
                <button
                  disabled={sellItem.isPending}
                  onClick={() => handleSellItem(item.id)}
                  className="rounded-full border border-neutral-700 p-2 text-sm"
                >
                  {item.price}
                </button>
              </div>
            ))
          ) : (
            <div className="flex w-full justify-start text-center text-sm text-neutral-500">
              Нет предметов
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex w-full flex-col items-start gap-2">
        <div className="text-md flex items-start text-left text-neutral-300">
          ПОЛУЧЕННЫЕ ПРЕДМЕТЫ
        </div>

        <div className="grid w-full grid-cols-3 gap-2">
          {gotItems && gotItems?.length !== 0 ? (
            gotItems.map((item) => (
              <div
                key={item.id}
                className="flex h-[180px] flex-col items-center justify-end rounded-md border-2 border-neutral-700 p-2 text-center"
              >
                <div className="text-sm">{item.name}</div>
                <button
                  disabled={sellItem.isPending}
                  onClick={() => handleSellItem(item.id)}
                  className="rounded-full border border-neutral-700 p-2 text-sm"
                >
                  {item.price}
                </button>
              </div>
            ))
          ) : (
            <div className="flex w-full justify-start text-center text-sm text-neutral-500">
              Нет предметов
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex w-full flex-col items-start gap-2">
        <div className="text-md text-left text-neutral-300">ПРОДАННЫЕ ПРЕДМЕТЫ</div>
        <div className="grid w-full grid-cols-3 gap-2">
          {soldItems && soldItems?.length !== 0 ? (
            soldItems.map((item) => (
              <div
                key={item.id}
                className="flex h-[180px] flex-col items-center justify-end rounded-md border-2 border-neutral-700 p-2 text-center"
              >
                <div className="text-sm">{item.name}</div>
                <button
                  disabled={sellItem.isPending}
                  onClick={() => handleSellItem(item.id)}
                  className="rounded-full border border-neutral-700 p-2 text-sm"
                >
                  {item.price}
                </button>
              </div>
            ))
          ) : (
            <div className="flex w-full justify-start text-center text-sm text-neutral-500">
              Нет предметов
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
