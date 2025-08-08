import { ApiProperty } from '@nestjs/swagger';

export interface RaceStatBonusDto {
  ag: number;
  co: number;
  em: number;
  in: number;
  me: number;
  pr: number;
  qu: number;
  re: number;
  sd: number;
  st: number;
}

export interface RaceResistancesDto {
  channeling: number;
  mentalism: number;
  essence: number;
  physical: number;
}

export interface SexBasedAttributeDto {
  male: number;
  female: number;
}

export class RaceDto {
  @ApiProperty({ description: 'Unique identifier for the race', example: 'elf' })
  id: string;

  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  name: string;

  @ApiProperty({ description: 'Realm of the race', example: 'lotr' })
  realm: string;

  @ApiProperty({ description: 'Size of the race', example: 'Medium' })
  size: string;

  @ApiProperty({ description: 'Default stat bonus for the race' })
  defaultStatBonus: RaceStatBonusDto;

  @ApiProperty({ description: 'Resistances of the race' })
  resistances: RaceResistancesDto;

  @ApiProperty({ description: 'Average height of the race by sex' })
  averageHeight: SexBasedAttributeDto;

  @ApiProperty({ description: 'Average weight of the race by sex' })
  averageWeight: SexBasedAttributeDto;

  @ApiProperty({ description: 'Stride bonus for the race' })
  strideBonus: number;

  @ApiProperty({ description: 'Endurance bonus for the race' })
  enduranceBonus: number;

  @ApiProperty({ description: 'Recovery multiplier for the race' })
  recoveryMultiplier: number;

  @ApiProperty({ description: 'Base hits for the race' })
  baseHits: number;

  @ApiProperty({ description: 'Bonus development points for the race' })
  bonusDevPoints: number;

  @ApiProperty({ description: 'Description of the race' })
  description: string;
}

export interface UpdateRaceRequest {
  name?: string;
  realm?: string;
  size?: string;
  defaultStatBonus?: RaceStatBonusDto;
  resistances?: RaceResistancesDto;
  averageHeight?: SexBasedAttributeDto;
  averageWeight?: SexBasedAttributeDto;
  strideBonus?: number;
  enduranceBonus?: number;
  recoveryMultiplier?: number;
  baseHits?: number;
  bonusDevPoints?: number;
  description?: string;
}
