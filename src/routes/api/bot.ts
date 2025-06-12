import { createAPIFileRoute } from "@tanstack/react-start/api";
import { eq } from "drizzle-orm";
import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { db } from "~/lib/db";
import { updateCrystalBalance } from "~/lib/utils/updateCrys";
const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);

const inlineKeyboard = new InlineKeyboard().webApp(
  "Начать играть!",
  "https://champtracker-backend.vercel.app/",
);

bot.on("message:successful_payment", async (ctx) => {
  console.log("message:successful_payment", ctx);
  const payment = ctx.update.message.successful_payment;

  console.log("message:successful_payment", JSON.stringify(payment, null, 2));

  const payload = JSON.parse(payment.invoice_payload) as { userId: number };

  console.log("payload", payload);

  const user = await db.query.usersTable.findFirst({
    where: (users) => eq(users.id, payload.userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  updateCrystalBalance(user.id, payment.total_amount);
});

bot.command("start", async (ctx) => {
  await ctx.replyWithPhoto("https://champtracker-backend.vercel.app/images/champ.jpg", {
    caption: `*🏆 Ваш личный помощник в формировании привычек! 🏆*

С Champtracker вы сможете:
✅ Создавать и настраивать задания для укрепления дисциплины
🎯 Следить за прогрессом и достигать своих целей
💰 Зарабатывать токены за ежедневную активность и выполнение заданий

Нажми кнопку ниже, чтобы начать прокачивать свою дисциплину! 💪`,
    reply_markup: inlineKeyboard,
    parse_mode: "Markdown",
  });
});

bot.on("pre_checkout_query", async (ctx) => {
  console.log("pre_checkout_query", ctx);
  return ctx.answerPreCheckoutQuery(true);
});

const update = webhookCallback(bot, "std/http");

const handleUpdate = async (request: Request) => {
  //   const url = new URL(request.url);
  //   if (url.searchParams.get("secret") !== bot.token) {
  //     return new Response("not allowed", { status: 405 });
  //   }
  return await update(request);
};

export const APIRoute = createAPIFileRoute("/api/bot")({
  GET: async ({ request }) => handleUpdate(request),
  POST: async ({ request }) => handleUpdate(request),
});
