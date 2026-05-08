import { FilterQuery } from 'mongoose';
import { TraitGuardPort } from '../../application/ports/trait-guard.port';
import { Trait } from '../../domain/aggregates/trait';
import { ForbiddenError } from 'src/modules/shared/domain/errors/errors';
import { RMU_ADMIN, RMU_USER } from 'src/modules/shared/domain/entities/user-roles';

export class TraitGuardAdapter implements TraitGuardPort {
  checkRead(entity: Trait, userId: string, roles: string[]): void {
    if (this.canAccess(entity, userId, roles)) return;
    throw new ForbiddenError('You do not have permission to read this entity');
  }

  checkCreate(roles: string[]): void {
    if (roles.includes(RMU_ADMIN)) return;
    if (roles.includes(RMU_USER)) return;
    throw new ForbiddenError('You do not have permission to create this entity');
  }

  checkUpdate(entity: Trait, userId: string, roles: string[]): void {
    if (this.canAccess(entity, userId, roles)) return;
    throw new ForbiddenError('You do not have permission to update this entity');
  }

  checkDelete(entity: Trait, userId: string, roles: string[]): void {
    if (this.canAccess(entity, userId, roles)) return;
    throw new ForbiddenError('You do not have permission to delete this entity');
  }

  buildQueryPredicate(userId: string, roles: string[]): FilterQuery<any> {
    if (roles.includes(RMU_ADMIN)) return {};
    return { owner: userId };
  }

  private canAccess(entity: Trait, userId: string, roles: string[]): boolean {
    if (roles.includes(RMU_ADMIN)) return true;
    return entity.owner === userId;
  }
}
