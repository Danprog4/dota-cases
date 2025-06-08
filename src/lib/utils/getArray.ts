import { CASES_CONFIG } from "../configs/cases.config";
import { getItem } from "./getItem";

export const getArray = async (caseId: number, userId: number) => {
  const caseItems = CASES_CONFIG.find((caseItem) => caseItem.id === caseId)?.items;

  const randomItem = await getItem(caseId, userId);

  if (!randomItem) {
    return [];
  }

  console.log(randomItem, "real item");

  const filteredArray = caseItems?.filter((item) => {
    return randomItem?.name !== item.name;
  });

  if (!filteredArray) {
    return [];
  }

  const array = [
    ...filteredArray,
    {
      name: randomItem?.name,
      price: randomItem?.price,
      id: randomItem.id,
    },
  ];

  return array;
};
