import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { CASE_IMAGES } from "~/case-images";
import { CASES_CONFIG } from "~/lib/configs/cases.config";
import { db } from "~/lib/db";
import { tapBatches, usersTable } from "~/lib/db/schema";
import { getItem } from "~/lib/utils/getItem";
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
  getFriends: procedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const user = await db.query.usersTable.findFirst({
      where: (users) => eq(users.id, userId),
    });
    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Пользователь не найден",
      });
    }
    const friends = await db.query.usersTable.findMany({
      where: (users) => eq(users.referrerId, userId),
    });
    return friends;
  }),
  getRemaining: procedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.userId;
      console.log(`Getting remaining taps for user: ${userId}`);
      console.log(`Current MAX_TAPS value: ${MAX_TAPS}`);

      console.log(`Executing database query for user ${userId} to get tap count`);
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
      console.log(`Query result for user ${userId}: ${JSON.stringify(row)}`);
      console.log(`Raw total value: ${total}, type: ${typeof total}`);
      console.log(
        `User ${userId} has used ${total} taps today. Remaining: ${Number(MAX_TAPS) - Number(total)}`,
      );

      const remaining = Number(MAX_TAPS) - Number(total);
      console.log(`Final remaining value: ${remaining}, type: ${typeof remaining}`);

      return { remaining };
    } catch (error) {
      console.error("Error in getRemaining:", error);
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack trace available",
      );
      console.error("Context:", { userId: ctx.userId });
      throw error;
    }
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

  setTradeLink: procedure
    .input(z.object({ link: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.link.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пожалуйста, введите ссылку на обмен",
        });
      }
      const userId = ctx.userId;
      await db
        .update(usersTable)
        .set({ tradeLink: input.link })
        .where(eq(usersTable.id, userId));
    }),

  buyCase: procedure
    .input(z.object({ caseId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пользователь не найден",
        });
      }
      const crystalBalance = user.crystalBalance;

      const caseId = input.caseId;
      const caseItem = CASES_CONFIG.find((caseItem) => caseItem.id === caseId);
      if (!caseItem) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Кейс не найден",
        });
      }

      if (crystalBalance < caseItem.price) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Недостаточно кристаллов",
        });
      }

      await db
        .update(usersTable)
        .set({ crystalBalance: sql`${usersTable.crystalBalance} - ${caseItem.price}` })
        .where(eq(usersTable.id, userId));

      const item = await getItem(caseId, userId);

      if (!item) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Не удалось получить предмет",
        });
      }

      console.log(item, "[item] found");

      const newUserItems = [
        ...(user.items || []),
        { name: item.name, price: item.price, id: item.id, isSold: false },
      ];

      if (!newUserItems) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Не удалось получить предмет из массива",
        });
      }

      console.log(newUserItems, "new user items");

      await db
        .update(usersTable)
        .set({ items: newUserItems })
        .where(eq(usersTable.id, userId));

      const newCaseItems = [
        ...caseItem.items,
        { name: item.name, price: item.price, id: item.id, isSold: false },
      ];

      const newCaseWithImages = newCaseItems.map((item) => {
        const caseImage = CASE_IMAGES.find((image) => image.markethashname === item.name);

        return {
          ...item,
          image: caseImage?.itemimage ?? "/fallback.png",
        };
      });

      return newCaseWithImages;
    }),

  sellItem: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;
      const itemId = input.id;

      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Пользователь не найден",
        });
      }

      const item = user.items?.find((item) => item.id === itemId && !item.isSold);

      if (!item) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Предмет не найден",
        });
      }

      const userCrystalBalance = user.crystalBalance;

      await db
        .update(usersTable)
        .set({ crystalBalance: userCrystalBalance + item.price })
        .where(eq(usersTable.id, userId));

      const newUserItems = user.items?.map((item) =>
        item.id === itemId ? { ...item, isSold: true } : item,
      );

      await db
        .update(usersTable)
        .set({ items: newUserItems })
        .where(eq(usersTable.id, userId));

      return {
        crystalBalance: userCrystalBalance + item.price,
        items: newUserItems,
      };
    }),
} satisfies TRPCRouterRecord;

export type Router = typeof router;
