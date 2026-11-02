import type { KafkaContext } from '@nestjs/microservices';
import request from 'supertest';
import {
  type FriendshipEventData,
  KafkaFriendshipEventConsumer,
} from '../../src/modules/realms/interfaces/messaging/kafka.friendship-event-consumer.js';
import { type E2eApp, ids, startApp, takeTopics, USERS, type UserName } from './support/app.js';
import { enumerationBody, raceBody, realmBody } from './support/fixtures.js';

type Realm = { id: string; version: number; access: string; shares?: { userId: string; userName: string; level: string }[] };

// Spec 069: the owner shares a realm with friends; races and enumerations of the realm follow its access.
describe('Realm shares (e2e)', () => {
  let e2e: E2eApp;
  const id = (user: UserName) => USERS[user].sub;

  beforeAll(async () => {
    e2e = await startApp();
    e2e.friendships.befriend(id('owner'), id('friend'));
    e2e.friendships.befriend(id('owner'), id('other'));
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const as = (user: UserName) => ({ Authorization: e2e.auth(user) });

  const createRealm = async (user: UserName, overrides: Record<string, unknown> = {}) => {
    const res = await request(e2e.server).post('/v1/realms').set(as(user)).send(realmBody(overrides)).expect(201);
    return res.body as Realm;
  };

  const share = (user: UserName, realmId: string, target: UserName, level: string) =>
    request(e2e.server)
      .put(`/v1/realms/${realmId}/shares/${id(target)}`)
      .set(as(user))
      .send({ level });

  it('lets a reader see a private realm and its races, and a writer also change them', async () => {
    const realm = await createRealm('owner');
    const race = await request(e2e.server).post('/v1/races').set(as('owner')).send(raceBody(realm.id)).expect(201);
    const racePath = `/v1/races/${(race.body as { id: string }).id}`;

    await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('friend')).expect(403);
    await request(e2e.server).get(racePath).set(as('friend')).expect(403);

    const shared = await share('owner', realm.id, 'friend', 'read').expect(200);
    expect(shared.body).toMatchObject({
      access: 'manage',
      shares: [{ userId: id('friend'), userName: `name-of-${id('friend')}`, level: 'read' }],
    });
    expect(takeTopics(e2e.events)).toContain('internal.rmu-core.realm.updated.v1');

    const read = await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('friend')).expect(200);
    expect(read.body).toMatchObject({ access: 'read' });
    expect(read.body).not.toHaveProperty('shares');
    await request(e2e.server).get(racePath).set(as('friend')).expect(200);
    await request(e2e.server).patch(`/v1/realms/${realm.id}`).set(as('friend')).send({ name: 'Edited' }).expect(403);
    await request(e2e.server).patch(racePath).set(as('friend')).send({ name: 'Edited' }).expect(403);

    const listed = await request(e2e.server).get('/v1/realms?scope=shared').set(as('friend')).expect(200);
    expect(ids(listed.body)).toEqual([realm.id]);
    const races = await request(e2e.server).get(`/v1/races?q=realmId==${realm.id}`).set(as('friend')).expect(200);
    expect(races.body).toMatchObject({ content: [{ access: 'read' }] });

    await share('owner', realm.id, 'friend', 'write').expect(200);
    await request(e2e.server).patch(`/v1/realms/${realm.id}`).set(as('friend')).send({ name: 'Edited' }).expect(200);
    await request(e2e.server).patch(racePath).set(as('friend')).send({ name: 'Edited race' }).expect(200);
    await request(e2e.server)
      .post('/v1/races')
      .set(as('friend'))
      .send(raceBody(realm.id, { name: 'By friend' }))
      .expect(201);
    await request(e2e.server)
      .post('/v1/enumerations')
      .set(as('friend'))
      .send(enumerationBody({ key: 'friend-key', realmId: realm.id }))
      .expect(201);

    // A writer neither deletes the realm nor changes its visibility or shares.
    await request(e2e.server).delete(`/v1/realms/${realm.id}`).set(as('friend')).expect(403);
    await request(e2e.server).patch(`/v1/realms/${realm.id}`).set(as('friend')).send({ accessType: 'public' }).expect(403);
    await share('friend', realm.id, 'other', 'read').expect(403);
    await request(e2e.server).get(`/v1/realms/${realm.id}/shares`).set(as('friend')).expect(403);
    // …but deletes races of the realm.
    await request(e2e.server).delete(racePath).set(as('friend')).expect(204);

    // Another user still sees nothing of it.
    await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('other')).expect(403);
    const ofOther = await request(e2e.server).get('/v1/races?size=100').set(as('other')).expect(200);
    expect((ofOther.body as { content: { realmId: string }[] }).content.map(r => r.realmId)).not.toContain(realm.id);
  });

  it('lets everyone read a public realm but only its writers change it', async () => {
    const realm = await createRealm('owner', { accessType: 'public' });
    await request(e2e.server).patch(`/v1/realms/${realm.id}`).set(as('other')).send({ name: 'No' }).expect(403);
    await share('owner', realm.id, 'other', 'write').expect(200);
    const edited = await request(e2e.server).patch(`/v1/realms/${realm.id}`).set(as('other')).send({ name: 'Yes' }).expect(200);
    expect(edited.body).toMatchObject({ name: 'Yes', access: 'write' });
  });

  it('keeps a system realm read-only for a user with a write share', async () => {
    const realm = await createRealm('admin', { entitySource: 'system' });
    await request(e2e.server)
      .put(`/v1/realms/${realm.id}/shares/${id('friend')}`)
      .set(as('admin'))
      .send({ level: 'write' })
      .expect(400);
    // The friendship is with the owner of the realm: the admin's realm needs the admin as a friend.
    e2e.friendships.befriend(id('admin'), id('friend'));
    await request(e2e.server)
      .put(`/v1/realms/${realm.id}/shares/${id('friend')}`)
      .set(as('admin'))
      .send({ level: 'write' })
      .expect(200);

    const read = await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('friend')).expect(200);
    expect(read.body).toMatchObject({ access: 'read' });
    const denied = await request(e2e.server).patch(`/v1/realms/${realm.id}`).set(as('friend')).send({ name: 'No' }).expect(403);
    expect(denied.body).toMatchObject({ code: 'system-entity-admin-only' });
  });

  it('rejects sharing with a user who is not a friend, with the owner, or with a stale version', async () => {
    const realm = await createRealm('owner');
    const notFriend = await share('owner', realm.id, 'coreLaw', 'read').expect(400);
    expect(notFriend.body).toMatchObject({ code: 'share-not-friend' });
    const self = await share('owner', realm.id, 'owner', 'read').expect(400);
    expect(self.body).toMatchObject({ code: 'share-self' });
    await share('owner', realm.id, 'friend', 'admin').expect(400);
    await request(e2e.server)
      .put(`/v1/realms/${realm.id}/shares/${id('friend')}`)
      .set(as('owner'))
      .send({ level: 'read', version: realm.version + 5 })
      .expect(409);
    await request(e2e.server)
      .put(`/v1/realms/missing/shares/${id('friend')}`)
      .set(as('owner'))
      .send({ level: 'read' })
      .expect(404);
  });

  it('lets the owner and the admin manage shares, and the receiver give the access up', async () => {
    const realm = await createRealm('owner');
    await share('owner', realm.id, 'friend', 'read').expect(200);
    await share('admin', realm.id, 'other', 'write').expect(200);

    const shares = await request(e2e.server).get(`/v1/realms/${realm.id}/shares`).set(as('owner')).expect(200);
    expect((shares.body as { userId: string }[]).map(s => s.userId).sort()).toEqual([id('friend'), id('other')].sort());

    // other cannot remove the access of friend, but gives up its own.
    await request(e2e.server)
      .delete(`/v1/realms/${realm.id}/shares/${id('friend')}`)
      .set(as('other'))
      .expect(403);
    await request(e2e.server)
      .delete(`/v1/realms/${realm.id}/shares/${id('other')}`)
      .set(as('other'))
      .expect(200);
    await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('other')).expect(403);

    const removed = await request(e2e.server)
      .delete(`/v1/realms/${realm.id}/shares/${id('friend')}`)
      .set(as('owner'))
      .expect(200);
    expect(removed.body).toMatchObject({ shares: [] });
    // Removing it again changes nothing.
    await request(e2e.server)
      .delete(`/v1/realms/${realm.id}/shares/${id('friend')}`)
      .set(as('owner'))
      .expect(200);
  });

  it('revokes the shares between two users when their friendship is blocked or deleted', async () => {
    const realm = await createRealm('owner');
    await share('owner', realm.id, 'friend', 'write').expect(200);
    const consumer = e2e.app.get(KafkaFriendshipEventConsumer);
    const context = { getTopic: () => 'internal.rmu-users.friendship.updated.v1' } as unknown as KafkaContext;
    const event = (status: FriendshipEventData['status']) => ({
      data: { id: 'f-1', requesterId: id('friend'), addresseeId: id('owner'), status },
    });

    await consumer.handleFriendshipUpdated(event('accepted'), context);
    await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('friend')).expect(200);

    await consumer.handleFriendshipUpdated(event('blocked'), context);
    await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('friend')).expect(403);
    // Redelivered: nothing left to remove.
    await consumer.handleFriendshipDeleted(event('blocked'), context);

    await share('owner', realm.id, 'friend', 'read').expect(200);
    await consumer.handleFriendshipDeleted(event('accepted'), context);
    const after = await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('owner')).expect(200);
    expect(after.body).toMatchObject({ shares: [] });
  });
});
