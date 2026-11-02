import { describe, expect, it } from 'vitest';
import { Realm } from '../../../../src/modules/realms/domain/aggregates/realm.js';
import { MAX_SHARES } from '../../../../src/modules/shared/domain/entities/entity-share.js';
import { RealmGuardAdapter } from '../../../../src/modules/realms/infrastructure/security/realm-guard.adapter.js';
import { OTHER, OWNER } from '../../support/users.js';

const FRIEND = { id: 'friend-1', roles: ['rmu-user'] } as const;

const realm = (accessType: 'public' | 'private' = 'private') =>
  Realm.fromProps({
    id: 'realm-1',
    name: 'Middle-earth',
    magicPresence: 'limited',
    owner: OWNER.id,
    entitySource: 'user',
    accessType,
    generic: false,
    shares: [],
    createdAt: new Date('2026-01-01T00:00:00Z'),
  }).restoreVersion(0);

const code = (run: () => void) => {
  try {
    run();
    return null;
  } catch (error) {
    return (error as { code: string }).code;
  }
};

describe('Realm shares (spec 069)', () => {
  it('adds a share, changes its level and removes it, with an updated event each time', () => {
    const r = realm();
    r.share(FRIEND.id, 'bea', 'read');
    expect(r.shares).toEqual([expect.objectContaining({ userId: FRIEND.id, userName: 'bea', level: 'read' })]);
    r.share(FRIEND.id, 'bea', 'write');
    expect(r.shares).toHaveLength(1);
    expect(r.shares[0].level).toBe('write');
    r.unshare(FRIEND.id);
    expect(r.shares).toEqual([]);
    expect(r.getUncommittedEvents().map(e => e.eventType)).toEqual(['updated', 'updated', 'updated']);
  });

  it('changes nothing when the share is the same or the user had none', () => {
    const r = realm();
    r.share(FRIEND.id, 'bea', 'read');
    r.restoreVersion(1);
    r.share(FRIEND.id, 'bea', 'read');
    r.unshare(OTHER.id);
    expect(r.hasChanges()).toBe(false);
  });

  it('rejects sharing with the owner and past the limit', () => {
    const r = realm();
    expect(code(() => r.share(OWNER.id, 'owner', 'write'))).toBe('share-self');
    for (let i = 0; i < MAX_SHARES; i++) r.share(`user-${i}`, `user-${i}`, 'read');
    expect(code(() => r.share('one-more', 'one-more', 'read'))).toBe('share-limit-reached');
    // Changing the level of an existing share still works at the limit.
    expect(code(() => r.share('user-0', 'user-0', 'write'))).toBeNull();
  });

  describe('RealmGuardAdapter with shares', () => {
    const guard = new RealmGuardAdapter();

    it('lets a writer update but not delete or manage, and a reader only read', () => {
      const r = realm();
      r.share(FRIEND.id, 'bea', 'write');
      r.share(OTHER.id, 'other', 'read');
      expect(code(() => guard.checkUpdate(r, FRIEND.id, [...FRIEND.roles]))).toBeNull();
      expect(code(() => guard.checkDelete(r, FRIEND.id, [...FRIEND.roles]))).toBe('forbidden');
      expect(code(() => guard.checkManage(r, FRIEND.id, [...FRIEND.roles]))).toBe('forbidden');
      expect(code(() => guard.checkRead(r, OTHER.id, [...OTHER.roles]))).toBeNull();
      expect(code(() => guard.checkUpdate(r, OTHER.id, [...OTHER.roles]))).toBe('forbidden');
    });

    it('lists public, owned and shared realms', () => {
      expect(guard.buildQueryPredicate(FRIEND.id, [...FRIEND.roles])).toEqual({
        type: 'anyOf',
        criteria: [
          { type: 'eq', field: 'accessType', value: 'public' },
          { type: 'eq', field: 'owner', value: FRIEND.id },
          { type: 'eq', field: 'shares.userId', value: FRIEND.id },
        ],
      });
    });
  });
});
