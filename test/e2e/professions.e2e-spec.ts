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

    it('stores user as the source of a profession created without one, by an admin too (spec 063)', async () => {
      expect(await create('admin')).toMatchObject({ entitySource: 'user', owner: 'e2e-admin' });
      expect(await create('admin', { entitySource: 'system' })).toMatchObject({ entitySource: 'system', owner: 'e2e-admin' });
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

    it('rejects an entity source other than system or user, on create and on update', async () => {
      const auth = e2e.auth('admin');
      await request(e2e.server)
        .post('/v1/professions')
        .set('Authorization', auth)
        .send(professionBody('wild-source', { entitySource: 'book' }))
        .expect(400);
      await request(e2e.server)
        .patch(`/v1/professions/${(await create('admin')).id}`)
        .set('Authorization', auth)
        .send({ entitySource: 'book' })
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

    it('validates the costs of each skill category, on create and on update', async () => {
      const auth = e2e.auth('owner');
      for (const skillCosts of [{ animal: 'cheap' }, { animal: [2, 'x'] }, { awareness: [1.5] }, { brawn: 3 }]) {
        await request(e2e.server)
          .post('/v1/professions')
          .set('Authorization', auth)
          .send(professionBody('invalid-costs', { skillCosts }))
          .expect(400);
      }

      const profession = await create('owner');
      const path = `/v1/professions/${profession.id}`;
      await request(e2e.server)
        .patch(path)
        .set('Authorization', auth)
        .send({ skillCosts: { animal: ['x'] } })
        .expect(400);
      const updated = await request(e2e.server)
        .patch(path)
        .set('Authorization', auth)
        .send({ skillCosts: { animal: [1, 2], lore: [3] } })
        .expect(200);
      expect(updated.body).toMatchObject({ skillCosts: { animal: [1, 2], lore: [3] } });
    });

    it('drops unknown fields of the body', async () => {
      const profession = await create('owner', { owner: 'someone-else', unknown: 'value' });
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
  describe('entity source (spec 063)', () => {
    const forbidden = { statusCode: 403, code: 'system-entity-admin-only', path: expect.stringMatching(/^\/v1\/professions/) as unknown };

    it('lets only an admin change or delete a system profession, even when another user owns it', async () => {
      // A system profession owned by a player: the owner keeps no rights over rulebook content.
      const profession = await create('admin', { entitySource: 'system', accessType: 'public' });
      await e2e.connection.collection('professions').updateOne({ _id: profession.id as never }, { $set: { owner: 'e2e-owner' } });
      const path = `/v1/professions/${profession.id}`;

      const patch = await request(e2e.server).patch(path).set('Authorization', e2e.auth('owner')).send({ description: 'Mine' }).expect(403);
      expect(patch.body).toMatchObject(forbidden);
      const del = await request(e2e.server).delete(path).set('Authorization', e2e.auth('owner')).expect(403);
      expect(del.body).toMatchObject(forbidden);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ description: 'Taken' }).expect(403);

      const byAdmin = await request(e2e.server)
        .patch(path)
        .set('Authorization', e2e.auth('admin'))
        .send({ description: 'Errata' })
        .expect(200);
      expect(byAdmin.body).toMatchObject({ description: 'Errata', entitySource: 'system', owner: 'e2e-owner' });
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('admin')).expect(204);
    });

    it('lets the owner and an admin change a user profession', async () => {
      const profession = await create('owner');
      const path = `/v1/professions/${profession.id}`;
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('owner')).send({ description: 'Mine' }).expect(200);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('admin')).send({ description: 'By admin' }).expect(200);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('owner')).expect(204);
    });

    it('forbids a player to create a system profession or to turn one into system', async () => {
      const res = await request(e2e.server)
        .post('/v1/professions')
        .set('Authorization', e2e.auth('owner'))
        .send(professionBody('player-system', { entitySource: 'system' }))
        .expect(403);
      expect(res.body).toMatchObject({ ...forbidden, error: 'ForbiddenError' });
      await request(e2e.server).get('/v1/professions/player-system').set('Authorization', e2e.auth('admin')).expect(404);

      const profession = await create('owner', { entitySource: 'user' });
      const path = `/v1/professions/${profession.id}`;
      const patch = await request(e2e.server)
        .patch(path)
        .set('Authorization', e2e.auth('owner'))
        .send({ entitySource: 'system' })
        .expect(403);
      expect(patch.body).toMatchObject(forbidden);
      const found = await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      expect(found.body).toMatchObject({ entitySource: 'user' });
    });

    it('lets an admin move a profession between system and user, keeping its owner', async () => {
      const profession = await create('owner');
      const path = `/v1/professions/${profession.id}`;
      const toSystem = await request(e2e.server)
        .patch(path)
        .set('Authorization', e2e.auth('admin'))
        .send({ entitySource: 'system' })
        .expect(200);
      expect(toSystem.body).toMatchObject({ entitySource: 'system', owner: 'e2e-owner' });
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('owner')).send({ description: 'Mine' }).expect(403);
      const toUser = await request(e2e.server)
        .patch(path)
        .set('Authorization', e2e.auth('admin'))
        .send({ entitySource: 'user' })
        .expect(200);
      expect(toUser.body).toMatchObject({ entitySource: 'user', owner: 'e2e-owner' });
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('owner')).send({ description: 'Mine' }).expect(200);
    });

    it('reads a document stored without the field as a user profession', async () => {
      await e2e.connection.collection('professions').insertOne({
        _id: 'legacy-profession' as never,
        archetype: 'non-spellcaster',
        availableRealmTypes: ['channeling'],
        fixedRealmTypes: [],
        skillCosts: { animal: [2, 4] },
        professionalSkills: [],
        owner: 'e2e-owner',
        accessType: 'private',
        createdAt: new Date(),
      });
      const path = '/v1/professions/legacy-profession';
      const found = await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      expect(found.body).toMatchObject({ id: 'legacy-profession', entitySource: 'user' });
      const listed = await request(e2e.server)
        .get('/v1/professions?q=id==legacy-profession')
        .set('Authorization', e2e.auth('owner'))
        .expect(200);
      expect(listed.body).toMatchObject({ content: [{ entitySource: 'user' }] });
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('owner')).send({ description: 'Still mine' }).expect(200);
    });
  });
});
