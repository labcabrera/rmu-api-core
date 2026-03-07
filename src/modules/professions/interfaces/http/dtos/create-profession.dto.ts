import { ApiProperty } from '@nestjs/swagger';
import { ProfessionSkillCostsDto } from './profession-skill-cost.dto';
import { CreateProfessionCommand } from 'src/modules/professions/application/cqrs/commands/create-profession.command';

export class CreateProfessionDto {
  @ApiProperty({ description: 'Profession ID', example: 'warrior' })
  id: string;

  @ApiProperty({ description: 'Skill costs associated with the profession', required: true })
  skillCosts: ProfessionSkillCostsDto;

  @ApiProperty({ description: 'List of available professional skills', required: true, example: ['riding', 'perception'] })
  professionalSkills: string[];

  @ApiProperty({ description: 'Description of the profession', example: 'A brave warrior skilled in combat.' })
  description: string | undefined;

  static toCommand(dto: CreateProfessionDto, userId: string, roles: string[]): CreateProfessionCommand {
    return new CreateProfessionCommand(dto.id, dto.skillCosts, dto.professionalSkills, dto.description, userId, roles);
  }
}
