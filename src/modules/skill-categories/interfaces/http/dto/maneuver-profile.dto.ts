import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import {
  EffectiveManeuverProfile,
  MANEUVER_LIGHT_USAGES,
  MANEUVER_TYPES,
  ManeuverProfile,
  ManeuverProfiles,
} from '../../../domain/value-objects/maneuver-profile.vo';
import type { ManeuverLightUsage, ManeuverType } from '../../../domain/value-objects/maneuver-profile.vo';

export class ManeuverActionPointsDto {
  @ApiProperty({ description: 'Minimum action points', example: 1 })
  @IsInt()
  @Min(0)
  min: number;

  @ApiProperty({ description: 'Maximum action points (no penalty when the maneuver uses them all)', example: 4 })
  @IsInt()
  @Min(0)
  max: number;
}

/** Stored (own) maneuver profile: every field is optional. Used in requests and as raw values in responses. */
export class ManeuverProfileDto {
  @ApiProperty({ description: 'Maneuver type proposed when declaring', enum: MANEUVER_TYPES, required: false })
  @IsIn(MANEUVER_TYPES)
  @IsOptional()
  defaultType?: ManeuverType;

  @ApiProperty({ description: 'Absolute maneuver result table', example: 'generic', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  resultTable?: string;

  @ApiProperty({ description: 'Requires freedom of movement (armor and encumbrance apply)', required: false })
  @IsBoolean()
  @IsOptional()
  movement?: boolean;

  @ApiProperty({ description: 'Light usage', enum: MANEUVER_LIGHT_USAGES, required: false })
  @IsIn(MANEUVER_LIGHT_USAGES)
  @IsOptional()
  light?: ManeuverLightUsage;

  @ApiProperty({ description: 'Action point range', type: ManeuverActionPointsDto, required: false })
  @ValidateNested()
  @Type(() => ManeuverActionPointsDto)
  @IsOptional()
  actionPoints?: ManeuverActionPointsDto;

  static toProfile(dto: ManeuverProfileDto | null | undefined): ManeuverProfile | undefined {
    return ManeuverProfiles.normalize(dto);
  }

  static fromProfile(profile: ManeuverProfile | null | undefined): ManeuverProfileDto | undefined {
    const normalized = ManeuverProfiles.normalize(profile);
    if (!normalized) return undefined;
    return Object.assign(new ManeuverProfileDto(), normalized);
  }
}

/** Effective maneuver profile: category values overridden by the skill and completed with defaults. */
export class EffectiveManeuverProfileDto {
  @ApiProperty({ enum: MANEUVER_TYPES, example: 'absolute' })
  defaultType: ManeuverType;

  @ApiProperty({ example: 'generic' })
  resultTable: string;

  @ApiProperty({ example: false })
  movement: boolean;

  @ApiProperty({ enum: MANEUVER_LIGHT_USAGES, example: 'none' })
  light: ManeuverLightUsage;

  @ApiProperty({ type: ManeuverActionPointsDto, required: false })
  actionPoints?: ManeuverActionPointsDto;

  static fromProfile(profile: EffectiveManeuverProfile): EffectiveManeuverProfileDto {
    return Object.assign(new EffectiveManeuverProfileDto(), profile);
  }
}
