import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Lottie from "lottie-react";
import { useState } from "react";
import { toast } from "sonner";
import duckAnimation from "~/assets/duck-think.json";
import { BackButton } from "~/components/BackButton";
import { useUser } from "~/hooks/useUser";
import { User } from "~/lib/db/schema";
import { useTRPC } from "~/trpc/init/react";
export const Route = createFileRoute("/trade")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [link, setLink] = useState("");
  const navigate = useNavigate();
  const { mutate: setTradeLink } = useMutation(trpc.main.setTradeLink.mutationOptions());
  const tradeLink = user?.tradeLink;

  const handleSave = () => {
    if (link.length === 0) {
      toast.error("Пожалуйста, введите ссылку на обмен");
      return;
    }
    setTradeLink({ link });
    queryClient.setQueryData(trpc.main.getUser.queryKey(), (old: User | undefined) => {
      if (!old) return undefined;
      return {
        ...old,
        tradeLink: link,
      };
    });
    toast.success("Ссылка обмена сохранена");
    setLink("");
  };
  return (
    <div className="flex h-screen w-full flex-col items-center p-4 pt-14">
      <BackButton onClick={() => navigate({ to: "/profile" })} />
      <div className="h-[150px] w-[150px]">
        <Lottie animationData={duckAnimation} loop={true} />
      </div>
      <div className="mb-4 flex flex-col gap-2 text-center">
        <div className="text-2xl font-bold">Куда отправлять предметы?</div>
        <div className="min-w-[400px]">
          Кейсы, стикеры и наклейки отправляются с помощью ссылки обмена. Найди свою
          ссылку обмена{" "}
          <div className="inline text-blue-500">
            <a href="https://steamcommunity.com/tradeoffer/new/?partner=1234567890&token=1234567890">
              на странице обмена в Steam
            </a>
          </div>
        </div>
      </div>
      <div className="relative flex h-27 w-full rounded-2xl bg-neutral-800">
        <input
          type="text"
          placeholder={
            tradeLink ??
            "https://steamcommunity.com/tradeoffer/new/?partner=1234567890&token=1234567890"
          }
          style={{ outline: "none" }}
          className="absolute top-0 left-0 w-full rounded-2xl bg-neutral-800 p-4 text-wrap text-white placeholder:text-wrap"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <button
        className="fixed right-0 bottom-4 left-0 mx-4 mb-4 flex w-auto cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 text-white"
        onClick={handleSave}
      >
        Сохранить
      </button>
    </div>
  );
}
