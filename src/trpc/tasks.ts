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
    console.log("getTasks called for userId:", ctx.userId);
    const tasks = await db.select().from(tasksTable);
    console.log("Retrieved tasks:", tasks.length);

    const userTasks = await db
      .select()
      .from(userTasksTable)
      .where(eq(userTasksTable.userId, ctx.userId));
    console.log("Retrieved userTasks:", userTasks.length);

    const userTaskMap = new Map<number, TaskStatus>(
      userTasks.map((ut) => [ut.taskId, ut.status as TaskStatus]),
    );
    console.log("User task map created with entries:", userTaskMap.size);

    const frontendTasks = tasks.map(
      (task) =>
        ({
          id: task.id,
          name: task.name,
          status: (userTaskMap.get(task.id) || "notStarted") satisfies TaskStatus,
          reward: task.reward,
          taskData: task.data as TaskData,
        }) satisfies FrontendTask,
    );
    console.log("Returning frontend tasks:", frontendTasks.length);
    return frontendTasks;
  }),

  getTasksStatuses: procedure
    .input(
      z.object({
        tasksIds: z.array(z.number()),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("getTasksStatuses called with userId:", ctx.userId);
      console.log("Requested task IDs:", input.tasksIds);

      // Get all tasks statuses for the given task IDs
      const userTasks = await db
        .select()
        .from(userTasksTable)
        .where(
          and(
            eq(userTasksTable.userId, ctx.userId),
            inArray(userTasksTable.taskId, input.tasksIds),
          ),
        );

      console.log("input.tasksIds", input.tasksIds);
      console.log("userTasks", userTasks);

      // Map tasks to required format
      const result = userTasks.map((task) => ({
        taskId: task.taskId,
        status: task.status,
      }));
      console.log("Returning task statuses:", result);
      return result;
    }),

  startVerification: procedure
    .input(z.object({ taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      console.log(
        "startVerification called for userId:",
        ctx.userId,
        "taskId:",
        input.taskId,
      );

      const task = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.id, input.taskId))
        .then((rows) => rows[0]);

      if (!task) {
        console.error("Task not found for taskId:", input.taskId);
        throw new Error("Task not found");
      }
      console.log("Found task:", task);

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

      console.log(
        "Calling checkMembership for userId:",
        ctx.userId,
        "taskId:",
        input.taskId,
      );
      await checkMembership({
        userId: ctx.userId,
        taskId: input.taskId,
      });
      console.log("checkMembership completed");
    }),

  startTask: procedure
    .input(z.object({ taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      console.log("startTask called for userId:", ctx.userId, "taskId:", input.taskId);

      const task = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.id, input.taskId))
        .then((rows) => rows[0]);

      if (!task) {
        console.error("Task not found for taskId:", input.taskId);
        throw new Error("Task not found");
      }
      console.log("Found task:", task);

      const userTask = await db
        .select()
        .from(userTasksTable)
        .where(
          and(
            eq(userTasksTable.userId, ctx.userId),
            eq(userTasksTable.taskId, input.taskId),
          ),
        );
      console.log("Existing userTask:", userTask);

      if (userTask.length !== 0) {
        console.log("Updating existing user task to 'started'");
        await db
          .update(userTasksTable)
          .set({
            status: "started",
          })
          .where(
            and(
              eq(userTasksTable.userId, ctx.userId),
              eq(userTasksTable.taskId, input.taskId),
            ),
          );
        return;
      }

      console.log("Creating new user task with 'started' status");
      await db.insert(userTasksTable).values({
        userId: ctx.userId,
        taskId: input.taskId,
        status: "started",
      });
      console.log("Task started successfully");
    }),
};
