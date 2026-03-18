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
  'melee-weapon-type',
  'ranged-weapon-type',
  'skill-directed-spell',
  'skill-culinary',
  'skill-fabric-craft',
  'skill-administration',
  'skill-trade',
  'skill-service',
  'skill-mechanics',
  'skill-influence',
  'skill-music',
] as const;

export type EnumerationCategory = (typeof ENUMERATION_CATEGORIES)[number];
