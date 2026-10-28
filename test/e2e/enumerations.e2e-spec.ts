import request from 'supertest';
import { type E2eApp, ids, startApp, takeTopics, type UserName } from './support/app.js';
import { enumerationBody, realmBody } from './support/fixtures.js';

describe('Enumerations (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const create = async (user: UserName, overrides: Record<string, unknown> = {}) => {
    const res = await request(e2e.server)
      .post('/v1/enumerations')
      .set('Authorization', e2e.auth(user))
      .send(enumerationBody(overrides))
      .expect(201);
    return res.body as { id: string; key: string };
  };

  describe('CRUD', () => {
    it('creates, reads, lists, updates and deletes an enumeration, without events', async () => {
      const auth = e2e.auth('owner');
      takeTopics(e2e.events);

      const created = await create('owner', { key: 'horse', category: 'animal-type', description: 'A hoofed mammal' });
      expect(created).toMatchObject({
        key: 'horse',
        category: 'animal-type',
        realmId: null,
        description: 'A hoofed mammal',
        imageUrl: null,
        owner: 'e2e-owner',
        accessType: 'private',
        entitySource: 'user',
      });

      const found = await request(e2e.server).get(`/v1/enumerations/${created.id}`).set('Authorization', auth).expect(200);
      expect(found.body).toMatchObject({ id: created.id, key: 'horse' });

      const listed = await request(e2e.server).get('/v1/enumerations?q=key==horse').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toEqual([created.id]);
      expect(listed.body).toMatchObject({ pagination: { page: 0, size: 10, totalElements: 1 } });

      const updated = await request(e2e.server)
        .patch(`/v1/enumerations/${created.id}`)
        .set('Authorization', auth)
        .send({ key: 'pony', imageUrl: 'https://example.test/pony.png' })
        .expect(200);
      expect(updated.body).toMatchObject({ key: 'pony', imageUrl: 'https://example.test/pony.png', description: 'A hoofed mammal' });

      await request(e2e.server).delete(`/v1/enumerations/${created.id}`).set('Authorization', auth).expect(204);
      await request(e2e.server).get(`/v1/enumerations/${created.id}`).set('Authorization', auth).expect(404);
      await request(e2e.server).delete(`/v1/enumerations/${created.id}`).set('Authorization', auth).expect(404);

      expect(takeTopics(e2e.events)).toEqual([]);
    });

    it('searches with RSQL and pages the results sorted by key, up to the catalog page size', async () => {
      const auth = e2e.auth('owner');
      for (const key of ['search-c', 'search-a', 'search-b']) await create('owner', { key, category: 'region' });

      const page = await request(e2e.server)
        .get('/v1/enumerations?q=category==region&size=2&page=0')
        .set('Authorization', auth)
        .expect(200);
      expect(page.body).toMatchObject({ pagination: { page: 0, size: 2, totalElements: 3 } });
      expect((page.body as { content: { key: string }[] }).content.map(item => item.key)).toEqual(['search-a', 'search-b']);

      const all = await request(e2e.server).get('/v1/enumerations?q=category==region&size=1000').set('Authorization', auth).expect(200);
      expect(ids(all.body)).toHaveLength(3);
      await request(e2e.server).get('/v1/enumerations?size=1001').set('Authorization', auth).expect(400);

      const none = await request(e2e.server).get('/v1/enumerations?q=key==missing').set('Authorization', auth).expect(200);
      expect(ids(none.body)).toEqual([]);
    });

    it('lists the enumeration categories', async () => {
      const res = await request(e2e.server).get('/v1/enumeration-categories').set('Authorization', e2e.auth('noRole')).expect(200);
      expect(res.body).toEqual(expect.arrayContaining(['animal-type', 'language', 'region', 'vehicle']));
      await request(e2e.server).get('/v1/enumeration-categories').expect(401);
    });
  });

  describe('validation', () => {
    it('rejects an access type other than public or private, on create and on update', async () => {
      const auth = e2e.auth('owner');
      const created = await request(e2e.server)
        .post('/v1/enumerations')
        .set('Authorization', auth)
        .send(enumerationBody({ key: 'wild', accessType: 'wild' }))
        .expect(400);
      expect(created.body).toMatchObject({ statusCode: 400, error: 'BadRequestException' });
      await request(e2e.server)
        .patch(`/v1/enumerations/${(await create('owner')).id}`)
        .set('Authorization', auth)
        .send({ accessType: 'wild' })
        .expect(400);
    });

    it('rejects an empty body', async () => {
      const res = await request(e2e.server).post('/v1/enumerations').set('Authorization', e2e.auth('owner')).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/enumerations' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it('rejects an unknown category and an empty key', async () => {
      const auth = e2e.auth('owner');
      await request(e2e.server)
        .post('/v1/enumerations')
        .set('Authorization', auth)
        .send(enumerationBody({ category: 'dragon' }))
        .expect(400);
      await request(e2e.server)
        .post('/v1/enumerations')
        .set('Authorization', auth)
        .send(enumerationBody({ key: '' }))
        .expect(400);
      const enumeration = await create('owner', { key: 'valid-key' });
      await request(e2e.server)
        .patch(`/v1/enumerations/${enumeration.id}`)
        .set('Authorization', auth)
        .send({ category: 'dragon' })
        .expect(400);
    });

    it('rejects a key that already exists in the category, on create and on update', async () => {
      const auth = e2e.auth('owner');
      await create('owner', { key: 'elvish', category: 'language' });
      const res = await request(e2e.server)
        .post('/v1/enumerations')
        .set('Authorization', auth)
        .send(enumerationBody({ key: 'elvish', category: 'language' }))
        .expect(409);
      expect(res.body).toMatchObject({ statusCode: 409, error: 'ConflictError' });

      // The same key in another category is a different enumeration.
      const religion = await create('owner', { key: 'elvish', category: 'religion' });
      await request(e2e.server)
        .patch(`/v1/enumerations/${religion.id}`)
        .set('Authorization', auth)
        .send({ category: 'language' })
        .expect(409);
    });
  });

  describe('permissions', () => {
    it('lets players and admins create enumerations, but not a user without a role', async () => {
      await create('owner', { key: 'by-owner' });
      await create('admin', { key: 'by-admin' });
      await request(e2e.server)
        .post('/v1/enumerations')
        .set('Authorization', e2e.auth('noRole'))
        .send(enumerationBody({ key: 'by-guest' }))
        .expect(403);
    });

    it.each(['private', 'public'])('adds enumerations to a %s realm only for its owner and admins', async accessType => {
      const realm = await request(e2e.server)
        .post('/v1/realms')
        .set('Authorization', e2e.auth('owner'))
        .send(realmBody({ accessType }))
        .expect(201);
      const realmId = (realm.body as { id: string }).id;
      const post = (user: UserName) =>
        request(e2e.server)
          .post('/v1/enumerations')
          .set('Authorization', e2e.auth(user))
          .send(enumerationBody({ key: `realm-${user}`, realmId }));

      await post('other').expect(403);
      await post('owner').expect(201);
      await post('admin').expect(201);
      const missing = await request(e2e.server)
        .post('/v1/enumerations')
        .set('Authorization', e2e.auth('owner'))
        .send(enumerationBody({ key: 'missing-realm', realmId: 'missing' }))
        .expect(400);
      expect(missing.body).toMatchObject({ error: 'ValidationError' });
    });

    it('shows a private enumeration only to its owner and admins, and lets only them change it', async () => {
      const enumeration = await create('owner', { key: 'private-key' });
      const path = `/v1/enumerations/${enumeration.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('admin')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ key: 'taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('admin')).send({ description: 'By admin' }).expect(200);

      const ofOther = await request(e2e.server).get('/v1/enumerations?size=1000').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(ofOther.body)).not.toContain(enumeration.id);
      const ofAdmin = await request(e2e.server).get('/v1/enumerations?size=1000').set('Authorization', e2e.auth('admin')).expect(200);
      expect(ids(ofAdmin.body)).toContain(enumeration.id);

      await request(e2e.server).delete(path).set('Authorization', e2e.auth('admin')).expect(204);
    });

    it('shows a public enumeration to everyone but lets only its owner and admins change it', async () => {
      const enumeration = await create('owner', { key: 'public-key', accessType: 'public' });
      const path = `/v1/enumerations/${enumeration.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('noRole')).expect(200);
      const listed = await request(e2e.server).get('/v1/enumerations?size=1000').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(listed.body)).toContain(enumeration.id);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ key: 'taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('owner')).expect(204);
    });

    it('answers 404 for an enumeration that does not exist', async () => {
      await request(e2e.server).get('/v1/enumerations/missing').set('Authorization', e2e.auth('admin')).expect(404);
      await request(e2e.server).patch('/v1/enumerations/missing').set('Authorization', e2e.auth('admin')).send({ key: 'x' }).expect(404);
      await request(e2e.server).delete('/v1/enumerations/missing').set('Authorization', e2e.auth('admin')).expect(404);
    });
  });
});
