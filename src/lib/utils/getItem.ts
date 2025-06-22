import { eq } from "drizzle-orm";
import { CASES_CONFIG } from "../configs/cases.config";
import { db } from "../db";
import { usersTable } from "../db/schema";

const CHEAP_BOOST = 2.2; // множитель для вещей дешевле кейса
const EPS = 1; // чтобы не делить на ноль

export const getItem = async (caseId: number, userId: number) => {
  // 1. Проверяем пользователя
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });
  if (!user) return;

  // 2. Получаем предметы выбранного кейса
  const currentCase = CASES_CONFIG.find((c) => c.id === caseId);
  if (!currentCase || currentCase.items.length === 0) return null;

  const { items: caseItems, price: casePrice } = currentCase;

  // 3. Считаем веса
  const itemsWithWeights = caseItems.map((item) => {
    // Инверсная квадратичная зависимость от цены
    let weight = 1 / Math.pow(item.price + EPS, 2);

    // Усиливаем, если предмет дешевле кейса
    if (item.price < casePrice) weight *= CHEAP_BOOST;

    return { ...item, weight };
  });

  // 4. Рулетка по суммарному весу
  const totalWeight = itemsWithWeights.reduce((sum, i) => sum + i.weight, 0);
  const roll = Math.random() * totalWeight;

  let acc = 0;
  for (const item of itemsWithWeights) {
    acc += item.weight;
    if (roll <= acc) {
      return {
        name: item.name,
        price: item.price,
        id: Date.now(),
        isSold: false,
      };
    }
  }
};
