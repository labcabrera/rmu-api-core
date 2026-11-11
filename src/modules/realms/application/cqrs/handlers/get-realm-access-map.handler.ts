import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RMU_ADMIN } from '../../../../shared/domain/entities/user-roles.js';
import { ForbiddenError } from '../../../../shared/domain/errors/errors.js';
import { type AccessLevel, resolveAccess } from '../../../../shared/domain/services/entity-access.js';
import { REALM_GUARD, type RealmGuardPort } from '../../ports/realm-guard.port.js';
import { REALM_REPOSITORY, type RealmRepository } from '../../ports/realm-repository.port.js';
import { GetRealmAccessMapQuery } from '../queries/get-realm-access-map.query.js';

export interface RealmLevel {
  realmId: string;
  level: AccessLevel;
}

/**
 * The realms a user reads, as a non-admin (the caller knows the roles of its user and lets an admin through itself),
 * with the games of spec 071. Realms without access are left out.
 */
@QueryHandler(GetRealmAccessMapQuery)
export class GetRealmAccessMapHandler implements IQueryHandler<GetRealmAccessMapQuery, RealmLevel[]> {
  constructor(
    @Inject(REALM_REPOSITORY) private readonly realmRepository: RealmRepository,
    @Inject(REALM_GUARD) private readonly realmGuard: RealmGuardPort,
  ) {}

  async execute(query: GetRealmAccessMapQuery): Promise<RealmLevel[]> {
    if (!query.roles.includes(RMU_ADMIN)) throw new ForbiddenError('Only other APIs ask for the access of a user');
    const ids = await this.realmRepository.findIdsMatching(this.realmGuard.buildQueryPredicate(query.subjectId, []));
    const realms = await this.realmRepository.findByIds(ids);
    return realms
      .map(realm => ({ realmId: realm.id, level: resolveAccess(realm, query.subjectId, []) }))
      .filter(entry => entry.level !== 'none')
      .sort((a, b) => a.realmId.localeCompare(b.realmId));
  }
}
