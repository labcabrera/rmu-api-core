import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { UpdateSkillCommand } from 'src/modules/skills/application/cqrs/commands/update-skill.command';

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

  static toCommand(id: string, dto: UpdateSkillDto, userId: string, roles: string[]): UpdateSkillCommand {
    return new UpdateSkillCommand(id, dto.categoryId, dto.bonus, dto.specialization, dto.accessType, userId, roles);
  }
}
