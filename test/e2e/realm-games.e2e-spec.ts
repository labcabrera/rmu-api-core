import type { KafkaContext } from '@nestjs/microservices';
import request from 'supertest';
import {
  KafkaStrategicGameEventConsumer,
  type StrategicGameEventData,
} from '../../src/modules/realms/interfaces/messaging/kafka.strategic-game-event-consumer.js';
import { type E2eApp, ids, startApp, USERS, type UserName } from './support/app.js';
import { raceBody, realmBody } from './support/fixtures.js';

// Spec 071: the members of a strategic game read its realm while the owner of the game reads it.
describe('Realm games (e2e)', () => {
  let e2e: E2eApp;
  const id = (user: UserName) => USERS[user].sub;
  const as = (user: UserName) => ({ Authorization: e2e.auth(user) });
  const context = (topic: string) => ({ getTopic: () => topic }) as unknown as KafkaContext;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const game = (realmId: string, members: UserName[]): { data: StrategicGameEventData } => ({
    data: { id: 'game-1', realmId, owner: id('owner'), members: members.map(m => ({ userId: id(m) })) },
  });

  it('lets the members read the realm and its races, and ends with the game', async () => {
    const realm = (await request(e2e.server).post('/v1/realms').set(as('owner')).send(realmBody()).expect(201)).body as { id: string };
    const race = (await request(e2e.server).post('/v1/races').set(as('owner')).send(raceBody(realm.id)).expect(201)).body as { id: string };
    const consumer = e2e.app.get(KafkaStrategicGameEventConsumer);

    await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('friend')).expect(403);
    await consumer.handleGameCreated(game(realm.id, ['friend']), context('internal.rmu-strategic.game.created.v1'));

    const read = await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('friend')).expect(200);
    expect(read.body).toMatchObject({ access: 'read' });
    expect(read.body).not.toHaveProperty('games');
    await request(e2e.server).get(`/v1/races/${race.id}`).set(as('friend')).expect(200);
    await request(e2e.server).patch(`/v1/realms/${realm.id}`).set(as('friend')).send({ name: 'No' }).expect(403);
    expect(ids((await request(e2e.server).get('/v1/realms?size=100').set(as('friend')).expect(200)).body)).toContain(realm.id);
    await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('other')).expect(403);

    const access = await request(e2e.server)
      .get(`/v1/realms/${realm.id}/access/${id('friend')}`)
      .set(as('admin'))
      .expect(200);
    expect(access.body).toEqual({ realmId: realm.id, userId: id('friend'), level: 'read' });
    await request(e2e.server)
      .get(`/v1/realms/${realm.id}/access/${id('friend')}`)
      .set(as('owner'))
      .expect(403);
    await request(e2e.server)
      .get(`/v1/realms/missing/access/${id('friend')}`)
      .set(as('admin'))
      .expect(404);

    // The member leaves, then the game is deleted.
    await consumer.handleGameUpdated(game(realm.id, []), context('internal.rmu-strategic.game.updated.v1'));
    await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('friend')).expect(403);
    await consumer.handleGameUpdated(game(realm.id, ['friend']), context('internal.rmu-strategic.game.updated.v1'));
    await consumer.handleGameDeleted(game(realm.id, ['friend']), context('internal.rmu-strategic.game.deleted.v1'));
    await request(e2e.server).get(`/v1/realms/${realm.id}`).set(as('friend')).expect(403);
  });
});
