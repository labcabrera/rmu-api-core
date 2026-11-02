import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ManeuverProfileDto } from './maneuver-profile.dto.js';
import { CreateSkillCategoryCommand } from '../../../application/cqrs/commands/create-skill-category.command.js';

export class CreateSkillCategoryDto {
  @ApiProperty({ description: 'Name of the race', example: 'Elf' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Description of the race' })
  @IsArray()
  bonus: string[];

  @ApiProperty({ type: Number, description: 'Realm base bonus count' })
  @IsNumber()
  @IsOptional()
  realmBonus: number | null;

  @ApiProperty({ description: 'Maneuver profile of the category', type: ManeuverProfileDto, required: false })
  @ValidateNested()
  @Type(() => ManeuverProfileDto)
  @IsOptional()
  maneuver?: ManeuverProfileDto;

  static toCommand(dto: CreateSkillCategoryDto, userId: string, roles: string[]): CreateSkillCategoryDto {
    return new CreateSkillCategoryCommand(dto.id, dto.bonus, dto.realmBonus, ManeuverProfileDto.toProfile(dto.maneuver), userId, roles);
  }
}
