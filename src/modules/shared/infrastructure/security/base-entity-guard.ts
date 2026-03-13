import { ForbiddenError } from '../../domain/errors/errors';
import { RMU_ADMIN } from '../../domain/entities/user-roles';
import { HasOwner } from '../../domain/entities/has-owner';

export abstract class BaseEntityGuard<E extends HasOwner> implements BaseEntityGuard<E> {
  checkRead(entity: E, userId: string, roles: string[]) {
    if (roles.includes(RMU_ADMIN)) return;
    if (entity.owner === userId) return;
    throw new ForbiddenError('You do not have permission to read this entity');
  }

  checkCreate(roles: string[]) {
    if (!roles.includes(RMU_ADMIN)) {
      throw new ForbiddenError('You do not have permission to create this entity');
    }
  }

  checkUpdate(entity: E, userId: string, roles: string[]) {
    if (roles.includes(RMU_ADMIN)) return;
    if (entity.owner === userId) return;
    throw new ForbiddenError('You do not have permission to update this entity');
  }

  checkDelete(entity: E, userId: string, roles: string[]) {
    if (roles.includes(RMU_ADMIN)) return;
    if (entity.owner === userId) return;
    throw new ForbiddenError('You do not have permission to delete this entity');
  }
}
