import { ApiProperty } from '@nestjs/swagger';
import {
  POISON_CATEGORIES,
  POISON_CONDITIONS,
  POISON_SEVERITIES,
  type PoisonCategory,
  type PoisonCondition,
  type PoisonSeverity,
  type PoisonTables,
  TIME_UNITS,
  type TimeUnit,
} from '../../../domain/value-objects/poison-tables.vo.js';

export class TimeRangeDto {
  @ApiProperty({ example: 1 })
  min: number;

  @ApiProperty({ example: 50 })
  max: number;

  @ApiProperty({ type: String, enum: TIME_UNITS, example: 'round' })
  unit: TimeUnit;
}

export class ValueRangeDto {
  @ApiProperty({ example: -50 })
  min: number;

  @ApiProperty({ example: -10 })
  max: number;
}

export class PoisonSeverityRowDto {
  @ApiProperty({ type: String, enum: POISON_CATEGORIES, example: 'circulatory' })
  category: PoisonCategory;

  @ApiProperty({ type: String, enum: POISON_SEVERITIES, example: 'mild' })
  severity: PoisonSeverity;

  @ApiProperty({ type: TimeRangeDto, description: 'Onset, counted from the exposure' })
  start: TimeRangeDto;

  @ApiProperty({ type: TimeRangeDto, nullable: true, description: 'Null lasts until the poisoning is cured' })
  duration: TimeRangeDto | null;

  @ApiProperty({ type: ValueRangeDto, nullable: true, description: 'Penalty (negative), rolled when the severity starts' })
  penalty: ValueRangeDto | null;

  @ApiProperty({ type: ValueRangeDto, nullable: true, description: 'Hits lost each round' })
  hitsPerRound: ValueRangeDto | null;

  @ApiProperty({ type: ValueRangeDto, nullable: true, description: 'Rounds the hits per round last; null until unconscious' })
  hitsRounds: ValueRangeDto | null;

  @ApiProperty({ type: String, enum: POISON_CONDITIONS, nullable: true })
  condition: PoisonCondition | null;

  @ApiProperty({ type: TimeRangeDto, nullable: true, description: 'Delay between the onset and the condition' })
  conditionDelay: TimeRangeDto | null;

  @ApiProperty({ type: TimeRangeDto, nullable: true, description: 'How long the condition lasts' })
  conditionDuration: TimeRangeDto | null;

  @ApiProperty({ description: 'The penalty does not heal' })
  permanent: boolean;
}

export class PoisonTablesDto {
  @ApiProperty({ type: [PoisonSeverityRowDto], description: 'General effects by poison category and severity' })
  rows: PoisonSeverityRowDto[];

  static fromEntity(entity: PoisonTables): PoisonTablesDto {
    return Object.assign(new PoisonTablesDto(), entity);
  }
}
