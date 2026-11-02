import { describe, expect, it } from 'vitest';
import {
  type AccessLevel,
  type AccessSubject,
  assertAccess,
  atLeast,
  resolveAccess,
  resolveChildAccess,
} from '../../../../src/modules/shared/domain/services/entity-access.js';
import type { EntityShare, ShareLevel } from '../../../../src/modules/shared/domain/entities/entity-share.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';

const FRIEND = { id: 'friend-1', roles: ['rmu-user'] } as const;

const share = (userId: string, level: ShareLevel): EntityShare => ({ userId, userName: userId, level, grantedAt: new Date(0) });

const entity = (entitySource: 'system' | 'user', accessType: 'public' | 'private', level?: ShareLevel): AccessSubject => ({
  owner: OWNER.id,
  accessType,
  entitySource,
  shares: level ? [share(FRIEND.id, level)] : [],
});

type User = { id: string; roles: readonly string[] };

// Spec 069, decision 1.
const cases: [string, User, AccessSubject, AccessLevel][] = [
  ['admin, private user entity', ADMIN, entity('user', 'private'), 'manage'],
  ['admin, private system entity', ADMIN, entity('system', 'private'), 'manage'],
  ['owner, private user entity', OWNER, entity('user', 'private'), 'manage'],
  ['owner (importer), private system entity', OWNER, entity('system', 'private'), 'read'],
  ['write share, private user entity', FRIEND, entity('user', 'private', 'write'), 'write'],
  ['read share, private user entity', FRIEND, entity('user', 'private', 'read'), 'read'],
  ['write share, public user entity', FRIEND, entity('user', 'public', 'write'), 'write'],
  ['no share, public user entity', OTHER, entity('user', 'public'), 'read'],
  ['no share, private user entity', OTHER, entity('user', 'private'), 'none'],
  ['no roles, public user entity', NO_ROLES, entity('user', 'public'), 'read'],
  ['write share, private system entity', FRIEND, entity('system', 'private', 'write'), 'read'],
  ['read share, private system entity', FRIEND, entity('system', 'private', 'read'), 'read'],
  ['no share, private system entity', OTHER, entity('system', 'private'), 'none'],
  ['no share, public system entity', OTHER, entity('system', 'public'), 'read'],
];

describe('resolveAccess (spec 069)', () => {
  it.each(cases)('%s', (_, user, subject, expected) => {
    expect(resolveAccess(subject, user.id, [...user.roles])).toBe(expected);
  });

  it('reads documents stored before specs 063 and 069 as user entities without shares', () => {
    expect(resolveAccess({ owner: OWNER.id, accessType: 'private' }, OWNER.id, [...OWNER.roles])).toBe('manage');
    expect(resolveAccess({ owner: OWNER.id, accessType: 'private' }, OTHER.id, [...OTHER.roles])).toBe('none');
  });
});

describe('resolveChildAccess (spec 069)', () => {
  const userChild: AccessSubject = { owner: OWNER.id, accessType: 'private', entitySource: 'user' };
  const systemChild: AccessSubject = { owner: OWNER.id, accessType: 'public', entitySource: 'system' };

  it('follows the realm, at most write', () => {
    expect(resolveChildAccess(userChild, entity('user', 'private'), OWNER.id, [...OWNER.roles])).toBe('write');
    expect(resolveChildAccess(userChild, entity('user', 'private', 'write'), FRIEND.id, [...FRIEND.roles])).toBe('write');
    expect(resolveChildAccess(userChild, entity('user', 'private', 'read'), FRIEND.id, [...FRIEND.roles])).toBe('read');
    expect(resolveChildAccess(userChild, entity('user', 'public'), OTHER.id, [...OTHER.roles])).toBe('read');
    expect(resolveChildAccess(userChild, entity('user', 'private'), OTHER.id, [...OTHER.roles])).toBe('none');
  });

  it('ignores the accessType of the child: a public child of a private realm stays hidden', () => {
    const publicChild: AccessSubject = { ...userChild, accessType: 'public' };
    expect(resolveChildAccess(publicChild, entity('user', 'private'), OTHER.id, [...OTHER.roles])).toBe('none');
  });

  it('keeps a system child read-only for non-admins, also for the realm owner', () => {
    expect(resolveChildAccess(systemChild, entity('user', 'private'), OWNER.id, [...OWNER.roles])).toBe('read');
    expect(resolveChildAccess(systemChild, entity('user', 'private', 'write'), FRIEND.id, [...FRIEND.roles])).toBe('read');
    expect(resolveChildAccess(systemChild, entity('user', 'private'), ADMIN.id, [...ADMIN.roles])).toBe('write');
  });

  it('uses the own rules of a child without realm (a global enumeration)', () => {
    expect(resolveChildAccess(userChild, null, OWNER.id, [...OWNER.roles])).toBe('manage');
    expect(resolveChildAccess(userChild, null, OTHER.id, [...OTHER.roles])).toBe('none');
  });
});

describe('assertAccess', () => {
  const code = (run: () => void) => {
    try {
      run();
      return null;
    } catch (error) {
      return (error as { code: string }).code;
    }
  };

  it('passes when the level is enough', () => {
    expect(atLeast('manage', 'write')).toBe(true);
    expect(code(() => assertAccess(entity('user', 'private'), 'write', 'write', 'update'))).toBeNull();
  });

  it('answers system-entity-admin-only for a change of a system entity and forbidden otherwise', () => {
    expect(code(() => assertAccess(entity('system', 'public'), 'read', 'write', 'update'))).toBe('system-entity-admin-only');
    expect(code(() => assertAccess(entity('system', 'private'), 'none', 'read', 'read'))).toBe('forbidden');
    expect(code(() => assertAccess(entity('user', 'private'), 'write', 'manage', 'delete'))).toBe('forbidden');
  });
});
