import request from 'supertest';
import { type E2eApp, ids, startApp, takeTopics, type UserName } from './support/app.js';
import { professionBody } from './support/fixtures.js';

type Profession = { id: string; owner: string; entitySource: string; accessType: string };

describe('Professions (e2e)', () => {
  let e2e: E2eApp;
  let sequence = 0;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const create = async (user: UserName, overrides: Record<string, unknown> = {}, id = `e2e-profession-${++sequence}`) => {
    const res = await request(e2e.server)
      .post('/v1/professions')
      .set('Authorization', e2e.auth(user))
      .send(professionBody(id, overrides))
      .expect(201);
    return res.body as Profession;
  };

  describe('CRUD', () => {
    it('creates, reads, lists, updates and deletes a profession, publishing its events', async () => {
      const auth = e2e.auth('owner');
      takeTopics(e2e.events);

      const created = await create('owner', { description: 'Fights' }, 'fighter');
      expect(created).toMatchObject({
        id: 'fighter',
        archetype: 'non-spellcaster',
        owner: 'e2e-owner',
        accessType: 'private',
        entitySource: 'user',
        skillCosts: { animal: [2, 4], awareness: [1, 3] },
        professionalSkills: ['e2e-skill'],
      });

      const found = await request(e2e.server).get('/v1/professions/fighter').set('Authorization', auth).expect(200);
      expect(found.body).toMatchObject({ id: 'fighter', description: 'Fights' });

      const listed = await request(e2e.server).get('/v1/professions?q=id==fighter').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toEqual(['fighter']);
      expect(listed.body).toMatchObject({ pagination: { page: 0, size: 10, totalElements: 1 } });

      const updated = await request(e2e.server)
        .patch('/v1/professions/fighter')
        .set('Authorization', auth)
        .send({ archetype: 'semi-spellcaster', professionalSkills: ['riding'] })
        .expect(200);
      expect(updated.body).toMatchObject({ archetype: 'semi-spellcaster', professionalSkills: ['riding'], description: 'Fights' });

      await request(e2e.server).delete('/v1/professions/fighter').set('Authorization', auth).expect(204);
      await request(e2e.server).get('/v1/professions/fighter').set('Authorization', auth).expect(404);
      await request(e2e.server).delete('/v1/professions/fighter').set('Authorization', auth).expect(404);

      expect(takeTopics(e2e.events)).toEqual([
        'internal.rmu-core.profession.created.v1',
        'internal.rmu-core.profession.updated.v1',
        'internal.rmu-core.profession.deleted.v1',
      ]);
    });

    it('searches with RSQL and pages the results', async () => {
      const auth = e2e.auth('owner');
      for (const id of ['search-a', 'search-b', 'search-c']) await create('owner', { archetype: 'pure-spellcaster' }, id);

      const page = await request(e2e.server)
        .get('/v1/professions?q=archetype==pure-spellcaster&size=2&page=1')
        .set('Authorization', auth)
        .expect(200);
      expect(page.body).toMatchObject({ pagination: { page: 1, size: 2, totalElements: 3 } });
      expect(ids(page.body)).toEqual(['search-c']);

      const none = await request(e2e.server).get('/v1/professions?q=id==missing').set('Authorization', auth).expect(200);
      expect(ids(none.body)).toEqual([]);
    });

    it('marks the professions created by an admin as system ones', async () => {
      const profession = await create('admin');
      expect(profession).toMatchObject({ entitySource: 'system', owner: 'e2e-admin' });
    });
  });

  describe('validation', () => {
    it('rejects an access type other than public or private, on create and on update', async () => {
      const auth = e2e.auth('owner');
      const created = await request(e2e.server)
        .post('/v1/professions')
        .set('Authorization', auth)
        .send(professionBody('wild-profession', { accessType: 'wild' }))
        .expect(400);
      expect(created.body).toMatchObject({ statusCode: 400, error: 'BadRequestException' });
      await request(e2e.server)
        .patch(`/v1/professions/${(await create('owner')).id}`)
        .set('Authorization', auth)
        .send({ accessType: 'wild' })
        .expect(400);
    });

    it('rejects an empty body', async () => {
      const res = await request(e2e.server).post('/v1/professions').set('Authorization', e2e.auth('owner')).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/professions' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it('rejects invalid fields and a repeated id', async () => {
      const auth = e2e.auth('owner');
      await request(e2e.server)
        .post('/v1/professions')
        .set('Authorization', auth)
        .send(professionBody('invalid', { skillCosts: 'cheap' }))
        .expect(400);
      await request(e2e.server)
        .post('/v1/professions')
        .set('Authorization', auth)
        .send(professionBody('invalid', { availableRealmTypes: 'channeling' }))
        .expect(400);

      const profession = await create('owner');
      const conflict = await request(e2e.server)
        .post('/v1/professions')
        .set('Authorization', auth)
        .send(professionBody(profession.id))
        .expect(409);
      expect(conflict.body).toMatchObject({ error: 'ConflictError' });
      await request(e2e.server)
        .patch(`/v1/professions/${profession.id}`)
        .set('Authorization', auth)
        .send({ fixedRealmTypes: 'x' })
        .expect(400);
    });

    it('drops unknown fields of the body', async () => {
      const profession = await create('owner', { owner: 'someone-else', entitySource: 'system', unknown: 'value' });
      expect(profession).toMatchObject({ owner: 'e2e-owner', entitySource: 'user' });
      expect(profession).not.toHaveProperty('unknown');
    });
  });

  describe('permissions', () => {
    it('lets players and admins create professions, but not a user without a role', async () => {
      await create('owner');
      await create('admin');
      await request(e2e.server)
        .post('/v1/professions')
        .set('Authorization', e2e.auth('noRole'))
        .send(professionBody('no-role'))
        .expect(403);
    });

    it('shows a private profession only to its owner and admins, and lets only them change it', async () => {
      const profession = await create('owner');
      const path = `/v1/professions/${profession.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('admin')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ description: 'Taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('admin')).send({ description: 'By admin' }).expect(200);

      const ofOther = await request(e2e.server).get('/v1/professions?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(ofOther.body)).not.toContain(profession.id);
      const ofAdmin = await request(e2e.server).get('/v1/professions?size=100').set('Authorization', e2e.auth('admin')).expect(200);
      expect(ids(ofAdmin.body)).toContain(profession.id);

      await request(e2e.server).delete(path).set('Authorization', e2e.auth('admin')).expect(204);
    });

    it('shows a public profession to everyone but lets only its owner and admins change it', async () => {
      const profession = await create('owner', { accessType: 'public' });
      const path = `/v1/professions/${profession.id}`;

      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('noRole')).expect(200);
      const listed = await request(e2e.server).get('/v1/professions?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(listed.body)).toContain(profession.id);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ description: 'Taken' }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('owner')).expect(204);
    });

    it('answers 404 for a profession that does not exist', async () => {
      await request(e2e.server).get('/v1/professions/missing').set('Authorization', e2e.auth('admin')).expect(404);
      await request(e2e.server)
        .patch('/v1/professions/missing')
        .set('Authorization', e2e.auth('admin'))
        .send({ description: 'X' })
        .expect(404);
    });
  });
});
