import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/lib/db";
import { tapBatches, usersTable } from "~/lib/db/schema";
import { procedure, publicProcedure } from "./init";

const MAX_TAPS = 100;

export const router = {
  getHello: publicProcedure.query(() => {
    return {
      hello: "world",
    };
  }),
  getUser: procedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const user = await db.query.usersTable.findFirst({
      where: (users) => eq(users.id, userId),
    });
    return user;
  }),
  getRemaining: procedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const [row] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${tapBatches.count}), 0)`,
      })
      .from(tapBatches)
      .where(
        and(eq(tapBatches.userId, userId), sql`DATE(${tapBatches.date}) = CURRENT_DATE`),
      );
    const total = row.total;
    return { remaining: Number(MAX_TAPS) - Number(total) };
  }),
  addBatch: procedure
    .input(z.object({ count: z.number().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;

      const count = input.count;
      if (count !== 10) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid batch size",
        });
      }
      const [row] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${tapBatches.count}), 0)`,
        })
        .from(tapBatches)
        .where(
          and(
            eq(tapBatches.userId, userId),
            sql`DATE(${tapBatches.date}) = CURRENT_DATE`,
          ),
        );
      const total = row.total;
      if (Number(total) + Number(count) > MAX_TAPS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tap limit reached",
        });
      }
      await db.insert(tapBatches).values({ userId, count });
      await db
        .update(usersTable)
        .set({ crystalBalance: sql`${usersTable.crystalBalance} + ${count}` })
        .where(eq(usersTable.id, userId));
      return { remaining: Number(MAX_TAPS) - (Number(total) + Number(count)) };
    }),
} satisfies TRPCRouterRecord;

export type Router = typeof router;
