import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Realm } from '../../../../src/modules/realms/domain/aggregates/realm.js';
import type { RealmProps } from '../../../../src/modules/realms/domain/aggregates/realm-props.js';
import { RealmGuardAdapter } from '../../../../src/modules/realms/infrastructure/security/realm-guard.adapter.js';
import { ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateRealmHandler } from '../../../../src/modules/realms/application/cqrs/handlers/create-realm.handler.js';
import { CreateRealmCommand } from '../../../../src/modules/realms/application/cqrs/commands/create-realm.command.js';
import { UpdateRealmHandler } from '../../../../src/modules/realms/application/cqrs/handlers/update-realm.handler.js';
import { UpdateRealmCommand } from '../../../../src/modules/realms/application/cqrs/commands/update-realm.command.js';
import { DeleteRealmHandler } from '../../../../src/modules/realms/application/cqrs/handlers/delete-realm.handler.js';
import { DeleteRealmCommand } from '../../../../src/modules/realms/application/cqrs/commands/delete-realm.command.js';
import { InMemoryRepository } from '../../support/in-memory.repository.js';
import { RecordingEventPublisher } from '../../support/recording-event-publisher.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';

type User = { id: string; roles: readonly string[] };

const realm = (overrides: Partial<RealmProps> = {}) =>
  Realm.fromProps({
    id: 'realm-1',
    name: 'Middle-earth',
    magicPresence: 'limited',
    shortDescription: 'Short',
    description: 'Long',
    imageUrl: undefined,
    owner: OWNER.id,
    entitySource: 'user',
    accessType: 'private',
    generic: false,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: undefined,
    ...overrides,
  });

