import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  referrerId: bigint("referrerId", { mode: "number" }),
  photoUrl: varchar({ length: 255 }),
  name: varchar("name", { length: 255 }),
  crystalBalance: bigint("crystalBalance", { mode: "number" }).default(0).notNull(),
  lastMining: timestamp("lastMining", { withTimezone: true }),
});

export const tapBatches = pgTable("tap_batches", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  count: integer("count").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
});

export type TaskDataTelegram = {
  type: "telegram";
  data: {
    chatId: string;
    channelName: string;
  };
};

export type TaskDataLink = {
  type: "link";
};

export type TaskData = TaskDataTelegram | TaskDataLink;

export const tasksTable = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  reward: integer("reward").notNull().default(100),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  completed: integer("completed").notNull().default(0),
  active: boolean("active").notNull().default(true),
  type: varchar("type", { length: 50 }).notNull().default("join"), // telegram, fake, twitter, external
  data: jsonb("data").$type<TaskData>(),
});

export type Task = typeof tasksTable.$inferSelect;
export type TaskInsert = typeof tasksTable.$inferInsert;

export type FrontendTask = {
  id: number;
  name: string;
  reward: number;
  status: TaskStatus;
  taskData: TaskData;
};

/**
 * If you want user-task statuses, define a join table with a status field.
 */
export const userTasksTable = pgTable(
  "user_tasks",
  {
    userId: bigint("user_id", { mode: "number" }).notNull(),
    taskId: integer("task_id").notNull(),
    status: varchar("task_status", { length: 32 }).notNull().default("notStarted"),
  },
  (table) => {
    return [
      {
        pk: primaryKey({ columns: [table.userId, table.taskId] }),
        userIdIdx: index("user_task_user_id_idx").on(table.userId),
      },
    ];
  },
);

export type UserTask = typeof userTasksTable.$inferSelect;

export type TaskStatus = "checking" | "completed" | "failed" | "notStarted" | "started";

export type User = typeof usersTable.$inferSelect;
