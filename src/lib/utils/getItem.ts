import { CASES_CONFIG } from "../configs/cases.config";

export const getItem = (caseId: number) => {
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
    currentWeight += item.weight;
    if (random <= currentWeight) {
      return { name: item.name, price: item.price };
    }
  }

  return { name: caseItems[0].name, price: caseItems[0].price };
};
