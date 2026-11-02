import request from 'supertest';
import { type E2eApp, ids, startApp, takeTopics, type UserName } from './support/app.js';
import { maneuverModifierBody, skillBody, skillCategoryBody } from './support/fixtures.js';

describe('Maneuver modifiers (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const create = async (user: UserName, key: string, overrides: Record<string, unknown> = {}) => {
    const res = await request(e2e.server)
      .post('/v1/maneuver-modifiers')
      .set('Authorization', e2e.auth(user))
      .send(maneuverModifierBody(key, overrides))
      .expect(201);
    return res.body as { id: string; key: string };
  };

  const keys = (body: unknown) => (body as { key: string }[]).map(item => item.key);

  describe('contexts', () => {
    it('keeps the contexts of a Trading modifier, filters by them and rejects unknown ones', async () => {
      const auth = e2e.auth('owner');
      const created = await create('owner', 'e2e-perishable', { scope: { skillIds: ['e2e-skill'], contexts: ['sale', 'sale'] } });
      expect(created).toMatchObject({ scope: { skillIds: ['e2e-skill'], contexts: ['sale'] } });

      const listed = await request(e2e.server).get('/v1/maneuver-modifiers?q=scope.contexts==sale').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toContain(created.id);

      await request(e2e.server)
        .post('/v1/maneuver-modifiers')
        .set('Authorization', auth)
        .send(maneuverModifierBody('e2e-bad-context', { scope: { skillIds: ['e2e-skill'], contexts: ['rent'] } }))
        .expect(400);
    });
  });

  describe('CRUD', () => {
    it('creates, reads, lists, updates and deletes a maneuver modifier, without events', async () => {
      const auth = e2e.auth('owner');
      takeTopics(e2e.events);

      const created = await create('owner', 'e2e-darkness', { description: 'In the dark' });
      expect(created).toMatchObject({
        key: 'e2e-darkness',
        scope: { skillIds: ['e2e-skill'] },
        type: 'flag',
        value: 10,
        description: 'In the dark',
        owner: 'e2e-owner',
        accessType: 'private',
      });

      const found = await request(e2e.server).get(`/v1/maneuver-modifiers/${created.id}`).set('Authorization', auth).expect(200);
      expect(found.body).toMatchObject({ id: created.id, key: 'e2e-darkness' });

      const listed = await request(e2e.server).get('/v1/maneuver-modifiers?q=key==e2e-darkness').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toEqual([created.id]);
      expect(listed.body).toMatchObject({ pagination: { page: 0, size: 10, totalElements: 1 } });

      // A change of type keeps only the fields of the new type.
      const updated = await request(e2e.server)
        .patch(`/v1/maneuver-modifiers/${created.id}`)
        .set('Authorization', auth)
        .send({ type: 'number', perUnit: -5, min: 0, max: 4 })
        .expect(200);
      expect(updated.body).toMatchObject({ key: 'e2e-darkness', type: 'number', perUnit: -5, min: 0, max: 4 });
      expect(updated.body).not.toHaveProperty('value');

      await request(e2e.server).delete(`/v1/maneuver-modifiers/${created.id}`).set('Authorization', auth).expect(204);
      await request(e2e.server).get(`/v1/maneuver-modifiers/${created.id}`).set('Authorization', auth).expect(404);
      await request(e2e.server).delete(`/v1/maneuver-modifiers/${created.id}`).set('Authorization', auth).expect(404);

      expect(takeTopics(e2e.events)).toEqual([]);
    });

    it('searches with RSQL and pages the results sorted by key', async () => {
      const auth = e2e.auth('owner');
      for (const key of ['search-c', 'search-a', 'search-b']) await create('owner', key);

      const page = await request(e2e.server)
        .get('/v1/maneuver-modifiers?q=key=re=search&size=2&page=1')
        .set('Authorization', auth)
        .expect(200);
      expect(page.body).toMatchObject({ pagination: { page: 1, size: 2, totalElements: 3 } });
      expect((page.body as { content: { key: string }[] }).content.map(item => item.key)).toEqual(['search-c']);
      await request(e2e.server).get('/v1/maneuver-modifiers?size=101').set('Authorization', auth).expect(400);

      const none = await request(e2e.server).get('/v1/maneuver-modifiers?q=key==missing').set('Authorization', auth).expect(200);
      expect(ids(none.body)).toEqual([]);
    });

    it('finds the modifiers that apply to a skill and to its category as a plain array', async () => {
      const admin = e2e.auth('admin');
      await request(e2e.server)
        .post('/v1/skill-categories')
        .set('Authorization', admin)
        .send(skillCategoryBody('e2e-mm-category'))
        .expect(201);
      await request(e2e.server)
        .post('/v1/skills')
        .set('Authorization', admin)
        .send(skillBody('e2e-mm-skill', 'e2e-mm-category'))
        .expect(201);
      await create('owner', 'applies-to-skill', { scope: { skillIds: ['e2e-mm-skill'] } });
      await create('owner', 'applies-to-category', { scope: { categoryIds: ['e2e-mm-category'] } });
      await create('owner', 'applies-elsewhere', { scope: { skillIds: ['e2e-other-skill'] } });
      await create('other', 'applies-to-skill-of-other', { scope: { skillIds: ['e2e-mm-skill'] } });

      const auth = e2e.auth('owner');
      const bySkill = await request(e2e.server).get('/v1/maneuver-modifiers?skillId=e2e-mm-skill').set('Authorization', auth).expect(200);
      expect(keys(bySkill.body)).toEqual(['applies-to-category', 'applies-to-skill']);

      const byCategory = await request(e2e.server)
        .get('/v1/maneuver-modifiers?categoryId=e2e-mm-category')
        .set('Authorization', auth)
        .expect(200);
      expect(keys(byCategory.body)).toEqual(['applies-to-category']);

      const ofAdmin = await request(e2e.server).get('/v1/maneuver-modifiers?skillId=e2e-mm-skill').set('Authorization', admin).expect(200);
      expect(keys(ofAdmin.body)).toEqual(['applies-to-category', 'applies-to-skill', 'applies-to-skill-of-other']);

      await request(e2e.server).get('/v1/maneuver-modifiers?skillId=missing-skill').set('Authorization', auth).expect(404);
    });
  });

  describe('validation', () => {
    it('rejects an empty body', async () => {
      const res = await request(e2e.server).post('/v1/maneuver-modifiers').set('Authorization', e2e.auth('owner')).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/maneuver-modifiers' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it('rejects an unknown type, an empty scope and a definition incomplete for its type', async () => {
      const auth = e2e.auth('owner');
      const post = (body: Record<string, unknown>) =>
        request(e2e.server).post('/v1/maneuver-modifiers').set('Authorization', auth).send(body);
      await post(maneuverModifierBody('e2e-bad', { type: 'slider' })).expect(400);
      const res = await post(maneuverModifierBody('e2e-bad', { scope: {} })).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'ValidationError' });
      await post(maneuverModifierBody('e2e-bad', { type: 'choice' })).expect(400);
      await post(maneuverModifierBody('e2e-bad', { type: 'number', perUnit: 1, min: 5, max: 1 })).expect(400);

      const modifier = await create('owner', 'e2e-valid');
      await request(e2e.server).patch(`/v1/maneuver-modifiers/${modifier.id}`).set('Authorization', auth).send({ key: '' }).expect(400);
    });

    it('rejects a key that already exists, on create and on update', async () => {
      const auth = e2e.auth('owner');
      await create('owner', 'e2e-taken');
      const res = await request(e2e.server)
        .post('/v1/maneuver-modifiers')
        .set('Authorization', e2e.auth('admin'))
        .send(maneuverModifierBody('e2e-taken'))
        .expect(409);
      expect(res.body).toMatchObject({ statusCode: 409, error: 'ConflictError' });

      const second = await create('owner', 'e2e-second');
      await request(e2e.server)
        .patch(`/v1/maneuver-modifiers/${second.id}`)
        .set('Authorization', auth)
        .send({ key: 'e2e-taken' })
        .expect(409);
      const unchanged = await request(e2e.server).get(`/v1/maneuver-modifiers/${second.id}`).set('Authorization', auth).expect(200);
      expect(unchanged.body).toMatchObject({ key: 'e2e-second' });
      // Keeping its own key is not a conflict.
      await request(e2e.server)
        .patch(`/v1/maneuver-modifiers/${second.id}`)
        .set('Authorization', auth)
        .send({ key: 'e2e-second', value: 20 })
        .expect(200);
    });
  });

  describe('permissions', () => {
    it('lets players and admins create maneuver modifiers, but not a user without a role', async () => {
      await create('owner', 'e2e-by-owner');
      await create('admin', 'e2e-by-admin');
      await request(e2e.server)
        .post('/v1/maneuver-modifiers')
        .set('Authorization', e2e.auth('noRole'))
        .send(maneuverModifierBody('e2e-by-guest'))
        .expect(403);
    });

    it('shows a private maneuver modifier only to its owner and admins, and lets only them change it', async () => {
      const modifier = await create('owner', 'e2e-private');
      const path = `/v1/maneuver-modifiers/${modifier.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('admin')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ value: 1 }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('admin')).send({ value: 1 }).expect(200);

      const ofOther = await request(e2e.server).get('/v1/maneuver-modifiers?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(ofOther.body)).not.toContain(modifier.id);
      const ofAdmin = await request(e2e.server).get('/v1/maneuver-modifiers?size=100').set('Authorization', e2e.auth('admin')).expect(200);
      expect(ids(ofAdmin.body)).toContain(modifier.id);

      await request(e2e.server).delete(path).set('Authorization', e2e.auth('admin')).expect(204);
    });

    it('shows a public maneuver modifier to everyone but lets only its owner and admins change it', async () => {
      const modifier = await create('owner', 'e2e-public', { accessType: 'public' });
      const path = `/v1/maneuver-modifiers/${modifier.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('noRole')).expect(200);
      const listed = await request(e2e.server).get('/v1/maneuver-modifiers?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(listed.body)).toContain(modifier.id);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ value: 1 }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('owner')).expect(204);
    });

    it('rejects a request without a token', async () => {
      await request(e2e.server).get('/v1/maneuver-modifiers').expect(401);
      await request(e2e.server).post('/v1/maneuver-modifiers').send(maneuverModifierBody('e2e-anonymous')).expect(401);
    });

    it('answers 404 for a maneuver modifier that does not exist', async () => {
      await request(e2e.server).get('/v1/maneuver-modifiers/missing').set('Authorization', e2e.auth('admin')).expect(404);
      await request(e2e.server)
        .patch('/v1/maneuver-modifiers/missing')
        .set('Authorization', e2e.auth('admin'))
        .send({ value: 1 })
        .expect(404);
      await request(e2e.server).delete('/v1/maneuver-modifiers/missing').set('Authorization', e2e.auth('admin')).expect(404);
    });
  });
});
