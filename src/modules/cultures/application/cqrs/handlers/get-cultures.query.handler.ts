import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCulturesQuery } from '../queries/get-cultures.query';
import { Page } from '../../../../shared/domain/entities/page';
import type { CultureRepository } from '../../ports/culture-repository';
import type { CultureGuardPort } from '../../ports/culture-guard.port';
import { CultureViewService } from '../../services/culture-view.service';
import { CultureView } from '../../read-models/culture-view';

@QueryHandler(GetCulturesQuery)
export class GetCulturesHandler implements IQueryHandler<GetCulturesQuery, Page<CultureView>> {
  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
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
