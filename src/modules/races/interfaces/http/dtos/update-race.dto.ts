import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RaceResistancesDto } from './race-resistances.dto';
import { RaceStatsDto } from './race-stats.dto';
import { SexBasedAttributeDto } from './sex-based-attribute.dto';
import { UpdateRaceCommand } from 'src/modules/races/application/cqrs/commands/update-race.command';
import { RaceTraitDto } from './race-trait.dto';
import { Type } from 'class-transformer';
import { NamedEntityDto } from 'src/modules/shared/interfaces/http/dto/named-entity.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRaceDto {
  @ApiProperty({ description: 'Name of the race', example: 'Elf', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Archetype of the race', example: 'wood-elf', required: false })
  @IsString()
  @IsOptional()
  archetype?: string;

  @ApiProperty({ description: 'Realm of the race', type: NamedEntityDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => NamedEntityDto)
  realm?: NamedEntityDto;

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
  resistances?: RaceResistancesDto;

  @ApiProperty({ description: 'Average height by sex', required: false, type: Object })
  @IsOptional()
  averageHeight?: SexBasedAttributeDto;

  @ApiProperty({ description: 'Average weight by sex', required: false, type: Object })
  @IsOptional()
  averageWeight?: SexBasedAttributeDto;

  @ApiProperty({ description: 'Stride bonus for the race', required: false })
  @IsOptional()
  strideBonus?: number;

  @ApiProperty({ description: 'Endurance bonus for the race', required: false })
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

  @ApiProperty({ description: 'Default language of the race', type: NamedEntityDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => NamedEntityDto)
  defaultLanguage?: NamedEntityDto;

  @ApiProperty({ description: 'List of talents identifiers', type: [String], required: false })
  @IsArray()
  @IsOptional()
  talents?: string[];

  @ApiProperty({ description: 'List of race traits', type: [RaceTraitDto], required: false })
  @IsArray()
  @IsOptional()
  traits?: RaceTraitDto[];

  @ApiProperty({ description: 'Description of the race', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Image URL of the race', required: false, example: 'https://example.com/images/races/elf.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

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
      NamedEntityDto.toEntity(dto.defaultLanguage),
      dto.talents,
      dto.traits?.map(RaceTraitDto.toEntity),
      dto.description,
      dto.imageUrl,
      userId,
      roles,
    );
  }
}
