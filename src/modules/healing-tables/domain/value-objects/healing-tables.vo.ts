/** Injury types with a recovery column. 'unknown' has none: the injury type must be set before rolling. */
export type RecoveryInjuryType = 'bone' | 'cut-burn' | 'muscle-tendon' | 'organ' | 'poison-disease' | 'skin-tissue';
export type InjurySeverity = 'light' | 'medium' | 'severe';
export type HealingType = 'none' | 'medicine' | 'medicine-absolute' | 'magic-or-herbs' | 'magic-and-herbs';

/** Injury types of the treatment difficulties: the recovery columns plus 'unknown' (bleeding control only). */
export const TREATMENT_INJURY_TYPES = ['bone', 'cut-burn', 'muscle-tendon', 'organ', 'poison-disease', 'skin-tissue', 'unknown'] as const;
export type TreatmentInjuryType = (typeof TREATMENT_INJURY_TYPES)[number];

/**
 * Medicine procedures (§13.1), with the ids of rmu-api-strategic and rmu-api-tactical. 'magic', 'herbs' and
 * 'stabilize' (system shock) have a duration but no difficulty rows.
 */
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
  'magic',
  'herbs',
  'stabilize',
] as const;
export type TreatmentProcedure = (typeof TREATMENT_PROCEDURES)[number];

/** Maneuver difficulty keys (Table 5-1), from the easiest to the hardest. */
export const DIFFICULTY_KEYS = ['c', 's', 'r', 'e', 'l', 'm', 'h', 'vh', 'xh', 'sf', 'a', 'ni'] as const;
export type DifficultyKey = (typeof DIFFICULTY_KEYS)[number];

export const INJURY_SEVERITIES: InjurySeverity[] = ['light', 'medium', 'severe'];

/** Movement paces (Table 5-3), from the slowest to the fastest. */
export const PACES = ['creep', 'walk', 'jog', 'run', 'sprint', 'dash'] as const;
export type Pace = (typeof PACES)[number];

/** Result of an absolute maneuver. */
export const MANEUVER_RESULTS = ['absolute-failure', 'failure', 'partial-success', 'success', 'absolute-success'] as const;
export type ManeuverResult = (typeof MANEUVER_RESULTS)[number];

/** What a cauterization does to the bleeding of the wound. */
export const CAUTERIZATION_BLEEDING = ['unchanged', 'halved', 'stopped'] as const;
export type CauterizationBleeding = (typeof CAUTERIZATION_BLEEDING)[number];

/** Severity of a critical (A-E). */
export const CRITICAL_SEVERITIES = ['A', 'B', 'C', 'D', 'E'] as const;
export type CriticalSeverity = (typeof CRITICAL_SEVERITIES)[number];

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

/** Rounds a procedure takes in tactical combat. */
export interface TreatmentDuration {
  procedure: TreatmentProcedure;
  /** Null when the procedure is not offered in tactical combat. */
  rounds: number | null;
  /** The rounds are multiplied by the bleeding of the wound. */
  perBleeding: boolean;
}

/** Roll band (bounds included, null is open) of a cauterization and what it does. */
export interface CauterizationRow {
  min: number | null;
  max: number | null;
  result: ManeuverResult;
  bleeding: CauterizationBleeding;
  /** Severity of the Heat critical the patient takes, null for none. */
  heatSeverity: CriticalSeverity | null;
  /** Number of d10 hits the patient takes. */
  hitsDice: number;
}

/** An injury type and severity that only surgery (or magic) can treat. */
export interface SurgeryRequirement {
  injuryType: RecoveryInjuryType;
  severity: InjurySeverity;
}

/** What a treated limb is limited to. */
export interface TreatmentLimits {
  splint: {
    leg: { pace: Pace };
    arm: { limbUnusable: boolean };
  };
  cast: {
    /** Fastest pace on a leg: alone, with a cane or with crutches. */
    leg: { pace: Pace; cane: Pace; crutches: Pace };
    /** Factor applied to the maneuver penalty of the injury (not to the recovery). */
    maneuverPenaltyFactor: number;
  };
}

/** How long a tourniquet stays tight before it must be loosened. */
export interface TourniquetRules {
  loosenEveryRounds: number;
  /** Rounds past the limit before the limb is lost. */
  graceRounds: number;
}

/** Keeping a character in system shock alive, one roll per round. */
export interface StabilizeRules {
  difficulty: DifficultyKey;
  /** Rounds of life gained on a success. */
  successRounds: number;
  /** Rounds of life gained on an absolute success. */
  absoluteRounds: number;
}

/** Range of the recovery modifier a salve gives. */
export interface SalveModifierRange {
  min: number;
  max: number;
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
  /** Rounds of each procedure in tactical combat (spec 068); empty for tables imported before. */
  treatmentDurations: TreatmentDuration[];
  /** Table 13-1c by roll band; empty for tables imported before. */
  cauterization: CauterizationRow[];
  /** Unmodified roll of the cauterization unusual event. */
  cauterizationUnusualRoll: number | null;
  surgeryRequired: SurgeryRequirement[];
  treatmentLimits: TreatmentLimits | null;
  tourniquet: TourniquetRules | null;
  stabilize: StabilizeRules | null;
  salveModifier: SalveModifierRange | null;
  /** Action points of using a healing item in combat. */
  combatItemAp: number | null;
}
