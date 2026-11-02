import request from 'supertest';
import { type E2eApp, ids, startApp, takeTopics, type UserName } from './support/app.js';
import { skillBody, skillCategoryBody } from './support/fixtures.js';

type Skill = { id: string; categoryId: string; accessType: string; maneuver: Record<string, unknown>; maneuverOverrides?: unknown };

const CATEGORY = 'e2e-category';
const OTHER_CATEGORY = 'e2e-other-category';

describe('Skills (e2e)', () => {
  let e2e: E2eApp;
  let sequence = 0;

  beforeAll(async () => {
    e2e = await startApp();
    for (const [id, maneuver] of [
      [CATEGORY, { defaultType: 'percent', resultTable: 'perception', movement: true }],
      [OTHER_CATEGORY, undefined],
    ] as const) {
      await request(e2e.server)
        .post('/v1/skill-categories')
        .set('Authorization', e2e.auth('admin'))
        .send(skillCategoryBody(id, { maneuver }))
        .expect(201);
    }
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const create = async (user: UserName, overrides: Record<string, unknown> = {}, id = `e2e-skill-${++sequence}`) => {
    const res = await request(e2e.server)
      .post('/v1/skills')
      .set('Authorization', e2e.auth(user))
      .send(skillBody(id, CATEGORY, overrides))
      .expect(201);
    return res.body as Skill;
  };

  describe('CRUD', () => {
    it('creates, reads, lists, updates and deletes a skill, publishing no events', async () => {
      const auth = e2e.auth('owner');
      takeTopics(e2e.events);

      const created = await create('owner', { specialization: 'tracking' }, 'perception');
      expect(created).toMatchObject({ id: 'perception', categoryId: CATEGORY, bonus: ['ag', 'qu'], specialization: 'tracking' });

      const found = await request(e2e.server).get('/v1/skills/perception').set('Authorization', auth).expect(200);
      expect(found.body).toMatchObject({ id: 'perception', accessType: 'private' });

      const listed = await request(e2e.server).get('/v1/skills?q=id==perception').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toEqual(['perception']);
      expect(listed.body).toMatchObject({ pagination: { page: 0, size: 10, totalElements: 1 } });

      const updated = await request(e2e.server)
        .patch('/v1/skills/perception')
        .set('Authorization', auth)
        .send({ categoryId: OTHER_CATEGORY, bonus: ['in'] })
        .expect(200);
      expect(updated.body).toMatchObject({ categoryId: OTHER_CATEGORY, bonus: ['in'], specialization: 'tracking' });

      await request(e2e.server).delete('/v1/skills/perception').set('Authorization', auth).expect(204);
      await request(e2e.server).get('/v1/skills/perception').set('Authorization', auth).expect(404);
      await request(e2e.server).delete('/v1/skills/perception').set('Authorization', auth).expect(404);

      expect(takeTopics(e2e.events)).toEqual([]);
    });

    it('searches with RSQL and pages the results', async () => {
      const auth = e2e.auth('owner');
      for (const id of ['search-a', 'search-b', 'search-c']) await create('owner', {}, id);

      const page = await request(e2e.server).get('/v1/skills?q=id=re=search&size=2&page=1').set('Authorization', auth).expect(200);
      expect(page.body).toMatchObject({ pagination: { page: 1, size: 2, totalElements: 3 } });
      expect(ids(page.body)).toEqual(['search-c']);

      const none = await request(e2e.server).get('/v1/skills?q=id==missing').set('Authorization', auth).expect(200);
      expect(ids(none.body)).toEqual([]);
    });

    it('is a catalog: pages of up to 1000 elements', async () => {
      const auth = e2e.auth('owner');
      await request(e2e.server).get('/v1/skills?size=1000').set('Authorization', auth).expect(200);
      await request(e2e.server).get('/v1/skills?size=1001').set('Authorization', auth).expect(400);
    });

    it('resolves the maneuver profile from its category and its own overrides', async () => {
      const auth = e2e.auth('owner');
      const plain = await create('owner');
      expect(plain.maneuver).toEqual({
        defaultType: 'percent',
        resultTable: 'perception',
        resultKind: 'standard',
        movement: true,
        light: 'none',
      });
      expect(plain).not.toHaveProperty('maneuverOverrides');

      const skill = await create('owner', { maneuver: { movement: false, light: 'required' } });
      expect(skill).toMatchObject({
        maneuver: { defaultType: 'percent', resultTable: 'perception', movement: false, light: 'required' },
        maneuverOverrides: { movement: false, light: 'required' },
      });

      const cleared = await request(e2e.server)
        .patch(`/v1/skills/${skill.id}`)
        .set('Authorization', auth)
        .send({ maneuver: null })
        .expect(200);
      expect((cleared.body as Skill).maneuver).toEqual(plain.maneuver);
      expect(cleared.body).not.toHaveProperty('maneuverOverrides');

      const priced = await create('owner', { maneuver: { resultKind: 'price' } });
      expect(priced).toMatchObject({
        maneuver: { defaultType: 'percent', resultKind: 'price' },
        maneuverOverrides: { resultKind: 'price' },
      });
    });
  });

  describe('validation', () => {
    it('rejects an access type other than public or private, on create and on update', async () => {
      const auth = e2e.auth('owner');
      const created = await request(e2e.server)
        .post('/v1/skills')
        .set('Authorization', auth)
        .send(skillBody('wild-skill', CATEGORY, { accessType: 'wild' }))
        .expect(400);
      expect(created.body).toMatchObject({ statusCode: 400, error: 'BadRequestException' });
      await request(e2e.server)
        .patch(`/v1/skills/${(await create('owner')).id}`)
        .set('Authorization', auth)
        .send({ accessType: 'wild' })
        .expect(400);
    });

    it('rejects an empty body', async () => {
      const res = await request(e2e.server).post('/v1/skills').set('Authorization', e2e.auth('owner')).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/skills' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it('rejects a missing category, an invalid maneuver profile and a repeated id', async () => {
      const auth = e2e.auth('owner');
      const post = (body: Record<string, unknown>) => request(e2e.server).post('/v1/skills').set('Authorization', auth).send(body);

      const missing = await post(skillBody('invalid', 'missing')).expect(400);
      expect(missing.body).toMatchObject({ error: 'ValidationError' });
      await post(skillBody('invalid', CATEGORY, { maneuver: { light: 'bright' } })).expect(400);
      await post(skillBody('invalid', CATEGORY, { maneuver: { resultKind: 'haggle' } })).expect(400);
      await post(skillBody('invalid', CATEGORY, { maneuver: { actionPoints: { min: 3, max: 1 } } })).expect(400);

      const skill = await create('owner');
      await post(skillBody(skill.id, CATEGORY)).expect(409);
      await request(e2e.server).patch(`/v1/skills/${skill.id}`).set('Authorization', auth).send({ categoryId: 'missing' }).expect(400);
      await request(e2e.server).patch(`/v1/skills/${skill.id}`).set('Authorization', auth).send({ bonus: 'ag' }).expect(400);
    });

    it('drops unknown fields of the body', async () => {
      const skill = await create('owner', { unknown: 'value' });
      expect(skill).not.toHaveProperty('unknown');
    });
  });

  describe('permissions', () => {
    it('lets players and admins create skills, but not a user without a role', async () => {
      await create('owner');
      await create('admin');
      await request(e2e.server)
        .post('/v1/skills')
        .set('Authorization', e2e.auth('noRole'))
        .send(skillBody('no-role', CATEGORY))
        .expect(403);
    });

    it('shows a private skill only to its owner and admins, and lets only them change it', async () => {
      const skill = await create('owner');
      const path = `/v1/skills/${skill.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('admin')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server)
        .patch(path)
        .set('Authorization', e2e.auth('other'))
        .send({ bonus: ['in'] })
        .expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server)
        .patch(path)
        .set('Authorization', e2e.auth('admin'))
        .send({ bonus: ['in'] })
        .expect(200);

      const ofOther = await request(e2e.server).get('/v1/skills?size=1000').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(ofOther.body)).not.toContain(skill.id);
      const ofAdmin = await request(e2e.server).get('/v1/skills?size=1000').set('Authorization', e2e.auth('admin')).expect(200);
      expect(ids(ofAdmin.body)).toContain(skill.id);

      await request(e2e.server).delete(path).set('Authorization', e2e.auth('admin')).expect(204);
    });

    it('shows a public skill to everyone but lets only its owner and admins change it', async () => {
      const skill = await create('owner', { accessType: 'public' });
      const path = `/v1/skills/${skill.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('noRole')).expect(200);
      const listed = await request(e2e.server).get('/v1/skills?size=1000').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(listed.body)).toContain(skill.id);
      await request(e2e.server)
        .patch(path)
        .set('Authorization', e2e.auth('other'))
        .send({ bonus: ['in'] })
        .expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('owner')).expect(204);
    });

    it('answers 404 for a skill that does not exist', async () => {
      await request(e2e.server).get('/v1/skills/missing').set('Authorization', e2e.auth('admin')).expect(404);
      await request(e2e.server)
        .patch('/v1/skills/missing')
        .set('Authorization', e2e.auth('admin'))
        .send({ bonus: ['in'] })
        .expect(404);
    });
  });
});
