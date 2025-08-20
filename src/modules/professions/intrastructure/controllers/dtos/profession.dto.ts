import { ApiProperty } from '@nestjs/swagger';

import { Profession } from 'src/modules/professions/domain/entities/profession.entity';
import { ProfessionSkillCostsDto } from './profession-skill-cost.dto';

export class ProfessionDto {
  @ApiProperty({ description: 'Profession identifier', example: 'rogue', required: true })
  id: string;

  @ApiProperty({ description: 'Skill costs associated with the profession', required: true })
  skillCosts: ProfessionSkillCostsDto;

  @ApiProperty({ description: 'List of available professional skills', required: true, example: ['riding', 'perception'] })
  professionalSkills: string[];

  static fromEntity(entity: Profession): ProfessionDto {
    return { ...entity };
  }
}
