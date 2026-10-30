import { beforeEach, describe, expect, it } from 'vitest';
import { Enumeration } from '../../../../src/modules/enumerations/domain/aggregates/enumeration.js';
import type { EnumerationProps } from '../../../../src/modules/enumerations/domain/aggregates/enumeration-props.js';
import type { EnumerationRepository } from '../../../../src/modules/enumerations/application/ports/enumeration-repository.port.js';
import { EnumerationGuardAdapter } from '../../../../src/modules/enumerations/infrastructure/security/enumeration-guard.adapter.js';
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateEnumerationHandler } from '../../../../src/modules/enumerations/application/cqrs/handlers/create-enumeration.handler.js';
import { CreateEnumerationCommand } from '../../../../src/modules/enumerations/application/cqrs/commands/create-enumeration.command.js';
import { DeleteEnumerationHandler } from '../../../../src/modules/enumerations/application/cqrs/handlers/delete-enumeration.handler.js';
import { DeleteEnumerationCommand } from '../../../../src/modules/enumerations/application/cqrs/commands/delete-enumeration.command.js';
import { Realm } from '../../../../src/modules/realms/domain/aggregates/realm.js';
import { RealmGuardAdapter } from '../../../../src/modules/realms/infrastructure/security/realm-guard.adapter.js';
import { InMemoryRepository } from '../../support/in-memory.repository.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';

class InMemoryEnumerationRepository extends InMemoryRepository<Enumeration> implements EnumerationRepository {
  findByKeyCategoryAndRealm(key: string, category: string, realmId: string | null): Promise<Enumeration | null> {
    const found = [...this.items.values()].find(e => e.key === key && e.category === category && e.realmId === realmId);
    return Promise.resolve(found ?? null);
  }
}

type User = { id: string; roles: readonly string[] };

const enumeration = (overrides: Partial<EnumerationProps> = {}) =>
  Enumeration.fromProps({
    id: 'enum-1',
    key: 'westron',
    name: 'Westron',
    category: 'language',
    realmId: null,
    description: null,
    imageUrl: null,
    owner: OWNER.id,
    accessType: 'private',
    entitySource: 'system',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: undefined,
    ...overrides,
  });

const realm = (accessType: 'private' | 'public' = 'private') =>
  Realm.fromProps({
    id: 'realm-1',
    name: 'Middle-earth',
    magicPresence: 'limited',
    shortDescription: undefined,
    description: undefined,
    imageUrl: undefined,
    owner: OWNER.id,
    accessType,
    generic: false,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: undefined,
  });

describe('enumeration command handlers', () => {
  let enumerations: InMemoryEnumerationRepository;
  let realms: InMemoryRepository<Realm>;
  const guard = new EnumerationGuardAdapter();

  beforeEach(() => {
    enumerations = new InMemoryEnumerationRepository(enumeration());
    realms = new InMemoryRepository(realm());
  });

  describe('CreateEnumerationHandler', () => {
    const command = (key: string, realmId: string | null, user: User = OWNER, name = key) =>
      new CreateEnumerationCommand(key, name, 'language', realmId, 'A tongue', null, 'public', user.id, [...user.roles]);

    const handler = () => new CreateEnumerationHandler(enumerations, guard, realms, new RealmGuardAdapter());

    it('stores a user enumeration owned by the user, with the key normalized from the name (spec 050)', async () => {
      const created = await handler().execute(command('Black Speech', 'realm-1', OWNER, 'Black Speech'));

      expect(created).toMatchObject({
        key: 'black-speech',
        name: 'Black Speech',
        category: 'language',
        realmId: 'realm-1',
        description: 'A tongue',
        owner: OWNER.id,
        accessType: 'public',
        entitySource: 'user',
      });
      expect(enumerations.items.get(created.id)).toBe(created);
    });

    it('allows the same key and category in another realm', async () => {
      const created = await handler().execute(command('westron', 'realm-1'));

      expect(created.realmId).toBe('realm-1');
      expect(enumerations.items.size).toBe(2);
    });

    it('rejects a duplicated key, category and realm, also in another spelling', async () => {
      await expect(handler().execute(command('westron', null, ADMIN))).rejects.toThrow(ConflictError);
      await expect(handler().execute(command('Westron ', null, ADMIN))).rejects.toThrow(ConflictError);
      expect(enumerations.items.size).toBe(1);
    });

    it('leaves the global scope to admins (spec 050)', async () => {
      await expect(handler().execute(command('quenya', null))).rejects.toMatchObject({ code: 'enumeration-global-admin-only' });
      expect((await handler().execute(command('quenya', null, ADMIN))).realmId).toBeNull();
    });

    it('rejects a name without letters or digits', async () => {
      await expect(handler().execute(command('--', 'realm-1'))).rejects.toMatchObject({ code: 'invalid-enumeration-key' });
    });

    it('rejects a user without the player or admin role', async () => {
      await expect(handler().execute(command('quenya', null, NO_ROLES))).rejects.toThrow(ForbiddenError);
      expect(enumerations.items.size).toBe(1);
    });

    it('lets an admin add an enumeration to the realm of another user', async () => {
      const created = await handler().execute(command('quenya', 'realm-1', ADMIN));

      expect(created).toMatchObject({ realmId: 'realm-1', owner: ADMIN.id });
    });

    it('rejects an unknown realm', async () => {
      await expect(handler().execute(command('quenya', 'missing'))).rejects.toThrow(ValidationError);
      expect(enumerations.items.size).toBe(1);
    });

    it.each(['private', 'public'] as const)('rejects another user in a %s realm of the owner', async accessType => {
      realms.items.set('realm-1', realm(accessType));

      await expect(handler().execute(command('quenya', 'realm-1', OTHER))).rejects.toThrow(ForbiddenError);
      expect(enumerations.items.size).toBe(1);
    });
  });

  describe('DeleteEnumerationHandler', () => {
    const handler = () => new DeleteEnumerationHandler(enumerations, guard);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s delete the enumeration and returns its last state', async (_, user) => {
      const deleted = await handler().execute(new DeleteEnumerationCommand('enum-1', user.id, [...user.roles]));

      expect(deleted).toMatchObject({ id: 'enum-1', key: 'westron' });
      expect(enumerations.items.has('enum-1')).toBe(false);
    });

    it('forbids another user', async () => {
      await expect(handler().execute(new DeleteEnumerationCommand('enum-1', OTHER.id, [...OTHER.roles]))).rejects.toThrow(ForbiddenError);
      expect(enumerations.items.has('enum-1')).toBe(true);
    });

    it('fails on an unknown enumeration', async () => {
      await expect(handler().execute(new DeleteEnumerationCommand('missing', OWNER.id, [...OWNER.roles]))).rejects.toThrow(NotFoundError);
    });
  });
});
