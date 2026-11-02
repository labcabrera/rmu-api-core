import { describe, expect, it, vi } from 'vitest';
import { Realm } from '../../../../src/modules/realms/domain/aggregates/realm.js';
import type { ShareLevel } from '../../../../src/modules/shared/domain/entities/entity-share.js';
import { RealmGuardAdapter } from '../../../../src/modules/realms/infrastructure/security/realm-guard.adapter.js';
import { ShareRealmHandler } from '../../../../src/modules/realms/application/cqrs/handlers/share-realm.handler.js';
import { UnshareRealmHandler } from '../../../../src/modules/realms/application/cqrs/handlers/unshare-realm.handler.js';
import { RevokeSharesBetweenUsersHandler } from '../../../../src/modules/realms/application/cqrs/handlers/revoke-shares-between-users.handler.js';
import { GetRealmSharesHandler } from '../../../../src/modules/realms/application/cqrs/handlers/get-realm-shares.handler.js';
import { GetRealmsHandler } from '../../../../src/modules/realms/application/cqrs/handlers/get-realms.handler.js';
import { ShareRealmCommand } from '../../../../src/modules/realms/application/cqrs/commands/share-realm.command.js';
import { UnshareRealmCommand } from '../../../../src/modules/realms/application/cqrs/commands/unshare-realm.command.js';
import { RevokeSharesBetweenUsersCommand } from '../../../../src/modules/realms/application/cqrs/commands/revoke-shares-between-users.command.js';
import { GetRealmSharesQuery } from '../../../../src/modules/realms/application/cqrs/queries/get-realm-shares.query.js';
import { GetRealmsQuery, type RealmScope } from '../../../../src/modules/realms/application/cqrs/queries/get-realms.query.js';
import type { FriendshipPort } from '../../../../src/modules/realms/application/ports/friendship.port.js';
import { ApiFriendshipAdapter } from '../../../../src/modules/realms/infrastructure/api-clients/api.friendship.adapter.js';
import { UpstreamBadGatewayError } from '../../../../src/modules/shared/infrastructure/http/http-client.js';
import type { HttpClient } from '../../../../src/modules/shared/infrastructure/http/http-client.js';
import type { TokenService } from '../../../../src/modules/shared/infrastructure/security/token.service.js';
import type { ConfigService } from '@nestjs/config';
import { InMemoryRealmRepository, matchesCriteria } from '../../support/in-memory-realm.repository.js';
import { RecordingEventPublisher } from '../../support/recording-event-publisher.js';
import { ADMIN, OTHER, OWNER } from '../../support/users.js';

const FRIEND = { id: 'friend-1', roles: ['rmu-user'] } as const;

const realm = (id: string, owner: string, accessType: 'public' | 'private', shares: [string, ShareLevel][] = []) =>
  Realm.fromProps({
    id,
    name: id,
    magicPresence: 'limited',
    owner,
    entitySource: 'user',
    accessType,
    generic: false,
    shares: shares.map(([userId, level]) => ({ userId, userName: userId, level, grantedAt: new Date(0) })),
    createdAt: new Date('2026-01-01T00:00:00Z'),
  });

const friends = (...pairs: [string, string][]): FriendshipPort => ({
  findAcceptedFriend: (a, b) =>
    Promise.resolve(pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a)) ? { userId: b, userName: `name-${b}` } : null),
});

