import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSkillsQuery } from '../queries/get-skills.query.js';
import { SKILL_REPOSITORY, type SkillRepository } from '../../ports/skill-repository.port.js';
import { Page } from '../../../../shared/application/pagination/page.js';
import type { SkillView } from '../../read-models/skill-view.js';
import { SkillViewService } from '../../services/skill-view.service.js';
import { SKILL_GUARD, type SkillGuardPort } from '../../ports/skill-guard.port.js';

@QueryHandler(GetSkillsQuery)
export class GetSkillsHandler implements IQueryHandler<GetSkillsQuery, Page<SkillView>> {
  constructor(
    @Inject(SKILL_REPOSITORY) private readonly skillRepository: SkillRepository,
    @Inject(SKILL_GUARD) private readonly skillGuard: SkillGuardPort,
    private readonly skillViewService: SkillViewService,
  ) {}

  async execute(query: GetSkillsQuery): Promise<Page<SkillView>> {
    const filter = this.skillGuard.buildQueryPredicate(query.userId, query.roles);
    const sort = { _id: 'asc' } as const;
    const page = await this.skillRepository.findByRsql(query.rsql, query.page, query.size, filter, sort);
    const views = await this.skillViewService.toViews(page.content);
    return new Page<SkillView>(views, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }
}
