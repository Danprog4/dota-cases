import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/init/react";

export const useUser = () => {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.main.getUser.queryOptions());

  return { user };
};