describe('realm command handlers', () => {
  let realms: InMemoryRepository<Realm>;
  let events: RecordingEventPublisher;
  const guard = new RealmGuardAdapter();

  beforeEach(() => {
    realms = new InMemoryRepository(realm());
    events = new RecordingEventPublisher();
  });

  describe('CreateRealmHandler', () => {
    const command = (user: User) =>
      new CreateRealmCommand('Arda', 'A world', 'The whole world', 'arda.png', 'unlimited', 'public', user.id, [...user.roles]);

    it.each([
      ['a user', OWNER],
      ['an admin', ADMIN],
    ])('lets %s create a realm owned by them and publishes realm.created', async (_, user) => {
      const created = await new CreateRealmHandler(realms, guard, events).execute(command(user));

      expect(created).toMatchObject({
        name: 'Arda',
        shortDescription: 'A world',
        description: 'The whole world',
        imageUrl: 'arda.png',
        magicPresence: 'unlimited',
        accessType: 'public',
        owner: user.id,
        updatedAt: undefined,
      });
      expect(created.id).not.toBe('realm-1');
      expect(realms.items.get(created.id)).toBe(created);
      expect(events.topics).toEqual(['realm.created']);
      expect((events.published[0].event.data as RealmProps).id).toBe(created.id);
    });

    it('lets an admin create a generic realm and carries it in realm.created', async () => {
      const generic = new CreateRealmCommand(
        'RMU Core',
        undefined,
        undefined,
        undefined,
        'limited',
        'public',
        ADMIN.id,
        [...ADMIN.roles],
        true,
      );

      const created = await new CreateRealmHandler(realms, guard, events).execute(generic);

      expect(created.generic).toBe(true);
      expect((events.published[0].event.data as RealmProps).generic).toBe(true);
    });

    it('creates a realm that is not generic by default', async () => {
      const created = await new CreateRealmHandler(realms, guard, events).execute(command(OWNER));
      expect(created.generic).toBe(false);
    });

    it('forbids a player to create a generic realm', async () => {
      const generic = new CreateRealmCommand(
        'Mine',
        undefined,
        undefined,
        undefined,
        'limited',
        'public',
        OWNER.id,
        [...OWNER.roles],
        true,
      );

      await expect(new CreateRealmHandler(realms, guard, events).execute(generic)).rejects.toThrow(ForbiddenError);
      expect([...realms.items.keys()]).toEqual(['realm-1']);
      expect(events.topics).toEqual([]);
    });

    it('forbids a user without roles', async () => {
      await expect(new CreateRealmHandler(realms, guard, events).execute(command(NO_ROLES))).rejects.toThrow(ForbiddenError);
      expect([...realms.items.keys()]).toEqual(['realm-1']);
      expect(events.topics).toEqual([]);
    });
  });

  describe('UpdateRealmHandler', () => {
    const command = (id: string, user: User) =>
      new UpdateRealmCommand(id, 'Arda', 'none', undefined, undefined, 'arda.png', 'public', user.id, [...user.roles]);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s update the realm and publishes realm.updated', async (_, user) => {
      const updated = await new UpdateRealmHandler(realms, guard, events).execute(command('realm-1', user));

      expect(updated).toMatchObject({
        id: 'realm-1',
        name: 'Arda',
        magicPresence: 'none',
        shortDescription: 'Short',
        description: 'Long',
        imageUrl: 'arda.png',
        accessType: 'public',
        owner: OWNER.id,
      });
      expect(updated.updatedAt).toBeInstanceOf(Date);
      expect(realms.items.get('realm-1')).toBe(updated);
      expect(events.topics).toEqual(['realm.updated']);
    });

    it('keeps the fields the command leaves undefined, without writing or publishing', async () => {
      const handler = new UpdateRealmHandler(realms, guard, events);
      const update = vi.spyOn(realms, 'update');
      const updated = await handler.execute(
        new UpdateRealmCommand('realm-1', undefined, undefined, undefined, undefined, undefined, undefined, OWNER.id, [...OWNER.roles]),
      );

      expect(updated).toMatchObject({ name: 'Middle-earth', magicPresence: 'limited', accessType: 'private', imageUrl: undefined });
      expect(updated.updatedAt).toBeUndefined();
      expect(update).not.toHaveBeenCalled();
      expect(events.topics).toEqual([]);
    });

    const genericCommand = (generic: boolean, user: User) =>
      new UpdateRealmCommand(
        'realm-1',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        user.id,
        [...user.roles],
        undefined,
        generic,
      );

    it('lets an admin mark and unmark the realm as generic', async () => {
      const handler = new UpdateRealmHandler(realms, guard, events);

      expect((await handler.execute(genericCommand(true, ADMIN))).generic).toBe(true);
      expect((events.published[0].event.data as RealmProps).generic).toBe(true);
      expect((await handler.execute(genericCommand(false, ADMIN))).generic).toBe(false);
      expect(events.topics).toEqual(['realm.updated', 'realm.updated']);
    });

    it('forbids the owner to change generic, but accepts the stored value sent back', async () => {
      const handler = new UpdateRealmHandler(realms, guard, events);

      await expect(handler.execute(genericCommand(true, OWNER))).rejects.toThrow(ForbiddenError);
      expect(realms.items.get('realm-1')?.generic).toBe(false);
      await expect(handler.execute(genericCommand(false, OWNER))).resolves.toMatchObject({ generic: false });
      expect(events.topics).toEqual([]);
    });

    it('forbids another user', async () => {
      await expect(new UpdateRealmHandler(realms, guard, events).execute(command('realm-1', OTHER))).rejects.toThrow(ForbiddenError);
      expect(realms.items.get('realm-1')).toMatchObject({ name: 'Middle-earth', accessType: 'private', updatedAt: undefined });
      expect(events.topics).toEqual([]);
    });

    it('fails on an unknown realm', async () => {
      await expect(new UpdateRealmHandler(realms, guard, events).execute(command('missing', OWNER))).rejects.toThrow(NotFoundError);
      expect(events.topics).toEqual([]);
    });
  });

  describe('DeleteRealmHandler', () => {
    /** The races of the realm, as the port counts them: `system` ones only. */
    const systemRaces = (count: number) => ({ countSystemRaces: vi.fn((realmId: string) => Promise.resolve(realmId ? count : 0)) });
    const noSystemRaces = systemRaces(0);

    it('forbids the owner to delete a realm with system races, without deleting or publishing (spec 063)', async () => {
      const races = systemRaces(2);
      const handler = new DeleteRealmHandler(realms, guard, events, races);

      await expect(handler.execute(new DeleteRealmCommand('realm-1', OWNER.id, [...OWNER.roles]))).rejects.toMatchObject({
        statusCode: 403,
        code: 'system-entity-admin-only',
      });
      expect(races.countSystemRaces).toHaveBeenCalledWith('realm-1');
      expect(realms.items.has('realm-1')).toBe(true);
      expect(events.topics).toEqual([]);
    });

    it('lets an admin delete a realm with system races', async () => {
      await new DeleteRealmHandler(realms, guard, events, systemRaces(2)).execute(
        new DeleteRealmCommand('realm-1', ADMIN.id, [...ADMIN.roles]),
      );
      expect(realms.items.has('realm-1')).toBe(false);
      expect(events.topics).toEqual(['realm.deleted']);
    });

    it('checks the owner before counting the races', async () => {
      const races = systemRaces(0);
      await expect(
        new DeleteRealmHandler(realms, guard, events, races).execute(new DeleteRealmCommand('realm-1', OTHER.id, [...OTHER.roles])),
      ).rejects.toMatchObject({ code: 'forbidden' });
      expect(races.countSystemRaces).not.toHaveBeenCalled();
    });

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s delete the realm and publishes realm.deleted with its last state', async (_, user) => {
      const result = await new DeleteRealmHandler(realms, guard, events, noSystemRaces).execute(
        new DeleteRealmCommand('realm-1', user.id, [...user.roles]),
      );

      expect(result).toBeUndefined();
      expect(realms.items.has('realm-1')).toBe(false);
      expect(events.published.map(p => [p.topic, (p.event.data as RealmProps).id])).toEqual([['realm.deleted', 'realm-1']]);
    });

    it('forbids another user', async () => {
      const handler = new DeleteRealmHandler(realms, guard, events, noSystemRaces);
      await expect(handler.execute(new DeleteRealmCommand('realm-1', OTHER.id, [...OTHER.roles]))).rejects.toThrow(ForbiddenError);
      expect(realms.items.has('realm-1')).toBe(true);
      expect(events.topics).toEqual([]);
    });

    it('fails on an unknown realm', async () => {
      const handler = new DeleteRealmHandler(realms, guard, events, noSystemRaces);
      await expect(handler.execute(new DeleteRealmCommand('missing', OWNER.id, [...OWNER.roles]))).rejects.toThrow(NotFoundError);
      expect(events.topics).toEqual([]);
    });

    it('fails without publishing when the repository finds nothing to delete', async () => {
      class VanishingRealmRepository extends InMemoryRepository<Realm> {
        override deleteById(): Promise<Realm | null> {
          return Promise.resolve(null);
        }
      }
      const handler = new DeleteRealmHandler(new VanishingRealmRepository(realm()), guard, events, noSystemRaces);

      await expect(handler.execute(new DeleteRealmCommand('realm-1', OWNER.id, [...OWNER.roles]))).rejects.toThrow(NotFoundError);
      expect(events.topics).toEqual([]);
    });
  });
});
