import { CASE_IMAGES } from "~/case-images";
import { CASES_CONFIG } from "../configs/cases.config";

export const getAllFb = async () => {
  const caseImages = CASES_CONFIG.map((item) => {
    const caseItems = item.items.map((item) => {
      const itemImage = CASE_IMAGES.find((image) => image.markethashname === item.name);
      return {
        ...item,
        image: itemImage?.itemimage || "/fallback.png",
      };
    });
    return caseItems;
  });
  console.log(caseImages);

  return caseImages
    .flat()
    .filter((item) => item.image === "/fallback.png")
    .map((item) => item.name);
};

getAllFb().then((items) => {
  console.log(items);
});

//result

// "Taunt: Curious Movements",
//   "Inscribed Demon Eater",
//   "Bladeform Legacy",
//   "Feast of Abscession",
//   "Great Sage's Reckoning",
//   "Fiery Soul of the Slayer",
//   "Blade of the Demonic Vessel",
//   "Chains of the Black Death",
//   "Pact of the Wurmblood",
//   "Genuine Weather Ash",
//   "Feast of Abscession Bundle",
//   "Mark of the Blood Moon",
//   "Inscribed Demon Eater",
//   "Bladeform Legacy",
//   "Manifold Paradox",
//   "Tempest Helm of the Thundergod",
//   "Flockheart's Gamble";
