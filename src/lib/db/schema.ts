import {
  bigint,
  integer,
  pgTable,
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
  userId: integer("user_id").notNull(),
  count: integer("count").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
