/** Injury types with a recovery column. 'unknown' has none: the injury type must be set before rolling. */
export type RecoveryInjuryType = 'bone' | 'cut-burn' | 'muscle-tendon' | 'organ' | 'poison-disease' | 'skin-tissue';
export type InjurySeverity = 'light' | 'medium' | 'severe';
export type HealingType = 'none' | 'medicine' | 'medicine-absolute' | 'magic-or-herbs' | 'magic-and-herbs';

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
}
