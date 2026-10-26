import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ManeuverProfileDto } from '../../../../skill-categories/interfaces/http/dto/maneuver-profile.dto.js';
import type { EnumerationCategory } from '../../../../enumerations/domain/value-objects/enumeration-category.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { CreateSkillCommand } from '../../../application/cqrs/commands/create-skill.command.js';

export class CreateSkillDto {
  @ApiProperty({ description: 'Unique identifier of the skill', example: 'animal-handling' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: 'Category identifier of the skill', example: 'animal' })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ description: 'Bonus attributes of the skill', example: ['strength', 'dexterity'] })
  @IsArray()
  bonus!: string[];

  @ApiProperty({ type: String, description: 'Specialization of the skill', example: 'tracking' })
  @IsString()
  @IsOptional()
  specialization: EnumerationCategory | null;

  @ApiProperty({ description: 'The specialization is suggested, not required', required: false, example: false })
  @IsBoolean()
  @IsOptional()
  specializationOptional?: boolean;

  @ApiProperty({ type: String, description: 'Access type of the skill', example: 'public' })
  @IsString()
  accessType: AccessType;

  @ApiProperty({ description: 'Maneuver profile values that override the category profile', type: ManeuverProfileDto, required: false })
  @ValidateNested()
  @Type(() => ManeuverProfileDto)
  @IsOptional()
  maneuver?: ManeuverProfileDto;

  static toCommand(dto: CreateSkillDto, userId: string, roles: string[]): CreateSkillCommand {
    return new CreateSkillCommand(
      dto.id,
      dto.categoryId,
      dto.bonus,
      dto.specialization,
      dto.accessType,
      ManeuverProfileDto.toProfile(dto.maneuver),
      userId,
      roles,
      dto.specializationOptional,
    );
  }
}
