import { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "./init";

export const router = {
  getHello: publicProcedure.query(() => {
    return {
      hello: "world",
    };
  }),
} satisfies TRPCRouterRecord;

export type Router = typeof router;
