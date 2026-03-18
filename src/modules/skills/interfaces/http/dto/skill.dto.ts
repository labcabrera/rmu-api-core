import { ApiProperty } from '@nestjs/swagger';
import { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';

export class SkillDto {
  @ApiProperty({ description: 'Unique identifier of the skill', example: 'animal-handling' })
  id: string;

  @ApiProperty({ description: 'Category of the skill', example: 'animal' })
  categoryId: string;

  @ApiProperty({ description: 'List of stats that apply a benefit to the skill', example: ['em', 'co'] })
  bonus: string[];

  @ApiProperty({ description: 'List of specializations for the skill', example: ['stealth', 'tracking'] })
  specialization: EnumerationCategory | null;

  static fromEntity(entity: Skill): SkillDto {
    const dto = new SkillDto();
    dto.id = entity.id;
    dto.categoryId = entity.categoryId;
    dto.bonus = entity.bonus || [];
    dto.specialization = entity.specialization;
    return dto;
  }
}

export class SkillPageDto {
  @ApiProperty({
    type: [SkillDto],
    description: 'Skills',
    isArray: true,
  })
  content: SkillDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
