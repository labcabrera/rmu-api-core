import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../../shared/interfaces/http/dto/page.dto.js';
import { ManeuverProfileDto } from './maneuver-profile.dto.js';
import { SkillCategory } from '../../../domain/entities/skill-category.js';

export class SkillCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'animals' })
  id: string;

  @ApiProperty({ description: 'List of stats that apply a benefit to the skill', example: ['em', 'co'] })
  bonus: string[];

  @ApiProperty({ type: Number, description: 'Realm bonus count', example: 2, nullable: true })
  realmBonus: number | null;

  @ApiProperty({ description: 'Own maneuver profile of the category (no defaults applied)', type: ManeuverProfileDto, required: false })
  maneuver?: ManeuverProfileDto;

  static fromEntity(entity: SkillCategory): SkillCategoryDto {
    const dto = new SkillCategoryDto();
    dto.id = entity.id;
    dto.bonus = entity.bonus || [];
    dto.realmBonus = entity.realmBonus;
    dto.maneuver = ManeuverProfileDto.fromProfile(entity.maneuver);
    return dto;
  }
}

export class SkillCategoryPageDto {
  @ApiProperty({
    type: [SkillCategoryDto],
    description: 'Skill Categories',
    isArray: true,
  })
  content: SkillCategoryDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
