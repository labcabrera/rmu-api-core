import { Inject, Injectable } from '@nestjs/common';
import { REALM_REPOSITORY, type RealmRepository } from '../ports/realm-repository.port.js';
import type { RealmAccessPort, RealmChild } from '../ports/realm-access.port.js';
import { REALM_GUARD, type RealmGuardPort } from '../ports/realm-guard.port.js';
import { type AccessLevel, resolveAccess, resolveChildAccess } from '../../../shared/domain/services/entity-access.js';
import { RMU_ADMIN } from '../../../shared/domain/entities/user-roles.js';
import type { Realm } from '../../domain/aggregates/realm.js';

/**
 * Reads the realm of each child in process, so a share that is removed stops counting at once (spec 069, decision 8),
 * not when a Kafka sync reaches the copies of the races.
 */
@Injectable()
export class RealmAccessService implements RealmAccessPort {
  constructor(
    @Inject(REALM_REPOSITORY) private readonly realms: RealmRepository,
    @Inject(REALM_GUARD) private readonly realmGuard: RealmGuardPort,
  ) {}

  async levelOf(realmId: string, userId: string, roles: string[]): Promise<AccessLevel> {
    const realm = await this.realms.findById(realmId);
    return realm ? resolveAccess(realm, userId, roles) : 'none';
  }

  async childLevel(child: RealmChild, userId: string, roles: string[]): Promise<AccessLevel> {
    return (await this.childLevels([child], userId, roles))[0];
  }

  async childLevels(children: RealmChild[], userId: string, roles: string[]): Promise<AccessLevel[]> {
    const ids = [...new Set(children.map(child => child.realmId).filter((id): id is string => !!id))];
    const byId = new Map<string, Realm>((await this.realms.findByIds(ids)).map(realm => [realm.id, realm]));
    return children.map(child => {
      if (!child.realmId) return resolveChildAccess(child, null, userId, roles);
      const realm = byId.get(child.realmId);
      // A child whose realm is gone: only an admin still sees it (the deletion cascade removes it soon).
      if (!realm) return roles.includes(RMU_ADMIN) ? 'write' : 'none';
      return resolveChildAccess(child, realm, userId, roles);
    });
  }

  async readableRealmIds(userId: string, roles: string[]): Promise<string[] | null> {
    if (roles.includes(RMU_ADMIN)) return null;
    return this.realms.findIdsMatching(this.realmGuard.buildQueryPredicate(userId, roles));
  }
}
