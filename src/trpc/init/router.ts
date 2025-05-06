import { authRouter } from "../auth";
import { router } from "../main";
import { tgTxRouter } from "../tgTx";
import { createTRPCRouter } from "./index";

export const trpcRouter = createTRPCRouter({
  main: router,
  auth: authRouter,
  tgTx: tgTxRouter,
});

export type TRPCRouter = typeof trpcRouter;
