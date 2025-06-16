import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "~/trpc/init/react";
import { useUser } from "../hooks/useUser";
import { FullPageSpinner } from "./Spinner";
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const trpc = useTRPC();
  const [initData, setInitData] = useState<string | null>(null);
  const [startParam, setStartParam] = useState<string | undefined>(undefined);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: () => setLoggedIn(true),
    }),
  );

  const prefetch = async () => {
    await queryClient.prefetchQuery(trpc.main.getUser.queryOptions());
    await queryClient.prefetchQuery(trpc.main.getRemaining.queryOptions());
    await queryClient.prefetchQuery(trpc.tasks.getTasks.queryOptions());
  };

  useEffect(() => {
    const loadTelegramSDK = async () => {
      const { retrieveRawInitData, retrieveLaunchParams } = await import(
        "@telegram-apps/sdk"
      );

      const getTelegramInitData = retrieveRawInitData();
      const getTelegramLaunchParams = retrieveLaunchParams();

      setInitData(getTelegramInitData!);
      setStartParam(getTelegramLaunchParams.tgWebAppStartParam);
    };

    loadTelegramSDK();
  }, []);

  useEffect(() => {
    if (!initData) {
      return;
    }
    loginMutation.mutate({
      initData,
      startParam,
    });
  }, [initData, startParam]);

  useEffect(() => {
    prefetch();
  }, []);

  if (!loggedIn) {
    return <FullPageSpinner />;
  }

  return <>{children}</>;
};
