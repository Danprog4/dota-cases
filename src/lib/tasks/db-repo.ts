import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { TaskInsert, tasksTable, usersTable, userTasksTable } from "../db/schema";

export const makeTaskCompleted = async (userId: number, taskId: number) => {
  await db
    .update(userTasksTable)
    .set({ status: "completed" })
    .where(and(eq(userTasksTable.userId, userId), eq(userTasksTable.taskId, taskId)));

  const task = await getTaskById(taskId);

  await db
    .update(tasksTable)
    .set({ completed: task.completed + 1 })
    .where(eq(tasksTable.id, taskId));

  const isTgTask = task.data?.type === "telegram";

  await db
    .update(usersTable)
    .set({
      crystalBalance: sql`${usersTable.crystalBalance} + ${task.reward}`,
      isSub: isTgTask && true,
    })
    .where(eq(usersTable.id, userId));
};

export const makeTaskFailed = async (userId: number, taskId: number) => {
  await db
    .update(userTasksTable)
    .set({ status: "failed" })
    .where(and(eq(userTasksTable.userId, userId), eq(userTasksTable.taskId, taskId)));
};

export const getTaskById = async (taskId: number) => {
  const [row] = await db.select().from(tasksTable).where(eq(tasksTable.id, taskId));
  return row;
};

export const getUserTaskById = async (userId: number, taskId: number) => {
  const [row] = await db
    .select()
    .from(userTasksTable)
    .where(and(eq(userTasksTable.userId, userId), eq(userTasksTable.taskId, taskId)));
  return row;
};

export const createTask = async (task: TaskInsert) => {
  await db.insert(tasksTable).values(task);
};

// test helpers

export const deleteUserTasks = async (userId: number) => {
  await db.delete(userTasksTable).where(eq(userTasksTable.userId, userId));
};

// Helpers for dev only

export const deleteAllTasks = async () => {
  await db.delete(tasksTable);
};
