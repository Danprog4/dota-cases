import Case1 from "../../../public/cases/1.png";
import Case2 from "../../../public/cases/2.png";
import Case3 from "../../../public/cases/3.png";
import Case4 from "../../../public/cases/4.png";
import Case5 from "../../../public/cases/5.png";
import Case6 from "../../../public/cases/6.png";

export interface CaseConfig {
  id: number;
  name: string;
  description: string;
  price: number;
  img: string;
  items: { name: string; price: number; image: string }[];
}

// Весь плоский список предметов с их неизменными ценами
const ALL_ITEMS = [
  { name: "Taunt: Victory Jig", price: 2600, image: "" },
  { name: "The International 2014 Music Pack", price: 500, image: "" },
  { name: "Awaleb's Trundleweed", price: 800, image: "" },
  { name: "Blossom of the Merry Wanderer", price: 1000, image: "" },
  { name: "Dark Maw Inhibitor", price: 1000, image: "" },
  { name: "Fate of Hydrophiinae", price: 1100, image: "" },
  { name: "Fin of the First Spear", price: 700, image: "" },
  { name: "Shadow of the Dark Age", price: 900, image: "" },
  { name: "Latticean Hierarchy", price: 500, image: "" },
  { name: "Chalice of Ix'yxa", price: 700, image: "" },
  { name: "Taunt: The Royal Raspberry", price: 900, image: "" },
  { name: "Mask of Metira", price: 700, image: "" },
  { name: "Stuntwood Symbiont", price: 900, image: "" },
  { name: "Eye of Ix'yxa", price: 400, image: "" },
  { name: "Colossal Crystal Chorus", price: 3100, image: "" },
  { name: "Tormented Staff", price: 9000, image: "" },
  { name: "Full-Bore Bonanza", price: 4000, image: "" },
  { name: "Transversant Soul", price: 9800, image: "" },
  { name: "Offhand Basher of Mage Skulls", price: 6500, image: "" },
  { name: "Rollermawster", price: 8800, image: "" },
  { name: "Resistive Pinfold", price: 6400, image: "" },
  { name: "Pachyderm Powderwagon Spoon", price: 3800, image: "" },
  { name: "Severing Lash", price: 9600, image: "" },
  { name: "Aktok's Domain", price: 3200, image: "" },
  { name: "Paragon's Pride Bundle", price: 7300, image: "" },
  { name: "Draca Maw", price: 2700, image: "" },
  { name: "Draining Wight", price: 2300, image: "" },
  { name: "Arcanic Resonance Beam", price: 1100, image: "" },
  { name: "Ripper's Reel", price: 21700, image: "" },
  { name: "Edge of the Lost Order", price: 4500, image: "" },
  { name: "Yulsaria's Glacier", price: 16100, image: "" },
  { name: "The Spoils of Dezun", price: 19400, image: "" },
  { name: "Sylvan Cascade", price: 18600, image: "" },
  { name: "Chaos Arbiter", price: 19300, image: "" },
  { name: "Hydrakan Latch", price: 24500, image: "" },
  { name: "Vigil Signet", price: 11000, image: "" },
  { name: "Mask of the Confidant", price: 8700, image: "" },
  { name: "Iron Surge", price: 12400, image: "" },
  { name: "Iceflight Edifice", price: 7000, image: "" },
  { name: "Solar Forge", price: 23200, image: "" },
  { name: "Jewel of Aeons", price: 8500, image: "" },
  { name: "Peregrine Flight", price: 10800, image: "" },
  { name: "Origins of Faith", price: 31100, image: "" },
  { name: "Gimlek Decanter", price: 27600, image: "" },
  { name: "Golden Profane Union", price: 11800, image: "" },
  { name: "Shearing Deposition", price: 10200, image: "" },
  { name: "Golden Cyrridae", price: 22200, image: "" },
  { name: "Piston Impaler", price: 29700, image: "" },
  { name: "Almond the Frondillo", price: 20600, image: "" },
  { name: "Glaive of Oscilla", price: 39600, image: "" },
  { name: "Totem of Deep Magma", price: 14200, image: "" },
  { name: "Trust of the Benefactor 2018", price: 20500, image: "" },
  { name: "Dipper the Destroyer", price: 26200, image: "" },
  { name: "Shatterblast Rule", price: 14500, image: "" },
  { name: "Servant of the Sightless Shamans Head", price: 12400, image: "" },
  { name: "Inscribed Wraithbinder", price: 6200, image: "" },
  { name: "Genuine Hell's Usher", price: 19300, image: "" },
  { name: "Antipodean Allies", price: 19500, image: "" },
  { name: "Hidden Vector - Hat", price: 11900, image: "" },
  { name: "Immortal Treasure II 2022", price: 9800, image: "" },
  { name: "Trust of the Benefactor 2022", price: 20900, image: "" },
  { name: "Genuine The Barb of Skadi", price: 13700, image: "" },
  { name: "Immortal Treasure I 2017", price: 16300, image: "" },
  { name: "Inscribed Shock of the Anvil", price: 19900, image: "" },
  { name: "Pyrexaec Floe", price: 94100, image: "" },
  { name: "Golden Scavenging Guttleslug", price: 91700, image: "" },
  { name: "Hunter's Hoard", price: 69700, image: "" },
  { name: "Arms of Desolation", price: 51300, image: "" },
  { name: "Crux of Perplex", price: 33800, image: "" },
  { name: "Golden Ice Blossom", price: 30200, image: "" },
  { name: "Genuine Bloodfeather Wings", price: 60300, image: "" },
  { name: "Blistering Shade", price: 95000, image: "" },
  { name: "Reaper's Wreath", price: 49700, image: "" },
  { name: "Floodmask", price: 57400, image: "" },
  { name: "Dam'arakan Muzzle", price: 101200, image: "" },
  { name: "Siltbreaker Reward", price: 55400, image: "" },
  { name: "Thirst of Eztzhok - Off-Hand", price: 33800, image: "" },
  { name: "Inscribed The Lightning Orchid", price: 16600, image: "" },
  { name: "Inscribed Sylvan Cascade", price: 17300, image: "" },
  { name: "Doll of the Dead", price: 99000, image: "" },
  { name: "Inscribed Muh Keen Gun", price: 37900, image: "" },
  { name: "Armor of the Loyal Fold", price: 76700, image: "" },
  { name: "Swift Claw", price: 97300, image: "" },
  { name: "Apogee of the Guardian Flame", price: 31200, image: "" },
  { name: "Tines of Tybara", price: 24200, image: "" },
  { name: "Sullen Rampart", price: 66800, image: "" },
  { name: "Focal Resonance", price: 46000, image: "" },
  { name: "Jagged Honor Blade", price: 79400, image: "" },
  { name: "Mulctant Pall", price: 101600, image: "" },
  { name: "Flourishing Lodestar", price: 39800, image: "" },
  { name: "Thirst of Eztzhok Blade", price: 45200, image: "" },
  { name: "Cape of the Impossible Realm", price: 49500, image: "" },
  { name: "Genuine Inverse Bayonet", price: 44600, image: "" },
  { name: "Genuine Pale Edge", price: 47900, image: "" },
  { name: "Infused Claws of the Ferocious Heart", price: 37000, image: "" },
  { name: "Hidden Vector - Blade", price: 45400, image: "" },
  { name: "Inscribed Magus Apex", price: 28700, image: "" },
  { name: "Inscribed Vigil Signet", price: 9300, image: "" },
  { name: "Mask of the Forgotten Plane", price: 9400, image: "" },
  { name: "Astral Origins - Back", price: 67700, image: "" },
  { name: "The Abscesserator", price: 38700, image: "" },
  { name: "Inscribed Focal Resonance", price: 39300, image: "" },
  { name: "Nemestice 2021 Themed Treasure", price: 9400, image: "" },
  { name: "Hunger of the Howling Wilds Weapon", price: 11900, image: "" },
  { name: "Hidden Vector", price: 80300, image: "" },
  { name: "Inscribed Golden Offhand Basher of Mage Skulls", price: 39600, image: "" },
  { name: "Inscribed Ripper's Reel", price: 22100, image: "" },
  { name: "Inscribed Thirst of Eztzhok Blade", price: 40300, image: "" },
  { name: "Tools of the Hellsworn", price: 37600, image: "" },
  { name: "Unusual Mango the Newt", price: 63800, image: "" },
  { name: "Apex Explorer", price: 9200, image: "" },
  { name: "Hunter of the Crystal Drift", price: 46300, image: "" },
  { name: "Pulsar Remnant", price: 24900, image: "" },
  { name: "Cult of Aktok", price: 25300, image: "" },
  { name: "Paraflare Cannon", price: 24900, image: "" },
  { name: "Grasping Bludgeon", price: 76800, image: "" },
  { name: "The Lightning Orchid", price: 19400, image: "" },
  { name: "Jagged Honor Mask", price: 52400, image: "" },
  { name: "Infernal Chieftain", price: 63700, image: "" },
  { name: "Mantle of the Whispered Bond", price: 21400, image: "" },
  { name: "Golden Bloodfeather Feast", price: 16900, image: "" },
  { name: "Bonkers the Mad", price: 16500, image: "" },
  { name: "Mandate of the Stormborn", price: 19500, image: "" },
  { name: "Mania's Mask", price: 82200, image: "" },
  { name: "Genuine Skittering Desolation", price: 77500, image: "" },
  { name: "Dark Artistry Pauldrons", price: 59200, image: "" },
  { name: "Golden Edge of the Lost Order", price: 10100, image: "" },
  { name: "Bracers of the Cavern Luminar", price: 14900, image: "" },
  { name: "Ice Blossom", price: 13900, image: "" },
  { name: "The Sunbreeze Birthright", price: 47500, image: "" },
  { name: "Hellborn Grasp", price: 64700, image: "" },
  { name: "Genuine Molten Claw", price: 71000, image: "" },
  { name: "Disciple of the Wyrmwrought Flame", price: 9613, image: "" },
  { name: "Scorching Talon", price: 109500, image: "" },
  { name: "Feathers of the Vermillion Crucible", price: 153500, image: "" },
  { name: "Insatiable Bonesaw", price: 170900, image: "" },
  { name: "Genuine Heavy Wingblade", price: 42600, image: "" },
  { name: "Taunt: Come and Get It!", price: 21400, image: "" },
  { name: "Taunt: Raging Bull", price: 10500, image: "" },
  { name: "Golden Draca Maw", price: 14200, image: "" },
  { name: "Golden Offhand Basher of Mage Skulls", price: 42400, image: "" },
  { name: "Concord Dominion", price: 39300, image: "" },
  { name: "Staff of Perplex", price: 89100, image: "" },
  { name: "Lamb to the Slaughter", price: 87300, image: "" },
  { name: "Genuine Rapier of the Burning God Offhand", price: 37600, image: "" },
  { name: "Mask of the Demon Trickster", price: 28100, image: "" },
  { name: "Alluvion Prophecy", price: 27600, image: "" },
  { name: "Desert Burn Saddle", price: 157900, image: "" },
  { name: "Inscribed Sullen Hollow", price: 91100, image: "" },
  { name: "Provocation of Ruin Bracers", price: 45300, image: "" },
  { name: "Guardian Snow Angel", price: 77400, image: "" },
  { name: "Demon Eater", price: 160100, image: "" },
  { name: "Magus Accord", price: 157800, image: "" },
  { name: "Swine of the Sunken Galley", price: 184300, image: "" },
  { name: "Blades of the Foulfell Corruptor", price: 131000, image: "" },
  { name: "Golden Ripper's Reel", price: 407700, image: "" },
  { name: "Exalted The Magus Cypher", price: 200800, image: "" },
  { name: "Inscribed Blades of Voth Domosh", price: 195000, image: "" },
  { name: "Inscribed Fractal Horns of Inner Abysm", price: 278100, image: "" },
  { name: "Provocation of Ruin Mask", price: 239300, image: "" },
  { name: "Dark Artistry Belt", price: 118200, image: "" },
  { name: "Crimson Gates of Nothl", price: 1022600, image: "" },
  { name: "Crimson Latticean Hierarchy", price: 947200, image: "" },
  { name: "Crimson Progenitor's Bane", price: 961400, image: "" },
  { name: "Genuine Claddish Cudgel", price: 162800, image: "" },
  { name: "Genuine Ripper's Reel of the Crimson Witness", price: 1405000, image: "" },
  { name: "Blades of Voth Domosh", price: 202100, image: "" },
  { name: "Golden Staff of Gun-Yu", price: 369600, image: "" },
  { name: "Golden Nothlic Burden", price: 366800, image: "" },
  { name: "Armor of the Demon Trickster", price: 419400, image: "" },
  { name: "Exalted Fractal Horns of Inner Abysm", price: 309500, image: "" },
  { name: "Spring Lineage Pauldrons of Eternal Harvest", price: 115400, image: "" },
  { name: "Inscribed Fin King's Charm", price: 19600, image: "" },
  { name: "Inscribed Shards of Exile", price: 72800, image: "" },
];

