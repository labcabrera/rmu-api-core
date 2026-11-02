import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Realm } from '../../../domain/aggregates/realm.js';
import { GetRealmsQuery, type RealmScope } from '../queries/get-realms.query.js';
import { QueryCriteria } from '../../../../shared/application/criteria/query-criteria.js';
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
    const access = this.realmGuard.buildQueryPredicate(query.userId, query.roles);
    const scope = scopeCriteria(query.scope, query.userId);
    const predicate = scope ? QueryCriteria.allOf([access, scope]) : access;
    const sort = { name: 'asc' } as const;
    return await this.realmRepository.findByRsql(query.rsql, query.page, query.size, predicate, sort);
  }
}

function scopeCriteria(scope: RealmScope | undefined, userId: string): QueryCriteria | null {
  switch (scope) {
    case 'mine':
      return QueryCriteria.eq('owner', userId);
    case 'shared':
      return QueryCriteria.eq('shares.userId', userId);
    case 'public':
      return QueryCriteria.eq('accessType', 'public');
    default:
      return null;
  }
}
