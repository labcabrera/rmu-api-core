import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSkillQuery } from '../queries/get-skill.query';
import type { SkillRepository } from '../../ports/skill-repository';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';
import type { SkillGuardPort } from '../../ports/skill-guard';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';

@QueryHandler(GetSkillQuery)
export class GetSkillHandler implements IQueryHandler<GetSkillQuery, Skill> {
  constructor(
    @Inject('SkillRepository') private readonly skillRepository: SkillRepository,
    @Inject('SkillGuardPort') private readonly skillGuard: SkillGuardPort,
  ) {}

  async execute(query: GetSkillQuery): Promise<Skill> {
    const skill = await this.skillRepository.findById(query.id);
    if (!skill) throw new NotFoundError('Skill', query.id);
    this.skillGuard.checkRead(skill, query.userId, query.roles);
    return skill;
  }
}
