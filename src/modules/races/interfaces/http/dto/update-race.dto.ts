import { IsArray, IsNumber, IsOptional, IsString, ValidateNested, IsInt, Min, IsNotEmpty, ValidateIf } from 'class-validator';
import { RaceResistancesDto } from './race-resistances.dto.js';
import { RaceStatsDto } from './race-stats.dto.js';
import { SexBasedAttributeDto } from './sex-based-attribute.dto.js';
import { UpdateRaceCommand } from '../../../application/cqrs/commands/update-race.command.js';
import { RaceTraitDto } from './race-trait.dto.js';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRaceDto {
  @ApiProperty({ description: 'Name of the race', example: 'Elf', required: false })
  // Absent keeps the name; null or '' is a 400 (a name cannot be cleared).
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: 'Archetype of the race', example: 'wood-elf', required: false })
  @IsString()
  @IsOptional()
  archetype?: string;

  // A race cannot move to another realm: the realm sync owns its owner and accessType. The field is accepted, because
  // the edit form sends back the whole race, and ignored (it never reaches the command).
  @ApiProperty({ description: 'Ignored: a race cannot move to another realm', required: false, deprecated: true })
  @IsString()
  @IsOptional()
  realmId?: string;

  @ApiProperty({ description: 'Size identifier for the race', example: 'Medium', required: false })
  @IsString()
  @IsOptional()
  sizeId?: string;

  @ApiProperty({ description: 'Default stat bonus for the race', required: false, type: Object })
  @IsOptional()
  @ValidateNested()
  @Type(() => RaceStatsDto)
  stats?: RaceStatsDto;

  @ApiProperty({ description: 'Resistances of the race', required: false, type: Object })
  @IsOptional()
  @ValidateNested()
  @Type(() => RaceResistancesDto)
  resistances?: RaceResistancesDto;

  @ApiProperty({ description: 'Average height by sex', required: false, type: Object })
  @IsOptional()
  @ValidateNested()
  @Type(() => SexBasedAttributeDto)
  averageHeight?: SexBasedAttributeDto;

  @ApiProperty({ description: 'Average weight by sex', required: false, type: Object })
  @IsOptional()
  @ValidateNested()
  @Type(() => SexBasedAttributeDto)
  averageWeight?: SexBasedAttributeDto;

  @ApiProperty({ description: 'Stride bonus for the race', required: false })
  @IsNumber()
  @IsOptional()
  strideBonus?: number;

  @ApiProperty({ description: 'Endurance bonus for the race', required: false })
  @IsNumber()
  @IsOptional()
  enduranceBonus?: number;

  @ApiProperty({ description: 'Recovery multiplier for the race', required: false })
  @IsNumber()
  @IsOptional()
  recoveryMultiplier?: number;

  @ApiProperty({ description: 'Base hits for the race', required: false })
  @IsNumber()
  @IsOptional()
  baseHits?: number;

  @ApiProperty({ description: 'Base development points for the race', required: false })
  @IsNumber()
  @IsOptional()
  baseDevPoints?: number;

  @ApiProperty({ description: 'Racial armor bonus', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  baseAt?: number;

  @ApiProperty({ description: 'List of talents identifiers', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  talents?: string[];

  @ApiProperty({ description: 'List of race traits', type: [RaceTraitDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RaceTraitDto)
  @IsOptional()
  traits?: RaceTraitDto[];

  @ApiProperty({ description: 'Default language identifier of the race', type: String, required: false })
  @IsString()
  @IsOptional()
  defaultLanguage?: string;

  @ApiProperty({ description: 'Description of the race', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Image URL of the race', required: false, example: 'https://example.com/images/races/elf.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Version the client read (from the GET); a different stored version is a 409', required: false, example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;

  static toCommand(id: string, dto: UpdateRaceDto, userId: string, roles: string[]): UpdateRaceCommand {
    return new UpdateRaceCommand(
      id,
      dto.name,
      dto.archetype,
      dto.sizeId,
      dto.stats,
      dto.resistances,
      dto.averageHeight,
      dto.averageWeight,
      dto.strideBonus,
      dto.enduranceBonus,
      dto.recoveryMultiplier,
      dto.baseHits,
      dto.baseDevPoints,
      dto.baseAt,
      dto.talents,
      dto.traits?.map(t => RaceTraitDto.toEntity(t)),
      dto.defaultLanguage,
      dto.description,
      dto.imageUrl,
      userId,
      roles,
      dto.version,
    );
  }
}
