import { describe, expect, it } from 'vitest';
import { BaseEntityGuard } from '../../../../src/modules/shared/infrastructure/security/base-entity-guard.js';
import type { RbacEntity } from '../../../../src/modules/shared/domain/entities/rbac-entity.js';
import type { EntitySource } from '../../../../src/modules/shared/domain/entities/entity-source.js';
import { RealmGuardAdapter } from '../../../../src/modules/realms/infrastructure/security/realm-guard.adapter.js';
import { TraitGuardAdapter } from '../../../../src/modules/traits/infrastructure/security/trait-guard.adapter.js';
import { Trait } from '../../../../src/modules/traits/domain/aggregates/trait.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';

type User = { id: string; roles: readonly string[] };

class TestGuard extends BaseEntityGuard<RbacEntity> {}

const rbac = (entitySource: EntitySource, accessType = 'private'): RbacEntity => ({ owner: OWNER.id, accessType, entitySource });

const trait = (entitySource: EntitySource) =>
  Trait.fromProps({
    id: 'night-vision',
    name: 'Night vision',
    category: 'senses',
    isTalent: true,
    specialization: null,
    isTierBased: false,
    maxTier: undefined,
    adquisitionCost: 5,
    tierCost: undefined,
    description: undefined,
    owner: OWNER.id,
    entitySource,
    createdAt: new Date('2026-01-01T00:00:00Z'),
  });

// Spec 063, decision 4.
const changes: [string, User, EntitySource, string | null][] = [
  ['the admin', ADMIN, 'system', null],
  ['the admin', ADMIN, 'user', null],
  ['the owner', OWNER, 'system', 'system-entity-admin-only'],
  ['the owner', OWNER, 'user', null],
  ['another user', OTHER, 'system', 'system-entity-admin-only'],
  ['another user', OTHER, 'user', 'forbidden'],
];

const errorCode = (run: () => void): string | null => {
  try {
    run();
    return null;
  } catch (error) {
    return (error as { code: string }).code;
  }
};

describe('entity guards (spec 063)', () => {
  describe.each([
    ['BaseEntityGuard', new TestGuard(), rbac],
    ['RealmGuardAdapter', new RealmGuardAdapter(), rbac],
    ['TraitGuardAdapter', new TraitGuardAdapter(), trait],
  ] as const)('%s', (_, guard, build) => {
    const g = guard as unknown as BaseEntityGuard<RbacEntity>;
    const make = build as (source: EntitySource) => RbacEntity;

    it.each(changes)('checkUpdate and checkDelete: %s on a %s entity -> %s', (__, user, source, code) => {
      expect(errorCode(() => g.checkUpdate(make(source), user.id, [...user.roles]))).toBe(code);
      expect(errorCode(() => g.checkDelete(make(source), user.id, [...user.roles]))).toBe(code);
    });

    it('checkEntitySource: only an admin asks for system', () => {
      expect(errorCode(() => g.checkEntitySource([...ADMIN.roles], 'system'))).toBeNull();
      expect(errorCode(() => g.checkEntitySource([...OWNER.roles], 'user'))).toBeNull();
      expect(errorCode(() => g.checkEntitySource([...OWNER.roles], undefined))).toBeNull();
      expect(errorCode(() => g.checkEntitySource([...OWNER.roles], 'system'))).toBe('system-entity-admin-only');
    });

    it('checkCreate is unchanged: a user or an admin', () => {
      expect(errorCode(() => g.checkCreate([...OWNER.roles]))).toBeNull();
      expect(errorCode(() => g.checkCreate([...ADMIN.roles]))).toBeNull();
      expect(errorCode(() => g.checkCreate([...NO_ROLES.roles]))).toBe('forbidden');
    });
  });

  it('keeps the read rule of the base guard: public, or the owner or an admin', () => {
    const guard = new TestGuard();
    expect(errorCode(() => guard.checkRead(rbac('system', 'public'), OTHER.id, [...OTHER.roles]))).toBeNull();
    expect(errorCode(() => guard.checkRead(rbac('system'), OWNER.id, [...OWNER.roles]))).toBeNull();
    expect(errorCode(() => guard.checkRead(rbac('user'), OTHER.id, [...OTHER.roles]))).toBe('forbidden');
  });

  it('lets everyone read a trait, system or not', () => {
    expect(() => new TraitGuardAdapter().checkRead()).not.toThrow();
  });

  it('keeps the realm generic rule', () => {
    const guard = new RealmGuardAdapter();
    expect(errorCode(() => guard.checkGeneric([...ADMIN.roles]))).toBeNull();
    expect(errorCode(() => guard.checkGeneric([...OWNER.roles]))).toBe('forbidden');
  });
});
