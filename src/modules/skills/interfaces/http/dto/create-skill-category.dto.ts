import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { CreateSkillCategoryCommand } from 'src/modules/skills/application/cqrs/commands/create-skill-category.command';

export class CreateSkillCategoryDto {
  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Description of the race' })
  @IsArray()
  bonus: string[];

  static toCommand(dto: CreateSkillCategoryDto, userId: string, roles: string[]): CreateSkillCategoryDto {
    return new CreateSkillCategoryCommand(dto.id, dto.bonus, userId, roles);
  }
}
