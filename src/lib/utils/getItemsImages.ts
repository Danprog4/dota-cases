import { CASE_IMAGES } from "~/case-images";
import { CaseConfig, CASES_CONFIG } from "../configs/cases.config";

export interface CaseWithImage extends Omit<CaseConfig, "items"> {
  items: Array<{ name: string; price: number; image: string }>;
}

export async function getCasesWithImages(game = "dota"): Promise<CaseWithImage[]> {
  return CASES_CONFIG.map((c) => {
    const itemsWithImages = c.items.map((item) => {
      const caseImage = CASE_IMAGES.find((i) => i.markethashname === item.name);

      return {
        ...item,
        image: caseImage?.itemimage ?? "/fallback.png",
      };
    });

    console.log(itemsWithImages, "itemsWithImages");
    return { ...c, items: itemsWithImages };
  });
}
