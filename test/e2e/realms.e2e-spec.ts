import request from 'supertest';
import { type E2eApp, ids, startApp, takeTopics, type UserName } from './support/app.js';
import { realmBody } from './support/fixtures.js';

describe('Realms (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const create = async (user: UserName, overrides: Record<string, unknown> = {}) => {
    const res = await request(e2e.server).post('/v1/realms').set('Authorization', e2e.auth(user)).send(realmBody(overrides)).expect(201);
    return res.body as { id: string; name: string };
  };

  describe('CRUD', () => {
    it('creates, reads, lists, updates and deletes a realm, publishing its events', async () => {
      const auth = e2e.auth('owner');
      takeTopics(e2e.events);

      const created = await create('owner', { name: 'Kulthea' });
      expect(created).toMatchObject({ name: 'Kulthea', owner: 'e2e-owner', accessType: 'private', magicPresence: 'limited' });

      const found = await request(e2e.server).get(`/v1/realms/${created.id}`).set('Authorization', auth).expect(200);
      expect(found.body).toMatchObject({ id: created.id, name: 'Kulthea' });

      const listed = await request(e2e.server).get('/v1/realms?q=name==Kulthea').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toEqual([created.id]);
      expect(listed.body).toMatchObject({ pagination: { page: 0, size: 10, totalElements: 1 } });

      const updated = await request(e2e.server)
        .patch(`/v1/realms/${created.id}`)
        .set('Authorization', auth)
        .send({ name: 'Shadow World', magicPresence: 'unlimited' })
        .expect(200);
      expect(updated.body).toMatchObject({ name: 'Shadow World', magicPresence: 'unlimited' });

      await request(e2e.server).delete(`/v1/realms/${created.id}`).set('Authorization', auth).expect(204);
      await request(e2e.server).get(`/v1/realms/${created.id}`).set('Authorization', auth).expect(404);
      await request(e2e.server).delete(`/v1/realms/${created.id}`).set('Authorization', auth).expect(404);

      expect(takeTopics(e2e.events)).toEqual([
        'internal.rmu-core.realm.created.v1',
        'internal.rmu-core.realm.updated.v1',
        'internal.rmu-core.realm.deleted.v1',
      ]);
    });

    it('searches with RSQL and pages the results', async () => {
      const auth = e2e.auth('owner');
      for (const name of ['Search A', 'Search B', 'Search C']) await create('owner', { name });

      const page = await request(e2e.server).get('/v1/realms?q=name=re=search&size=2&page=1').set('Authorization', auth).expect(200);
      expect(page.body).toMatchObject({ pagination: { page: 1, size: 2, totalElements: 3 } });
      expect(ids(page.body)).toHaveLength(1);

      const none = await request(e2e.server).get('/v1/realms?q=name==Missing').set('Authorization', auth).expect(200);
      expect(ids(none.body)).toEqual([]);
    });

    it('clears the optional texts with an empty string or null', async () => {
      const auth = e2e.auth('owner');
      const realm = await create('owner', { shortDescription: 'Short', description: 'Long', imageUrl: 'https://example.test/a.png' });

      await request(e2e.server)
        .patch(`/v1/realms/${realm.id}`)
        .set('Authorization', auth)
        .send({ shortDescription: '', description: null })
        .expect(200);
      const found = await request(e2e.server).get(`/v1/realms/${realm.id}`).set('Authorization', auth).expect(200);
      expect(found.body).not.toHaveProperty('shortDescription');
      expect(found.body).not.toHaveProperty('description');
      expect(found.body).toMatchObject({ imageUrl: 'https://example.test/a.png' });
    });
  });

  describe('validation', () => {
    it('rejects an access type other than public or private, on create and on update', async () => {
      const auth = e2e.auth('owner');
      const created = await request(e2e.server)
        .post('/v1/realms')
        .set('Authorization', auth)
        .send(realmBody({ accessType: 'wild' }))
        .expect(400);
      expect(created.body).toMatchObject({ statusCode: 400, error: 'BadRequestException' });
      await request(e2e.server)
        .patch(`/v1/realms/${(await create('owner')).id}`)
        .set('Authorization', auth)
        .send({ accessType: 'wild' })
        .expect(400);
    });

    it('rejects an empty body', async () => {
      const res = await request(e2e.server).post('/v1/realms').set('Authorization', e2e.auth('owner')).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/realms' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it('rejects an unknown magic presence and an empty name', async () => {
      const auth = e2e.auth('owner');
      await request(e2e.server)
        .post('/v1/realms')
        .set('Authorization', auth)
        .send(realmBody({ magicPresence: 'wild' }))
        .expect(400);
      const realm = await create('owner');
      await request(e2e.server).patch(`/v1/realms/${realm.id}`).set('Authorization', auth).send({ name: '' }).expect(400);
      await request(e2e.server).patch(`/v1/realms/${realm.id}`).set('Authorization', auth).send({ name: null }).expect(400);
    });

    it('drops unknown fields of the body', async () => {
      const realm = await create('owner', { owner: 'someone-else', unknown: 'value' });
      expect(realm).toMatchObject({ owner: 'e2e-owner' });
      expect(realm).not.toHaveProperty('unknown');
    });
  });

  describe('permissions', () => {
    it('lets players and admins create realms, but not a user without a role', async () => {
      await create('owner');
      await create('admin');
      await request(e2e.server).post('/v1/realms').set('Authorization', e2e.auth('noRole')).send(realmBody()).expect(403);
    });

    it('shows a private realm only to its owner and admins, and lets only them change it', async () => {
      const realm = await create('owner', { name: 'Private realm' });
      const path = `/v1/realms/${realm.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('admin')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ name: 'Taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('admin')).send({ name: 'By admin' }).expect(200);

      const ofOther = await request(e2e.server).get('/v1/realms?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(ofOther.body)).not.toContain(realm.id);
      const ofAdmin = await request(e2e.server).get('/v1/realms?size=100').set('Authorization', e2e.auth('admin')).expect(200);
      expect(ids(ofAdmin.body)).toContain(realm.id);

      await request(e2e.server).delete(path).set('Authorization', e2e.auth('admin')).expect(204);
    });

    it('shows a public realm to everyone but lets only its owner and admins change it', async () => {
      const realm = await create('owner', { name: 'Public realm', accessType: 'public' });
      const path = `/v1/realms/${realm.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('noRole')).expect(200);
      const listed = await request(e2e.server).get('/v1/realms?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(listed.body)).toContain(realm.id);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ name: 'Taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('owner')).expect(204);
    });

    it('answers 404 for a realm that does not exist', async () => {
      await request(e2e.server).get('/v1/realms/missing').set('Authorization', e2e.auth('admin')).expect(404);
      await request(e2e.server).patch('/v1/realms/missing').set('Authorization', e2e.auth('admin')).send({ name: 'X' }).expect(404);
    });
  });
});
