import { ApiProperty } from '@nestjs/swagger';
import {
  DIFFICULTY_KEYS,
  type DifficultyKey,
  type HealingTables,
  type HealingType,
  INJURY_SEVERITIES,
  type InjurySeverity,
  type PermanentInjuryRow,
  type RecoveryDaysRow,
  type SeverityThreshold,
  TREATMENT_INJURY_TYPES,
  TREATMENT_PROCEDURES,
  type TreatmentInjuryType,
  type TreatmentProcedure,
} from '../../../domain/value-objects/healing-tables.vo.js';

export class TreatmentDifficultyDto {
  @ApiProperty({ type: String, enum: TREATMENT_PROCEDURES, example: 'stitches' })
  procedure: TreatmentProcedure;

  @ApiProperty({ type: String, enum: TREATMENT_INJURY_TYPES, example: 'cut-burn' })
  injuryType: TreatmentInjuryType;

  @ApiProperty({ type: String, enum: INJURY_SEVERITIES, example: 'light' })
  severity: InjurySeverity;

  @ApiProperty({ type: String, enum: DIFFICULTY_KEYS, description: 'Maneuver difficulty key (Table 5-1)', example: 'm' })
  difficulty: DifficultyKey;
}

export class TreatmentRulesDto {
  @ApiProperty({ description: 'Difficulty steps added on a head injury', example: 1 })
  headDifficultySteps: number;

  @ApiProperty({ description: 'Modifier per point of bleeding when cauterizing', example: -5 })
  cauterizePenaltyPerBleeding: number;

  @ApiProperty({ type: [String], enum: TREATMENT_PROCEDURES, description: 'Procedures that need a bleeding injury' })
  bleedingProcedures: TreatmentProcedure[];

  @ApiProperty({ type: [String], description: 'Locations where a tourniquet applies', example: ['arm', 'leg'] })
  tourniquetLocations: string[];
}

export class HealingTablesDto {
  @ApiProperty({ description: 'Days for a light injury to fade by roll band and injury type', type: [Object] })
  recoveryDays: RecoveryDaysRow[];

  @ApiProperty({ description: 'Recovery days multiplier by severity', type: Object })
  severityMultipliers: Record<InjurySeverity, number>;

  @ApiProperty({ description: 'Recovery days multiplier for head injuries' })
  headMultiplier: number;

  @ApiProperty({ description: 'Severity by penalty magnitude or bleeding per round', type: [Object] })
  severity: SeverityThreshold[];

  @ApiProperty({ description: 'Recovery roll modifier by type of healing', type: Object })
  healingTypeModifiers: Record<HealingType, number>;

  @ApiProperty({ description: 'Bonus to the Medicine roll after a successful Herbalism roll' })
  herbalismBonus: number;

  @ApiProperty({ description: 'Fraction of the penalty that stays permanent by roll band', type: [Object] })
  permanentInjury: PermanentInjuryRow[];

  @ApiProperty({ description: 'Percentage of the maximum hits recovered per rest period' })
  restHpPercentPerPeriod: number;

  @ApiProperty({ description: 'Hours of a rest period' })
  restPeriodHours: number;

  @ApiProperty({ description: 'Days counted per day of complete rest' })
  fullRestDayMultiplier: number;

  @ApiProperty({ description: 'Recovery time multiplier by talent or flaw identifier', type: Object })
  talentMultipliers: Record<string, number>;

  @ApiProperty({
    description: 'Difficulty of each Medicine procedure by injury type and severity; no row means it does not apply',
    type: [TreatmentDifficultyDto],
  })
  treatmentDifficulties: TreatmentDifficultyDto[];

  @ApiProperty({ description: 'Rules over the treatment difficulties', type: TreatmentRulesDto })
  treatmentRules: TreatmentRulesDto;

  static fromEntity(entity: HealingTables): HealingTablesDto {
    return Object.assign(new HealingTablesDto(), entity);
  }
}
