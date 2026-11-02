/** Poison categories of Core Law §15.6 (Table 15-6a). Irritants have no general effects and no rows. */
export const POISON_CATEGORIES = ['circulatory', 'conversion', 'muscle', 'nerve', 'paralytic', 'reduction', 'respiratory'] as const;
export type PoisonCategory = (typeof POISON_CATEGORIES)[number];

/** Resistance roll failure severities (Table 5-6), from the mildest. */
export const POISON_SEVERITIES = ['mild', 'moderate', 'severe', 'extreme'] as const;
export type PoisonSeverity = (typeof POISON_SEVERITIES)[number];

export const TIME_UNITS = ['round', 'minute', 'hour', 'day'] as const;
export type TimeUnit = (typeof TIME_UNITS)[number];

/** State a severity leaves the victim in: coma is a long unconsciousness, dead ends the poisoning. */
export const POISON_CONDITIONS = ['unconscious', 'coma', 'paralyzed', 'incapacitated', 'dead'] as const;
export type PoisonCondition = (typeof POISON_CONDITIONS)[number];

/** Inclusive range of a roll, e.g. 1-50 rounds. */
export interface TimeRange {
  min: number;
  max: number;
  unit: TimeUnit;
}

export interface ValueRange {
  min: number;
  max: number;
}

/**
 * General effects of one severity of a poison category. Penalties are negative; a range (-10 to -50) is rolled when
 * the severity starts. A null duration lasts until the poisoning is cured (or kills).
 */
export interface PoisonSeverityRow {
  category: PoisonCategory;
  severity: PoisonSeverity;
  /** Onset, counted from the exposure */
  start: TimeRange;
  duration: TimeRange | null;
  penalty: ValueRange | null;
  hitsPerRound: ValueRange | null;
  /** Rounds the hits per round last; null until the victim falls unconscious */
  hitsRounds: ValueRange | null;
  condition: PoisonCondition | null;
  /** Delay between the onset and the condition; null is immediate */
  conditionDelay: TimeRange | null;
  /** How long the condition lasts; null until the poisoning ends */
  conditionDuration: TimeRange | null;
  /** The penalty does not heal (permanent nerve damage) */
  permanent: boolean;
}

/**
 * Poison tables. The values come from the rulebook and are imported from the gitignored data directory
 * (data/core-law/poison-tables.json), never written in code.
 */
export interface PoisonTables {
  rows: PoisonSeverityRow[];
}
