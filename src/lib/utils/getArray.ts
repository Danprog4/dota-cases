import { CASES_CONFIG } from "../configs/cases.config";

export const getArray = async (caseId: number, userId: number, randomItem: any) => {
  const caseItems = CASES_CONFIG.find((caseItem) => caseItem.id === caseId)?.items;
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
      id: randomItem?.id,
    },
  ];

  return array;
};
