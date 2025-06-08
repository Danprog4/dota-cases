import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "~/hooks/useUser";
import { CASES_CONFIG } from "~/lib/configs/cases.config";
import { useTRPC } from "~/trpc/init/react";

export const Route = createFileRoute("/roulete/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/roulete/$id" });
  const trpc = useTRPC();
  const [offset, setOffset] = useState(0);
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAnimationEnd, setIsAnimationEnd] = useState(false);
  const [arrayWithWinningItem, setArrayWithWinningItem] = useState<any[]>([]);
  const sellItem = useMutation(trpc.main.sellItem.mutationOptions());

  const buyCase = useMutation(
    trpc.main.buyCase.mutationOptions({
      onSuccess: (data) => {
        setArrayWithWinningItem(data);
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

  useEffect(() => {
    const numericId = Number(id);
    if (
      user &&
      numericId &&
      !isNaN(numericId) &&
      !arrayWithWinningItem.length &&
      !buyCase.isPending
    ) {
      const currentCaseItem = CASES_CONFIG.find((caseItem) => caseItem.id === numericId);
      if (currentCaseItem) {
        buyCase.mutate({ caseId: numericId });
      } else {
        toast.error("Кейс не найден!");
        navigate({ to: "/cases" });
      }
    }
  }, [id, user, buyCase.mutate, arrayWithWinningItem.length, navigate]);

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

  if (!user) {
    return <div>Загрузка пользователя...</div>;
  }

  const numericId = Number(id);
  const caseItem = CASES_CONFIG.find((item) => item.id === numericId);
  const items = caseItem?.items;
  const winningItem = arrayWithWinningItem[arrayWithWinningItem.length - 1];

  if (buyCase.isPending || !arrayWithWinningItem.length) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-xl font-bold">
        Открываем кейс
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!caseItem) {
    toast.error("Кейс не найден!");
    navigate({ to: "/cases" });
    return null;
  }

  return (
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
                    sellItem.mutate(
                      { id: winningItem.id },
                      {
                        onSuccess: () => {
                          toast.success(
                            `Предмет ${winningItem.name} продан за ${winningItem.price}!`,
                          );

                          navigate({ to: "/cases" });
                        },
                        onError: () => {
                          toast.error("Не удалось продать предмет.");
                        },
                      },
                    );
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
                    buyCase.mutate({ caseId: numericId });
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
  );
}
