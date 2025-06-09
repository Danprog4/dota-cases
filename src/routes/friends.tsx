import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { shareURL } from "@telegram-apps/sdk";
import Lottie from "lottie-react";
import { useMemo } from "react";
import duckAnimation from "~/assets/duck.json";
import { Logo } from "~/components/icons/logo";

import { useUser } from "~/hooks/useUser";
import { pluralFriends } from "~/lib/utils/pluralFriends";
import { pluralItems } from "~/lib/utils/pluralItems";
import { useTRPC } from "~/trpc/init/react";
export const Route = createFileRoute("/friends")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUser();
  const trpc = useTRPC();
  const text = "Приглашаю тебя в игру Dota Cases!";
  const link = useMemo((): string => {
    return `https://t.me/DotaCases_bot?startapp=ref_${user?.id || ""}`;
  }, [user?.id]);

  const { data: friends } = useQuery(trpc.main.getFriends.queryOptions());

  return (
    <div className="flex w-full flex-col items-center gap-2 p-4 pt-14">
      <div className="flex flex-col items-center gap-2">
        <div className="h-[150px] w-[150px]">
          <Lottie animationData={duckAnimation} loop={true} />
        </div>
        <div className="mb-12 max-w-[342px] text-center text-4xl font-bold">
          Приглашай друзей и получай{" "}
          <span className="flex items-center justify-center gap-2">
            500 DOTA COINS <Logo width="40px" height="40px" />
          </span>
        </div>
      </div>
      {friends?.length && (
        <div className="flex w-full flex-col items-start gap-2">
          <div className="text-neutral-500">
            {friends?.length} {pluralFriends(friends?.length || 0)}
          </div>
          <div className="w-full">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={friend.photoUrl || ""}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <div className="text-sm">{friend.name}</div>
                    <div className="flex gap-2 text-xs text-neutral-500">
                      <div>{friend.crystalBalance} DOTA COINS,</div>
                      <div>
                        {friend.items?.length || 0}{" "}
                        {pluralItems(friend.items?.length || 0)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  +500 <Logo width="20px" height="20px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        onClick={() => {
          if (shareURL.isAvailable()) {
            shareURL(link, text);
          }
        }}
        className="fixed right-0 bottom-20 left-0 mx-4 mb-4 flex w-auto cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 text-white"
      >
        Пригласить друга
      </div>
    </div>
  );
}
