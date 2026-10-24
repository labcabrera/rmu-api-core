import type { KafkaContext } from '@nestjs/microservices';
import request from 'supertest';
import { KafkaRealmEventConsumer } from '../../src/modules/races/interfaces/messaging/kafka.realm-event-consumer.js';
import type { RealmProps } from '../../src/modules/realms/domain/aggregates/realm-props.js';
import { DomainEvent } from '../../src/modules/shared/domain/events/domain-event.js';
import { type E2eApp, ids, startApp, takeTopics, type UserName } from './support/app.js';
import { raceBody, realmBody } from './support/fixtures.js';

type Race = {
  id: string;
  name: string;
  owner: string;
  accessType: string;
  traits: { id: string; traitId: string }[];
  skillBonuses: { skillId: string; specialization?: string | null; bonus: number }[];
};

describe('Races (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const createRealm = async (user: UserName, overrides: Record<string, unknown> = {}) => {
    const res = await request(e2e.server).post('/v1/realms').set('Authorization', e2e.auth(user)).send(realmBody(overrides)).expect(201);
    return res.body as RealmProps;
  };

  const create = async (user: UserName, realmId: string, overrides: Record<string, unknown> = {}) => {
    const res = await request(e2e.server)
      .post('/v1/races')
      .set('Authorization', e2e.auth(user))
      .send(raceBody(realmId, overrides))
      .expect(201);
    return res.body as Race;
  };

  describe('CRUD', () => {
    it('creates, reads, lists, updates and deletes a race, publishing its events', async () => {
      const auth = e2e.auth('owner');
      const realm = await createRealm('owner');
      takeTopics(e2e.events);

      const created = await create('owner', realm.id, { name: 'Dunadan', defaultLanguage: 'westron' });
      expect(created).toMatchObject({
        name: 'Dunadan',
        realmId: realm.id,
        owner: 'e2e-owner',
        accessType: 'private',
        defaultLanguage: 'westron',
        skillBonuses: [],
      });

      const found = await request(e2e.server).get(`/v1/races/${created.id}`).set('Authorization', auth).expect(200);
      expect(found.body).toMatchObject({ id: created.id, name: 'Dunadan', baseHits: 10 });

      const listed = await request(e2e.server).get('/v1/races?q=name==Dunadan').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toEqual([created.id]);
      expect(listed.body).toMatchObject({ pagination: { page: 0, size: 10, totalElements: 1 } });

      const updated = await request(e2e.server)
        .patch(`/v1/races/${created.id}`)
        .set('Authorization', auth)
        .send({ name: 'Numenorean', baseHits: 12 })
        .expect(200);
      expect(updated.body).toMatchObject({ name: 'Numenorean', baseHits: 12, baseDevPoints: 60 });

      await request(e2e.server).delete(`/v1/races/${created.id}`).set('Authorization', auth).expect(204);
      await request(e2e.server).get(`/v1/races/${created.id}`).set('Authorization', auth).expect(404);
      await request(e2e.server).delete(`/v1/races/${created.id}`).set('Authorization', auth).expect(404);

      expect(takeTopics(e2e.events)).toEqual([
        'internal.rmu-core.race.created.v1',
        'internal.rmu-core.race.updated.v1',
        'internal.rmu-core.race.deleted.v1',
      ]);
    });

    it('searches with RSQL and pages the results', async () => {
      const auth = e2e.auth('owner');
      const realm = await createRealm('owner');
      for (const name of ['Search A', 'Search B', 'Search C']) await create('owner', realm.id, { name });

      const page = await request(e2e.server).get('/v1/races?q=name=re=search&size=2&page=1').set('Authorization', auth).expect(200);
      expect(page.body).toMatchObject({ pagination: { page: 1, size: 2, totalElements: 3 } });
      expect(ids(page.body)).toHaveLength(1);

      const byRealm = await request(e2e.server).get(`/v1/races?q=realmId==${realm.id}`).set('Authorization', auth).expect(200);
      expect(ids(byRealm.body)).toHaveLength(3);
    });

    it('takes the access type of its realm', async () => {
      const realm = await createRealm('owner', { accessType: 'public' });
      const race = await create('owner', realm.id, { accessType: 'private' });
      expect(race).toMatchObject({ accessType: 'public' });
    });

    it('adds and removes traits', async () => {
      const auth = e2e.auth('owner');
      const race = await create('owner', (await createRealm('owner')).id);
      const path = `/v1/races/${race.id}/traits`;
      takeTopics(e2e.events);

      const added = await request(e2e.server)
        .post(path)
        .set('Authorization', auth)
        .send({ traitId: 'night-vision', isTalent: false, tier: 2 })
        .expect(200);
      const traits = (added.body as Race).traits;
      expect(traits).toEqual([expect.objectContaining({ traitId: 'night-vision', isTalent: false, tier: 2 })]);
      expect(traits[0].id).toBeTypeOf('string');

      const removed = await request(e2e.server).delete(`${path}/${traits[0].id}`).set('Authorization', auth).expect(200);
      expect((removed.body as Race).traits).toEqual([]);
      await request(e2e.server).delete(`${path}/${traits[0].id}`).set('Authorization', auth).expect(404);

      expect(takeTopics(e2e.events)).toEqual(['internal.rmu-core.race.updated.v1', 'internal.rmu-core.race.updated.v1']);
    });

    it('sets and removes skill bonuses by skill and specialization', async () => {
      const auth = e2e.auth('owner');
      const race = await create('owner', (await createRealm('owner')).id);
      const path = `/v1/races/${race.id}/skill-bonuses`;

      await request(e2e.server).post(path).set('Authorization', auth).send({ skillId: 'perception', bonus: 5 }).expect(200);
      await request(e2e.server)
        .post(path)
        .set('Authorization', auth)
        .send({ skillId: 'animal-handling', specialization: 'cat', bonus: 10 })
        .expect(200);
      const replaced = await request(e2e.server)
        .post(path)
        .set('Authorization', auth)
        .send({ skillId: 'perception', bonus: 15 })
        .expect(200);
      expect((replaced.body as Race).skillBonuses).toEqual([
        expect.objectContaining({ skillId: 'perception', bonus: 15 }),
        expect.objectContaining({ skillId: 'animal-handling', specialization: 'cat', bonus: 10 }),
      ]);

      const removed = await request(e2e.server).delete(`${path}/animal-handling?specialization=cat`).set('Authorization', auth).expect(200);
      expect((removed.body as Race).skillBonuses).toEqual([expect.objectContaining({ skillId: 'perception' })]);
      const empty = await request(e2e.server).delete(`${path}/perception`).set('Authorization', auth).expect(200);
      expect((empty.body as Race).skillBonuses).toEqual([]);
      await request(e2e.server).delete(`${path}/perception`).set('Authorization', auth).expect(404);
    });

    it('the realm event consumer keeps the races of a realm in step', async () => {
      const auth = e2e.auth('owner');
      const realm = await createRealm('owner', { name: 'Synced realm' });
      const race = await create('owner', realm.id);
      const consumer = e2e.app.get(KafkaRealmEventConsumer);
      const context = { getTopic: () => 'internal.rmu-core.realm.e2e.v1' } as KafkaContext;

      await consumer.handleRealmUpdated(new DomainEvent('updated', { ...realm, accessType: 'public' }), context);
      const synced = await request(e2e.server).get(`/v1/races/${race.id}`).set('Authorization', auth).expect(200);
      expect(synced.body).toMatchObject({ accessType: 'public' });

      takeTopics(e2e.events);
      await consumer.handleRealmDeleted(new DomainEvent('deleted', realm), context);
      await request(e2e.server).get(`/v1/races/${race.id}`).set('Authorization', auth).expect(404);
      expect(takeTopics(e2e.events)).toEqual(['internal.rmu-core.race.deleted.v1']);

      // Redelivery finds nothing left to delete.
      await consumer.handleRealmDeleted(new DomainEvent('deleted', realm), context);
      expect(takeTopics(e2e.events)).toEqual([]);
    });
  });

  describe('validation', () => {
    it('rejects an empty body', async () => {
      const res = await request(e2e.server).post('/v1/races').set('Authorization', e2e.auth('owner')).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/races' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it('rejects a missing realm, invalid fields and invalid subresources', async () => {
      const auth = e2e.auth('owner');
      const missing = await request(e2e.server).post('/v1/races').set('Authorization', auth).send(raceBody('missing')).expect(400);
      expect(missing.body).toMatchObject({ error: 'ValidationError' });

      const realm = await createRealm('owner');
      await request(e2e.server)
        .post('/v1/races')
        .set('Authorization', auth)
        .send(raceBody(realm.id, { baseHits: 'ten' }))
        .expect(400);
      await request(e2e.server)
        .post('/v1/races')
        .set('Authorization', auth)
        .send(raceBody(realm.id, { stats: { ag: 'x' } }))
        .expect(400);

      const race = await create('owner', realm.id);
      await request(e2e.server).patch(`/v1/races/${race.id}`).set('Authorization', auth).send({ baseHits: 'ten' }).expect(400);
      await request(e2e.server).post(`/v1/races/${race.id}/traits`).set('Authorization', auth).send({ traitId: 'x' }).expect(400);
      await request(e2e.server).post(`/v1/races/${race.id}/skill-bonuses`).set('Authorization', auth).send({ skillId: 'x' }).expect(400);
    });

    it('drops unknown fields of the body', async () => {
      const race = await create('owner', (await createRealm('owner')).id, { owner: 'someone-else', unknown: 'value' });
      expect(race).toMatchObject({ owner: 'e2e-owner' });
      expect(race).not.toHaveProperty('unknown');
    });
  });

  describe('permissions', () => {
    it('a non-admin owner can delete their own race', async () => {
      const race = await create('owner', (await createRealm('owner')).id);
      await request(e2e.server).delete(`/v1/races/${race.id}`).set('Authorization', e2e.auth('owner')).expect(204);
    });

    it('shows a race of a private realm only to its owner and admins, and lets only them change it', async () => {
      const race = await create('owner', (await createRealm('owner')).id, { name: 'Private race' });
      const path = `/v1/races/${race.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('admin')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('noRole')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ name: 'Taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server)
        .post(`${path}/traits`)
        .set('Authorization', e2e.auth('other'))
        .send({ traitId: 'x', isTalent: false })
        .expect(403);
      await request(e2e.server)
        .post(`${path}/skill-bonuses`)
        .set('Authorization', e2e.auth('other'))
        .send({ skillId: 'x', bonus: 1 })
        .expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('admin')).send({ name: 'By admin' }).expect(200);

      const ofOther = await request(e2e.server).get('/v1/races?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(ofOther.body)).not.toContain(race.id);
      const ofAdmin = await request(e2e.server).get('/v1/races?size=100').set('Authorization', e2e.auth('admin')).expect(200);
      expect(ids(ofAdmin.body)).toContain(race.id);

      await request(e2e.server).delete(path).set('Authorization', e2e.auth('admin')).expect(204);
    });

    it('shows a race of a public realm to everyone but lets only its owner and admins change it', async () => {
      const race = await create('owner', (await createRealm('owner', { accessType: 'public' })).id, { name: 'Public race' });
      const path = `/v1/races/${race.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('noRole')).expect(200);
      const listed = await request(e2e.server).get('/v1/races?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(listed.body)).toContain(race.id);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ name: 'Taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('owner')).expect(204);
    });

    it('answers 404 for a race that does not exist', async () => {
      const auth = e2e.auth('admin');
      await request(e2e.server).get('/v1/races/missing').set('Authorization', auth).expect(404);
      await request(e2e.server).patch('/v1/races/missing').set('Authorization', auth).send({ name: 'X' }).expect(404);
      await request(e2e.server)
        .post('/v1/races/missing/traits')
        .set('Authorization', auth)
        .send({ traitId: 'x', isTalent: false })
        .expect(404);
      await request(e2e.server)
        .post('/v1/races/missing/skill-bonuses')
        .set('Authorization', auth)
        .send({ skillId: 'x', bonus: 1 })
        .expect(404);
    });
  });
});
