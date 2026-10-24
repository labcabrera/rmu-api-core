/** Failure severity of a resistance roll (Table 5-6), from the mildest to the worst. */
export const FAILURE_SEVERITIES = ['mild', 'moderate', 'severe', 'extreme'] as const;
export type FailureSeverity = (typeof FAILURE_SEVERITIES)[number];

/** Result of a failed resistance roll (Table 5-6). */
export const RESISTANCE_RESULTS = ['mild-failure', 'moderate-failure', 'severe-failure', 'extreme-failure'] as const;
export type ResistanceResult = (typeof RESISTANCE_RESULTS)[number];

/** State of a character who failed a fear RR (§14.3), from the mildest to the worst. */
export const FEAR_RESULTS = ['balk', 'retreat', 'routed', 'broken'] as const;
export type FearResult = (typeof FEAR_RESULTS)[number];

/** Result of an absolute maneuver (morale and rally tables). */
export const MANEUVER_RESULTS = ['absolute-failure', 'failure', 'partial-success', 'success', 'absolute-success'] as const;
export type ManeuverResult = (typeof MANEUVER_RESULTS)[number];

/** What a follower does after a morale roll (Table 14-3b). */
export const MORALE_OUTCOMES = ['refuses-hostile', 'refuses', 'needs-clarification', 'obeys', 'inspired'] as const;
export type MoraleOutcome = (typeof MORALE_OUTCOMES)[number];

/** Kinds of resistance roll, each with the stat of its bonus (Table 5-6). */
export const RESISTANCE_KINDS = ['physical', 'fear', 'channeling', 'essence', 'mentalism'] as const;
export type ResistanceKind = (typeof RESISTANCE_KINDS)[number];

/** A situation and its fright level, the attack level of the fear RR (Table 14-3a). */
export interface FrightLevel {
  key: string;
  level: number;
}

/** Failure margin band (bounds included, null is open) of a fear RR and the fear state it causes. */
export interface FearResultRow {
  min: number | null;
  max: number | null;
  severity: FailureSeverity;
  result: FearResult;
  /** Modifier to rally a character in this state. */
  rallyModifier: number;
}

/** Roll band of the morale maneuver (Table 14-3b). */
export interface MoraleRow {
  min: number | null;
  max: number | null;
  result: ManeuverResult;
  outcome: MoraleOutcome;
  /** Modifier to the later morale rolls of the leader with this follower (0 for none). */
  moraleModifier: number;
  /** Days the modifier lasts; null when it lasts until the game master lifts it. */
  moraleModifierDays: number | null;
}

/** Unusual event of the morale maneuver (unmodified roll). */
export interface MoraleUnusualEvent {
  roll: number;
  outcome: string;
}

/** Roll band of the rally maneuver (Table 14-3c). */
export interface RallyRow {
  min: number | null;
  max: number | null;
  result: ManeuverResult;
  /** Steps the fear state moves: negative calms down (below balk ends the fear), positive makes it worse. */
  fearSeverityChange: number;
}

/** Unusual event of the rally maneuver (unmodified roll): a bonus for the leader himself. */
export interface RallyUnusualEvent {
  roll: number;
  outcome: string;
  leaderFearRrBonus: number;
  leaderHits: number;
  durationDays: number;
}

/** Rallying several followers at once: `modifier` for every `followersPerStep` followers, rounded up. */
export interface RallyGroupModifier {
  followersPerStep: number;
  modifier: number;
}

/** Failure margin band of a resistance roll (Table 5-6). */
export interface ResistanceRow {
  min: number | null;
  max: number | null;
  result: ResistanceResult;
  severity: FailureSeverity;
}

/** How the resistance roll total is built (Table 5-6) and the number it has to reach. */
export interface ResistanceRollRules {
  /** Total to reach when there is no caster or opposing roll. */
  requiredTotal: number;
  /** Multiplier of the attack level (negative). */
  attackLevelMultiplier: number;
  /** Multiplier of the target level. */
  targetLevelMultiplier: number;
  /** Bonus against the target's own realm. */
  ownRealmBonus: number;
  /** Stat of the bonus of each kind of RR. */
  stats: Record<ResistanceKind, string>;
  /** Injury and fatigue penalties do not apply to fear RRs. */
  fearIgnoresInjuryPenalties: boolean;
}

/**
 * Psychology tables (fear, morale, rally) and the resistance roll table. The values come from the rulebook and are
 * imported from the gitignored data directory (data/core-law/psychology-tables.json), never written in code.
 */
export interface PsychologyTables {
  frightLevels: FrightLevel[];
  frightLevelModifiers: FrightLevel[];
  fearResults: FearResultRow[];
  morale: MoraleRow[];
  moraleUnusualEvent: MoraleUnusualEvent;
  rally: RallyRow[];
  rallyUnusualEvent: RallyUnusualEvent;
  rallyGroupModifier: RallyGroupModifier;
  resistance: ResistanceRow[];
  resistanceRoll: ResistanceRollRules;
}
