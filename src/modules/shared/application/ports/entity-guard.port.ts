import { QueryCriteria } from '../criteria/query-criteria.js';
import type { EntitySource } from '../../domain/entities/entity-source.js';

export interface EntityGuard<E> {
  checkCreate(roles: string[]): void;

  checkRead(entity: E, userId: string, roles: string[]): void;

  /** System entities: admin only. User entities: the owner or an admin (spec 063). */
  checkUpdate(entity: E, userId: string, roles: string[]): void;

  /** Same rule as checkUpdate. */
  checkDelete(entity: E, userId: string, roles: string[]): void;

  /** Only an admin asks for `system`, on create or on update (403 `system-entity-admin-only`). */
  checkEntitySource(roles: string[], value: EntitySource | undefined): void;

  buildQueryPredicate(userId: string, roles: string[]): QueryCriteria;
}
