import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSkillsQuery } from '../queries/get-skills.query.js';
import type { SkillRepository } from '../../ports/skill-repository.js';
import { Page } from '../../../../shared/domain/entities/page.js';
import type { SkillView } from '../../read-models/skill-view.js';
import { SkillViewService } from '../../services/skill-view.service.js';
import type { SkillGuardPort } from '../../ports/skill-guard.js';

@QueryHandler(GetSkillsQuery)
export class GetSkillsHandler implements IQueryHandler<GetSkillsQuery, Page<SkillView>> {
  constructor(
    @Inject('SkillRepository') private readonly skillRepository: SkillRepository,
    @Inject('SkillGuardPort') private readonly skillGuard: SkillGuardPort,
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
