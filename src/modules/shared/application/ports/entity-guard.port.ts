import { QueryCriteria } from '../criteria/query-criteria.js';
import type { EntitySource } from '../../domain/entities/entity-source.js';
import type { AccessLevel } from '../../domain/services/entity-access.js';

export interface EntityGuard<E> {
  /** The level of the user on the entity (spec 069): `access` of the responses. */
  accessOf(entity: E, userId: string, roles: string[]): AccessLevel;

  checkCreate(roles: string[]): void;

  checkRead(entity: E, userId: string, roles: string[]): void;

  /** Needs `write` (spec 069): system entities, admin only; user entities, the owner, a writer or an admin. */
  checkUpdate(entity: E, userId: string, roles: string[]): void;

  /** Needs `manage`: the owner or an admin (system entities: admin only). */
  checkDelete(entity: E, userId: string, roles: string[]): void;

  /** Needs `manage`: visibility and shares (spec 069). */
  checkManage(entity: E, userId: string, roles: string[]): void;

  /** Only an admin asks for `system`, on create or on update (403 `system-entity-admin-only`). */
  checkEntitySource(roles: string[], value: EntitySource | undefined): void;

  buildQueryPredicate(userId: string, roles: string[]): QueryCriteria;
}
