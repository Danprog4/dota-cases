import { eq } from "drizzle-orm";
import { CRYSTAL_PRICE } from "../configs/crys.price";
import { db } from "../db";
import { usersTable } from "../db/schema";
export const updateCrystalBalance = async (userId: number, amount: number) => {
  const user = await db.query.usersTable.findFirst({
    where: (users) => eq(users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const price = CRYSTAL_PRICE.find((p) => p.stars === amount);

  if (!price) {
    throw new Error("Price not found");
  }

  await db
    .update(usersTable)
    .set({ crystalBalance: user.crystalBalance + price.crystals })
    .where(eq(usersTable.id, userId));
};
