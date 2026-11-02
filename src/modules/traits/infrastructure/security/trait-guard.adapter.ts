import type { TraitGuardPort } from '../../application/ports/trait-guard.port.js';
import { Trait } from '../../domain/aggregates/trait.js';
import { ForbiddenError } from '../../../shared/domain/errors/errors.js';
import { RMU_ADMIN, RMU_USER } from '../../../shared/domain/entities/user-roles.js';
import type { EntitySource } from '../../../shared/domain/entities/entity-source.js';
import { assertCanChangeEntity, canChangeEntity, checkEntitySource } from '../../../shared/domain/services/entity-permissions.js';
import type { AccessLevel } from '../../../shared/domain/services/entity-access.js';
import { QueryCriteria } from '../../../shared/application/criteria/query-criteria.js';

/**
 * Traits are public and have no accessType (spec 016, decision 4): races and characters of any user reference them,
 * so every authenticated user reads and lists all of them. BaseEntityGuard needs accessType, hence this own guard.
 * Changes follow the common rule (spec 063): a system trait only an admin; a user trait its owner or an admin.
 */
export class TraitGuardAdapter implements TraitGuardPort {
  accessOf(entity: Trait, userId: string, roles: string[]): AccessLevel {
    return canChangeEntity(entity, userId, roles) ? 'manage' : 'read';
  }

  checkRead(): void {}

  checkCreate(roles: string[]): void {
    if (roles.includes(RMU_ADMIN)) return;
    if (roles.includes(RMU_USER)) return;
    throw new ForbiddenError('You do not have permission to create this entity');
  }

  checkUpdate(entity: Trait, userId: string, roles: string[]): void {
    assertCanChangeEntity(entity, userId, roles, 'update');
  }

  checkDelete(entity: Trait, userId: string, roles: string[]): void {
    assertCanChangeEntity(entity, userId, roles, 'delete');
  }

  checkManage(entity: Trait, userId: string, roles: string[]): void {
    assertCanChangeEntity(entity, userId, roles, 'update');
  }

  checkEntitySource(roles: string[], value: EntitySource | undefined): void {
    checkEntitySource(value, roles);
  }

  buildQueryPredicate(): QueryCriteria {
    return QueryCriteria.empty();
  }
}
