import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Bot, webhookCallback } from "grammy";
import { db } from "~/lib/db";
import { getIsAdmin } from "~/lib/utils/getIsAdmin";

const token = process.env.ADMIN_BOT_TOKEN;
if (!token) throw new Error("ADMIN_BOT_TOKEN is unset");

const bot = new Bot(token);

bot.command("start", async (ctx) => {
  await ctx.api.sendChatAction(ctx.chat.id, "typing");

  await ctx.reply("Привет, Админ!");
});

bot.command("get_withdrawals", async (ctx) => {
  await ctx.api.sendChatAction(ctx.chat.id, "typing");

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
        `Юзер ID: ${w.userId}\nСкин: ${w.itemName}\nСсылка Обмена: ${w.tradeLink}\nДата: ${w.date}\n---`,
    )
    .join("\n");

  await ctx.reply(withdrawalInfo || "Нет выводов");
});

const update = webhookCallback(bot, "std/http");

const handleUpdate = async (request: Request) => {
  return await update(request);
};

export const APIRoute = createAPIFileRoute("/api/admin-bot")({
  GET: async ({ request }) => handleUpdate(request),
  POST: async ({ request }) => handleUpdate(request),
});
