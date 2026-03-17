export const ENUMERATION_CATEGORIES = [
  'race-archetype',
  'animal-type',
  'creature-lore',
  'historic-lore',
  'material-lore',
  'environment',
  'vehicle',
  'region',
  'religion',
  'language',
  'music-instrument',
  'influence-type',
  'directed-spell',
  'combat-skill',
  'melee-combat-training-specialization',
  'ranged-combat-training-specialization',
  'culinary-specialization',
] as const;

export type EnumerationCategory = (typeof ENUMERATION_CATEGORIES)[number];