describe('realm share handlers (spec 069)', () => {
  const guard = new RealmGuardAdapter();

  it('shares with a friend of the owner, also when an admin does it, and keeps the friend name', async () => {
    const realms = new InMemoryRealmRepository(realm('r', OWNER.id, 'private'));
    const events = new RecordingEventPublisher();
    const handler = new ShareRealmHandler(realms, guard, friends([OWNER.id, FRIEND.id]), events);

    const shared = await handler.execute(new ShareRealmCommand('r', FRIEND.id, 'read', ADMIN.id, [...ADMIN.roles]));
    expect(shared.shares).toEqual([expect.objectContaining({ userId: FRIEND.id, userName: `name-${FRIEND.id}`, level: 'read' })]);
    // The same share again neither writes nor publishes.
    const before = events.published.length;
    await handler.execute(new ShareRealmCommand('r', FRIEND.id, 'read', OWNER.id, [...OWNER.roles]));
    expect(events.published.length).toBe(before);
  });

  it('rejects a missing realm, a non-manager, the owner and a non-friend', async () => {
    const realms = new InMemoryRealmRepository(realm('r', OWNER.id, 'public', [[FRIEND.id, 'write']]));
    const handler = new ShareRealmHandler(realms, guard, friends(), new RecordingEventPublisher());
    const run = (realmId: string, target: string, user: { id: string; roles: readonly string[] }) =>
      handler.execute(new ShareRealmCommand(realmId, target, 'read', user.id, [...user.roles]));

    await expect(run('missing', OTHER.id, OWNER)).rejects.toMatchObject({ code: 'not-found' });
    await expect(run('r', OTHER.id, FRIEND)).rejects.toMatchObject({ code: 'forbidden' });
    await expect(run('r', OWNER.id, OWNER)).rejects.toMatchObject({ code: 'share-self' });
    await expect(run('r', OTHER.id, OWNER)).rejects.toMatchObject({ code: 'share-not-friend' });
  });

  it('lets the receiver give the access up, and only who manages remove others', async () => {
    const realms = new InMemoryRealmRepository(
      realm('r', OWNER.id, 'private', [
        [FRIEND.id, 'read'],
        [OTHER.id, 'write'],
      ]),
    );
    const handler = new UnshareRealmHandler(realms, guard, new RecordingEventPublisher());
    const run = (target: string, user: { id: string; roles: readonly string[] }, realmId = 'r') =>
      handler.execute(new UnshareRealmCommand(realmId, target, user.id, [...user.roles]));

    await expect(run(FRIEND.id, OWNER, 'missing')).rejects.toMatchObject({ code: 'not-found' });
    await expect(run(FRIEND.id, OTHER)).rejects.toMatchObject({ code: 'forbidden' });
    await expect(run(OTHER.id, OTHER)).resolves.toMatchObject({ shares: [expect.objectContaining({ userId: FRIEND.id })] });
    // Giving up an access one does not have is not allowed for a non-manager.
    await expect(run(OTHER.id, OTHER)).rejects.toMatchObject({ code: 'forbidden' });
    await expect(run(FRIEND.id, OWNER)).resolves.toMatchObject({ shares: [] });
    await expect(run(FRIEND.id, OWNER)).resolves.toMatchObject({ shares: [] });
  });

  it('revokes the shares between two users in both directions, idempotently', async () => {
    const realms = new InMemoryRealmRepository(
      realm('of-owner', OWNER.id, 'private', [
        [FRIEND.id, 'write'],
        [OTHER.id, 'read'],
      ]),
      realm('of-friend', FRIEND.id, 'private', [[OWNER.id, 'read']]),
      realm('unrelated', OTHER.id, 'private', [[FRIEND.id, 'read']]),
    );
    const handler = new RevokeSharesBetweenUsersHandler(realms, new RecordingEventPublisher());

    await expect(handler.execute(new RevokeSharesBetweenUsersCommand(FRIEND.id, OWNER.id))).resolves.toBe(2);
    expect(realms.items.get('of-owner')!.shares.map(s => s.userId)).toEqual([OTHER.id]);
    expect(realms.items.get('of-friend')!.shares).toEqual([]);
    expect(realms.items.get('unrelated')!.shares).toHaveLength(1);
    await expect(handler.execute(new RevokeSharesBetweenUsersCommand(FRIEND.id, OWNER.id))).resolves.toBe(0);
  });

  it('lists the shares only to who manages the realm', async () => {
    const realms = new InMemoryRealmRepository(realm('r', OWNER.id, 'private', [[FRIEND.id, 'write']]));
    const handler = new GetRealmSharesHandler(realms, guard);
    await expect(handler.execute(new GetRealmSharesQuery('r', OWNER.id, [...OWNER.roles]))).resolves.toHaveLength(1);
    await expect(handler.execute(new GetRealmSharesQuery('r', FRIEND.id, [...FRIEND.roles]))).rejects.toMatchObject({ code: 'forbidden' });
    await expect(handler.execute(new GetRealmSharesQuery('missing', OWNER.id, [...OWNER.roles]))).rejects.toMatchObject({
      code: 'not-found',
    });
  });

  it.each([
    ['mine', ['mine-private', 'mine-public']],
    ['shared', ['shared']],
    ['public', ['mine-public', 'public']],
    [undefined, ['mine-private', 'mine-public', 'public', 'shared']],
  ] as [RealmScope | undefined, string[]][])('narrows the listing with scope %s', async (scope, expected) => {
    const realms = new InMemoryRealmRepository(
      realm('mine-private', FRIEND.id, 'private'),
      realm('mine-public', FRIEND.id, 'public'),
      realm('public', OWNER.id, 'public'),
      realm('shared', OWNER.id, 'private', [[FRIEND.id, 'read']]),
      realm('hidden', OWNER.id, 'private'),
    );
    const handler = new GetRealmsHandler(realms, guard);
    // The in-memory listing evaluates the predicate the handler builds.
    const spy = vi.spyOn(realms, 'findByRsql');
    await handler.execute(new GetRealmsQuery(undefined, 0, 100, FRIEND.id, [...FRIEND.roles], scope));
    const predicate = (spy.mock.calls[0] as unknown[])[3] as Parameters<typeof matchesCriteria>[1];
    const found = [...realms.items.values()].filter(r => matchesCriteria(r.getProps(), predicate)).map(r => r.id);
    expect(found.sort()).toEqual(expected);
  });
});

