import type { EntitySource } from '../entities/entity-source.js';
import { RMU_ADMIN } from '../entities/user-roles.js';
import { ForbiddenError } from '../errors/errors.js';

/** Error code of a change to a rulebook entity (or a request for `system`) by a non-admin (spec 063). */
export const SYSTEM_ENTITY_ADMIN_ONLY = 'system-entity-admin-only';

type ChangeableEntity = { owner?: string | null; entitySource?: EntitySource | null };

/**
 * Admin: always. System entity: admin only. User entity: its owner (and the admin, until the friends spec).
 * A missing source counts as `user`, so a document stored before spec 063 keeps the owner rule.
 */
export function canChangeEntity(entity: ChangeableEntity, userId: string, roles: string[]): boolean {
  if (roles.includes(RMU_ADMIN)) return true;
  if (entity.entitySource === 'system') return false;
  return !!entity.owner && entity.owner === userId;
}

/** Throws ForbiddenError(SYSTEM_ENTITY_ADMIN_ONLY) when a non-admin asks for 'system'. undefined and 'user' pass. */
export function checkEntitySource(value: EntitySource | undefined, roles: string[]): void {
  if (value !== 'system') return;
  if (roles.includes(RMU_ADMIN)) return;
  throw new ForbiddenError('Only an admin sets the system entity source', SYSTEM_ENTITY_ADMIN_ONLY);
}

/** Throws ForbiddenError: SYSTEM_ENTITY_ADMIN_ONLY for a system entity, 'forbidden' otherwise. */
export function assertCanChangeEntity(entity: ChangeableEntity, userId: string, roles: string[], action: 'update' | 'delete'): void {
  if (canChangeEntity(entity, userId, roles)) return;
  if (entity.entitySource === 'system') {
    throw new ForbiddenError(`Only an admin can ${action} a system entity`, SYSTEM_ENTITY_ADMIN_ONLY);
  }
  throw new ForbiddenError(`You do not have permission to ${action} this entity`);
}
