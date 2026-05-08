import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCulturesQuery } from '../queries/get-cultures.query';
import { Page } from 'src/modules/shared/domain/entities/page';
import { Culture } from 'src/modules/cultures/domain/aggregates/culture';
import type { CultureRepository } from '../../ports/culture-repository';
import type { CultureGuardPort } from '../../ports/culture-guard.port';

@QueryHandler(GetCulturesQuery)
export class GetCulturesHandler implements IQueryHandler<GetCulturesQuery, Page<Culture>> {
  constructor(
    @Inject('CultureRepository') private readonly cultureRepository: CultureRepository,
    @Inject('CultureGuard') private readonly cultureGuard: CultureGuardPort,
  ) {}

  async execute(query: GetCulturesQuery): Promise<Page<Culture>> {
    const predicate = this.cultureGuard.buildQueryPredicate(query.userId, query.roles);
    const sort = { name: 'asc' } as const;
    return await this.cultureRepository.findByRsql(query.rsql, query.page, query.size, predicate, sort);
  }
}
