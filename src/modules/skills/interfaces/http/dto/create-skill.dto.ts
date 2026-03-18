import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { CreateSkillCommand } from 'src/modules/skills/application/cqrs/commands/create-skill.command';

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

  @ApiProperty({ description: 'Specialization of the skill', example: 'tracking' })
  @IsString()
  @IsOptional()
  specialization: EnumerationCategory | null;

  @ApiProperty({ description: 'Access type of the skill', example: 'public' })
  @IsString()
  accessType: AccessType;

  static toCommand(dto: CreateSkillDto, userId: string, roles: string[]): CreateSkillCommand {
    return new CreateSkillCommand(dto.id, dto.categoryId, dto.bonus, dto.specialization, dto.accessType, userId, roles);
  }
}