// Цены кейсов
const CASE_PRICES = [500, 3000, 5000, 10000, 15000, 25000];
// Названия кейсов
const CASE_NAMES = [
  "Обычный",
  "Стартовый",
  "Редкий",
  "Эпический",
  "Мифический",
  "Легендарный",
];
// Количество дешёвых и дорогих предметов в каждом кейсе
const CHEAP_COUNT = 12;
const EXPENSIVE_COUNT = 3;

// Изображения кейсов по индексу
const CASE_IMAGES = [Case1, Case2, Case3, Case4, Case5, Case6];

export const CASES_CONFIG: CaseConfig[] = CASE_PRICES.map((casePrice, idx) => {
  // Сортируем полный пул предметов по возрастанию цены
  const sorted = ALL_ITEMS.slice().sort((a, b) => a.price - b.price);

  // Берём первые CHEAP_COUNT предметов дешевле casePrice
  const cheap = sorted
    .filter((i) => i.price < casePrice)
    .slice(-CHEAP_COUNT)
    .map((i) => ({ ...i }));

  // Берём EXPENSIVE_COUNT предметов дороже или равных casePrice
  const expensive = sorted
    .filter((i) => i.price >= casePrice)
    .slice(0, EXPENSIVE_COUNT)
    .map((i) => ({ ...i }));

  // Итоговый набор предметов кейса
  const items = [...cheap, ...expensive];

  return {
    id: idx + 1,
    name: `${CASE_NAMES[idx]} `,
    description: `${CASE_NAMES[idx]} кейс`,
    price: casePrice,
    img: CASE_IMAGES[idx],
    items,
  };
});
