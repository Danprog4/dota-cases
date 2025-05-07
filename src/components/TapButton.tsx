import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Lottie from "lottie-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import dotaAnimation from "~/assets/dota.json";
import { User } from "~/lib/db/schema";
import { useTRPC } from "~/trpc/init/react";

export const TapButton = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: remaining } = useQuery(trpc.main.getRemaining.queryOptions());
  const { mutateAsync: addBatch } = useMutation(trpc.main.addBatch.mutationOptions());
  const [taps, setTaps] = useState(0);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const isPressed = useRef(false);

  const handlePress = async () => {
    if (remaining === undefined || remaining.remaining <= 0) {
      toast.error(
        "На сегодня все! Приходи завтра тапать на кристаллы, а пока приглашай друзей.",
      );
      return;
    }
    queryClient.setQueryData(trpc.main.getUser.queryKey(), (old: User | undefined) => {
      if (!old) return undefined;
      return {
        ...old,
        crystalBalance: old.crystalBalance + 1,
      };
    });
    queryClient.setQueryData(trpc.main.getRemaining.queryKey(), {
      remaining: remaining.remaining - 1,
    });
    if (taps === 9) {
      addBatch({ count: 10 });
      setTaps(0);
    } else {
      setTaps(taps + 1);
    }
  };

  const handlePressStart = () => {
    isPressed.current = true;
    if (buttonRef.current) {
      buttonRef.current.style.transform = "scale(0.95)";
    }
  };

  const handlePressEnd = () => {
    isPressed.current = false;
    if (buttonRef.current) {
      buttonRef.current.style.transform = "scale(1)";
    }
  };

  return (
    <button
      ref={buttonRef}
      className="h-[88px] w-[88px] cursor-pointer transition-transform"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={handlePress}
    >
      <Lottie animationData={dotaAnimation} loop={true} />
    </button>
  );
};
