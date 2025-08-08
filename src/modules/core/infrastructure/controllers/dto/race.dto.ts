import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRaceCommand } from 'src/modules/core/application/commands/create-race.command';
import { Race } from 'src/modules/core/domain/entities/race';

export class RaceStatBonusDto {
  @ApiProperty({ description: 'Agility bonus', example: 5 })
  @IsNumber()
  ag: number;

  @ApiProperty({ description: 'Constitution bonus', example: 0 })
  @IsNumber()
  co: number;

  @ApiProperty({ description: 'Empathy bonus', example: 0 })
  @IsNumber()
  em: number;

  @ApiProperty({ description: 'Intelligence bonus', example: 5 })
  @IsNumber()
  in: number;

  @ApiProperty({ description: 'Mental endurance bonus', example: 0 })
  @IsNumber()
  me: number;

  @ApiProperty({ description: 'Physical prowess bonus', example: 5 })
  @IsNumber()
  pr: number;

  @ApiProperty({ description: 'Quickness bonus', example: 5 })
  @IsNumber()
  qu: number;

  @ApiProperty({ description: 'Resistance bonus', example: 5 })
  @IsNumber()
  re: number;

  @ApiProperty({ description: 'Stealth bonus', example: 5 })
  @IsNumber()
  sd: number;

  @ApiProperty({ description: 'Strength bonus', example: 5 })
  @IsNumber()
  st: number;
}

export class RaceResistancesDto {
  @ApiProperty({ description: 'Channeling resistance', example: 0 })
  @IsNumber()
  channeling: number;

  @ApiProperty({ description: 'Mentalism resistance', example: 0 })
  @IsNumber()
  mentalism: number;

  @ApiProperty({ description: 'Essence resistance', example: 10 })
  @IsNumber()
  essence: number;

  @ApiProperty({ description: 'Physical resistance', example: 0 })
  @IsNumber()
  physical: number;
}

export class SexBasedAttributeDto {
  @ApiProperty({ description: 'Average height for males', example: 180 })
  @IsNumber()
  male: number;

  @ApiProperty({ description: 'Average height for females', example: 170 })
  @IsNumber()
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
  description?: string;

  static fromEntity(entity: Race): RaceDto {
    const dto = new RaceDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.realm = entity.realm;
    dto.size = entity.size;
    dto.defaultStatBonus = entity.defaultStatBonus;
    dto.resistances = entity.resistances;
    dto.averageHeight = entity.averageHeight;
    dto.averageWeight = entity.averageWeight;
    dto.strideBonus = entity.strideBonus;
    dto.enduranceBonus = entity.enduranceBonus;
    dto.recoveryMultiplier = entity.recoveryMultiplier;
    dto.baseHits = entity.baseHits;
    dto.bonusDevPoints = entity.bonusDevPoints;
    dto.description = entity.description;
    return dto;
  }
}

export class CreateRaceDto {
  @ApiProperty({ description: 'Unique identifier for the race', example: 'elf' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Realm of the race', example: 'lotr' })
  @IsString()
  @IsNotEmpty()
  realm: string;

  @ApiProperty({ description: 'Size of the race', example: 'Medium' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ description: 'Default stat bonus for the race' })
  @ValidateNested()
  @Type(() => RaceStatBonusDto)
  defaultStatBonus: RaceStatBonusDto;

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

  @ApiProperty({ description: 'Bonus development points for the race' })
  @IsNumber()
  bonusDevPoints: number;

  @ApiProperty({ description: 'Description of the race' })
  @IsString()
  @IsNotEmpty()
  description: string;

  static toCommand(dto: CreateRaceDto, userId: string, roles: string[]): CreateRaceCommand {
    return new CreateRaceCommand(
      dto.id,
      dto.name,
      dto.realm,
      dto.size,
      dto.defaultStatBonus,
      dto.resistances,
      dto.averageHeight,
      dto.averageWeight,
      dto.strideBonus,
      dto.enduranceBonus,
      dto.recoveryMultiplier,
      dto.baseHits,
      dto.bonusDevPoints,
      dto.description,
      userId,
      roles,
    );
  }
}

export class UpdateRaceDto {
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
