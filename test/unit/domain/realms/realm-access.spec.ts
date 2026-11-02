import { describe, expect, it } from 'vitest';
import { Realm } from '../../../../src/modules/realms/domain/aggregates/realm.js';
import type { ShareLevel } from '../../../../src/modules/shared/domain/entities/entity-share.js';
import { RealmGuardAdapter } from '../../../../src/modules/realms/infrastructure/security/realm-guard.adapter.js';
import { RealmAccessService } from '../../../../src/modules/realms/application/services/realm-access.service.js';
import { UpdateRealmHandler } from '../../../../src/modules/realms/application/cqrs/handlers/update-realm.handler.js';
import { UpdateRealmCommand } from '../../../../src/modules/realms/application/cqrs/commands/update-realm.command.js';
import { InMemoryRealmRepository } from '../../support/in-memory-realm.repository.js';
import { RecordingEventPublisher } from '../../support/recording-event-publisher.js';
import { ADMIN, OTHER, OWNER } from '../../support/users.js';

const FRIEND = { id: 'friend-1', roles: ['rmu-user'] } as const;

const realm = (id: string, accessType: 'public' | 'private', entitySource: 'system' | 'user' = 'user', level?: ShareLevel) =>
  Realm.fromProps({
    id,
    name: id,
    magicPresence: 'limited',
    owner: OWNER.id,
    entitySource,
    accessType,
    generic: false,
    shares: level ? [{ userId: FRIEND.id, userName: 'bea', level, grantedAt: new Date(0) }] : [],
    createdAt: new Date('2026-01-01T00:00:00Z'),
  });

describe('RealmAccessService (spec 069)', () => {
  const realms = new InMemoryRealmRepository(
    realm('private', 'private'),
    realm('public', 'public'),
    realm('shared-write', 'private', 'user', 'write'),
    realm('system-write', 'private', 'system', 'write'),
  );
  const service = new RealmAccessService(realms, new RealmGuardAdapter());
  const child = (realmId: string | null, entitySource: 'system' | 'user' = 'user') => ({
    realmId,
    owner: OWNER.id,
    accessType: 'private',
    entitySource,
  });

  it('gives each child the access to its realm, with one read of the realms', async () => {
    const levels = await service.childLevels(
      [child('private'), child('public'), child('shared-write'), child('system-write'), child('missing'), child('shared-write', 'system')],
      FRIEND.id,
      [...FRIEND.roles],
    );
    expect(levels).toEqual(['none', 'read', 'write', 'read', 'none', 'read']);
  });

  it('lists the realms a user reads, and all of them for an admin', async () => {
    expect((await service.readableRealmIds(FRIEND.id, [...FRIEND.roles]))?.sort()).toEqual(['public', 'shared-write', 'system-write']);
    expect((await service.readableRealmIds(OTHER.id, [...OTHER.roles]))?.sort()).toEqual(['public']);
    expect(await service.readableRealmIds(ADMIN.id, [...ADMIN.roles])).toBeNull();
  });

  it('answers none for a realm that does not exist', async () => {
    expect(await service.levelOf('missing', OWNER.id, [...OWNER.roles])).toBe('none');
    expect(await service.levelOf('private', OWNER.id, [...OWNER.roles])).toBe('manage');
  });
});

describe('UpdateRealmHandler with shares (spec 069)', () => {
  const command = (accessType: 'public' | 'private' | undefined, user: { id: string; roles: readonly string[] }) =>
    new UpdateRealmCommand('shared-write', 'Arda', undefined, undefined, undefined, undefined, accessType, user.id, [...user.roles]);

  it('lets a writer edit the realm but not change its visibility', async () => {
    const realms = new InMemoryRealmRepository(realm('shared-write', 'private', 'user', 'write'));
    const handler = new UpdateRealmHandler(realms, new RealmGuardAdapter(), new RecordingEventPublisher());
    await expect(handler.execute(command(undefined, FRIEND))).resolves.toMatchObject({ name: 'Arda' });
    await expect(handler.execute(command('private', FRIEND))).resolves.toMatchObject({ accessType: 'private' });
    await expect(handler.execute(command('public', FRIEND))).rejects.toMatchObject({ code: 'forbidden' });
    await expect(handler.execute(command('public', OWNER))).resolves.toMatchObject({ accessType: 'public' });
  });
});
