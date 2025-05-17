import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/lib/db";
import {
  FrontendTask,
  TaskData,
  tasksTable,
  TaskStatus,
  userTasksTable,
} from "~/lib/db/schema";
import { checkMembership } from "~/lib/tasks/check-tasks";
import { procedure } from "./init";
export const tasksRouter = {
  getTasks: procedure.query<FrontendTask[]>(async ({ ctx }) => {
    console.log("[getTasks] Starting query for userId:", ctx.userId);

    console.log("[getTasks] Fetching all tasks from database");
    const tasks = await db.select().from(tasksTable);
    console.log("[getTasks] Found tasks:", tasks.length);

    console.log("[getTasks] Fetching user tasks for userId:", ctx.userId);
    const userTasks = await db
      .select()
      .from(userTasksTable)
      .where(eq(userTasksTable.userId, ctx.userId));
    console.log("[getTasks] Found user tasks:", userTasks.length);

    console.log("[getTasks] Creating user task status map");
    const userTaskMap = new Map<number, TaskStatus>(
      userTasks.map((ut) => [ut.taskId, ut.status as TaskStatus]),
    );
    console.log("[getTasks] User task map size:", userTaskMap.size);

    console.log("[getTasks] Mapping tasks with user statuses");
    const result = tasks.map((task) => {
      const status = userTaskMap.get(task.id) || "notStarted";
      console.log(`[getTasks] Task ${task.id} status: ${status}`);
      return {
        id: task.id,
        name: task.name,
        status: status satisfies TaskStatus,
        reward: task.reward,
        taskData: task.data as TaskData,
      } satisfies FrontendTask;
    });

    console.log("[getTasks] Returning tasks with statuses, count:", result.length);
    return result;
  }),

  getTasksStatuses: procedure
    .input(
      z.object({
        tasksIds: z.array(z.number()),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("[getTasksStatuses] Starting query for userId:", ctx.userId);
      console.log("[getTasksStatuses] Requested task IDs:", input.tasksIds);

      // Get all tasks statuses for the given task IDs
      console.log("[getTasksStatuses] Fetching user tasks from database");
      const userTasks = await db
        .select()
        .from(userTasksTable)
        .where(
          and(
            eq(userTasksTable.userId, ctx.userId),
            inArray(userTasksTable.taskId, input.tasksIds),
          ),
        );

      console.log("[getTasksStatuses] input.tasksIds", input.tasksIds);
      console.log("[getTasksStatuses] Found userTasks:", userTasks.length);
      console.log("[getTasksStatuses] userTasks data:", JSON.stringify(userTasks));

      // Map tasks to required format
      console.log("[getTasksStatuses] Mapping tasks to response format");
      const result = userTasks.map((task) => ({
        taskId: task.taskId,
        status: task.status,
      }));

      console.log("[getTasksStatuses] Returning statuses:", JSON.stringify(result));
      return result;
    }),

  startVerification: procedure
    .input(z.object({ taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      console.log(
        "[startVerification] Starting verification for userId:",
        ctx.userId,
        "taskId:",
        input.taskId,
      );

      console.log("[startVerification] Fetching task from database");
      const task = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.id, input.taskId))
        .then((rows) => rows[0]);

      console.log("[startVerification] Task data:", JSON.stringify(task));

      if (!task) {
        console.error("[startVerification] Task not found for taskId:", input.taskId);
        throw new Error("Task not found");
      }

      //   const existingTask = await db
      //     .select()
      //     .from(userTasksTable)
      //     .where(
      //       and(
      //         eq(userTasksTable.userId, ctx.userId),
      //         eq(userTasksTable.taskId, input.taskId),
      //       ),
      //     );

      //   console.log("existingTask", existingTask);

      //   if (existingTask.length === 0) {
      //     // create new task as checking in users table
      //     await db.insert(userTasksTable).values({
      //       userId: ctx.userId,
      //       taskId: input.taskId,
      //       status: "checking",
      //     });

      //     console.log("new task created");
      //   } else {
      //     await db
      //       .update(userTasksTable)
      //       .set({
      //         status: "checking",
      //       })
      //       .where(
      //         and(
      //           eq(userTasksTable.userId, ctx.userId),
      //           eq(userTasksTable.taskId, input.taskId),
      //         ),
      //       );
      //   }

      console.log("[startVerification] Calling checkMembership function");
      await checkMembership({
        userId: ctx.userId,
        taskId: input.taskId,
      });
      console.log("[startVerification] Verification process completed");
    }),

  startTask: procedure
    .input(z.object({ taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      console.log(
        "[startTask] Starting task for userId:",
        ctx.userId,
        "taskId:",
        input.taskId,
      );

      console.log("[startTask] Fetching task from database");
      const task = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.id, input.taskId))
        .then((rows) => rows[0]);

      console.log("[startTask] Task data:", JSON.stringify(task));

      if (!task) {
        console.error("[startTask] Task not found for taskId:", input.taskId);
        throw new Error("Task not found");
      }

      console.log("[startTask] Inserting user task with 'started' status");
      await db.insert(userTasksTable).values({
        userId: ctx.userId,
        taskId: input.taskId,
        status: "started",
      });
      console.log("[startTask] Task started successfully");
    }),
};
