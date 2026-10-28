import request from 'supertest';
import { type E2eApp, ids, startApp, takeTopics, type UserName } from './support/app.js';
import { traitBody } from './support/fixtures.js';

describe('Traits (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const create = async (user: UserName, overrides: Record<string, unknown> = {}) => {
    const res = await request(e2e.server).post('/v1/traits').set('Authorization', e2e.auth(user)).send(traitBody(overrides)).expect(201);
    return res.body as { id: string; name: string };
  };

  describe('CRUD', () => {
    it('creates, reads, lists, updates and deletes a trait, publishing its events', async () => {
      const auth = e2e.auth('owner');
      takeTopics(e2e.events);

      const created = await create('owner', { name: 'Visión nocturna', category: 'senses', maxTier: 3, tierCost: 2 });
      expect(created).toMatchObject({
        id: 'vision-nocturna',
        name: 'Visión nocturna',
        category: 'senses',
        isTalent: true,
        specialization: 'none',
        maxTier: 3,
        adquisitionCost: 5,
        tierCost: 2,
      });

      const found = await request(e2e.server).get('/v1/traits/vision-nocturna').set('Authorization', auth).expect(200);
      expect(found.body).toMatchObject({ id: 'vision-nocturna', name: 'Visión nocturna' });

      const listed = await request(e2e.server).get('/v1/traits?q=category==senses').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toEqual(['vision-nocturna']);
      expect(listed.body).toMatchObject({ pagination: { page: 0, size: 10, totalElements: 1 } });

      const updated = await request(e2e.server)
        .patch('/v1/traits/vision-nocturna')
        .set('Authorization', auth)
        .send({ name: 'Visión en la oscuridad', adquisitionCost: 8, description: 'Sees in the dark' })
        .expect(200);
      // The id stays the one derived from the name it was created with.
      expect(updated.body).toMatchObject({
        id: 'vision-nocturna',
        name: 'Visión en la oscuridad',
        adquisitionCost: 8,
        description: 'Sees in the dark',
      });

      await request(e2e.server).delete('/v1/traits/vision-nocturna').set('Authorization', auth).expect(204);
      await request(e2e.server).get('/v1/traits/vision-nocturna').set('Authorization', auth).expect(404);
      await request(e2e.server).delete('/v1/traits/vision-nocturna').set('Authorization', auth).expect(404);

      expect(takeTopics(e2e.events)).toEqual([
        'internal.rmu-core.trait.created.v1',
        'internal.rmu-core.trait.updated.v1',
        'internal.rmu-core.trait.deleted.v1',
      ]);
    });

    it('stores the Character Companion details and the new categories and specializations', async () => {
      const auth = e2e.auth('owner');
      const created = await create('owner', {
        name: 'Fixture companion talent',
        category: 'epic',
        specialization: 'skill-category',
        talentCategory: 'combat-expertise',
        prerequisites: [{ type: 'natural' }, { type: 'profession', value: 'ranger,druid' }, { type: 'milestone', description: 'a feat' }],
        possibleFlaws: ['fixture-flaw'],
        source: 'character-companion',
      });
      expect(created).toMatchObject({
        category: 'epic',
        specialization: 'skill-category',
        talentCategory: 'combat-expertise',
        prerequisites: [{ type: 'natural' }, { type: 'profession', value: 'ranger,druid' }, { type: 'milestone', description: 'a feat' }],
        possibleFlaws: ['fixture-flaw'],
        source: 'character-companion',
      });

      const updated = await request(e2e.server)
        .patch(`/v1/traits/${created.id}`)
        .set('Authorization', auth)
        .send({ prerequisites: [{ type: 'training' }], possibleFlaws: [] })
        .expect(200);
      expect(updated.body).toMatchObject({ prerequisites: [{ type: 'training' }], possibleFlaws: [], talentCategory: 'combat-expertise' });

      await request(e2e.server)
        .patch(`/v1/traits/${created.id}`)
        .set('Authorization', auth)
        .send({ prerequisites: [{ type: 'bribe' }] })
        .expect(400);
      await request(e2e.server).delete(`/v1/traits/${created.id}`).set('Authorization', auth).expect(204);
    });

    it('searches with RSQL and pages the results, up to the catalog page size', async () => {
      const auth = e2e.auth('owner');
      for (const name of ['Search A', 'Search B', 'Search C']) await create('owner', { name, category: 'discipline' });

      const page = await request(e2e.server).get('/v1/traits?q=category==discipline&size=2&page=1').set('Authorization', auth).expect(200);
      expect(page.body).toMatchObject({ pagination: { page: 1, size: 2, totalElements: 3 } });
      expect(ids(page.body)).toHaveLength(1);

      const all = await request(e2e.server).get('/v1/traits?q=category==discipline&size=1000').set('Authorization', auth).expect(200);
      expect(ids(all.body).sort()).toEqual(['search-a', 'search-b', 'search-c']);
      await request(e2e.server).get('/v1/traits?size=1001').set('Authorization', auth).expect(400);

      const none = await request(e2e.server).get('/v1/traits?q=name==Missing').set('Authorization', auth).expect(200);
      expect(ids(none.body)).toEqual([]);
    });
  });

  describe('validation', () => {
    it('rejects an empty or null name on update', async () => {
      const auth = e2e.auth('owner');
      const path = `/v1/traits/${(await create('owner', { name: 'Named trait' })).id}`;
      for (const name of ['', null]) {
        const res = await request(e2e.server).patch(path).set('Authorization', auth).send({ name }).expect(400);
        expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException' });
      }
    });

    it('rejects an empty body', async () => {
      const res = await request(e2e.server).post('/v1/traits').set('Authorization', e2e.auth('owner')).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/traits' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it('rejects an empty name, a text cost and a name without letters or digits', async () => {
      const auth = e2e.auth('owner');
      await request(e2e.server)
        .post('/v1/traits')
        .set('Authorization', auth)
        .send(traitBody({ name: '' }))
        .expect(400);
      await request(e2e.server)
        .post('/v1/traits')
        .set('Authorization', auth)
        .send(traitBody({ adquisitionCost: 'many' }))
        .expect(400);
      const res = await request(e2e.server)
        .post('/v1/traits')
        .set('Authorization', auth)
        .send(traitBody({ name: '!!!' }))
        .expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'ValidationError' });
    });

    it('rejects a name whose id already exists', async () => {
      await create('owner', { name: 'Ambidextrous' });
      const res = await request(e2e.server)
        .post('/v1/traits')
        .set('Authorization', e2e.auth('admin'))
        .send(traitBody({ name: 'ambidextrous' }))
        .expect(409);
      expect(res.body).toMatchObject({ statusCode: 409, error: 'ConflictError' });
    });
  });

  describe('permissions', () => {
    it('lets only its owner and admins change a trait', async () => {
      const trait = await create('owner', { name: 'Owned trait' });
      const path = `/v1/traits/${trait.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('admin')).expect(200);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ name: 'Taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('admin')).send({ description: 'By admin' }).expect(200);

      const ofAdmin = await request(e2e.server).get('/v1/traits?size=1000').set('Authorization', e2e.auth('admin')).expect(200);
      expect(ids(ofAdmin.body)).toContain(trait.id);

      await request(e2e.server).delete(path).set('Authorization', e2e.auth('admin')).expect(204);
    });

    it('lets players and admins create traits, but not a user without a role', async () => {
      await request(e2e.server)
        .post('/v1/traits')
        .set('Authorization', e2e.auth('noRole'))
        .send(traitBody({ name: 'By guest' }))
        .expect(403);
      await create('admin', { name: 'By admin' });
    });

    it('lets every authenticated user read and list any trait', async () => {
      const trait = await create('owner', { name: 'Shared trait' });

      for (const user of ['other', 'noRole'] as const) {
        await request(e2e.server).get(`/v1/traits/${trait.id}`).set('Authorization', e2e.auth(user)).expect(200);
        const listed = await request(e2e.server).get('/v1/traits?size=1000').set('Authorization', e2e.auth(user)).expect(200);
        expect(ids(listed.body)).toContain(trait.id);
      }
    });

    it('rejects a request without a token', async () => {
      await request(e2e.server).get('/v1/traits').expect(401);
      await request(e2e.server).post('/v1/traits').send(traitBody()).expect(401);
    });

    it('answers 404 for a trait that does not exist', async () => {
      await request(e2e.server).get('/v1/traits/missing').set('Authorization', e2e.auth('admin')).expect(404);
      await request(e2e.server).patch('/v1/traits/missing').set('Authorization', e2e.auth('admin')).send({ name: 'X' }).expect(404);
      await request(e2e.server).delete('/v1/traits/missing').set('Authorization', e2e.auth('admin')).expect(404);
    });
  });
});
