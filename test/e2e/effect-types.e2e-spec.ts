import request from 'supertest';
import { type E2eApp, ids, startApp, takeTopics, type UserName } from './support/app.js';
import { effectTypeBody } from './support/fixtures.js';

describe('Effect types (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const create = async (user: UserName, id: string, overrides: Record<string, unknown> = {}) => {
    const res = await request(e2e.server)
      .post('/v1/effect-types')
      .set('Authorization', e2e.auth(user))
      .send(effectTypeBody(id, overrides))
      .expect(201);
    return res.body as { id: string };
  };

  describe('CRUD', () => {
    it('creates, reads, lists, updates and deletes an effect type, without events', async () => {
      const auth = e2e.auth('owner');
      takeTopics(e2e.events);

      const created = await create('owner', 'e2e-bleeding');
      expect(created).toMatchObject({
        id: 'e2e-bleeding',
        isPersistent: true,
        isStackable: false,
        value: 'required',
        modifier: 'optional',
        rounds: 'forbidden',
        owner: 'e2e-owner',
        accessType: 'private',
        entitySource: 'user',
      });

      const found = await request(e2e.server).get('/v1/effect-types/e2e-bleeding').set('Authorization', auth).expect(200);
      expect(found.body).toMatchObject({ id: 'e2e-bleeding', value: 'required' });

      const listed = await request(e2e.server).get('/v1/effect-types?q=id==e2e-bleeding').set('Authorization', auth).expect(200);
      expect(ids(listed.body)).toEqual(['e2e-bleeding']);
      expect(listed.body).toMatchObject({ pagination: { page: 0, size: 10, totalElements: 1 } });

      const updated = await request(e2e.server)
        .patch('/v1/effect-types/e2e-bleeding')
        .set('Authorization', auth)
        .send({ isStackable: true, rounds: 'required' })
        .expect(200);
      expect(updated.body).toMatchObject({ id: 'e2e-bleeding', isStackable: true, rounds: 'required', value: 'required' });

      await request(e2e.server).delete('/v1/effect-types/e2e-bleeding').set('Authorization', auth).expect(204);
      await request(e2e.server).get('/v1/effect-types/e2e-bleeding').set('Authorization', auth).expect(404);
      await request(e2e.server).delete('/v1/effect-types/e2e-bleeding').set('Authorization', auth).expect(404);

      expect(takeTopics(e2e.events)).toEqual([]);
    });

    it('searches with RSQL and pages the results sorted by id', async () => {
      const auth = e2e.auth('owner');
      for (const id of ['search-c', 'search-a', 'search-b']) await create('owner', id);

      const page = await request(e2e.server).get('/v1/effect-types?q=id=re=search&size=2&page=1').set('Authorization', auth).expect(200);
      expect(page.body).toMatchObject({ pagination: { page: 1, size: 2, totalElements: 3 } });
      expect(ids(page.body)).toEqual(['search-c']);
      await request(e2e.server).get('/v1/effect-types?size=101').set('Authorization', auth).expect(400);

      const none = await request(e2e.server).get('/v1/effect-types?q=id==missing').set('Authorization', auth).expect(200);
      expect(ids(none.body)).toEqual([]);
    });
  });

  describe('validation', () => {
    it('rejects an empty body', async () => {
      const res = await request(e2e.server).post('/v1/effect-types').set('Authorization', e2e.auth('owner')).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/effect-types' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
    });

    it('rejects an unknown requirement and an unknown access type', async () => {
      const auth = e2e.auth('owner');
      await request(e2e.server)
        .post('/v1/effect-types')
        .set('Authorization', auth)
        .send(effectTypeBody('e2e-bad', { value: 'maybe' }))
        .expect(400);
      await request(e2e.server)
        .post('/v1/effect-types')
        .set('Authorization', auth)
        .send(effectTypeBody('e2e-bad', { accessType: 'shared' }))
        .expect(400);
      await create('owner', 'e2e-valid');
      await request(e2e.server).patch('/v1/effect-types/e2e-valid').set('Authorization', auth).send({ delay: 'sometimes' }).expect(400);
    });

    it('rejects an id that already exists', async () => {
      await create('owner', 'e2e-duplicated');
      const res = await request(e2e.server)
        .post('/v1/effect-types')
        .set('Authorization', e2e.auth('admin'))
        .send(effectTypeBody('e2e-duplicated'))
        .expect(409);
      expect(res.body).toMatchObject({ statusCode: 409, error: 'ConflictError' });
    });
  });

  describe('permissions', () => {
    it('lets players and admins create effect types, but not a user without a role', async () => {
      await create('owner', 'e2e-by-owner');
      await create('admin', 'e2e-by-admin');
      await request(e2e.server)
        .post('/v1/effect-types')
        .set('Authorization', e2e.auth('noRole'))
        .send(effectTypeBody('e2e-by-guest'))
        .expect(403);
    });

    it('shows a private effect type only to its owner and admins, and lets only them change it', async () => {
      await create('owner', 'e2e-private');
      const path = '/v1/effect-types/e2e-private';

      await request(e2e.server).get(path).set('Authorization', e2e.auth('owner')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('admin')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ isStackable: true }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('admin')).send({ isStackable: true }).expect(200);

      const ofOther = await request(e2e.server).get('/v1/effect-types?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(ofOther.body)).not.toContain('e2e-private');
      const ofAdmin = await request(e2e.server).get('/v1/effect-types?size=100').set('Authorization', e2e.auth('admin')).expect(200);
      expect(ids(ofAdmin.body)).toContain('e2e-private');

      await request(e2e.server).delete(path).set('Authorization', e2e.auth('admin')).expect(204);
    });

    it('shows a public effect type to everyone but lets only its owner and admins change it', async () => {
      await create('owner', 'e2e-public', { accessType: 'public' });
      const path = '/v1/effect-types/e2e-public';

      await request(e2e.server).get(path).set('Authorization', e2e.auth('other')).expect(200);
      await request(e2e.server).get(path).set('Authorization', e2e.auth('noRole')).expect(200);
      const listed = await request(e2e.server).get('/v1/effect-types?size=100').set('Authorization', e2e.auth('other')).expect(200);
      expect(ids(listed.body)).toContain('e2e-public');
      await request(e2e.server).patch(path).set('Authorization', e2e.auth('other')).send({ isStackable: true }).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('other')).expect(403);
      await request(e2e.server).delete(path).set('Authorization', e2e.auth('owner')).expect(204);
    });

    it('rejects a request without a token', async () => {
      await request(e2e.server).get('/v1/effect-types').expect(401);
      await request(e2e.server).post('/v1/effect-types').send(effectTypeBody('e2e-anonymous')).expect(401);
    });

    it('answers 404 for an effect type that does not exist', async () => {
      await request(e2e.server).get('/v1/effect-types/missing').set('Authorization', e2e.auth('admin')).expect(404);
      await request(e2e.server)
        .patch('/v1/effect-types/missing')
        .set('Authorization', e2e.auth('admin'))
        .send({ isStackable: true })
        .expect(404);
      await request(e2e.server).delete('/v1/effect-types/missing').set('Authorization', e2e.auth('admin')).expect(404);
    });
  });
});
