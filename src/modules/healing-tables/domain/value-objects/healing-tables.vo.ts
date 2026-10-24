/** Injury types with a recovery column. 'unknown' has none: the injury type must be set before rolling. */
export type RecoveryInjuryType = 'bone' | 'cut-burn' | 'muscle-tendon' | 'organ' | 'poison-disease' | 'skin-tissue';
export type InjurySeverity = 'light' | 'medium' | 'severe';
export type HealingType = 'none' | 'medicine' | 'medicine-absolute' | 'magic-or-herbs' | 'magic-and-herbs';

/** Injury types of the treatment difficulties: the recovery columns plus 'unknown' (bleeding control only). */
export const TREATMENT_INJURY_TYPES = ['bone', 'cut-burn', 'muscle-tendon', 'organ', 'poison-disease', 'skin-tissue', 'unknown'] as const;
export type TreatmentInjuryType = (typeof TREATMENT_INJURY_TYPES)[number];

/** Medicine procedures (§13.1), with the ids of rmu-api-strategic and rmu-api-tactical. */
export const TREATMENT_PROCEDURES = [
  'pressure',
  'stitches',
  'tourniquet',
  'cauterize',
  'dress',
  'splint',
  'cast',
  'salve',
  'surgery',
] as const;
export type TreatmentProcedure = (typeof TREATMENT_PROCEDURES)[number];

/** Maneuver difficulty keys (Table 5-1), from the easiest to the hardest. */
export const DIFFICULTY_KEYS = ['c', 's', 'r', 'e', 'l', 'm', 'h', 'vh', 'xh', 'sf', 'a', 'ni'] as const;
export type DifficultyKey = (typeof DIFFICULTY_KEYS)[number];

export const INJURY_SEVERITIES: InjurySeverity[] = ['light', 'medium', 'severe'];

/** Roll band (bounds included, null is open) with the days a light injury needs to fade, by injury type. */
export interface RecoveryDaysRow {
  min: number | null;
  max: number | null;
  days: Record<RecoveryInjuryType, number>;
}

/** Severity by penalty magnitude or bleeding per round (null is open). */
export interface SeverityThreshold {
  severity: InjurySeverity;
  maxPenalty: number | null;
  maxBleeding: number | null;
}

/** Roll band with the fraction of the injury penalty that stays permanent. */
export interface PermanentInjuryRow {
  min: number | null;
  max: number | null;
  result: string;
  fraction: number;
}

/**
 * Difficulty of a Medicine procedure on an injury of a type and severity. A procedure without a row for the injury
 * does not apply to it (stitches on a severe wound, for instance).
 */
export interface TreatmentDifficulty {
  procedure: TreatmentProcedure;
  injuryType: TreatmentInjuryType;
  severity: InjurySeverity;
  difficulty: DifficultyKey;
}

/** Rules applied over the treatment difficulties instead of extra rows. */
export interface TreatmentRules {
  /** Difficulty steps added to any Medicine maneuver on a head injury. */
  headDifficultySteps: number;
  /** Modifier per point of bleeding when cauterizing (negative). */
  cauterizePenaltyPerBleeding: number;
  /** Procedures that only apply to a bleeding injury, whatever its type. */
  bleedingProcedures: TreatmentProcedure[];
  /** Locations where a tourniquet can be applied. */
  tourniquetLocations: string[];
}

/**
 * Healing tables. The values come from the rulebook and are imported from the gitignored data directory
 * (data/core-law/healing-tables.json), never written in code.
 */
export interface HealingTables {
  recoveryDays: RecoveryDaysRow[];
  severityMultipliers: Record<InjurySeverity, number>;
  headMultiplier: number;
  severity: SeverityThreshold[];
  healingTypeModifiers: Record<HealingType, number>;
  herbalismBonus: number;
  permanentInjury: PermanentInjuryRow[];
  restHpPercentPerPeriod: number;
  restPeriodHours: number;
  fullRestDayMultiplier: number;
  talentMultipliers: Record<string, number>;
  treatmentDifficulties: TreatmentDifficulty[];
  treatmentRules: TreatmentRules;
}
