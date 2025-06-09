import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "~/components/BackButton";
import { useUser } from "~/hooks/useUser";
import { CASES_CONFIG } from "~/lib/configs/cases.config";
import { Item } from "~/lib/db/schema";
import { useTRPC } from "~/trpc/init/react";
export const Route = createFileRoute("/case/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/case/$id" });
  const navigate = useNavigate();
  const trpc = useTRPC();
  const { user } = useUser();
  const [offset, setOffset] = useState(0);
  const queryClient = useQueryClient();
  const [isAnimationEnd, setIsAnimationEnd] = useState(false);
  const [arrayWithWinningItem, setArrayWithWinningItem] = useState<Item[]>([]);
  const sellItem = useMutation(
    trpc.main.sellItem.mutationOptions({
      onSuccess: () => {
        setIsAnimationEnd(false);
        setArrayWithWinningItem([]);
        setOffset(0);
        setIsOpening(false);
      },
      onError: () => {
        toast.error("Не удалось продать предмет.");
      },
    }),
  );
  const caseItem = CASES_CONFIG.find((caseItem) => caseItem.id === Number(id));
  const [isOpening, setIsOpening] = useState(false);
  const numericId = Number(id);
  const items = caseItem?.items;
  const winningItem = arrayWithWinningItem[arrayWithWinningItem.length - 1];

  useEffect(() => {
    console.log(
      "Array with winning item changed:",
      arrayWithWinningItem[arrayWithWinningItem.length - 1],
    );
  }, [arrayWithWinningItem]);

  useEffect(() => {
    if (!arrayWithWinningItem.length) return;
    const timer = setTimeout(() => {
      const itemHeight = 50;
      const targetIndex = arrayWithWinningItem.length - 1;
      const calculatedOffset = targetIndex * itemHeight - (100 - itemHeight) / 2;
      setOffset(calculatedOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [arrayWithWinningItem]);

  useEffect(() => {
    if (offset > 0) {
      const timer = setTimeout(() => {
        setIsAnimationEnd(true);
        console.log("Animation end reached.");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [offset]);

  const buyCase = useMutation(
    trpc.main.buyCase.mutationOptions({
      onSuccess: (data) => {
        console.log(data, "[FJDSKFKLJDSJKFDKLJS]");
        setIsOpening(true);
        setArrayWithWinningItem(data as Item[]);
      },
      onError: (error) => {
        if (error.message === "Not enough balance") {
          toast.error("Недостаточно средств");
        } else {
          toast.error("Не удалось купить кейс");
        }
        navigate({ to: "/cases" });
      },
    }),
  );

  if (!user) {
    return;
  }

  if (!caseItem) {
    return;
  }

  const handleBuyCase = () => {
    if (user?.crystalBalance < caseItem?.price) {
      toast.error("Не удалось купить кейс. У вас недостаточно DOTA COINS");
      setIsOpening(false);
    } else {
      buyCase.mutate({ caseId: numericId });
    }
  };

  const handleSellItem = (item: Item) => {
    sellItem.mutate({ id: item.id });
    toast.success(`Предмет ${item.name} продан за ${item.price}!`);
    navigate({ to: "/cases" });
  };

  return (
    <>
      {isOpening ? (
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
                    style={{
                      minHeight: "50vh",
                    }}
                  >
                    {item.name}
                  </div>
                ))}
                {items?.map((item, index) => (
                  <div
                    key={index + arrayWithWinningItem.length}
                    className="flex h-[50vh] w-full items-center justify-center border"
                    style={{
                      minHeight: "50vh",
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            {isAnimationEnd && winningItem && (
              <div className="bg-opacity-70 absolute top-0 right-0 bottom-0 left-0 z-10 flex w-full items-center justify-center bg-black">
                <div className="flex w-full flex-col items-center justify-center gap-4">
                  <div className="text-center text-4xl font-bold text-white">
                    {winningItem.name}
                  </div>
                  <div className="absolute bottom-4 flex w-full flex-col gap-2 p-4">
                    <button
                      onClick={() => {
                        handleSellItem(winningItem);
                      }}
                      className="w-auto rounded-2xl bg-neutral-500 p-4 text-center text-white"
                      disabled={sellItem.isPending}
                    >
                      Продать за {winningItem.price}
                    </button>
                    <button
                      onClick={() => {
                        setIsAnimationEnd(false);
                        setArrayWithWinningItem([]);
                        setOffset(0);
                        setIsOpening(false);
                        handleBuyCase();
                      }}
                      className="w-auto rounded-2xl bg-red-500 p-4 text-center text-white"
                    >
                      Крутить еще раз за {caseItem?.price}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center overflow-x-hidden overflow-y-auto p-4 pt-24 pb-34">
          <BackButton onClick={() => navigate({ to: "/cases" })} />
          <div className="mb-4 flex flex-col items-center gap-2">
            <img
              src={caseItem?.img}
              alt={caseItem?.name}
              className="h-[150px] w-[150px]"
            />
            <div className="text-4xl font-bold">{caseItem?.name}</div>
            <div className="text-lg">{caseItem?.description}</div>
          </div>
          <div className="flex w-full flex-wrap justify-between gap-3">
            {caseItem?.items.map((item, index) => (
              <div
                key={index}
                className="flex h-[172px] max-w-[30%] flex-col items-center justify-end rounded-lg bg-neutral-800 p-3"
              >
                {/* <img alt={item.name} /> */}
                <div className="text-center text-sm">{item.name}</div>
              </div>
            ))}
          </div>
          <div className="fixed right-0 bottom-0 left-0 h-[14vh] w-full bg-neutral-800"></div>
          <div className="fixed right-0 bottom-10 left-0 z-10 mx-4 rounded-2xl bg-red-500 p-4">
            <div className="flex items-center justify-center gap-2">
              <div
                onClick={() => {
                  if (user?.crystalBalance < caseItem?.price) {
                    toast.error("Не удалось купить кейс. У вас недостаточно DOTA COINS");
                  } else {
                    handleBuyCase();
                  }
                }}
              >
                <div>
                  {buyCase.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Открыть кейс"
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div>{!buyCase.isPending && caseItem?.price}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
