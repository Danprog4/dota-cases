import { CASES_CONFIG } from "../configs/cases.config";
import { getItem } from "./getItem";

export const getArray = (caseId: number) => {
  const caseItems = CASES_CONFIG.find((caseItem) => caseItem.id === caseId)?.items;

  const randomItem = getItem(caseId);

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
    },
  ];

  return array;
};
