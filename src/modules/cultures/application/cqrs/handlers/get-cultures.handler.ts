import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCulturesQuery } from '../queries/get-cultures.query.js';
import { Page } from '../../../../shared/application/pagination/page.js';
import { CULTURE_REPOSITORY, type CultureRepository } from '../../ports/culture-repository.port.js';
import { CULTURE_GUARD, type CultureGuardPort } from '../../ports/culture-guard.port.js';
import { CultureViewService } from '../../services/culture-view.service.js';
import type { CultureView } from '../../read-models/culture-view.js';

@QueryHandler(GetCulturesQuery)
export class GetCulturesHandler implements IQueryHandler<GetCulturesQuery, Page<CultureView>> {
  constructor(
    @Inject(CULTURE_REPOSITORY) private readonly cultureRepository: CultureRepository,
    @Inject(CULTURE_GUARD) private readonly cultureGuard: CultureGuardPort,
    private readonly cultureViewService: CultureViewService,
  ) {}

  async execute(query: GetCulturesQuery): Promise<Page<CultureView>> {
    const predicate = this.cultureGuard.buildQueryPredicate(query.userId, query.roles);
    const sort = { name: 'asc' } as const;
    const page = await this.cultureRepository.findByRsql(query.rsql, query.page, query.size, predicate, sort);
    const views = await this.cultureViewService.toViews(page.content);
    return new Page<CultureView>(views, page.pagination.page, page.pagination.size, page.pagination.totalElements);
  }
}
