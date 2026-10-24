import { ApiProperty } from '@nestjs/swagger';
import {
  FAILURE_SEVERITIES,
  FEAR_RESULTS,
  type FailureSeverity,
  type FearResult,
  MANEUVER_RESULTS,
  MORALE_OUTCOMES,
  type ManeuverResult,
  type MoraleOutcome,
  type PsychologyTables,
  RESISTANCE_KINDS,
  RESISTANCE_RESULTS,
  type ResistanceKind,
  type ResistanceResult,
} from '../../../domain/value-objects/psychology-tables.vo.js';

export class FrightLevelDto {
  @ApiProperty({ description: 'Situation key', example: 'armed-opponent' })
  key: string;

  @ApiProperty({ description: 'Fright level (attack level of the fear RR), or the level it adds', example: 3 })
  level: number;
}

export class FearResultRowDto {
  @ApiProperty({ type: Number, nullable: true, description: 'Lowest failure margin of the band (null is open)' })
  min: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Highest failure margin of the band (null is open)' })
  max: number | null;

  @ApiProperty({ type: String, enum: FAILURE_SEVERITIES })
  severity: FailureSeverity;

  @ApiProperty({ type: String, enum: FEAR_RESULTS, description: 'Fear state' })
  result: FearResult;

  @ApiProperty({ description: 'Modifier to rally a character in this state', example: -20 })
  rallyModifier: number;
}

export class MoraleRowDto {
  @ApiProperty({ type: Number, nullable: true, description: 'Lowest roll of the band (null is open)' })
  min: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Highest roll of the band (null is open)' })
  max: number | null;

  @ApiProperty({ type: String, enum: MANEUVER_RESULTS })
  result: ManeuverResult;

  @ApiProperty({ type: String, enum: MORALE_OUTCOMES, description: 'What the follower does' })
  outcome: MoraleOutcome;

  @ApiProperty({ description: 'Modifier to the later morale rolls with this follower (0 for none)', example: 0 })
  moraleModifier: number;

  @ApiProperty({ type: Number, nullable: true, description: 'Days the modifier lasts (null: until lifted)' })
  moraleModifierDays: number | null;
}

export class MoraleUnusualEventDto {
  @ApiProperty({ description: 'Unmodified roll', example: 66 })
  roll: number;

  @ApiProperty({ description: 'Outcome key', example: 'misunderstands-order' })
  outcome: string;
}

export class RallyRowDto {
  @ApiProperty({ type: Number, nullable: true, description: 'Lowest roll of the band (null is open)' })
  min: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Highest roll of the band (null is open)' })
  max: number | null;

  @ApiProperty({ type: String, enum: MANEUVER_RESULTS })
  result: ManeuverResult;

  @ApiProperty({ description: 'Steps the fear state moves (negative calms down, positive worsens)', example: -1 })
  fearSeverityChange: number;
}

export class RallyUnusualEventDto {
  @ApiProperty({ description: 'Unmodified roll', example: 66 })
  roll: number;

  @ApiProperty({ description: 'Outcome key', example: 'leader-fired-up' })
  outcome: string;

  @ApiProperty({ description: 'Bonus to the fear RRs of the leader' })
  leaderFearRrBonus: number;

  @ApiProperty({ description: 'Hits the leader gains' })
  leaderHits: number;

  @ApiProperty({ description: 'Days the bonus lasts' })
  durationDays: number;
}

export class RallyGroupModifierDto {
  @ApiProperty({ description: 'Followers per step (rounded up)', example: 10 })
  followersPerStep: number;

  @ApiProperty({ description: 'Modifier per step', example: -10 })
  modifier: number;
}

export class ResistanceRowDto {
  @ApiProperty({ type: Number, nullable: true, description: 'Lowest failure margin of the band (null is open)' })
  min: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Highest failure margin of the band (null is open)' })
  max: number | null;

  @ApiProperty({ type: String, enum: RESISTANCE_RESULTS })
  result: ResistanceResult;

  @ApiProperty({ type: String, enum: FAILURE_SEVERITIES })
  severity: FailureSeverity;
}

export class ResistanceRollRulesDto {
  @ApiProperty({ description: 'Total to reach without a caster or an opposing roll', example: 50 })
  requiredTotal: number;

  @ApiProperty({ description: 'Multiplier of the attack level', example: -2 })
  attackLevelMultiplier: number;

  @ApiProperty({ description: 'Multiplier of the target level', example: 2 })
  targetLevelMultiplier: number;

  @ApiProperty({ description: 'Bonus against the own realm of magic', example: 10 })
  ownRealmBonus: number;

  @ApiProperty({
    description: `Stat of the bonus by kind of RR (${RESISTANCE_KINDS.join(', ')})`,
    type: Object,
    example: { fear: 'sd' },
  })
  stats: Record<ResistanceKind, string>;

  @ApiProperty({ description: 'Injury and fatigue penalties do not apply to fear RRs' })
  fearIgnoresInjuryPenalties: boolean;
}

export class PsychologyTablesDto {
  @ApiProperty({ description: 'Fright levels by situation (Table 14-3a)', type: [FrightLevelDto] })
  frightLevels: FrightLevelDto[];

  @ApiProperty({ description: 'Levels added by supernatural elements (Table 14-3a)', type: [FrightLevelDto] })
  frightLevelModifiers: FrightLevelDto[];

  @ApiProperty({ description: 'Fear state by failure margin of the fear RR', type: [FearResultRowDto] })
  fearResults: FearResultRowDto[];

  @ApiProperty({ description: 'Morale maneuver (Table 14-3b)', type: [MoraleRowDto] })
  morale: MoraleRowDto[];

  @ApiProperty({ type: MoraleUnusualEventDto })
  moraleUnusualEvent: MoraleUnusualEventDto;

  @ApiProperty({ description: 'Rally maneuver (Table 14-3c)', type: [RallyRowDto] })
  rally: RallyRowDto[];

  @ApiProperty({ type: RallyUnusualEventDto })
  rallyUnusualEvent: RallyUnusualEventDto;

  @ApiProperty({ description: 'Modifier for rallying several followers at once', type: RallyGroupModifierDto })
  rallyGroupModifier: RallyGroupModifierDto;

  @ApiProperty({ description: 'Resistance roll result by failure margin (Table 5-6)', type: [ResistanceRowDto] })
  resistance: ResistanceRowDto[];

  @ApiProperty({ description: 'How the resistance roll total is built (Table 5-6)', type: ResistanceRollRulesDto })
  resistanceRoll: ResistanceRollRulesDto;

  static fromEntity(entity: PsychologyTables): PsychologyTablesDto {
    return Object.assign(new PsychologyTablesDto(), entity);
  }
}
