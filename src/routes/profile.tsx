import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { CASE_IMAGES } from "~/case-images";
import VaulDrawer from "~/components/Drawer";
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
  const withdrawItem = useMutation(
    trpc.main.withdrawItem.mutationOptions({
      onError: (error) => {
        toast.error("Ошибка при выводе предмета");
      },
    }),
  );

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

  const handleWithdrawItem = (itemId: number) => {
    const item = user?.items?.find((item) => item.id === itemId);

    if (!item) {
      toast.error("Предмет не найден");
      return;
    }

    if (item.isWithdrawn) {
      toast.error("Предмет уже выведен");
      return;
    }

    if (item.isSold) {
      toast.error("Предмет уже продан");
      return;
    }

    if (!user?.tradeLink) {
      toast.error("У вас отсутствует ссылка обмена");
      return;
    }

    withdrawItem.mutate({
      id: itemId,
    });

    toast.success("Предмет выведен");

    queryClient.setQueryData(trpc.main.getUser.queryKey(), (user: User | undefined) => {
      if (!user || !user.items) {
        return;
      }

      return {
        ...user,
        items: user.items?.map((item) =>
          item.id === itemId ? { ...item, isWithdrawn: true } : item,
        ),
      };
    });
  };

  const userItemsWithImages = useMemo(() => {
    return user?.items?.map((item) => {
      const caseImage = CASE_IMAGES.find((image) => image.markethashname === item.name);
      return { ...item, image: caseImage?.itemimage ?? "/fallback.png" };
    });
  }, [user?.items]);

  const topItems = useMemo(() => {
    return userItemsWithImages?.sort((a, b) => b.price - a.price).slice(0, 3);
  }, [user?.items]);

  const gotItems = useMemo(() => {
    return userItemsWithImages?.filter((item) => !item.isSold && !item.isWithdrawn);
  }, [user?.items]);

  const soldItems = useMemo(() => {
    return userItemsWithImages?.filter((item) => item.isSold);
  }, [user?.items]);

  const withdrawnItems = useMemo(() => {
    return userItemsWithImages?.filter((item) => item.isWithdrawn);
  }, [user?.items]);

  console.log(gotItems?.length !== 0);
  console.log(gotItems);

  return (
    <div className="flex flex-col items-center gap-2 overflow-y-auto p-4 pt-14 pb-32">
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
                className="flex h-[210px] flex-col items-center justify-between gap-1 rounded-md border-2 border-neutral-700 p-2 text-center"
              >
                <img
                  className="min-h-[100px] w-full rounded-md object-cover"
                  src={item.image}
                  alt={item.name}
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="text-sm">
                    {item.name.length > 15
                      ? item.name.substring(0, 15) + "..."
                      : item.name}
                  </div>
                  {item.isSold || item.isWithdrawn ? (
                    <button
                      disabled
                      className="rounded-full border border-neutral-700 p-2 text-sm text-neutral-500"
                    >
                      {item.price}
                    </button>
                  ) : (
                    <VaulDrawer
                      price={item.price}
                      image={item.image}
                      name={item.name}
                      id={item.id}
                      sellItem={handleSellItem}
                      withdrawItem={handleWithdrawItem}
                    >
                      <button className="rounded-full border border-neutral-700 p-2 text-sm">
                        {item.price}
                      </button>
                    </VaulDrawer>
                  )}
                </div>
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
          ДОСТУПНЫЕ ПРЕДМЕТЫ
        </div>

        <div className="grid w-full grid-cols-3 gap-2">
          {gotItems && gotItems?.length !== 0 ? (
            gotItems.map((item) => (
              <div
                key={item.id}
                className="flex h-[210px] flex-col items-center justify-between rounded-md border-2 border-neutral-700 p-2 text-center"
              >
                <img
                  className="min-h-[100px] w-full rounded-md object-cover"
                  src={item.image}
                  alt={item.name}
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="text-xs">
                    {item.name.length > 15
                      ? item.name.substring(0, 15) + "..."
                      : item.name}
                  </div>
                  <VaulDrawer
                    price={item.price}
                    image={item.image}
                    name={item.name}
                    id={item.id}
                    sellItem={handleSellItem}
                    withdrawItem={handleWithdrawItem}
                  >
                    <button className="rounded-full border border-neutral-700 p-2 text-sm">
                      {item.price}
                    </button>
                  </VaulDrawer>
                </div>
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
                className="flex h-[210px] flex-col items-center justify-between rounded-md border-2 border-neutral-700 p-2 text-center"
              >
                <img
                  className="min-h-[100px] w-full rounded-md object-cover"
                  src={item.image}
                  alt={item.name}
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="text-xs">
                    {item.name.length > 15
                      ? item.name.substring(0, 15) + "..."
                      : item.name}
                  </div>
                  <button
                    disabled={sellItem.isPending}
                    onClick={() => handleSellItem(item.id)}
                    className="rounded-full border border-neutral-700 p-2 text-sm text-neutral-500"
                  >
                    {item.price}
                  </button>
                </div>
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
        <div className="text-md text-left text-neutral-300">ВЫВЕДЕННЫЕ ПРЕДМЕТЫ</div>
        <div className="grid w-full grid-cols-3 gap-2">
          {withdrawnItems && withdrawnItems?.length !== 0 ? (
            withdrawnItems.map((item) => (
              <div
                key={item.id}
                className="flex h-[210px] flex-col items-center justify-between rounded-md border-2 border-neutral-700 p-2 text-center"
              >
                <img
                  className="min-h-[100px] w-full rounded-md object-cover"
                  src={item.image}
                  alt={item.name}
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="text-xs">
                    {item.name.length > 15
                      ? item.name.substring(0, 15) + "..."
                      : item.name}
                  </div>
                  <button
                    disabled={sellItem.isPending}
                    onClick={() => handleSellItem(item.id)}
                    className="rounded-full border border-neutral-700 p-2 text-sm text-neutral-500"
                  >
                    {item.price}
                  </button>
                </div>
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
