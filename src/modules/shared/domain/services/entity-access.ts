import type { EntitySource } from '../entities/entity-source.js';
import type { EntityShare } from '../entities/entity-share.js';
import { RMU_ADMIN } from '../entities/user-roles.js';
import { ForbiddenError } from '../errors/errors.js';
import { SYSTEM_ENTITY_ADMIN_ONLY } from './entity-permissions.js';

/**
 * What a user can do with an entity (spec 069), from less to more:
 * - none: not even see it;
 * - read: read and list it;
 * - write: change it and add, change or delete what hangs from it;
 * - manage: also delete it, change its visibility and its shares.
 */
export const ACCESS_LEVELS = ['none', 'read', 'write', 'manage'] as const;

export type AccessLevel = (typeof ACCESS_LEVELS)[number];

/** The fields the access depends on. Missing ones read as the defaults of documents stored before specs 063 and 069. */
export type AccessSubject = {
  owner?: string | null;
  accessType?: string | null;
  entitySource?: EntitySource | null;
  shares?: readonly EntityShare[] | null;
  /**
   * Members of strategic games on the entity (a realm) whose owner reads it (spec 071, decision 2): they read it. The
   * realm keeps the list up to date.
   */
  gameReaderIds?: readonly string[] | null;
};

export function atLeast(level: AccessLevel, required: AccessLevel): boolean {
  return ACCESS_LEVELS.indexOf(level) >= ACCESS_LEVELS.indexOf(required);
}

/**
 * The access of a user to a root entity (spec 069, decision 1):
 * 1. an admin manages everything;
 * 2. a system entity is read when public, shared with the user (a write share reads too: only admins change it) or
 *    owned by the user (who imported it, spec 063);
 * 3. the owner manages a user entity;
 * 4. a share gives its level;
 * 5. a public entity is read by everyone;
 * 6. otherwise, a member of a strategic game on it reads it (spec 071).
 */
export function resolveAccess(entity: AccessSubject, userId: string, roles: readonly string[]): AccessLevel {
  const level = resolveOwnAccess(entity, userId, roles);
  if (level !== 'none') return level;
  return entity.gameReaderIds?.includes(userId) ? 'read' : 'none';
}

/** The access without the strategic games (rules 1 to 5): what a game owner needs to pass the realm on (spec 071). */
export function resolveOwnAccess(entity: AccessSubject, userId: string, roles: readonly string[]): AccessLevel {
  if (roles.includes(RMU_ADMIN)) return 'manage';
  const share = entity.shares?.find(s => s.userId === userId);
  const isPublic = entity.accessType === 'public';
  const isOwner = !!entity.owner && entity.owner === userId;
  if (entity.entitySource === 'system') return isPublic || share || isOwner ? 'read' : 'none';
  if (isOwner) return 'manage';
  if (share) return share.level;
  return isPublic ? 'read' : 'none';
}

/**
 * The access to an entity that hangs from a parent (a race or an enumeration of a realm): the access to the parent, at
 * most `write` (deleting a child needs `write`), and at most `read` for a system child of a non-admin. Without parent it
 * is a root entity.
 */
export function resolveChildAccess(
  child: AccessSubject,
  parent: AccessSubject | null,
  userId: string,
  roles: readonly string[],
): AccessLevel {
  if (!parent) return resolveAccess(child, userId, roles);
  const level = resolveAccess(parent, userId, roles);
  if (level === 'none' || level === 'read') return level;
  if (roles.includes(RMU_ADMIN)) return 'write';
  return child.entitySource === 'system' ? 'read' : 'write';
}

/**
 * Throws ForbiddenError when `level` does not reach `required`: `system-entity-admin-only` when a system entity is
 * changed, the default `forbidden` otherwise.
 */
export function assertAccess(entity: AccessSubject, level: AccessLevel, required: AccessLevel, action: string): void {
  if (atLeast(level, required)) return;
  if (entity.entitySource === 'system' && required !== 'read') {
    throw new ForbiddenError(`Only an admin can ${action} a system entity`, SYSTEM_ENTITY_ADMIN_ONLY);
  }
  throw new ForbiddenError(`You do not have permission to ${action} this entity`);
}
