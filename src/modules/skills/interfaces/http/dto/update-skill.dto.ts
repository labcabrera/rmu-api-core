import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested, IsInt, Min } from 'class-validator';
import { ManeuverProfileDto } from '../../../../skill-categories/interfaces/http/dto/maneuver-profile.dto.js';
import type { EnumerationCategory } from '../../../../enumerations/domain/value-objects/enumeration-category.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { UpdateSkillCommand } from '../../../application/cqrs/commands/update-skill.command.js';

export class UpdateSkillDto {
  @ApiProperty({ type: String, description: 'Category identifier of the skill', example: 'animal', required: false })
  @IsString()
  @IsOptional()
  categoryId: string | undefined;

  @ApiProperty({ description: 'Bonus attributes of the skill', example: ['st', 'co'], required: false })
  @IsArray()
  @IsOptional()
  bonus: string[] | undefined;

  @ApiProperty({ type: String, description: 'Specialization of the skill', example: 'tracking', required: false })
  @IsString()
  @IsOptional()
  specialization: EnumerationCategory | undefined;

  @ApiProperty({ description: 'The specialization is suggested, not required', required: false, example: true })
  @IsBoolean()
  @IsOptional()
  specializationOptional?: boolean;

  @ApiProperty({ type: String, description: 'Access type of the skill', example: 'public', required: false })
  @IsString()
  @IsOptional()
  accessType: AccessType;

  @ApiProperty({
    description: 'Maneuver profile values that override the category profile (replaces the stored ones; null removes them)',
    type: ManeuverProfileDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => ManeuverProfileDto)
  @IsOptional()
  maneuver?: ManeuverProfileDto | null;

  @ApiProperty({ description: 'Version the client read (from the GET); a different stored version is a 409', required: false, example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;

  static toCommand(id: string, dto: UpdateSkillDto, userId: string, roles: string[]): UpdateSkillCommand {
    return new UpdateSkillCommand(
      id,
      dto.categoryId,
      dto.bonus,
      dto.specialization,
      dto.accessType,
      dto.maneuver === null ? null : ManeuverProfileDto.toProfile(dto.maneuver),
      userId,
      roles,
      dto.version,
      dto.specializationOptional,
    );
  }
}
