import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';
import { GetRealmsQuery } from '../queries/get-realms.query';
import type { RealmRepository } from '../../ports/realm-repository';
import { Page } from 'src/modules/shared/domain/entities/page';
import type { RealmGuardPort } from '../../ports/realm-guard.port';

@QueryHandler(GetRealmsQuery)
export class GetRealmsHandler implements IQueryHandler<GetRealmsQuery, Page<Realm>> {
  constructor(
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('RealmGuardPort') private readonly realmGuard: RealmGuardPort,
  ) {}

  async execute(query: GetRealmsQuery): Promise<Page<Realm>> {
    const predicate = this.realmGuard.buildQueryPredicate(query.userId, query.roles);
    const sort = { name: 'asc' } as const;
    return await this.realmRepository.findByRsql(query.rsql, query.page, query.size, predicate, sort);
  }
}
