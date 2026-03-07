import { ForbiddenError } from '../../domain/errors/errors';

export class BaseEntityGuard<E> {
  checkCreate(roles: string[]) {
    if (!roles.includes('rmu-admin')) {
      throw new ForbiddenError('You do not have permission to create a realm');
    }
  }

  checkUpdate(entity: E, userId: string, roles: string[]) {
    if (roles.includes('rmu-admin')) return;
    if ((entity as any).owner === userId) return;
    throw new ForbiddenError('You do not have permission to update this realm');
  }

  checkDelete(entity: E, userId: string, roles: string[]) {
    if (roles.includes('rmu-admin')) return;
    if ((entity as any).owner === userId) return;
    throw new ForbiddenError('You do not have permission to delete this realm');
  }
}
