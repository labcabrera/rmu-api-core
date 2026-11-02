import { ApiProperty } from '@nestjs/swagger';
import {
  CAUTERIZATION_BLEEDING,
  CRITICAL_SEVERITIES,
  type CauterizationBleeding,
  type CriticalSeverity,
  DIFFICULTY_KEYS,
  type DifficultyKey,
  type HealingTables,
  type HealingType,
  INJURY_SEVERITIES,
  type InjurySeverity,
  MANEUVER_RESULTS,
  type ManeuverResult,
  PACES,
  type Pace,
  type PermanentInjuryRow,
  type RecoveryDaysRow,
  type SeverityThreshold,
  type RecoveryInjuryType,
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

export class TreatmentDurationDto {
  @ApiProperty({ type: String, enum: TREATMENT_PROCEDURES, example: 'tourniquet' })
  procedure: TreatmentProcedure;

  @ApiProperty({ type: Number, nullable: true, description: 'Rounds in tactical combat; null: not offered there', example: 2 })
  rounds: number | null;

  @ApiProperty({ description: 'The rounds are multiplied by the bleeding of the wound', example: false })
  perBleeding: boolean;
}

export class CauterizationRowDto {
  @ApiProperty({ type: Number, nullable: true, description: 'Lowest roll of the band (null is open)' })
  min: number | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Highest roll of the band (null is open)' })
  max: number | null;

  @ApiProperty({ type: String, enum: MANEUVER_RESULTS })
  result: ManeuverResult;

  @ApiProperty({ type: String, enum: CAUTERIZATION_BLEEDING, description: 'Effect on the bleeding of the wound' })
  bleeding: CauterizationBleeding;

  @ApiProperty({ type: String, enum: CRITICAL_SEVERITIES, nullable: true, description: 'Heat critical taken (null: none)' })
  heatSeverity: CriticalSeverity | null;

  @ApiProperty({ description: 'Number of d10 hits taken', example: 1 })
  hitsDice: number;
}

export class SurgeryRequirementDto {
  @ApiProperty({ type: String, enum: TREATMENT_INJURY_TYPES.filter(t => t !== 'unknown'), example: 'bone' })
  injuryType: RecoveryInjuryType;

  @ApiProperty({ type: String, enum: INJURY_SEVERITIES, example: 'severe' })
  severity: InjurySeverity;
}

export class PaceLimitDto {
  @ApiProperty({ type: String, enum: PACES, description: 'Fastest pace' })
  pace: Pace;
}

export class LimbUnusableDto {
  @ApiProperty({ description: 'The limb cannot be used while treated' })
  limbUnusable: boolean;
}

export class SplintLimitsDto {
  @ApiProperty({ type: PaceLimitDto })
  leg: PaceLimitDto;

  @ApiProperty({ type: LimbUnusableDto })
  arm: LimbUnusableDto;
}

export class CastLegLimitsDto {
  @ApiProperty({ type: String, enum: PACES, description: 'Fastest pace without support' })
  pace: Pace;

  @ApiProperty({ type: String, enum: PACES, description: 'Fastest pace with a cane' })
  cane: Pace;

  @ApiProperty({ type: String, enum: PACES, description: 'Fastest pace with crutches' })
  crutches: Pace;
}

export class CastLimitsDto {
  @ApiProperty({ type: CastLegLimitsDto })
  leg: CastLegLimitsDto;

  @ApiProperty({ description: 'Factor of the maneuver penalty of the injury (not of the recovery)', example: 0.5 })
  maneuverPenaltyFactor: number;
}

export class TreatmentLimitsDto {
  @ApiProperty({ type: SplintLimitsDto })
  splint: SplintLimitsDto;

  @ApiProperty({ type: CastLimitsDto })
  cast: CastLimitsDto;
}

export class TourniquetRulesDto {
  @ApiProperty({ description: 'Rounds a tourniquet stays tight before it must be loosened' })
  loosenEveryRounds: number;

  @ApiProperty({ description: 'Rounds past that limit before the limb is lost' })
  graceRounds: number;
}

export class StabilizeRulesDto {
  @ApiProperty({ type: String, enum: DIFFICULTY_KEYS, description: 'Difficulty of the roll made each round' })
  difficulty: DifficultyKey;

  @ApiProperty({ description: 'Rounds of life gained on a success' })
  successRounds: number;

  @ApiProperty({ description: 'Rounds of life gained on an absolute success' })
  absoluteRounds: number;
}

export class SalveModifierRangeDto {
  @ApiProperty({ description: 'Lowest recovery modifier of a salve' })
  min: number;

  @ApiProperty({ description: 'Highest recovery modifier of a salve' })
  max: number;
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

  @ApiProperty({ description: 'Rounds of each procedure in tactical combat', type: [TreatmentDurationDto] })
  treatmentDurations: TreatmentDurationDto[];

  @ApiProperty({ description: 'Cauterization result by roll band (Table 13-1c)', type: [CauterizationRowDto] })
  cauterization: CauterizationRowDto[];

  @ApiProperty({ type: Number, nullable: true, description: 'Unmodified roll of the cauterization unusual event' })
  cauterizationUnusualRoll: number | null;

  @ApiProperty({ description: 'Injuries that only surgery or magic can treat', type: [SurgeryRequirementDto] })
  surgeryRequired: SurgeryRequirementDto[];

  @ApiProperty({ description: 'Limits of a splinted or cast limb', type: TreatmentLimitsDto, nullable: true })
  treatmentLimits: TreatmentLimitsDto | null;

  @ApiProperty({ description: 'When a tourniquet must be loosened', type: TourniquetRulesDto, nullable: true })
  tourniquet: TourniquetRulesDto | null;

  @ApiProperty({ description: 'Keeping a character in system shock alive', type: StabilizeRulesDto, nullable: true })
  stabilize: StabilizeRulesDto | null;

  @ApiProperty({ description: 'Range of the recovery modifier of a salve', type: SalveModifierRangeDto, nullable: true })
  salveModifier: SalveModifierRangeDto | null;

  @ApiProperty({ type: Number, nullable: true, description: 'Action points of using a healing item in combat' })
  combatItemAp: number | null;

  static fromEntity(entity: HealingTables): HealingTablesDto {
    return Object.assign(new HealingTablesDto(), entity);
  }
}
