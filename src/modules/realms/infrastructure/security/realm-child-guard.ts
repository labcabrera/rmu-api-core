import { ForbiddenError } from '../../../shared/domain/errors/errors.js';
import { RMU_ADMIN, RMU_USER } from '../../../shared/domain/entities/user-roles.js';
import type { EntitySource } from '../../../shared/domain/entities/entity-source.js';
import { checkEntitySource } from '../../../shared/domain/services/entity-permissions.js';
import { type AccessLevel, assertAccess } from '../../../shared/domain/services/entity-access.js';
import { QueryCriteria } from '../../../shared/application/criteria/query-criteria.js';
import type { RealmChildGuard } from '../../../shared/application/ports/realm-child-guard.port.js';
import type { RealmAccessPort, RealmChild } from '../../application/ports/realm-access.port.js';
import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';
import type { RbacEntity } from '../../../shared/domain/entities/rbac-entity.js';

class OwnRules extends BaseEntityGuard<RbacEntity> {}

/** The rules of spec 069 for races and enumerations of a realm. Global enumerations (no realm) keep their own. */
export abstract class RealmChildGuardBase<E extends RealmChild> implements RealmChildGuard<E> {
  private readonly ownRules = new OwnRules();

  protected constructor(private readonly realmAccess: RealmAccessPort) {}

  checkCreate(roles: string[]): void {
    if (roles.includes(RMU_ADMIN)) return;
    if (roles.includes(RMU_USER)) return;
    throw new ForbiddenError('You do not have permission to create this entity');
  }

  checkEntitySource(roles: string[], value: EntitySource | undefined): void {
    checkEntitySource(value, roles);
  }

  async checkRead(entity: E, userId: string, roles: string[]): Promise<void> {
    if ((await this.realmAccess.childLevel(entity, userId, roles)) === 'none') {
      throw new ForbiddenError('You do not have permission to read this entity');
    }
  }

  async checkUpdate(entity: E, userId: string, roles: string[]): Promise<void> {
    assertAccess(entity, await this.realmAccess.childLevel(entity, userId, roles), 'write', 'update');
  }

  /** A writer of the realm deletes its children too (spec 069): `write`, not `manage`. */
  async checkDelete(entity: E, userId: string, roles: string[]): Promise<void> {
    assertAccess(entity, await this.realmAccess.childLevel(entity, userId, roles), 'write', 'delete');
  }

  accessOf(entities: E[], userId: string, roles: string[]): Promise<AccessLevel[]> {
    return this.realmAccess.childLevels(entities, userId, roles);
  }

  /** The children of the realms the user reads; with `globals`, also the entities without realm the user reads. */
  protected async realmPredicate(userId: string, roles: string[], globals: boolean): Promise<QueryCriteria> {
    const ids = await this.realmAccess.readableRealmIds(userId, roles);
    if (ids === null) return QueryCriteria.empty();
    const inRealms = QueryCriteria.in('realmId', ids);
    if (!globals) return inRealms;
    const ownRules = this.ownRules.buildQueryPredicate(userId, roles);
    return QueryCriteria.anyOf([QueryCriteria.allOf([QueryCriteria.eq('realmId', null), ownRules]), inRealms]);
  }

  abstract buildQueryPredicate(userId: string, roles: string[]): Promise<QueryCriteria>;
}
