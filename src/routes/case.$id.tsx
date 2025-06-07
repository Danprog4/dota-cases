import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { BackButton } from "~/components/BackButton";
import { CASES_CONFIG } from "~/lib/configs/cases.config";

import { useTRPC } from "~/trpc/init/react";
export const Route = createFileRoute("/case/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/case/$id" });
  const navigate = useNavigate();
  const trpc = useTRPC();

  const caseItem = CASES_CONFIG.find((caseItem) => caseItem.id === Number(id));
  const buyCase = useMutation(
    trpc.main.buyCase.mutationOptions({
      onSuccess: () => {
        navigate({ to: "/roulete/$id", params: { id: id } });
      },
      onError: () => {
        toast.error("Не удалось купить кейс. У вас недостаточно DOTA COINS");
      },
    }),
  );
  return (
    <div className="flex w-full flex-col items-center overflow-x-hidden overflow-y-auto p-4 pt-24 pb-24">
      <BackButton onClick={() => navigate({ to: "/cases" })} />
      <div className="mb-4 flex flex-col items-center gap-2">
        <img src={caseItem?.img} alt={caseItem?.name} className="h-[150px] w-[150px]" />
        <div className="text-4xl font-bold">{caseItem?.name}</div>
        <div className="text-lg">{caseItem?.description}</div>
      </div>
      <div className="flex w-full flex-wrap justify-between gap-3">
        {caseItem?.items.map((item) => (
          <div
            key={item.name}
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
              buyCase.mutate({ caseId: Number(id) });
            }}
          >
            Открыть кейс
          </div>
          <div className="flex items-center gap-1">
            <div>{caseItem?.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
