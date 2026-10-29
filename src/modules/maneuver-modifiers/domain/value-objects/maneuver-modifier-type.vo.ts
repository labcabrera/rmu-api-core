export const MANEUVER_MODIFIER_TYPES = ['flag', 'choice', 'number'] as const;

/**
 * - flag: on/off, adds `value` when selected.
 * - choice: one of `options`, adds the value of the selected option.
 * - number: a number of units (between `min` and `max` when given), adds units x `perUnit`.
 */
export type ManeuverModifierType = (typeof MANEUVER_MODIFIER_TYPES)[number];

export interface ManeuverModifierOption {
  key: string;
  value: number;
}

/** Sides of a deal (workspace spec 048): a Trading modifier can apply only to buying or only to selling. */
export const MANEUVER_MODIFIER_CONTEXTS = ['purchase', 'sale'] as const;
export type ManeuverModifierContext = (typeof MANEUVER_MODIFIER_CONTEXTS)[number];

/** Skills and skill categories a modifier applies to, and the contexts it is limited to (every one when missing). */
export interface ManeuverModifierScope {
  skillIds?: string[];
  categoryIds?: string[];
  contexts?: ManeuverModifierContext[];
}
