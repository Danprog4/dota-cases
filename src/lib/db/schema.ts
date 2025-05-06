import { bigint, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  referrerId: bigint("referrerId", { mode: "number" }),
  photoUrl: varchar({ length: 255 }),
  name: varchar("name", { length: 255 }),
  crystalBalance: bigint("crystalBalance", { mode: "number" }).default(0).notNull(),
  lastMining: timestamp("lastMining", { withTimezone: true }),
});
