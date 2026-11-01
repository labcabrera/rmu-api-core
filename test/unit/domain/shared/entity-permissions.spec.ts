import { describe, expect, it } from 'vitest';
import {
  assertCanChangeEntity,
  canChangeEntity,
  checkEntitySource,
  SYSTEM_ENTITY_ADMIN_ONLY,
} from '../../../../src/modules/shared/domain/services/entity-permissions.js';
import type { EntitySource } from '../../../../src/modules/shared/domain/entities/entity-source.js';
import { ForbiddenError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { ADMIN, OTHER, OWNER } from '../../support/users.js';

type User = { id: string; roles: readonly string[] };

const entity = (entitySource: EntitySource | undefined | null) => ({ owner: OWNER.id, entitySource });

// The rule of spec 063, decision 4: a missing source counts as `user`.
const table: [string, User, EntitySource | undefined | null, boolean][] = [
  ['the admin', ADMIN, 'system', true],
  ['the admin', ADMIN, 'user', true],
  ['the admin', ADMIN, undefined, true],
  ['the owner', OWNER, 'system', false],
  ['the owner', OWNER, 'user', true],
  ['the owner', OWNER, undefined, true],
  ['the owner', OWNER, null, true],
  ['another user', OTHER, 'system', false],
  ['another user', OTHER, 'user', false],
  ['another user', OTHER, undefined, false],
];

describe('entity permissions (spec 063)', () => {
  describe('canChangeEntity', () => {
    it.each(table)('%s on a %s entity: %s', (_, user, source, expected) => {
      expect(canChangeEntity(entity(source), user.id, [...user.roles])).toBe(expected);
    });

    it('does not let anyone but an admin change an entity without owner', () => {
      expect(canChangeEntity({ owner: undefined, entitySource: 'user' }, OWNER.id, [...OWNER.roles])).toBe(false);
      expect(canChangeEntity({ owner: undefined, entitySource: 'user' }, ADMIN.id, [...ADMIN.roles])).toBe(true);
    });
  });

  describe('assertCanChangeEntity', () => {
    it.each(table)('%s on a %s entity passes only when allowed (%s)', (_, user, source, allowed) => {
      for (const action of ['update', 'delete'] as const) {
        const run = () => assertCanChangeEntity(entity(source), user.id, [...user.roles], action);
        if (allowed) expect(run).not.toThrow();
        else expect(run).toThrow(ForbiddenError);
      }
    });

    it('answers system-entity-admin-only for a system entity and forbidden otherwise', () => {
      const code = (source: EntitySource, user: User) => {
        try {
          assertCanChangeEntity(entity(source), user.id, [...user.roles], 'update');
        } catch (error) {
          return { status: (error as ForbiddenError).statusCode, code: (error as ForbiddenError).code };
        }
        return null;
      };
      expect(code('system', OWNER)).toEqual({ status: 403, code: SYSTEM_ENTITY_ADMIN_ONLY });
      expect(code('system', OTHER)).toEqual({ status: 403, code: SYSTEM_ENTITY_ADMIN_ONLY });
      expect(code('user', OTHER)).toEqual({ status: 403, code: 'forbidden' });
      expect(SYSTEM_ENTITY_ADMIN_ONLY).toBe('system-entity-admin-only');
    });
  });

  describe('checkEntitySource', () => {
    it.each([
      ['the admin', ADMIN, 'system'],
      ['the admin', ADMIN, 'user'],
      ['the admin', ADMIN, undefined],
      ['a user', OWNER, 'user'],
      ['a user', OWNER, undefined],
    ] as const)('lets %s ask for %s', (_, user, value) => {
      expect(() => checkEntitySource(value, [...user.roles])).not.toThrow();
    });

    it('forbids a non-admin to ask for system', () => {
      expect(() => checkEntitySource('system', [...OWNER.roles])).toThrow(
        expect.objectContaining({ statusCode: 403, code: SYSTEM_ENTITY_ADMIN_ONLY }) as Error,
      );
      expect(() => checkEntitySource('system', [])).toThrow(ForbiddenError);
    });
  });
});
