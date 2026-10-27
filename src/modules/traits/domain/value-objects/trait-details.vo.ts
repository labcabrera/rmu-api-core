/** How a tier of a talent can be acquired (Character Companion 5.0): one of the listed prerequisites per tier. */
export type TraitPrerequisiteType = 'natural' | 'training' | 'milestone' | 'profession' | 'skill' | 'race';

export const TRAIT_PREREQUISITE_TYPES: TraitPrerequisiteType[] = ['natural', 'training', 'milestone', 'profession', 'skill', 'race'];

export interface TraitPrerequisite {
  type: TraitPrerequisiteType;
  /** Ids the prerequisite names: professions (comma separated), a skill or a race. */
  value?: string;
  description?: string;
}

/** Rulebook where the trait is defined. */
export type TraitSource = 'core-law' | 'character-companion';

/** Character Companion data of a talent or flaw (spec 039), all optional. */
export interface TraitDetails {
  /** Training category (combat-expertise, rage, luck…), used by training packages. */
  talentCategory?: string | null;
  prerequisites?: TraitPrerequisite[];
  /** Ids of the flaws that may be taken with the talent. */
  possibleFlaws?: string[];
  source?: TraitSource | null;
}
