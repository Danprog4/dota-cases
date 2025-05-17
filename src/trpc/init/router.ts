import { authRouter } from "../auth";
import { router } from "../main";
import { tasksRouter } from "../tasks";
import { tgTxRouter } from "../tgTx";
import { createTRPCRouter } from "./index";
export const trpcRouter = createTRPCRouter({
  main: router,
  auth: authRouter,
  tgTx: tgTxRouter,
  tasks: tasksRouter,
});

export type TRPCRouter = typeof trpcRouter;
