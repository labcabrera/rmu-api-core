import { ApiProperty } from '@nestjs/swagger';
import {
  ALCHEMY_TABLES_ID,
  type AlchemyFailureTable,
  type AlchemyTables,
  type PowerLevel,
  SERENDIPITY_KINDS,
  type Serendipity,
} from '../../../domain/value-objects/alchemy-tables.vo.js';

export class AlchemyFailureRowDto {
  @ApiProperty({ example: 1, description: 'Lowest failure roll of the row' })
  min: number;

  @ApiProperty({ type: Number, nullable: true, example: 10, description: 'Highest failure roll of the row; null has no limit' })
  max: number | null;

  @ApiProperty({ description: 'Result of the row' })
  text: string;

  @ApiProperty({ type: String, enum: SERENDIPITY_KINDS, required: false, description: 'A serendipity result' })
  serendipity?: Serendipity;
}

export class AlchemyFailureTablesDto implements Record<AlchemyFailureTable, AlchemyFailureRowDto[]> {
  @ApiProperty({ type: [AlchemyFailureRowDto] })
  bonus: AlchemyFailureRowDto[];

  @ApiProperty({ type: [AlchemyFailureRowDto], name: 'embedded-entity' })
  'embedded-entity': AlchemyFailureRowDto[];

  @ApiProperty({ type: [AlchemyFailureRowDto] })
  general: AlchemyFailureRowDto[];

  @ApiProperty({ type: [AlchemyFailureRowDto], name: 'independent-entity' })
  'independent-entity': AlchemyFailureRowDto[];

  @ApiProperty({ type: [AlchemyFailureRowDto] })
  intelligence: AlchemyFailureRowDto[];

  @ApiProperty({ type: [AlchemyFailureRowDto] })
  location: AlchemyFailureRowDto[];

  @ApiProperty({ type: [AlchemyFailureRowDto] })
  organism: AlchemyFailureRowDto[];

  @ApiProperty({ type: [AlchemyFailureRowDto] })
  potion: AlchemyFailureRowDto[];

  @ApiProperty({ type: [AlchemyFailureRowDto], name: 'power-enhancer' })
  'power-enhancer': AlchemyFailureRowDto[];

  @ApiProperty({ type: [AlchemyFailureRowDto], name: 'spell-power' })
  'spell-power': AlchemyFailureRowDto[];
}

export class PowerLevelsDto implements Record<PowerLevel, number> {
  @ApiProperty({ example: 1.5 })
  average: number;

  @ApiProperty({ example: 1 })
  superior: number;

  @ApiProperty({ example: 0.75 })
  heroic: number;

  @ApiProperty({ example: 0.5 })
  legendary: number;

  @ApiProperty({ example: 0.3 })
  epic: number;
}

export class AlchemyTablesDto {
  @ApiProperty({ type: String, enum: [ALCHEMY_TABLES_ID], example: ALCHEMY_TABLES_ID })
  id: typeof ALCHEMY_TABLES_ID;

  @ApiProperty({ type: AlchemyFailureTablesDto, description: 'The ten failure tables, each with its rows sorted by min' })
  failureTables: AlchemyFailureTablesDto;

  @ApiProperty({ type: PowerLevelsDto, description: 'Multiplier of the cost in the market value, by power level' })
  powerLevels: PowerLevelsDto;

  @ApiProperty({ example: 1, description: 'Bumped by the import when the tables change' })
  version: number;

  static fromEntity(entity: AlchemyTables): AlchemyTablesDto {
    return Object.assign(new AlchemyTablesDto(), entity);
  }
}
