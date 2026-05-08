import { QueryCriteria } from '../criteria/query-criteria';

export interface EntityGuard<E> {
  checkCreate(roles: string[]): void;

  checkRead(entity: E, userId: string, roles: string[]): void;

  checkUpdate(entity: E, userId: string, roles: string[]): void;

  checkDelete(entity: E, userId: string, roles: string[]): void;

  buildQueryPredicate(userId: string, roles: string[]): QueryCriteria;
}
