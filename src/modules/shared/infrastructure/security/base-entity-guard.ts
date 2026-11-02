import { ForbiddenError } from '../../domain/errors/errors.js';
import { RMU_ADMIN, RMU_USER } from '../../domain/entities/user-roles.js';
import type { RbacEntity } from '../../domain/entities/rbac-entity.js';
import type { EntitySource } from '../../domain/entities/entity-source.js';
import { checkEntitySource } from '../../domain/services/entity-permissions.js';
import { type AccessLevel, assertAccess, resolveAccess } from '../../domain/services/entity-access.js';
import { QueryCriteria } from '../../application/criteria/query-criteria.js';
import type { EntityGuard } from '../../application/ports/entity-guard.port.js';

/**
 * Access rules of a root entity (spec 069): read needs `read`, update `write`, delete and manage `manage`. Without
 * shares the result is the rule of spec 063: system entities for admins, user entities for their owner and admins.
 */
export abstract class BaseEntityGuard<E extends RbacEntity> implements EntityGuard<E> {
  accessOf(entity: E, userId: string, roles: string[]): AccessLevel {
    return resolveAccess(entity, userId, roles);
  }

  checkRead(entity: E, userId: string, roles: string[]) {
    if (resolveAccess(entity, userId, roles) === 'none') throw new ForbiddenError('You do not have permission to read this entity');
  }

  checkCreate(roles: string[]) {
    if (roles.includes(RMU_ADMIN)) return;
    if (roles.includes(RMU_USER)) return;
    throw new ForbiddenError('You do not have permission to create this entity');
  }

  checkUpdate(entity: E, userId: string, roles: string[]) {
    assertAccess(entity, resolveAccess(entity, userId, roles), 'write', 'update');
  }

  checkDelete(entity: E, userId: string, roles: string[]) {
    assertAccess(entity, resolveAccess(entity, userId, roles), 'manage', 'delete');
  }

  /** Visibility and shares: the owner or an admin (spec 069). */
  checkManage(entity: E, userId: string, roles: string[]) {
    assertAccess(entity, resolveAccess(entity, userId, roles), 'manage', 'manage');
  }

  checkEntitySource(roles: string[], value: EntitySource | undefined) {
    checkEntitySource(value, roles);
  }

  /** Public, owned or shared with the user (spec 069); everything for an admin. */
  buildQueryPredicate(userId: string, roles: string[]): QueryCriteria {
    if (roles.includes(RMU_ADMIN)) return QueryCriteria.empty();
    return QueryCriteria.anyOf([
      QueryCriteria.eq('accessType', 'public'),
      QueryCriteria.eq('owner', userId),
      QueryCriteria.eq('shares.userId', userId),
    ]);
  }
}
