import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RaceResistancesDto } from './race-resistances.dto';
import { RaceStatsDto } from './race-stats.dto';
import { SexBasedAttributeDto } from './sex-based-attribute.dto';
import { UpdateRaceCommand } from 'src/modules/races/application/cqrs/commands/update-race.command';
import { RaceTraitDto } from './race-trait.dto';
import { Type } from 'class-transformer';
import { NamedEntityDto } from 'src/modules/shared/interfaces/http/dto/named-entity.dto';

export class UpdateRaceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  archetype?: string;

  @IsString()
  @IsOptional()
  realmId?: string;

  @IsString()
  @IsOptional()
  sizeId?: string;

  @IsOptional()
  stats?: RaceStatsDto;

  @IsOptional()
  resistances?: RaceResistancesDto;

  @IsOptional()
  averageHeight?: SexBasedAttributeDto;

  @IsOptional()
  averageWeight?: SexBasedAttributeDto;

  @IsOptional()
  strideBonus?: number;

  @IsOptional()
  enduranceBonus?: number;

  @IsNumber()
  @IsOptional()
  recoveryMultiplier?: number;

  @IsNumber()
  @IsOptional()
  baseHits?: number;

  @IsNumber()
  @IsOptional()
  baseDevPoints?: number;

  @IsNumber()
  @IsOptional()
  baseAt?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => NamedEntityDto)
  defaultLanguage?: NamedEntityDto;

  @IsArray()
  @IsOptional()
  talents?: string[];

  @IsArray()
  @IsOptional()
  traits?: RaceTraitDto[];

  @IsString()
  @IsOptional()
  description?: string;

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
