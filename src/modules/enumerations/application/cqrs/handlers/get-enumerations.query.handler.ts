import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetEnumerationsQuery } from '../queries/get-enumerations.query';
import type { EnumerationRepository } from '../../ports/enumeration-repository';
import { Page } from 'src/modules/shared/domain/entities/page';
import type { EnumerationGuardPort } from '../../ports/enumeration-guard';
import { Enumeration } from 'src/modules/enumerations/domain/aggregates/enumeration';

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
