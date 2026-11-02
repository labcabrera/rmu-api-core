import request from 'supertest';
import { type E2eApp, ids, startApp, takeTopics, type UserName } from './support/app.js';
import { skillCategoryBody } from './support/fixtures.js';

type SkillCategory = { id: string; bonus: string[]; realmBonus: number | null; maneuver?: Record<string, unknown> };

describe('Skill categories (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const create = async (user: UserName, id: string, overrides: Record<string, unknown> = {}) => {
    const res = await request(e2e.server)
      .post('/v1/skill-categories')
      .set('Authorization', e2e.auth(user))
      .send(skillCategoryBody(id, overrides))
      .expect(201);
    return res.body as SkillCategory;
  };

  describe('CRUD', () => {
    it('creates, reads and lists a skill category, publishing no events', async () => {
      const auth = e2e.auth('admin');
      takeTopics(e2e.events);

      const created = await create('admin', 'crafting', { realmBonus: 1, maneuver: { defaultType: 'percent', movement: true } });
      expect(created).toEqual({ id: 'crafting', bonus: ['ag', 'qu'], realmBonus: 1, maneuver: { defaultType: 'percent', movement: true } });

      const found = await request(e2e.server).get('/v1/skill-categories/crafting').set('Authorization', auth).expect(200);
      expect(found.body).toEqual(created);

      const listed = await request(e2e.server).get('/v1/skill-categories?q=id==crafting').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toEqual(['crafting']);
      expect(listed.body).toMatchObject({ pagination: { page: 0, size: 10, totalElements: 1 } });

      expect(takeTopics(e2e.events)).toEqual([]);
    });

    it('searches with RSQL and pages the results', async () => {
      const auth = e2e.auth('admin');
      for (const id of ['search-a', 'search-b', 'search-c']) await create('admin', id);

      const page = await request(e2e.server)
        .get('/v1/skill-categories?q=id=re=search&size=2&page=1')
        .set('Authorization', auth)
        .expect(200);
      expect(page.body).toMatchObject({ pagination: { page: 1, size: 2, totalElements: 3 } });
      expect(ids(page.body)).toEqual(['search-c']);

      const none = await request(e2e.server).get('/v1/skill-categories?q=id==missing').set('Authorization', auth).expect(200);
      expect(ids(none.body)).toEqual([]);
    });

    it('is a catalog: pages of up to 1000 elements', async () => {
      const auth = e2e.auth('owner');
      await request(e2e.server).get('/v1/skill-categories?size=1000').set('Authorization', auth).expect(200);
      await request(e2e.server).get('/v1/skill-categories?size=1001').set('Authorization', auth).expect(400);
    });
  });

  describe('validation', () => {
    it('rejects an empty body', async () => {
      const res = await request(e2e.server).post('/v1/skill-categories').set('Authorization', e2e.auth('admin')).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/skill-categories' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it('rejects an invalid maneuver profile and a repeated id', async () => {
      const auth = e2e.auth('admin');
      const post = (body: Record<string, unknown>) =>
        request(e2e.server).post('/v1/skill-categories').set('Authorization', auth).send(body);

      await post(skillCategoryBody('invalid', { maneuver: { defaultType: 'wild' } })).expect(400);
      await post(skillCategoryBody('invalid', { bonus: 'ag' })).expect(400);
      const domain = await post(skillCategoryBody('invalid', { maneuver: { actionPoints: { min: 3, max: 1 } } })).expect(400);
      expect(domain.body).toMatchObject({ error: 'ValidationError' });

      await create('admin', 'repeated');
      const conflict = await post(skillCategoryBody('repeated')).expect(409);
      expect(conflict.body).toMatchObject({ error: 'ConflictError' });
    });
  });

  describe('permissions', () => {
    it('lets any authenticated user read the categories', async () => {
      await create('admin', 'readable');
      for (const user of ['owner', 'other', 'noRole'] as const) {
        await request(e2e.server).get('/v1/skill-categories/readable').set('Authorization', e2e.auth(user)).expect(200);
        const listed = await request(e2e.server).get('/v1/skill-categories?size=1000').set('Authorization', e2e.auth(user)).expect(200);
        expect(ids(listed.body)).toContain('readable');
      }
      await request(e2e.server).get('/v1/skill-categories/readable').expect(401);
    });

    it('lets only an admin create a category', async () => {
      for (const user of ['owner', 'noRole'] as const) {
        await request(e2e.server)
          .post('/v1/skill-categories')
          .set('Authorization', e2e.auth(user))
          .send(skillCategoryBody(`by-${user}`))
          .expect(403);
      }
      await create('admin', 'by-admin');
    });

    it('answers 404 for a skill category that does not exist', async () => {
      await request(e2e.server).get('/v1/skill-categories/missing').set('Authorization', e2e.auth('admin')).expect(404);
    });
  });
});
