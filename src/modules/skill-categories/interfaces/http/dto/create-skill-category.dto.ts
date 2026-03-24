import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional } from 'class-validator';
import { CreateSkillCategoryCommand } from 'src/modules/skill-categories/application/cqrs/commands/create-skill-category.command';

export class CreateSkillCategoryDto {
  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Description of the race' })
  @IsArray()
  bonus: string[];

  @ApiProperty({ description: 'Realm base bonus count' })
  @IsNumber()
  @IsOptional()
  realmBonus: number | null;

  static toCommand(dto: CreateSkillCategoryDto, userId: string, roles: string[]): CreateSkillCategoryDto {
    return new CreateSkillCategoryCommand(dto.id, dto.bonus, dto.realmBonus, userId, roles);
  }
}
