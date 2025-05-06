import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "~/trpc/init/react";
import { FullPageSpinner } from "./Spinner";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const trpc = useTRPC();
  const [initData, setInitData] = useState<string | null>(null);
  const [startParam, setStartParam] = useState<string | undefined>(undefined);

  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: () => setLoggedIn(true),
    }),
  );

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

  if (!loggedIn) {
    return <FullPageSpinner />;
  }

  return <>{children}</>;
};
