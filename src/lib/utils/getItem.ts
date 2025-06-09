import { eq } from "drizzle-orm";
import { CASES_CONFIG } from "../configs/cases.config";
import { db } from "../db";
import { usersTable } from "../db/schema";

export const getItem = async (caseId: number, userId: number) => {
  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) });

  if (!user) {
    return;
  }

  const caseItems = CASES_CONFIG.find((caseItem) => caseItem.id === caseId)?.items;

  if (!caseItems || caseItems.length === 0) {
    return null;
  }

  const maxPrice = Math.max(...caseItems.map((item) => item.price));
  const itemsWithWeights = caseItems.map((item) => ({
    ...item,
    weight: maxPrice - item.price + 1,
  }));

  const totalWeight = itemsWithWeights.reduce((sum, item) => sum + item.weight, 0);

  const random = Math.random() * totalWeight;

  let currentWeight = 0;
  for (const item of itemsWithWeights) {
    const idNow = Date.now();
    currentWeight += item.weight;
    if (random <= currentWeight) {
      return { name: item.name, price: item.price, id: idNow, isSold: false };
    }
  }
};
