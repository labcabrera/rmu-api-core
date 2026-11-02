import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetRealmSharesQuery } from '../queries/get-realm-shares.query.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { REALM_GUARD, type RealmGuardPort } from '../../ports/realm-guard.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import type { EntityShare } from '../../../../shared/domain/entities/entity-share.js';

@QueryHandler(GetRealmSharesQuery)
export class GetRealmSharesHandler implements IQueryHandler<GetRealmSharesQuery, readonly EntityShare[]> {
  constructor(
    @Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository,
    @Inject(REALM_GUARD) private readonly realmGuard: RealmGuardPort,
  ) {}

  async execute(query: GetRealmSharesQuery): Promise<readonly EntityShare[]> {
    const realm = await this.realmRepository.findById(query.realmId);
    if (!realm) throw new NotFoundError('Realm', query.realmId);
    this.realmGuard.checkManage(realm, query.userId, query.roles);
    return realm.shares;
  }
}
