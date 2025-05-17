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
  console.log("checkTelegramMembership called with", { userId, chatId });

  const apiUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`;
  const formattedChatId = chatId.toString().startsWith("-") ? chatId : "@" + chatId;

  console.log("Making API request to", apiUrl, "with params", {
    chat_id: formattedChatId,
    user_id: userId,
  });

  try {
    const response = await axios.get<{ result: { status: string } }>(apiUrl, {
      params: {
        chat_id: formattedChatId,
        user_id: userId,
      },
    });

    console.log("API response received:", response.data);
    console.log("Membership status:", response.data.result.status);

    return (
      response.data.result.status === "member" ||
      response.data.result.status === "administrator" ||
      response.data.result.status === "creator"
    );
  } catch (error) {
    console.error("Error in checkTelegramMembership:", error);
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
  console.log("checkMembership started", { userId, taskId });

  try {
    const task = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, taskId))
      .then((rows) => rows[0]);

    console.log("Task data retrieved:", task);

    const chatId = task.data?.type === "telegram" ? task.data.data.chatId : null;

    if (!chatId) {
      console.error("No chatId found for task", { taskId, taskData: task.data });
      return;
    }

    console.log("Checking membership with chatId:", chatId);

    try {
      const isMember = await checkTelegramMembership({
        userId,
        chatId,
      });

      console.log("Membership check result:", { userId, taskId, isMember });

      if (isMember) {
        console.log("User is a member, completing task", { userId, taskId });
        await makeTaskCompleted(userId, taskId);
        console.log("Task completed successfully", { userId, taskId });
      } else {
        console.log("User is not a member, marking task as failed", { userId, taskId });
        await makeTaskFailed(userId, taskId);
        console.log("Task marked as failed", { userId, taskId });
      }
    } catch (e) {
      console.error("Error during membership check:", e);
      console.log("Marking task as failed due to error", { userId, taskId });
      await makeTaskFailed(userId, taskId);
      console.log("Task marked as failed after error", { userId, taskId });
    }
  } catch (dbError) {
    console.error("Database error in checkMembership:", dbError);
  }
}
