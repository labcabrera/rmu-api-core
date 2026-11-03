import { describe, expect, it } from 'vitest';
import { SyncRealmGameHandler } from '../../../../src/modules/realms/application/cqrs/handlers/sync-realm-game.handler.js';
import { GetRealmAccessHandler } from '../../../../src/modules/realms/application/cqrs/handlers/get-realm-access.handler.js';
import { SyncRealmGameCommand } from '../../../../src/modules/realms/application/cqrs/commands/sync-realm-game.command.js';
import { GetRealmAccessQuery } from '../../../../src/modules/realms/application/cqrs/queries/get-realm-access.query.js';
import { Realm } from '../../../../src/modules/realms/domain/aggregates/realm.js';
import { resolveAccess } from '../../../../src/modules/shared/domain/services/entity-access.js';
import { InMemoryRealmRepository } from '../../support/in-memory-realm.repository.js';
import { OWNER } from '../../support/users.js';

const GM = 'gm-1';
const PLAYER = 'player-1';

const realm = (id = 'realm-1', accessType: 'public' | 'private' = 'private') =>
  Realm.fromProps({
    id,
    name: 'Middle-earth',
    magicPresence: 'limited',
    owner: OWNER.id,
    entitySource: 'user',
    accessType,
    generic: false,
    shares: [],
    createdAt: new Date('2026-01-01T00:00:00Z'),
  }).restoreVersion(0);

describe('Realm games (spec 071)', () => {
  it('lets the members of a game read the realm while its owner reads it', () => {
    const r = realm();
    r.share(GM, 'gm', 'read');
    r.syncGame({ gameId: 'game-1', ownerId: GM, memberIds: [PLAYER, PLAYER] });
    expect(r.games).toEqual([{ gameId: 'game-1', ownerId: GM, memberIds: [PLAYER] }]);
    expect(r.gameReaderIds).toEqual([PLAYER]);
    expect(resolveAccess(r, PLAYER, [])).toBe('read');

    // The owner of the game loses the realm: the members too.
    r.unshare(GM);
    expect(r.gameReaderIds).toEqual([]);
    expect(resolveAccess(r, PLAYER, [])).toBe('none');
    // Public again: they read it anyway.
    r.update({ accessType: 'public' });
    expect(r.gameReaderIds).toEqual([PLAYER]);
  });

  it('never raises a higher level and forgets a removed game', () => {
    const r = realm();
    r.share(PLAYER, 'player', 'write');
    r.syncGame({ gameId: 'game-1', ownerId: OWNER.id, memberIds: [PLAYER] });
    expect(resolveAccess(r, PLAYER, [])).toBe('write');
    r.removeGame('game-1');
    r.removeGame('game-1');
    expect(r.games).toEqual([]);
    expect(r.gameReaderIds).toEqual([]);
  });

  it('records a game on its realm and moves it when the game changes realm', async () => {
    const repository = new InMemoryRealmRepository(realm('realm-1'), realm('realm-2', 'public'));
    const handler = new SyncRealmGameHandler(repository);
    await handler.execute(new SyncRealmGameCommand('game-1', 'realm-1', OWNER.id, [PLAYER]));
    expect(repository.items.get('realm-1')!.gameReaderIds).toEqual([PLAYER]);

    await handler.execute(new SyncRealmGameCommand('game-1', 'realm-2', OWNER.id, [PLAYER]));
    expect(repository.items.get('realm-1')!.games).toEqual([]);
    expect(repository.items.get('realm-2')!.games).toHaveLength(1);

    await handler.execute(new SyncRealmGameCommand('game-1', null, OWNER.id, []));
    expect(repository.items.get('realm-2')!.games).toEqual([]);
    // A game of a realm that is gone changes nothing.
    await handler.execute(new SyncRealmGameCommand('game-2', 'missing', OWNER.id, [PLAYER]));
  });

  it('answers the level of a user to admins only', async () => {
    const r = realm();
    r.syncGame({ gameId: 'game-1', ownerId: OWNER.id, memberIds: [PLAYER] });
    const handler = new GetRealmAccessHandler(new InMemoryRealmRepository(r));
    const ask = (subject: string, roles: string[]) => handler.execute(new GetRealmAccessQuery('realm-1', subject, 'caller', roles));
    expect(await ask(PLAYER, ['rmu-admin'])).toBe('read');
    expect(await ask(OWNER.id, ['rmu-admin'])).toBe('manage');
    expect(await ask('stranger', ['rmu-admin'])).toBe('none');
    await expect(ask(PLAYER, ['rmu-user'])).rejects.toMatchObject({ code: 'forbidden' });
    await expect(handler.execute(new GetRealmAccessQuery('missing', PLAYER, 'caller', ['rmu-admin']))).rejects.toMatchObject({
      code: 'not-found',
    });
  });
});
