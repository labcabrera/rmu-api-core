import type { DifficultyKey } from '../../../healing-tables/domain/value-objects/healing-tables.vo.js';

/** Id of the guide with the general difficulty scale, returned for skills without their own examples. */
export const GENERAL_GUIDE_ID = 'general';

export interface LocalizedText {
  en: string;
  es?: string;
}

export interface DifficultyExample {
  difficulty: DifficultyKey;
  text: LocalizedText;
}

/**
 * Example difficulties of a skill (Character Companion, ch. 2, spec 037), from the rulebook: imported with
 * data/scripts/import-skill-difficulties.js and never edited through the API.
 */
export interface SkillDifficultyGuide {
  /** The skill id, or `general` for the general scale. */
  skillId: string;
  /** What the examples are about when the book says it (e.g. Spell Mastery). */
  context?: LocalizedText;
  /** The skill whose examples this one repeats (the Adrenal skills). */
  sharedWith?: string;
  examples: DifficultyExample[];
  /** True when the skill has no examples and the general scale is returned in its place. */
  fallback?: boolean;
}
