import { ApiProperty } from '@nestjs/swagger';

import { ProfessionProps } from 'src/modules/professions/domain/aggregates/profession';
import { ProfessionSkillCostsDto } from './profession-skill-cost.dto';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';

export class ProfessionDto {
  @ApiProperty({ description: 'Profession identifier', example: 'rogue', required: true })
  id: string;

  @ApiProperty({ description: 'Skill costs associated with the profession', required: true })
  skillCosts: ProfessionSkillCostsDto;

  @ApiProperty({ description: 'List of available professional skills', required: true, example: ['riding', 'perception'] })
  professionalSkills: string[];

  static fromEntity(entity: ProfessionProps): ProfessionDto {
    return { ...entity };
  }
}

export class ProfessionPageDto {
  @ApiProperty({
    type: [ProfessionDto],
    description: 'Professions',
    isArray: true,
  })
  content: ProfessionDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
