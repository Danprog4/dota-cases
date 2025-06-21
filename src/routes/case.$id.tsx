import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSound from "use-sound";
import { CASE_IMAGES } from "~/case-images";
import { BackButton } from "~/components/BackButton";
import { Logo } from "~/components/icons/logo";
import { useUser } from "~/hooks/useUser";
import { CASES_CONFIG } from "~/lib/configs/cases.config";
import { Item } from "~/lib/db/schema";
import { getCasesWithImages } from "~/lib/utils/getItemsImages";
import { useTRPC } from "~/trpc/init/react";

export const Route = createFileRoute("/case/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/case/$id" });
  const navigate = useNavigate();
  const gamble = useMemo(() => "/gamble.mp3", []);
  const [play] = useSound(gamble);
  const trpc = useTRPC();
  const { user } = useUser();
  const [offset, setOffset] = useState(0);
  const queryClient = useQueryClient();
  const [isAnimationEnd, setIsAnimationEnd] = useState(false);
  const [arrayWithWinningItem, setArrayWithWinningItem] = useState<any[]>([]);
  const [caseWithImages, setCaseWithImages] = useState<any>(null);
  const [isOpening, setIsOpening] = useState(false);

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
  const caseId = CASES_CONFIG.findIndex((caseItem) => caseItem.id === Number(id));

  const numericId = Number(id);
  const items = caseItem?.items;
  const itemsWithImages = items?.map((item) => {
    const itemImage = CASE_IMAGES.find((image) => image.markethashname === item.name);
    return { ...item, image: itemImage?.itemimage ?? "/fallback.png" };
  });
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
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [offset]);

  useEffect(() => {
    getCasesWithImages().then((casesWithImages) => {
      const caseWithImagesData = casesWithImages[caseId];
      setCaseWithImages(caseWithImagesData);
      console.log(caseWithImagesData, "[caseWithImages]");
    });
  }, [caseId]);

  const buyCase = useMutation(
    trpc.main.buyCase.mutationOptions({
      onSuccess: (data) => {
        console.log(data, "[FJDSKFKLJDSJKFDKLJS]");
        setIsOpening(true);
        play();
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

  if (!user) {
    return;
  }

  if (!caseItem) {
    return;
  }

  const handleBuyCase = () => {
    if (user?.crystalBalance < caseItem?.price) {
      toast.error("Не удалось купить кейс. У вас недостаточно DOTA COINS");
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
                    className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 p-8"
                    style={{
                      minHeight: "50vh",
                    }}
                  >
                    <img
                      className="h-full w-full rounded-md object-cover"
                      alt={item.name}
                      src={item.image}
                    />
                    <div className="text-center text-2xl">{item.name}</div>
                  </div>
                ))}
                {itemsWithImages?.map((item, index) => (
                  <div className="flex flex-col items-center justify-center">
                    <div
                      key={index + arrayWithWinningItem.length}
                      className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 p-8"
                      style={{
                        minHeight: "50vh",
                      }}
                    >
                      <img
                        className="h-full w-full rounded-md object-cover"
                        alt={item.name}
                        src={item.image}
                      />
                      <div className="text-center text-2xl">{item.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isAnimationEnd && winningItem && (
              <div className="bg-opacity-70 absolute top-0 right-0 bottom-0 left-0 z-10 flex w-full items-center justify-center bg-black">
                <div className="flex w-full flex-col items-center justify-center gap-4">
                  <img
                    className="h-full w-full rounded-md object-cover"
                    src={winningItem.image}
                    alt={winningItem.name}
                  />
                  <div className="text-center text-4xl font-bold text-white">
                    {winningItem.name}
                  </div>
                  <div className="absolute bottom-4 flex w-full flex-col gap-2 p-4">
                    <button
                      onClick={() => {
                        handleSellItem(winningItem);
                      }}
                      className="flex w-auto items-center justify-center gap-1 rounded-2xl bg-neutral-500 p-4 text-center text-white"
                      disabled={sellItem.isPending}
                    >
                      Продать за {winningItem.price} <Logo width={"20"} height={"20"} />
                    </button>
                    <button
                      onClick={() => {
                        setIsAnimationEnd(false);
                        setArrayWithWinningItem([]);
                        setOffset(0);
                        setIsOpening(false);
                        handleBuyCase();
                      }}
                      className="flex w-auto items-center justify-center gap-1 rounded-2xl border border-neutral-500 bg-black p-4 text-center text-white"
                    >
                      Крутить еще раз за {caseItem?.price}{" "}
                      <Logo width={"20"} height={"20"} />
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
            {caseWithImages?.items.map((item: any, index: number) => (
              <div
                key={item.id}
                className="flex h-[160px] max-w-[30%] flex-col items-center justify-start gap-2 rounded-md border-2 border-neutral-700 p-2 text-center"
              >
                <img
                  className="min-h-[100px] w-full rounded-md object-cover"
                  src={item.image}
                  alt={item.name}
                />
                <div className="text-xs">
                  {item.name.length > 18 ? item.name.substring(0, 18) + "..." : item.name}
                </div>
              </div>
            ))}
          </div>
          <div className="fixed right-0 bottom-0 left-0 h-[14vh] w-full bg-neutral-800"></div>
          <button
            className="fixed right-0 bottom-10 left-0 z-10 mx-4 rounded-2xl border border-red-500 bg-black p-4 disabled:opacity-50"
            onClick={handleBuyCase}
            disabled={buyCase.isPending}
          >
            <div className="flex items-center justify-center gap-2">
              <div>
                {buyCase.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Открыть кейс"
                )}
              </div>
              <div className="flex items-center gap-1">
                <div>{!buyCase.isPending && caseItem?.price} </div>
                <Logo width={"20"} height={"20"} />
              </div>
            </div>
          </button>
        </div>
      )}
    </>
  );
}
