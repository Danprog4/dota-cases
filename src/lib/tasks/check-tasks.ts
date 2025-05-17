import axios from "axios";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { tasksTable } from "../db/schema";
import { makeTaskCompleted, makeTaskFailed } from "./db-repo";

export async function checkTelegramMembership(args: {
  userId: number;
  chatId: string;
}): Promise<boolean> {
  const { userId, chatId } = args;
  const response = await axios.get<{ result: { status: string } }>(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`,
    {
      params: {
        chat_id: chatId.toString().startsWith("-") ? chatId : "@" + chatId,
        user_id: userId,
      },
    },
  );

  console.log("check membership response", response.data.result.status);

  return (
    response.data.result.status === "member" ||
    response.data.result.status === "administrator" ||
    response.data.result.status === "creator"
  );
}

export async function checkMembership({
  userId,
  taskId,
}: {
  userId: number;
  taskId: number;
}) {
  console.log("checkMembershipJob", { userId, taskId });

  const task = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.id, taskId))
    .then((rows) => rows[0]);

  const chatId = task.data?.type === "telegram" ? task.data.data.chatId : null;

  if (!chatId) {
    console.error("No chatId or channelName found", taskId);
    return;
  }

  try {
    const isMember = await checkTelegramMembership({
      userId,
      chatId,
    });

    console.log("isMember", isMember);

    if (isMember) {
      await makeTaskCompleted(userId, taskId);
      console.log("makeTaskCompleted", userId, taskId);
    } else {
      console.log("not member", userId, taskId);
      await makeTaskFailed(userId, taskId);
    }
  } catch (e) {
    console.log("error", (e as Error).message);
    await makeTaskFailed(userId, taskId);
  }
}
