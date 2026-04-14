import { FilterQuery } from 'mongoose';

export interface EntityGuard<E> {
  checkCreate(roles: string[]): void;

  checkRead(entity: E, userId: string, roles: string[]): void;

  checkUpdate(entity: E, userId: string, roles: string[]): void;

  checkDelete(entity: E, userId: string, roles: string[]): void;

  buildQueryPredicate(userId: string, roles: string[]): FilterQuery<any>;
}
