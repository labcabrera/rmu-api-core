import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { RaceResistancesDto } from './race-resistances.dto';
import { RaceStatsDto } from './race-stats.dto';
import { SexBasedAttributeDto } from './sex-based-attribute.dto';
import { UpdateRaceCommand } from 'src/modules/races/application/cqrs/commands/update-race.command';

export class UpdateRaceDto {
  @IsString()
  @IsOptional()
  name?: string;

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

  @IsNumber()
  @IsOptional()
  defaultLanguage?: string;

  @IsArray()
  @IsOptional()
  talents?: string[];

  @IsString()
  @IsOptional()
  description?: string;

  static toCommand(id: string, dto: UpdateRaceDto, userId: string, roles: string[]): UpdateRaceCommand {
    return new UpdateRaceCommand(
      id,
      dto.name,
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
      dto.defaultLanguage,
      dto.talents,
      dto.description,
      userId,
      roles,
    );
  }
}
