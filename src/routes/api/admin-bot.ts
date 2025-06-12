import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Bot, webhookCallback } from "grammy";
import { db } from "~/lib/db";
import { getIsAdmin } from "~/lib/utils/getIsAdmin";

const token = process.env.ADMIN_BOT_TOKEN;
if (!token) throw new Error("ADMIN_BOT_TOKEN is unset");

const bot = new Bot(token);

bot.command("start", async (ctx) => {
  await ctx.reply("Hello, Admin!");
});

bot.command("get_withdrawals", async (ctx) => {
  if (!ctx.from?.id) {
    await ctx.reply("You are not authorized to use this command");
    return;
  }

  const isAdmin = getIsAdmin(ctx.from.id);

  if (!isAdmin) {
    await ctx.reply("You are not admin to use this command");
    return;
  }

  const withdrawals = await db.query.withDrawalsTable.findMany({});
  const withdrawalInfo = withdrawals
    .map(
      (w) =>
        `ID: ${w.id}\nUser ID: ${w.userId}\nSkin: ${w.itemName}\nTrade Link: ${w.tradeLink}\nDate: ${w.date}\n---`,
    )
    .join("\n");

  await ctx.reply(withdrawalInfo || "No withdrawals found");
});

const update = webhookCallback(bot, "std/http");

const handleUpdate = async (request: Request) => {
  return await update(request);
};

export const APIRoute = createAPIFileRoute("/api/admin-bot")({
  GET: async ({ request }) => handleUpdate(request),
  POST: async ({ request }) => handleUpdate(request),
});
