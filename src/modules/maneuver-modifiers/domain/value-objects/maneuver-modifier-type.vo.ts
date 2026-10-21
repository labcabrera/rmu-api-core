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

/** Skills and skill categories a modifier applies to. */
export interface ManeuverModifierScope {
  skillIds?: string[];
  categoryIds?: string[];
}
