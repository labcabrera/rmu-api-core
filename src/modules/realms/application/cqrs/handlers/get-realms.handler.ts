import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Realm } from '../../../domain/aggregates/realm.js';
import { GetRealmsQuery } from '../queries/get-realms.query.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { Page } from '../../../../shared/application/pagination/page.js';
import { REALM_GUARD, type RealmGuardPort } from '../../ports/realm-guard.port.js';

@QueryHandler(GetRealmsQuery)
export class GetRealmsHandler implements IQueryHandler<GetRealmsQuery, Page<Realm>> {
  constructor(
    @Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository,
    @Inject(REALM_GUARD) private readonly realmGuard: RealmGuardPort,
  ) {}

  async execute(query: GetRealmsQuery): Promise<Page<Realm>> {
    const predicate = this.realmGuard.buildQueryPredicate(query.userId, query.roles);
    const sort = { name: 'asc' } as const;
    return await this.realmRepository.findByRsql(query.rsql, query.page, query.size, predicate, sort);
  }
}
