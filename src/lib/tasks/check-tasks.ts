import axios from "axios";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { tasksTable } from "../db/schema";
import { makeTaskCompleted, makeTaskFailed } from "./db-repo";

async function checkTelegramMembership(args: {
  userId: number;
  chatId: string;
}): Promise<boolean> {
  const { userId, chatId } = args;
  console.log(
    "[checkTelegramMembership] Starting check for userId:",
    userId,
    "chatId:",
    chatId,
  );

  const formattedChatId = chatId.toString().startsWith("-") ? chatId : "@" + chatId;
  console.log("[checkTelegramMembership] Formatted chatId:", formattedChatId);

  console.log(
    "[checkTelegramMembership] Making API request to Telegram with BOT_TOKEN:",
    process.env.BOT_TOKEN?.substring(0, 5) + "...",
  );

  try {
    const response = await axios.get<{ result: { status: string } }>(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`,
      {
        params: {
          chat_id: formattedChatId,
          user_id: userId,
        },
      },
    );

    console.log(
      "[checkTelegramMembership] Raw API response:",
      JSON.stringify(response.data),
    );
    console.log("[checkTelegramMembership] Member status:", response.data.result.status);

    const isMember =
      response.data.result.status === "member" ||
      response.data.result.status === "administrator" ||
      response.data.result.status === "creator";

    console.log("[checkTelegramMembership] Is member result:", isMember);
    return isMember;
  } catch (error) {
    console.error("[checkTelegramMembership] API request failed:", error);
    console.error(
      "[checkTelegramMembership] Error details:",
      (error as any)?.response?.data || error,
    );
    throw error;
  }
}

export async function checkMembership({
  userId,
  taskId,
}: {
  userId: number;
  taskId: number;
}) {
  console.log(
    "[checkMembership] Starting membership check for userId:",
    userId,
    "taskId:",
    taskId,
  );

  console.log("[checkMembership] Fetching task from database");
  const task = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.id, taskId))
    .then((rows) => rows[0]);

  console.log("[checkMembership] Task data:", JSON.stringify(task));

  const chatId = task.data?.type === "telegram" ? task.data.data.chatId : null;
  console.log("[checkMembership] Extracted chatId:", chatId);

  if (!chatId) {
    console.error("[checkMembership] No chatId found for taskId:", taskId);
    console.error("[checkMembership] Task data was:", JSON.stringify(task.data));
    return;
  }

  try {
    console.log("[checkMembership] Calling checkTelegramMembership");
    const isMember = await checkTelegramMembership({
      userId,
      chatId,
    });

    console.log("[checkMembership] Membership check result:", isMember);

    if (isMember) {
      console.log("[checkMembership] User is a member, marking task as completed");
      await makeTaskCompleted(userId, taskId);
      console.log(
        "[checkMembership] Task marked as completed for userId:",
        userId,
        "taskId:",
        taskId,
      );
    } else {
      console.log("[checkMembership] User is NOT a member, marking task as failed");
      await makeTaskFailed(userId, taskId);
      console.log(
        "[checkMembership] Task marked as failed for userId:",
        userId,
        "taskId:",
        taskId,
      );
    }
  } catch (e) {
    console.error(
      "[checkMembership] Error during membership check:",
      (e as Error).message,
    );
    console.error("[checkMembership] Error stack:", (e as Error).stack);
    console.log("[checkMembership] Marking task as failed due to error");
    await makeTaskFailed(userId, taskId);
    console.log(
      "[checkMembership] Task marked as failed for userId:",
      userId,
      "taskId:",
      taskId,
    );
  }
}
