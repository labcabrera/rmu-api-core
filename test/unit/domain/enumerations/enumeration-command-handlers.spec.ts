import { beforeEach, describe, expect, it } from 'vitest';
import { Enumeration } from '../../../../src/modules/enumerations/domain/aggregates/enumeration.js';
import type { EnumerationProps } from '../../../../src/modules/enumerations/domain/aggregates/enumeration-props.js';
import type { EnumerationRepository } from '../../../../src/modules/enumerations/application/ports/enumeration-repository.port.js';
import { EnumerationGuardAdapter } from '../../../../src/modules/enumerations/infrastructure/security/enumeration-guard.adapter.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateEnumerationHandler } from '../../../../src/modules/enumerations/application/cqrs/handlers/create-enumeration.handler.js';
import { CreateEnumerationCommand } from '../../../../src/modules/enumerations/application/cqrs/commands/create-enumeration.command.js';
import { DeleteEnumerationHandler } from '../../../../src/modules/enumerations/application/cqrs/handlers/delete-enumeration.handler.js';
import { DeleteEnumerationCommand } from '../../../../src/modules/enumerations/application/cqrs/commands/delete-enumeration.command.js';
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

describe('enumeration command handlers', () => {
  let enumerations: InMemoryEnumerationRepository;
  const guard = new EnumerationGuardAdapter();

  beforeEach(() => {
    enumerations = new InMemoryEnumerationRepository(enumeration());
  });

  describe('CreateEnumerationHandler', () => {
    const command = (key: string, realmId: string | null, user: User = OWNER) =>
      new CreateEnumerationCommand(key, 'language', realmId, 'A tongue', null, 'public', user.id, [...user.roles]);

    const handler = () => new CreateEnumerationHandler(enumerations, guard);

    it('stores a user enumeration owned by the user', async () => {
      const created = await handler().execute(command('quenya', null));

      expect(created).toMatchObject({
        key: 'quenya',
        category: 'language',
        realmId: null,
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

    it('rejects a duplicated key, category and realm', async () => {
      await expect(handler().execute(command('westron', null))).rejects.toThrow(ConflictError);
      expect(enumerations.items.size).toBe(1);
    });

    it('rejects a user without the player or admin role', async () => {
      await expect(handler().execute(command('quenya', null, NO_ROLES))).rejects.toThrow(ForbiddenError);
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
