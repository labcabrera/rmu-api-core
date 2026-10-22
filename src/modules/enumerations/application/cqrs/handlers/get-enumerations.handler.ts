import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetEnumerationsQuery } from '../queries/get-enumerations.query.js';
import { ENUMERATION_REPOSITORY, type EnumerationRepository } from '../../ports/enumeration-repository.port.js';
import { Page } from '../../../../shared/application/pagination/page.js';
import { ENUMERATION_GUARD, type EnumerationGuardPort } from '../../ports/enumeration-guard.port.js';
import { Enumeration } from '../../../domain/aggregates/enumeration.js';

@QueryHandler(GetEnumerationsQuery)
export class GetEnumerationsHandler implements IQueryHandler<GetEnumerationsQuery, Page<Enumeration>> {
  constructor(
    @Inject(ENUMERATION_REPOSITORY) private readonly skillRepository: EnumerationRepository,
    @Inject(ENUMERATION_GUARD) private readonly skillGuard: EnumerationGuardPort,
  ) {}

  async execute(query: GetEnumerationsQuery): Promise<Page<Enumeration>> {
    const filter = this.skillGuard.buildQueryPredicate(query.userId, query.roles);
    const sort = { key: 'asc' } as const;
    return await this.skillRepository.findByRsql(query.rsql, query.page, query.size, filter, sort);
  }
}
