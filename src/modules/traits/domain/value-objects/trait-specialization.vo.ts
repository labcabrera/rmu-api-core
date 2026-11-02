export type TraitSpecialization =
  | 'none'
  | 'stat'
  | 'skill'
  | 'combat-skill'
  | 'melee-combat-skill'
  | 'ranged-combat-skill'
  | 'melee-weapon-type'
  | 'ranged-weapon-type'
  | 'spell-list'
  | 'realm'
  | 'elemental-type'
  | 'sense'
  | 'language'
  | 'animal-type'
  | 'skill-category'
  | 'race'
  | 'text';

/** What a talent or flaw is specialized in (null when it has no specialization). */
export const TRAIT_SPECIALIZATIONS: TraitSpecialization[] = [
  'none',
  'stat',
  'skill',
  'combat-skill',
  'melee-combat-skill',
  'ranged-combat-skill',
  'melee-weapon-type',
  'ranged-weapon-type',
  'spell-list',
  'realm',
  'elemental-type',
  'sense',
  'language',
  'animal-type',
  'skill-category',
  'race',
  'text',
];
