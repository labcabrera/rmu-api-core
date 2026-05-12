import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSkillsQuery } from '../queries/get-skills.query';
import type { SkillRepository } from '../../ports/skill-repository';
import { Page } from 'src/modules/shared/domain/entities/page';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';
import type { SkillGuardPort } from '../../ports/skill-guard';

@QueryHandler(GetSkillsQuery)
export class GetSkillsHandler implements IQueryHandler<GetSkillsQuery, Page<Skill>> {
  constructor(
    @Inject('SkillRepository') private readonly skillRepository: SkillRepository,
    @Inject('SkillGuardPort') private readonly skillGuard: SkillGuardPort,
  ) {}

  async execute(query: GetSkillsQuery): Promise<Page<Skill>> {
    const filter = this.skillGuard.buildQueryPredicate(query.userId, query.roles);
    const sort = { _id: 'asc' } as const;
    return await this.skillRepository.findByRsql(query.rsql, query.page, query.size, filter, sort);
  }
}
