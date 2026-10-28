import type { TraitGuardPort } from '../../application/ports/trait-guard.port.js';
import { Trait } from '../../domain/aggregates/trait.js';
import { ForbiddenError } from '../../../shared/domain/errors/errors.js';
import { RMU_ADMIN, RMU_USER } from '../../../shared/domain/entities/user-roles.js';
import { QueryCriteria } from '../../../shared/application/criteria/query-criteria.js';

/**
 * Traits are public and have no accessType (spec 016, decision 4): races and characters of any user reference them,
 * so every authenticated user reads and lists all of them. Only the owner or an admin changes or deletes one.
 * BaseEntityGuard needs accessType, hence this own guard.
 */
export class TraitGuardAdapter implements TraitGuardPort {
  checkRead(): void {}

  checkCreate(roles: string[]): void {
    if (roles.includes(RMU_ADMIN)) return;
    if (roles.includes(RMU_USER)) return;
    throw new ForbiddenError('You do not have permission to create this entity');
  }

  checkUpdate(entity: Trait, userId: string, roles: string[]): void {
    if (this.canChange(entity, userId, roles)) return;
    throw new ForbiddenError('You do not have permission to update this entity');
  }

  checkDelete(entity: Trait, userId: string, roles: string[]): void {
    if (this.canChange(entity, userId, roles)) return;
    throw new ForbiddenError('You do not have permission to delete this entity');
  }

  buildQueryPredicate(): QueryCriteria {
    return QueryCriteria.empty();
  }

  private canChange(entity: Trait, userId: string, roles: string[]): boolean {
    if (roles.includes(RMU_ADMIN)) return true;
    return entity.owner === userId;
  }
}
