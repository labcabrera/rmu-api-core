import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetEnumerationsQuery } from '../queries/get-enumerations.query.js';
import type { EnumerationRepository } from '../../ports/enumeration-repository.js';
import { Page } from '../../../../shared/domain/entities/page.js';
import type { EnumerationGuardPort } from '../../ports/enumeration-guard.js';
import { Enumeration } from '../../../domain/aggregates/enumeration.js';

@QueryHandler(GetEnumerationsQuery)
export class GetEnumerationsHandler implements IQueryHandler<GetEnumerationsQuery, Page<Enumeration>> {
  constructor(
    @Inject('EnumerationRepository') private readonly skillRepository: EnumerationRepository,
    @Inject('EnumerationGuardPort') private readonly skillGuard: EnumerationGuardPort,
  ) {}

  async execute(query: GetEnumerationsQuery): Promise<Page<Enumeration>> {
    const filter = this.skillGuard.buildQueryPredicate(query.userId, query.roles);
    const sort = { key: 'asc' } as const;
    return await this.skillRepository.findByRsql(query.rsql, query.page, query.size, filter, sort);
  }
}
