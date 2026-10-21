import { ApiProperty } from '@nestjs/swagger';
import type {
  HealingTables,
  HealingType,
  InjurySeverity,
  PermanentInjuryRow,
  RecoveryDaysRow,
  SeverityThreshold,
} from '../../../domain/value-objects/healing-tables.vo';

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

  static fromEntity(entity: HealingTables): HealingTablesDto {
    return Object.assign(new HealingTablesDto(), entity);
  }
}
