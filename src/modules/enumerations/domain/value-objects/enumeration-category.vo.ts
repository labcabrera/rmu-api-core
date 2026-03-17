export const ENUMERATION_CATEGORIES = [
  'race-archetype',
  'none',
  'animal-type',
  'creature-lore',
  'historic-lore',
  'material-lore',
  'environment',
  'vehicle',
  'race',
  'region',
  'religion',
  'language',
  'music-instrument',
  'influence-type',
  'directed-spell',
  'combat-skill',
] as const;

export type EnumerationCategory = (typeof ENUMERATION_CATEGORIES)[number];
