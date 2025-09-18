import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested, IsNumber, IsArray } from 'class-validator';
import { RaceStatBonusDto, SexBasedAttributeDto } from './race.dto';
import { RaceResistancesDto } from './race-resistances.dto';
import { CreateRaceCommand } from 'src/modules/races/application/cqrs/commands/create-race.command';

export class CreateRaceDto {
  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Realm of the race', example: 'lotr' })
  @IsString()
  @IsNotEmpty()
  realmId: string;

  @ApiProperty({ description: 'Size of the race', example: 'Medium' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ description: 'Default stat bonus for the race' })
  @ValidateNested()
  @Type(() => RaceStatBonusDto)
  stats: RaceStatBonusDto;

  @ApiProperty({ description: 'Resistances of the race' })
  @ValidateNested()
  @Type(() => RaceResistancesDto)
  resistances: RaceResistancesDto;

  @ApiProperty({ description: 'Average height of the race by sex' })
  @ValidateNested()
  @Type(() => SexBasedAttributeDto)
  averageHeight: SexBasedAttributeDto;

  @ApiProperty({ description: 'Average weight of the race by sex' })
  @ValidateNested()
  @Type(() => SexBasedAttributeDto)
  averageWeight: SexBasedAttributeDto;

  @ApiProperty({ description: 'Stride bonus for the race' })
  @IsNumber()
  strideBonus: number;

  @ApiProperty({ description: 'Endurance bonus for the race' })
  @IsNumber()
  enduranceBonus: number;

  @ApiProperty({ description: 'Recovery multiplier for the race' })
  @IsNumber()
  recoveryMultiplier: number;

  @ApiProperty({ description: 'Base hits for the race' })
  @IsNumber()
  baseHits: number;

  @ApiProperty({ description: 'Base development points for the race' })
  @IsNumber()
  baseDevPoints: number;

  @ApiProperty({ description: 'Racial armor bonus', example: 1 })
  @IsNumber()
  baseAt: number;

  @ApiProperty({ description: 'Default language', example: 'Common', required: false })
  defaultLanguage?: string;

  @ApiProperty({ description: 'List of talents identifiers for the race' })
  @IsArray()
  @IsString({ each: true })
  talents: string[];

  @ApiProperty({ description: 'Description of the race' })
  @IsString()
  @IsNotEmpty()
  description: string;

  static toCommand(dto: CreateRaceDto, userId: string, roles: string[]): CreateRaceCommand {
    return new CreateRaceCommand(
      dto.name,
      dto.realmId,
      dto.size,
      dto.stats,
      RaceResistancesDto.toEntity(dto.resistances),
      dto.averageHeight,
      dto.averageWeight,
      dto.strideBonus,
      dto.enduranceBonus,
      dto.recoveryMultiplier,
      dto.baseHits,
      dto.baseDevPoints,
      dto.baseAt,
      dto.defaultLanguage,
      dto.talents,
      dto.description,
      userId,
      roles,
    );
  }
}
