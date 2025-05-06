import { z } from "zod";
import { handleCreateInvoice } from "~/create-invoice";
import { createTRPCRouter, procedure } from "./init";

export const tgTxRouter = createTRPCRouter({
  createInvoice: procedure
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await handleCreateInvoice(ctx.userId, input.amount);
    }),
});
