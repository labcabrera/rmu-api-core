import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested, IsNumber, IsArray, IsOptional } from 'class-validator';
import { RaceResistancesDto } from './race-resistances.dto';
import { CreateRaceCommand } from 'src/modules/races/application/cqrs/commands/create-race.command';
import { RaceStatsDto } from './race-stats.dto';
import { SexBasedAttributeDto } from './sex-based-attribute.dto';
import { RaceTraitDto } from './race-trait.dto';
import { NamedEntityDto } from 'src/modules/shared/interfaces/http/dto/named-entity.dto';

export class CreateRaceDto {
  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Archetype of the race', example: 'wood-elf' })
  @IsString()
  @IsNotEmpty()
  archetype: string;

  @ApiProperty({ description: 'Realm of the race', example: 'lotr' })
  @IsString()
  @IsNotEmpty()
  realmId: string;

  @ApiProperty({ description: 'Size of the race', example: 'Medium' })
  @IsString()
  @IsNotEmpty()
  sizeId: string;

  @ApiProperty({ description: 'Default stat bonus for the race' })
  @ValidateNested()
  @Type(() => RaceStatsDto)
  stats: RaceStatsDto;

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

  @ApiProperty({ description: 'Default language', required: false, type: NamedEntityDto })
  @ValidateNested()
  @Type(() => NamedEntityDto)
  defaultLanguage?: NamedEntityDto;

  @ApiProperty({ description: 'List of talents identifiers for the race' })
  @IsArray()
  @IsString({ each: true })
  talents: string[];

  @ApiProperty({ description: 'List of traits associated with the race', type: [RaceTraitDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RaceTraitDto)
  traits: RaceTraitDto[];

  @ApiProperty({ description: 'Description of the race' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  @ApiProperty({ description: 'Image URL of the race', required: false, example: 'https://example.com/images/races/elf.jpg' })
  @IsString()
  @IsOptional()
  imageUrl: string | undefined;

  static toCommand(dto: CreateRaceDto, userId: string, roles: string[]): CreateRaceCommand {
    return new CreateRaceCommand(
      dto.name,
      dto.archetype,
      dto.realmId,
      dto.sizeId,
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
      NamedEntityDto.toEntity(dto.defaultLanguage),
      dto.talents,
      dto.traits.map(RaceTraitDto.toEntity),
      dto.description,
      dto.imageUrl,
      userId,
      roles,
    );
  }
}