describe('ApiFriendshipAdapter (spec 069)', () => {
  const friendship = (status: string, requesterId: string = OWNER.id, addresseeId: string = FRIEND.id) => ({
    requesterId,
    requesterName: 'ana',
    addresseeId,
    addresseeName: 'bea',
    status,
  });
  const adapter = (get: (url: string) => Promise<unknown>) =>
    new ApiFriendshipAdapter(
      { getToken: () => Promise.resolve('token') } as unknown as TokenService,
      { get: () => 'http://users/v1' } as unknown as ConfigService,
      { get } as unknown as HttpClient,
    );

  it('returns the friend with the name users knows, in either direction', async () => {
    const urls: string[] = [];
    const a = adapter(url => (urls.push(url), Promise.resolve(friendship('accepted'))));
    await expect(a.findAcceptedFriend(OWNER.id, FRIEND.id)).resolves.toEqual({ userId: FRIEND.id, userName: 'bea' });
    await expect(a.findAcceptedFriend(FRIEND.id, OWNER.id)).resolves.toEqual({ userId: OWNER.id, userName: 'ana' });
    expect(urls[0]).toBe(`http://users/v1/friendships/between/${OWNER.id}/${FRIEND.id}`);
  });

  it('answers null for a friendship that is not accepted, of other users, or missing (404)', async () => {
    await expect(adapter(() => Promise.resolve(friendship('blocked'))).findAcceptedFriend(OWNER.id, FRIEND.id)).resolves.toBeNull();
    await expect(
      adapter(() => Promise.resolve(friendship('accepted', 'x', 'y'))).findAcceptedFriend(OWNER.id, FRIEND.id),
    ).resolves.toBeNull();
    const notFound = adapter(() => Promise.reject(new UpstreamBadGatewayError('users answered 404', 404)));
    await expect(notFound.findAcceptedFriend(OWNER.id, FRIEND.id)).resolves.toBeNull();
  });

  it('passes any other failure on, so nothing is shared on a guess', async () => {
    const down = adapter(() => Promise.reject(new UpstreamBadGatewayError('users answered 503', 503)));
    await expect(down.findAcceptedFriend(OWNER.id, FRIEND.id)).rejects.toMatchObject({ code: 'bad-gateway' });
  });
});
