import { SkillSpecialization } from '../value-objects/skill-specialization.vo';

export interface Skill {
  id: string;
  categoryId: string;
  bonus: string[];
  specialization: SkillSpecialization;
}

export const RMU_SKILLS: Skill[] = [
  { id: 'animal-handling', categoryId: 'animal', bonus: ['pr'], specialization: 'animal-type' },
  { id: 'riding', categoryId: 'animal', bonus: ['pr'], specialization: 'animal-type' },

  { id: 'perception', categoryId: 'awareness', bonus: ['sd'], specialization: 'none' },
  { id: 'tracking', categoryId: 'awareness', bonus: ['sd'], specialization: 'none' },

  { id: 'armor-maneuver', categoryId: 'battle-expertise', bonus: [], specialization: 'none' },
  { id: 'mounted-combat', categoryId: 'battle-expertise', bonus: [], specialization: 'none' },
  { id: 'protect', categoryId: 'battle-expertise', bonus: [], specialization: 'none' },
  { id: 'restricted-quarters', categoryId: 'battle-expertise', bonus: [], specialization: 'none' },
  { id: 'subduing', categoryId: 'battle-expertise', bonus: [], specialization: 'none' },

  { id: 'adrenal-maneuvers', categoryId: 'body-discipline', bonus: [], specialization: 'none' },
  { id: 'adrenal-defense', categoryId: 'body-discipline', bonus: ['ag'], specialization: 'none' },
  { id: 'adrenal-focus', categoryId: 'body-discipline', bonus: ['sd'], specialization: 'none' },
  { id: 'adrenal-speed', categoryId: 'body-discipline', bonus: ['qu'], specialization: 'none' },
  { id: 'adrenal-strength', categoryId: 'body-discipline', bonus: ['st'], specialization: 'none' },

  { id: 'body-development', categoryId: 'brawn', bonus: ['co'], specialization: 'none' },
  { id: 'fortitude', categoryId: 'brawn', bonus: ['sd'], specialization: 'none' },
  { id: 'weight-training', categoryId: 'brawn', bonus: ['st'], specialization: 'none' },

  { id: 'blind-figthing', categoryId: 'combat-expertise', bonus: [], specialization: 'none' },
  { id: 'disarm', categoryId: 'combat-expertise', bonus: [], specialization: 'none' },
  { id: 'footwork', categoryId: 'combat-expertise', bonus: [], specialization: 'none' },
  { id: 'multiple-attacks', categoryId: 'combat-expertise', bonus: [], specialization: 'none' },
  { id: 'reverse-strike', categoryId: 'combat-expertise', bonus: [], specialization: 'none' },

  { id: 'melee-weapon@blade', categoryId: 'combat-training', bonus: ['st'], specialization: 'none' },
  { id: 'melee-weapon@chain', categoryId: 'combat-training', bonus: ['st'], specialization: 'none' },
  {
    id: 'melee-weapon@hafted',
    categoryId: 'combat-training',
    bonus: ['st'],
    specialization: 'none',
  },
  {
    id: 'melee-weapon@greater-blade',
    categoryId: 'combat-training',
    bonus: ['st'],
    specialization: 'none',
  },
  {
    id: 'melee-weapon@greater-chain',
    categoryId: 'combat-training',
    bonus: ['st'],
    specialization: 'none',
  },
  {
    id: 'melee-weapon@greater-hafted',
    categoryId: 'combat-training',
    bonus: ['st'],
    specialization: 'none',
  },
  {
    id: 'melee-weapon@pole-arm',
    categoryId: 'combat-training',
    bonus: ['st'],
    specialization: 'none',
  },
  {
    id: 'melee-weapon@exotic',
    categoryId: 'combat-training',
    bonus: ['st'],
    specialization: 'none',
  },

  { id: 'ranged-weapon@bow', categoryId: 'combat-training', bonus: ['ag'], specialization: 'none' },
  {
    id: 'ranged-weapon@crossbow',
    categoryId: 'combat-training',
    bonus: ['ag'],
    specialization: 'none',
  },
  {
    id: 'ranged-weapon@sling',
    categoryId: 'combat-training',
    bonus: ['ag'],
    specialization: 'none',
  },
  {
    id: 'ranged-weapon@thrown',
    categoryId: 'combat-training',
    bonus: ['ag'],
    specialization: 'none',
  },
  {
    id: 'ranged-weapon@exotic',
    categoryId: 'combat-training',
    bonus: ['ag'],
    specialization: 'none',
  },

  { id: 'shield', categoryId: 'combat-training', bonus: ['st'], specialization: 'none' },

  { id: 'ilusion-crafting', categoryId: 'composition', bonus: ['pr'], specialization: 'none' },
  { id: 'music-composition', categoryId: 'composition', bonus: ['pr'], specialization: 'none' },
  { id: 'writing', categoryId: 'composition', bonus: ['re'], specialization: 'none' },

  { id: 'culinary', categoryId: 'crafting', bonus: ['sd'], specialization: 'none' },
  { id: 'drawing-painting', categoryId: 'crafting', bonus: ['in'], specialization: 'none' },
  { id: 'fabric-craft', categoryId: 'crafting', bonus: ['sd'], specialization: 'none' },
  { id: 'leathercraft', categoryId: 'crafting', bonus: ['sd'], specialization: 'none' },
  { id: 'metalcraft', categoryId: 'crafting', bonus: ['st'], specialization: 'none' },
  { id: 'stonecraft', categoryId: 'crafting', bonus: ['st'], specialization: 'none' },
  { id: 'woodcraft', categoryId: 'crafting', bonus: ['sd'], specialization: 'none' },

  { id: 'attunement', categoryId: 'delving', bonus: ['pr'], specialization: 'none' },
  { id: 'runes', categoryId: 'delving', bonus: ['pr'], specialization: 'none' },

  { id: 'navigation', categoryId: 'environmental', bonus: ['re'], specialization: 'none' },
  { id: 'piloting', categoryId: 'environmental', bonus: ['ag'], specialization: 'vehicle' },
  { id: 'survival', categoryId: 'environmental', bonus: ['ag'], specialization: 'environment' },

  { id: 'acrobatics', categoryId: 'gymnastic', bonus: ['st'], specialization: 'none' },
  { id: 'contortions', categoryId: 'gymnastic', bonus: ['sd'], specialization: 'none' },
  { id: 'jumping', categoryId: 'gymnastic', bonus: ['st'], specialization: 'none' },

  { id: 'creature-lore', categoryId: 'lore', bonus: ['re'], specialization: 'creature-lore' },
  { id: 'historic-lore', categoryId: 'lore', bonus: ['re'], specialization: 'historic-lore' },
  { id: 'language', categoryId: 'lore', bonus: ['re'], specialization: 'language' },
  { id: 'materials-lore', categoryId: 'lore', bonus: ['re'], specialization: 'material-lore' },
  { id: 'racial-lore', categoryId: 'lore', bonus: ['re'], specialization: 'race' },
  { id: 'region-lore', categoryId: 'lore', bonus: ['re'], specialization: 'region' },
  { id: 'religion-lore', categoryId: 'lore', bonus: ['re'], specialization: 'religion' },
  { id: 'spell-lore', categoryId: 'lore', bonus: ['re'], specialization: 'none' },

  { id: 'herbalism', categoryId: 'medical', bonus: ['re'], specialization: 'none' },
  { id: 'medicine', categoryId: 'medical', bonus: ['re'], specialization: 'none' },
  { id: 'poison-mastery', categoryId: 'medical', bonus: ['re'], specialization: 'none' },

  {
    id: 'control-lycanthropy',
    categoryId: 'mental-discipline',
    bonus: ['sd'],
    specialization: 'none',
  },
  { id: 'meditation', categoryId: 'mental-discipline', bonus: ['sd'], specialization: 'none' },
  { id: 'mental-focus', categoryId: 'mental-discipline', bonus: ['sd'], specialization: 'none' },

  { id: 'climbing', categoryId: 'movement', bonus: ['co'], specialization: 'none' },
  { id: 'flying', categoryId: 'movement', bonus: ['co'], specialization: 'none' },
  { id: 'running', categoryId: 'movement', bonus: ['co'], specialization: 'none' },
  { id: 'swimming', categoryId: 'movement', bonus: ['co'], specialization: 'none' },

  { id: 'acting', categoryId: 'performance-art', bonus: ['me'], specialization: 'none' },
  { id: 'music', categoryId: 'performance-art', bonus: ['me'], specialization: 'music-instrument' },
  { id: 'state-magic', categoryId: 'performance-art', bonus: ['ag'], specialization: 'none' },

  { id: 'channeling', categoryId: 'power-manipulation', bonus: ['sd'], specialization: 'none' },
  { id: 'directed-spell', categoryId: 'power-manipulation', bonus: ['ag'], specialization: 'none' },
  {
    id: 'power-development',
    categoryId: 'power-manipulation',
    bonus: ['co'],
    specialization: 'none',
  },
  {
    id: 'power-projection',
    categoryId: 'power-manipulation',
    bonus: ['sd'],
    specialization: 'none',
  },

  { id: 'architecture', categoryId: 'science', bonus: ['re'], specialization: 'none' },
  { id: 'astronomy', categoryId: 'science', bonus: ['re'], specialization: 'none' },
  { id: 'engineering', categoryId: 'science', bonus: ['re'], specialization: 'none' },
  { id: 'mathematics', categoryId: 'science', bonus: ['re'], specialization: 'none' },

  { id: 'influence@charm', categoryId: 'social', bonus: ['pr'], specialization: 'none' },
  { id: 'influence@duping', categoryId: 'social', bonus: ['pr'], specialization: 'none' },
  { id: 'influence@intimidation', categoryId: 'social', bonus: ['pr'], specialization: 'none' },
  { id: 'leadership', categoryId: 'social', bonus: ['pr'], specialization: 'none' },
  { id: 'social-awareness', categoryId: 'social', bonus: ['em'], specialization: 'none' },
  { id: 'trading', categoryId: 'social', bonus: ['em'], specialization: 'none' },

  { id: 'magic-ritual', categoryId: 'spellcasting', bonus: ['me'], specialization: 'none' },
  { id: 'base-spell-list', categoryId: 'spellcasting', bonus: ['me'], specialization: 'none' },
  { id: 'open-spell-list', categoryId: 'spellcasting', bonus: ['me'], specialization: 'none' },
  { id: 'closed-spell-list', categoryId: 'spellcasting', bonus: ['me'], specialization: 'none' },
  { id: 'arcane-spell-list', categoryId: 'spellcasting', bonus: ['me'], specialization: 'none' },
  { id: 'restricted-spell-list', categoryId: 'spellcasting', bonus: ['me'], specialization: 'none' },

  { id: 'ambush', categoryId: 'subterfuge', bonus: ['in'], specialization: 'combat-skill' },
  { id: 'concealment', categoryId: 'subterfuge', bonus: ['in'], specialization: 'none' },
  { id: 'stalking', categoryId: 'subterfuge', bonus: ['in'], specialization: 'none' },
  { id: 'trickery', categoryId: 'subterfuge', bonus: ['in'], specialization: 'none' },

  { id: 'locks', categoryId: 'technical', bonus: ['ag'], specialization: 'none' },
  { id: 'mechanics@construction', categoryId: 'technical', bonus: ['me'], specialization: 'none' },
  { id: 'mechanics@operation', categoryId: 'technical', bonus: ['me'], specialization: 'none' },
  { id: 'mechanics@repair', categoryId: 'technical', bonus: ['me'], specialization: 'none' },
  { id: 'traps', categoryId: 'technical', bonus: ['ag'], specialization: 'none' },

  { id: 'administration@bookkeeper', categoryId: 'vocation', bonus: ['re'], specialization: 'none' },
  { id: 'administration@librarian', categoryId: 'vocation', bonus: ['re'], specialization: 'none' },
  { id: 'administration@officer', categoryId: 'vocation', bonus: ['re'], specialization: 'none' },
  { id: 'administration@manager', categoryId: 'vocation', bonus: ['re'], specialization: 'none' },
  { id: 'administration@quartermaster', categoryId: 'vocation', bonus: ['re'], specialization: 'none' },
  { id: 'administration@seneschal', categoryId: 'vocation', bonus: ['re'], specialization: 'none' },

  { id: 'service@bodyguard', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@bonesetter', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@casino-dealer', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@guardsman', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@guide', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@innkeeper', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@researcher', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@shaman', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@sailor', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@soldier', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@teacher', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'service@valet', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },

  { id: 'trade@blacksmith', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@carpenter', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@farmer', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@fence', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@gambler', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@herdsman', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@hunter', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@merchant', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@miner', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@pirate', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@sailor', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@scribe', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@soldier', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@thief', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@tinker', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@trapper', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
  { id: 'trade@weaver', categoryId: 'vocation', bonus: ['pr'], specialization: 'none' },
];
