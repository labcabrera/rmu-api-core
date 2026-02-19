import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';
import { SkillCategory } from 'src/modules/skills/domain/aggregates/skill-category';

export class SkillCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'animals' })
  id: string;

  @ApiProperty({ description: 'List of stats that apply a benefit to the skill', example: ['em', 'co'] })
  bonus: string[];

  static fromEntity(entity: SkillCategory): SkillCategoryDto {
    const dto = new SkillCategoryDto();
    dto.id = entity.id;
    dto.bonus = entity.bonus || [];
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
