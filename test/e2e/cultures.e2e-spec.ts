import request from 'supertest';
import { type E2eApp, ids, startApp, takeTopics, type UserName } from './support/app.js';
import { cultureBody } from './support/fixtures.js';

type Culture = { id: string; name: string; owner: string; skillRanks: Record<string, unknown>[]; developmentCost: number };

describe('Cultures (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const create = async (user: UserName, overrides: Record<string, unknown> = {}) => {
    const res = await request(e2e.server)
      .post('/v1/cultures')
      .set('Authorization', e2e.auth(user))
      .send(cultureBody(overrides))
      .expect(201);
    return res.body as Culture;
  };

  describe('CRUD', () => {
    it('creates, reads, lists, updates and deletes a culture, publishing its events', async () => {
      const auth = e2e.auth('owner');
      takeTopics(e2e.events);

      const created = await create('owner', { name: 'Nomad', languages: ['westron'] });
      expect(created).toMatchObject({
        name: 'Nomad',
        owner: 'e2e-owner',
        accessType: 'private',
        languages: ['westron'],
        skillRanks: [{ type: 'skill', skillId: 'e2e-skill', ranks: 2 }],
      });
      expect(created.developmentCost).toBeTypeOf('number');

      const found = await request(e2e.server).get(`/v1/cultures/${created.id}`).set('Authorization', auth).expect(200);
      expect(found.body).toMatchObject({ id: created.id, name: 'Nomad' });

      const listed = await request(e2e.server).get('/v1/cultures?q=name==Nomad').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toEqual([created.id]);
      expect(listed.body).toMatchObject({ pagination: { page: 0, size: 10, totalElements: 1 } });

      const updated = await request(e2e.server)
        .patch(`/v1/cultures/${created.id}`)
        .set('Authorization', auth)
        .send({ name: 'Sea nomad', suggestedCrafts: 'Sailing', skillRanks: [] })
        .expect(200);
      expect(updated.body).toMatchObject({ name: 'Sea nomad', suggestedCrafts: 'Sailing', skillRanks: [], languages: ['westron'] });

      await request(e2e.server).delete(`/v1/cultures/${created.id}`).set('Authorization', auth).expect(204);
      await request(e2e.server).get(`/v1/cultures/${created.id}`).set('Authorization', auth).expect(404);
      await request(e2e.server).delete(`/v1/cultures/${created.id}`).set('Authorization', auth).expect(404);

      expect(takeTopics(e2e.events)).toEqual([
        'internal.rmu-core.culture.created.v1',
        'internal.rmu-core.culture.updated.v1',
        'internal.rmu-core.culture.deleted.v1',
      ]);
    });

    it('searches with RSQL and pages the results', async () => {
      const auth = e2e.auth('owner');
      for (const name of ['Search A', 'Search B', 'Search C']) await create('owner', { name });

      const page = await request(e2e.server).get('/v1/cultures?q=name=re=search&size=2&page=1').set('Authorization', auth).expect(200);
      expect(page.body).toMatchObject({ pagination: { page: 1, size: 2, totalElements: 3 } });
      expect(ids(page.body)).toHaveLength(1);

      const none = await request(e2e.server).get('/v1/cultures?q=name==Missing').set('Authorization', auth).expect(200);
      expect(ids(none.body)).toEqual([]);
    });

    it('appends and deletes skill rank entries by position', async () => {
      const auth = e2e.auth('owner');
      const culture = await create('owner');
      const path = `/v1/cultures/${culture.id}/skill-ranks`;
      takeTopics(e2e.events);

      const added = await request(e2e.server)
        .post(path)
        .set('Authorization', auth)
        .send({ type: 'category-pool', categoryIds: ['crafting', 'vocation'], ranks: 3, maxRanksPerSkill: 2 })
        .expect(200);
      expect((added.body as Culture).skillRanks).toEqual([
        { type: 'skill', skillId: 'e2e-skill', ranks: 2 },
        { type: 'category-pool', categoryIds: ['crafting', 'vocation'], ranks: 3, maxRanksPerSkill: 2 },
      ]);

      const deleted = await request(e2e.server).delete(`${path}/0`).set('Authorization', auth).expect(200);
      expect((deleted.body as Culture).skillRanks).toEqual([expect.objectContaining({ type: 'category-pool' })]);
      await request(e2e.server).delete(`${path}/1`).set('Authorization', auth).expect(404);
      await request(e2e.server).delete(`${path}/first`).set('Authorization', auth).expect(400);

      expect(takeTopics(e2e.events)).toEqual(['internal.rmu-core.culture.updated.v1', 'internal.rmu-core.culture.updated.v1']);
    });
  });

  describe('validation', () => {
    it('rejects an empty or null name on update', async () => {
      const auth = e2e.auth('owner');
      const path = `/v1/cultures/${(await create('owner')).id}`;
      for (const name of ['', null]) {
        const res = await request(e2e.server).patch(path).set('Authorization', auth).send({ name }).expect(400);
        expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException' });
      }
    });

    it('rejects an access type other than public or private, on create and on update', async () => {
      const auth = e2e.auth('owner');
      const created = await request(e2e.server)
        .post('/v1/cultures')
        .set('Authorization', auth)
        .send(cultureBody({ accessType: 'wild' }))
        .expect(400);
      expect(created.body).toMatchObject({ statusCode: 400, error: 'BadRequestException' });
      await request(e2e.server)
        .patch(`/v1/cultures/${(await create('owner')).id}`)
        .set('Authorization', auth)
        .send({ accessType: 'wild' })
        .expect(400);
    });

    it('rejects an empty body', async () => {
      const res = await request(e2e.server).post('/v1/cultures').set('Authorization', e2e.auth('owner')).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/cultures' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it('rejects invalid skill rank entries', async () => {
      const auth = e2e.auth('owner');
      const post = (skillRanks: unknown[]) =>
        request(e2e.server).post('/v1/cultures').set('Authorization', auth).send(cultureBody({ skillRanks }));

      await post([{ type: 'unknown', skillId: 'x', ranks: 1 }]).expect(400);
      await post([{ type: 'skill', skillId: 'x', ranks: 0 }]).expect(400);
      // The fields each type needs are checked by the domain.
      const domain = await post([{ type: 'skill', ranks: 1 }]).expect(400);
      expect(domain.body).toMatchObject({ error: 'ValidationError' });
      await post([{ type: 'region', skillId: 'x', ranks: 1 }]).expect(400);

      const culture = await create('owner');
      await request(e2e.server).patch(`/v1/cultures/${culture.id}`).set('Authorization', auth).send({ skillRanks: 'none' }).expect(400);
      await request(e2e.server)
        .post(`/v1/cultures/${culture.id}/skill-ranks`)
        .set('Authorization', auth)
        .send({ type: 'skill-choice', skillIds: [], ranks: 1 })
        .expect(400);
    });

    it('drops unknown fields of the body', async () => {
      const culture = await create('owner', { owner: 'someone-else', unknown: 'value' });
      expect(culture).toMatchObject({ owner: 'e2e-owner' });
      expect(culture).not.toHaveProperty('unknown');
    });
  });

  describe('permissions', () => {
    it('lets players and admins create cultures, but not a user without a role', async () => {
      await create('owner');
      await create('admin');
      await request(e2e.server).post('/v1/cultures').set('Authorization', e2e.auth('noRole')).send(cultureBody()).expect(403);
    });

    it('shows a private culture only to its owner and admins, and lets only them change it', async () => {
      const culture = await create('owner', { name: 'Private culture' });
      const path = `/v1/cultures/${culture.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('admin')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ name: 'Taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server)
        .post(`${path}/skill-ranks`)
        .set('Authorization', e2e.auth('other'))
        .send({ type: 'languages', ranks: 1 })
        .expect(403);
      await request(e2e.server).delete(`${path}/skill-ranks/0`).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('admin')).send({ name: 'By admin' }).expect(200);

      const ofOther = await request(e2e.server).get('/v1/cultures?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(ofOther.body)).not.toContain(culture.id);
      const ofAdmin = await request(e2e.server).get('/v1/cultures?size=100').set('Authorization', e2e.auth('admin')).expect(200);
      expect(ids(ofAdmin.body)).toContain(culture.id);

      await request(e2e.server).delete(path).set('Authorization', e2e.auth('admin')).expect(204);
    });

    it('shows a public culture to everyone but lets only its owner and admins change it', async () => {
      const culture = await create('owner', { name: 'Public culture', accessType: 'public' });
      const path = `/v1/cultures/${culture.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('noRole')).expect(200);
      const listed = await request(e2e.server).get('/v1/cultures?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(listed.body)).toContain(culture.id);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ name: 'Taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('owner')).expect(204);
    });

    it('answers 404 for a culture that does not exist', async () => {
      const auth = e2e.auth('admin');
      await request(e2e.server).get('/v1/cultures/missing').set('Authorization', auth).expect(404);
      await request(e2e.server).patch('/v1/cultures/missing').set('Authorization', auth).send({ name: 'X' }).expect(404);
      await request(e2e.server)
        .post('/v1/cultures/missing/skill-ranks')
        .set('Authorization', auth)
        .send({ type: 'languages', ranks: 1 })
        .expect(404);
      await request(e2e.server).delete('/v1/cultures/missing/skill-ranks/0').set('Authorization', auth).expect(404);
    });
  });
});
