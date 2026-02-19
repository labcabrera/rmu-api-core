import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSkillQuery } from '../queries/get-skill.query';
import type { SkillRepository } from '../../ports/skill-repository';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';

@QueryHandler(GetSkillQuery)
export class GetSkillHandler implements IQueryHandler<GetSkillQuery, Skill> {
  constructor(@Inject('SkillRepository') private readonly skillRepository: SkillRepository) {}

  async execute(query: GetSkillQuery): Promise<Skill> {
    const skill = await this.skillRepository.findById(query.id);
    return skill as Skill;
  }
}
