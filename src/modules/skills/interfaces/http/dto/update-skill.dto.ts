import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ManeuverProfileDto } from '../../../../skill-categories/interfaces/http/dto/maneuver-profile.dto';
import { EnumerationCategory } from '../../../../enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from '../../../../shared/domain/entities/access-type';
import { UpdateSkillCommand } from '../../../application/cqrs/commands/update-skill.command';

export class UpdateSkillDto {
  @ApiProperty({ description: 'Category identifier of the skill', example: 'animal', required: false })
  @IsString()
  @IsOptional()
  categoryId: string | undefined;

  @ApiProperty({ description: 'Bonus attributes of the skill', example: ['st', 'co'], required: false })
  @IsArray()
  @IsOptional()
  bonus: string[] | undefined;

  @ApiProperty({ description: 'Specialization of the skill', example: 'tracking', required: false })
  @IsString()
  @IsOptional()
  specialization: EnumerationCategory | undefined;

  @ApiProperty({ description: 'Access type of the skill', example: 'public', required: false })
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
    );
  }
}
