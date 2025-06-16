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

export const CASES_CONFIG = [
  {
    id: 1,
    name: "Стартовый",
    description: "Стартовый кейс",
    price: 1500, // Цена кейса
    img: Case1,
    items: [
      { name: "Taunt: Victory Jig", price: 2600 }, // Дороже
      { name: "The International 2014 Music Pack", price: 500 }, // Дешевле
      { name: "Awaleb's Trundleweed", price: 800 }, // Дешевле
      { name: "Blossom of the Merry Wanderer", price: 1000 }, // Дешевле
      { name: "Dark Maw Inhibitor", price: 1000 }, // Дешевле
      { name: "Fate of Hydrophiinae", price: 1100 }, // Дешевле
      { name: "Fin of the First Spear", price: 700 }, // Дешевле
      { name: "Shadow of the Dark Age", price: 900 }, // Дешевле
      { name: "Latticean Hierarchy", price: 500 }, // Дешевле
      { name: "Chalice of Ix'yxa", price: 700 }, // Дешевле
      { name: "Taunt: The Royal Raspberry", price: 900 }, // Дешевле
      { name: "Mask of Metira", price: 700 }, // Дешевле
      { name: "Stuntwood Symbiont", price: 900 }, // Дешевле
      { name: "Eye of Ix'yxa", price: 400 }, // Дешевле
      { name: "Colossal Crystal Chorus", price: 3100 }, // Дороже
      { name: "Tormented Staff", price: 9000 }, // Дороже
      { name: "Full-Bore Bonanza", price: 4000 }, // Дороже
      { name: "Transversant Soul", price: 9800 }, // Дороже
      { name: "Offhand Basher of Mage Skulls", price: 6500 }, // Дороже
      { name: "Rollermawster", price: 8800 }, // Дороже
      { name: "Resistive Pinfold", price: 6400 }, // Дороже
      { name: "Pachyderm Powderwagon Spoon", price: 3800 }, // Дороже
      { name: "Severing Lash", price: 9600 }, // Дороже
      { name: "Aktok's Domain", price: 3200 }, // Дороже
      { name: "Paragon's Pride Bundle", price: 7300 }, // Дороже
      { name: "Draca Maw", price: 2700 }, // Дороже
    ],
  },
  {
    id: 2,
    name: "Обычный",
    description: "Обычный кейс",
    price: 15000, // Цена кейса
    img: Case2,
    items: [
      { name: "Draining Wight", price: 2300 }, // Дешевле
      { name: "Arcanic Resonance Beam", price: 1100 }, // Дешевле
      { name: "Ripper's Reel", price: 21700 }, // Дороже
      { name: "Edge of the Lost Order", price: 4500 }, // Дешевле
      { name: "Yulsaria's Glacier", price: 16100 }, // Дороже
      { name: "The Spoils of Dezun", price: 19400 }, // Дороже
      { name: "Sylvan Cascade", price: 18600 }, // Дороже
      { name: "Chaos Arbiter", price: 19300 }, // Дороже
      { name: "Hydrakan Latch", price: 24500 }, // Дороже
      { name: "Vigil Signet", price: 11000 }, // Дешевле
      { name: "Mask of the Confidant", price: 8700 }, // Дешевле
      { name: "Iron Surge", price: 12400 }, // Дешевле
      { name: "Iceflight Edifice", price: 7000 }, // Дешевле
      { name: "Solar Forge", price: 23200 }, // Дороже
      { name: "Jewel of Aeons", price: 8500 }, // Дешевле
      { name: "Peregrine Flight", price: 10800 }, // Дешевле
      { name: "Origins of Faith", price: 31100 }, // Дороже
      { name: "Gimlek Decanter", price: 27600 }, // Дороже
      { name: "Golden Profane Union", price: 11800 }, // Дешевле
      { name: "Shearing Deposition", price: 10200 }, // Дешевле
      { name: "Golden Cyrridae", price: 22200 }, // Дороже
      { name: "Piston Impaler", price: 29700 }, // Дороже
      { name: "Almond the Frondillo", price: 20600 }, // Дороже
      { name: "Glaive of Oscilla", price: 39600 }, // Дороже
      { name: "Totem of Deep Magma", price: 14200 }, // Дешевле
      { name: "Trust of the Benefactor 2018", price: 20500 }, // Дороже
      { name: "Dipper the Destroyer", price: 26200 }, // Дороже
      { name: "Shatterblast Rule", price: 14500 }, // Дешевле
      { name: "Servant of the Sightless Shamans Head", price: 12400 }, // Дешевле
      { name: "Inscribed Wraithbinder", price: 6200 }, // Дешевле
      { name: "Genuine Hell's Usher", price: 19300 }, // Дороже
      { name: "Antipodean Allies", price: 19500 }, // Дороже
      { name: "Hidden Vector - Hat", price: 11900 }, // Дешевле
      { name: "Immortal Treasure II 2022", price: 9800 }, // Дешевле
      { name: "Trust of the Benefactor 2022", price: 20900 }, // Дороже
      { name: "Genuine The Barb of Skadi", price: 13700 }, // Дешевле
      { name: "Immortal Treasure I 2017", price: 16300 }, // Дороже
    ],
  },
  {
    id: 3,
    name: "Редкий",
    description: "Редкий кейс",
    price: 45000, // Цена кейса
    img: Case3,
    items: [
      { name: "Inscribed Shock of the Anvil", price: 19900 }, // Дешевле
      { name: "Pyrexaec Floe", price: 94100 }, // Дороже
      { name: "Golden Scavenging Guttleslug", price: 91700 }, // Дороже
      { name: "Hunter's Hoard", price: 69700 }, // Дороже
      { name: "Arms of Desolation", price: 51300 }, // Дороже
      { name: "Crux of Perplex", price: 33800 }, // Дешевле
      { name: "Golden Ice Blossom", price: 30200 }, // Дешевле
      { name: "Genuine Bloodfeather Wings", price: 60300 }, // Дороже
      { name: "Blistering Shade", price: 95000 }, // Дороже
      { name: "Reaper's Wreath", price: 49700 }, // Дороже
      { name: "Floodmask", price: 57400 }, // Дороже
      { name: "Dam'arakan Muzzle", price: 101200 }, // Дороже
      { name: "Siltbreaker Reward", price: 55400 }, // Дороже
      { name: "Thirst of Eztzhok - Off-Hand", price: 33800 }, // Дешевле
      { name: "Inscribed The Lightning Orchid", price: 16600 }, // Дешевле
      { name: "Inscribed Sylvan Cascade", price: 17300 }, // Дешевле
      { name: "Doll of the Dead", price: 99000 }, // Дороже
      { name: "Inscribed Muh Keen Gun", price: 37900 }, // Дешевле
      { name: "Armor of the Loyal Fold", price: 76700 }, // Дороже
      { name: "Swift Claw", price: 97300 }, // Дороже
      { name: "Apogee of the Guardian Flame", price: 31200 }, // Дешевле
      { name: "Tines of Tybara", price: 24200 }, // Дешевле
      { name: "Sullen Rampart", price: 66800 }, // Дороже
      { name: "Focal Resonance", price: 46000 }, // Дороже
      { name: "Jagged Honor Blade", price: 79400 }, // Дороже
      { name: "Mulctant Pall", price: 101600 }, // Дороже
      { name: "Blade of the Demonic Vessel", price: 67300 }, // Дороже
      { name: "Flourishing Lodestar", price: 39800 }, // Дешевле
      { name: "Thirst of Eztzhok Blade", price: 45200 }, // Дороже
      { name: "Cape of the Impossible Realm", price: 49500 }, // Дороже
      { name: "Genuine Inverse Bayonet", price: 44600 }, // Дешевле
      { name: "Genuine Pale Edge", price: 47900 }, // Дороже
      { name: "Infused Claws of the Ferocious Heart", price: 37000 }, // Дешевле
      { name: "Hidden Vector - Blade", price: 45400 }, // Дороже
      { name: "Inscribed Magus Apex", price: 28700 }, // Дешевле
      { name: "Inscribed Vigil Signet", price: 9300 }, // Дешевле
      { name: "Mask of the Forgotten Plane", price: 9400 }, // Дешевле
      { name: "Astral Origins - Back", price: 67700 }, // Дороже
      { name: "The Abscesserator", price: 38700 }, // Дешевле
      { name: "Inscribed Focal Resonance", price: 39300 }, // Дешевле
      { name: "Nemestice 2021 Themed Treasure", price: 9400 }, // Дешевле
      { name: "Hunger of the Howling Wilds Weapon", price: 11900 }, // Дешевле
      { name: "Hidden Vector", price: 80300 }, // Дороже
      { name: "Inscribed Golden Offhand Basher of Mage Skulls", price: 39600 }, // Дешевле
      { name: "Inscribed Ripper's Reel", price: 22100 }, // Дешевле
      { name: "Inscribed Thirst of Eztzhok Blade", price: 40300 }, // Дешевле
      { name: "Tools of the Hellsworn", price: 37600 }, // Дешевле
      { name: "Unusual Mango the Newt", price: 63800 }, // Дороже
      { name: "Apex Explorer", price: 9200 }, // Дешевле
      { name: "Hunter of the Crystal Drift", price: 46300 }, // Дороже
      { name: "Pulsar Remnant", price: 24900 }, // Дешевле
      { name: "Cult of Aktok", price: 25300 }, // Дешевле
      { name: "Paraflare Cannon", price: 24900 }, // Дешевле
    ],
  },
  {
    id: 4,
    name: "Эпический",
    description: "Эпический кейс",
    price: 80000, // Цена кейса
    img: Case4,
    items: [
      { name: "Grasping Bludgeon", price: 76800 }, // Дешевле
      { name: "The Lightning Orchid", price: 19400 }, // Дешевле
      { name: "Jagged Honor Mask", price: 52400 }, // Дешевле
      { name: "Infernal Chieftain", price: 63700 }, // Дешевле
      { name: "Mantle of the Whispered Bond", price: 21400 }, // Дешевле
      { name: "Golden Bloodfeather Feast", price: 16900 }, // Дешевле
      { name: "Bonkers the Mad", price: 16500 }, // Дешевле
      { name: "Mandate of the Stormborn", price: 19500 }, // Дешевле
      { name: "Mania's Mask", price: 82200 }, // Дороже
      { name: "Genuine Skittering Desolation", price: 77500 }, // Дешевле
      { name: "Dark Artistry Pauldrons", price: 59200 }, // Дешевле
      { name: "Golden Edge of the Lost Order", price: 10100 }, // Дешевле
      { name: "Bracers of the Cavern Luminar", price: 14900 }, // Дешевле
      { name: "Ice Blossom", price: 13900 }, // Дешевле
      { name: "The Sunbreeze Birthright", price: 47500 }, // Дешевле
      { name: "Hellborn Grasp", price: 64700 }, // Дешевле
      { name: "Genuine Molten Claw", price: 71000 }, // Дешевле
      { name: "Disciple of the Wyrmwrought Flame", price: 9613 }, // Дешевле
      { name: "Scorching Talon", price: 109500 }, // Дороже
      { name: "Feathers of the Vermillion Crucible", price: 153500 }, // Дороже
      { name: "Insatiable Bonesaw", price: 170900 }, // Дороже
      { name: "Genuine Heavy Wingblade", price: 42600 }, // Дешевле
      { name: "Taunt: Come and Get It!", price: 21400 }, // Дешевле
      { name: "Taunt: Raging Bull", price: 10500 }, // Дешевле
      { name: "Golden Draca Maw", price: 14200 }, // Дешевле
      { name: "Golden Offhand Basher of Mage Skulls", price: 42400 }, // Дешевле
      { name: "Concord Dominion", price: 39300 }, // Дешевле
      { name: "Staff of Perplex", price: 89100 }, // Дороже
      { name: "Lamb to the Slaughter", price: 87300 }, // Дороже
      { name: "Genuine Rapier of the Burning God Offhand", price: 37600 }, // Дешевле
      { name: "Mask of the Demon Trickster", price: 28100 }, // Дешевле
      { name: "Alluvion Prophecy", price: 27600 }, // Дешевле
      { name: "Desert Burn Saddle", price: 157900 }, // Дороже
      { name: "Trust of the Benefactor 2019", price: 18500 }, // Дешевле
      { name: "Inscribed Sullen Hollow", price: 91100 }, // Дороже
      { name: "Provocation of Ruin Bracers", price: 45300 }, // Дешевле
      { name: "Guardian Snow Angel", price: 77400 }, // Дешевле
    ],
  },
  {
    id: 5,
    name: "Мифический",
    description: "Мифический кейс",
    price: 150000, // Цена кейса
    img: Case5,
    items: [
      { name: "Demon Eater", price: 160100 }, // Дороже
      { name: "Magus Accord", price: 157800 }, // Дороже
      { name: "Swine of the Sunken Galley", price: 184300 }, // Дороже
      { name: "Blades of the Foulfell Corruptor", price: 131000 }, // Дешевле
      { name: "Golden Ripper's Reel", price: 407700 }, // Дороже
      { name: "Exalted The Magus Cypher", price: 200800 }, // Дороже
      { name: "Inscribed Blades of Voth Domosh", price: 195000 }, // Дороже
      { name: "Inscribed Fractal Horns of Inner Abysm", price: 278100 }, // Дороже
      { name: "Provocation of Ruin Mask", price: 239300 }, // Дороже (из стартового)
      { name: "Dark Artistry Belt", price: 118200 }, // Дешевле (из редкого)
      { name: "Genuine Bloodfeather Wings", price: 60300 }, // Дешевле (много где был)
      { name: "Crimson Gates of Nothl", price: 1022600 }, // Дороже
      { name: "Crimson Latticean Hierarchy", price: 947200 }, // Дороже
      { name: "Crimson Progenitor's Bane", price: 961400 }, // Дороже
      { name: "Genuine Claddish Cudgel", price: 162800 }, // Дороже
      { name: "Genuine Ripper's Reel of the Crimson Witness", price: 1405000 }, // Дороже
      { name: "Blades of Voth Domosh", price: 202100 }, // Дороже
      { name: "Golden Staff of Gun-Yu", price: 369600 }, // Дороже
      { name: "Golden Nothlic Burden", price: 366800 }, // Дороже
      { name: "Armor of the Demon Trickster", price: 419400 }, // Дороже
      { name: "Exalted Fractal Horns of Inner Abysm", price: 309500 }, // Дороже
      { name: "Spring Lineage Pauldrons of Eternal Harvest", price: 115400 }, // Дешевле
      { name: "Inscribed Fin King's Charm", price: 19600 }, // Дешевле
      { name: "Inscribed Shards of Exile", price: 72800 }, // Дешевле
    ],
  },
  {
    id: 6,
    name: "Легендарный",
    description: "Легендарный кейс",
    price: 300000, // Цена кейса
    img: Case6,
    items: [
      { name: "Crimson Gates of Nothl", price: 1022600 }, // Дороже
      { name: "Crimson Latticean Hierarchy", price: 947200 }, // Дороже
      { name: "Crimson Progenitor's Bane", price: 961400 }, // Дороже
      { name: "Genuine Ripper's Reel of the Crimson Witness", price: 1405000 }, // Дороже
      { name: "Golden Staff of Gun-Yu", price: 369600 }, // Дороже
      { name: "Golden Nothlic Burden", price: 366800 }, // Дороже
      { name: "Armor of the Demon Trickster", price: 419400 }, // Дороже
      { name: "Exalted Fractal Horns of Inner Abysm", price: 309500 }, // Дороже
      { name: "Provocation of Ruin Mask", price: 239300 }, // Дешевле
      { name: "Golden Ripper's Reel", price: 407700 }, // Дороже
      { name: "Swine of the Sunken Galley", price: 184300 }, // Дешевле
      { name: "Demon Eater", price: 160100 }, // Дешевле
      { name: "Magus Accord", price: 157800 }, // Дешевле
      { name: "Blades of the Foulfell Corruptor", price: 131000 }, // Дешевле
      { name: "Genuine Claddish Cudgel", price: 162800 }, // Дешевле
      { name: "Blades of Voth Domosh", price: 202100 }, // Дешевле
    ],
  },
];
