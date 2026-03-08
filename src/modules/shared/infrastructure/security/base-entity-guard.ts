import { ForbiddenError } from '../../domain/errors/errors';
import { RMU_ADMIN } from '../../domain/entities/user-roles';
import { HasOwner } from '../../domain/entities/has-owner';

export class BaseEntityGuard<E extends HasOwner> {
  checkCreate(roles: string[]) {
    if (!roles.includes(RMU_ADMIN)) {
      throw new ForbiddenError('You do not have permission to create a realm');
    }
  }

  checkUpdate(entity: E, userId: string, roles: string[]) {
    if (roles.includes(RMU_ADMIN)) return;
    if (entity.owner === userId) return;
    throw new ForbiddenError('You do not have permission to update this realm');
  }

  checkDelete(entity: E, userId: string, roles: string[]) {
    if (roles.includes(RMU_ADMIN)) return;
    if (entity.owner === userId) return;
    throw new ForbiddenError('You do not have permission to delete this realm');
  }
}
