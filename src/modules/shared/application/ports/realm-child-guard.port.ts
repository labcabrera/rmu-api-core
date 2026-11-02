import { QueryCriteria } from '../criteria/query-criteria.js';
import type { EntitySource } from '../../domain/entities/entity-source.js';
import type { AccessLevel } from '../../domain/services/entity-access.js';

/**
 * Guard of an entity that hangs from a realm (spec 069): its access is the one of its realm, read in process, so the
 * checks are asynchronous. Changing and deleting need `write` on the realm; a system child stays read-only for
 * non-admins.
 */
export interface RealmChildGuard<E> {
  checkCreate(roles: string[]): void;

  checkEntitySource(roles: string[], value: EntitySource | undefined): void;

  checkRead(entity: E, userId: string, roles: string[]): Promise<void>;

  checkUpdate(entity: E, userId: string, roles: string[]): Promise<void>;

  checkDelete(entity: E, userId: string, roles: string[]): Promise<void>;

  /** `access` of the responses, one per entity. */
  accessOf(entities: E[], userId: string, roles: string[]): Promise<AccessLevel[]>;

  buildQueryPredicate(userId: string, roles: string[]): Promise<QueryCriteria>;
}
