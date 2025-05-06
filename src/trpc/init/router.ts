import { router } from "../main";
import { createTRPCRouter } from "./index";

export const trpcRouter = createTRPCRouter({
  main: router,
});

export type TRPCRouter = typeof trpcRouter;
