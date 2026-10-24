import request from 'supertest';
import { type E2eApp, startApp } from './support/app.js';
import { realmBody, traitBody } from './support/fixtures.js';

// Optimistic concurrency and error codes (spec 018): every stored entity has a version, a PATCH that sends a stale
// one is a 409 `version-conflict`, and documents stored before versions existed count as version 0.
describe('Concurrency and error codes (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  const createRealm = async () => {
    const res = await request(e2e.server).post('/v1/realms').set('Authorization', e2e.auth('owner')).send(realmBody()).expect(201);
    return res.body as { id: string; version: number };
  };

  it('starts at version 0 and counts every update', async () => {
    const auth = e2e.auth('owner');
    const realm = await createRealm();
    expect(realm.version).toBe(0);

    const first = await request(e2e.server).patch(`/v1/realms/${realm.id}`).set('Authorization', auth).send({ name: 'One' }).expect(200);
    expect(first.body).toMatchObject({ version: 1 });
    const found = await request(e2e.server).get(`/v1/realms/${realm.id}`).set('Authorization', auth).expect(200);
    expect(found.body).toMatchObject({ name: 'One', version: 1 });
  });

  it('rejects a PATCH made on a stale version and keeps the newer change', async () => {
    const auth = e2e.auth('owner');
    const realm = await createRealm();
    const path = `/v1/realms/${realm.id}`;

    await request(e2e.server).patch(path).set('Authorization', auth).send({ name: 'First tab', version: 0 }).expect(200);
    const stale = await request(e2e.server).patch(path).set('Authorization', auth).send({ name: 'Second tab', version: 0 }).expect(409);
    expect(stale.body).toMatchObject({ statusCode: 409, error: 'ConflictError', code: 'version-conflict' });

    const found = await request(e2e.server).get(path).set('Authorization', auth).expect(200);
    expect(found.body).toMatchObject({ name: 'First tab', version: 1 });
  });

  it('accepts a PATCH without a version, as the image-only updates do', async () => {
    const auth = e2e.auth('owner');
    const realm = await createRealm();
    await request(e2e.server).patch(`/v1/realms/${realm.id}`).set('Authorization', auth).send({ name: 'Moved on' }).expect(200);

    const res = await request(e2e.server)
      .patch(`/v1/realms/${realm.id}`)
      .set('Authorization', auth)
      .send({ imageUrl: 'https://example.test/realm.png' })
      .expect(200);
    expect(res.body).toMatchObject({ imageUrl: 'https://example.test/realm.png', version: 2 });
  });

  it('rejects an invalid version', async () => {
    const realm = await createRealm();
    await request(e2e.server).patch(`/v1/realms/${realm.id}`).set('Authorization', e2e.auth('owner')).send({ version: -1 }).expect(400);
    await request(e2e.server).patch(`/v1/realms/${realm.id}`).set('Authorization', e2e.auth('owner')).send({ version: 1.5 }).expect(400);
  });

  it('reads a document stored without a version as version 0 and versions it on the first update', async () => {
    const auth = e2e.auth('owner');
    await e2e.connection.collection('realms').insertOne({
      _id: 'legacy-realm' as never,
      name: 'Legacy realm',
      magicPresence: 'none',
      owner: 'e2e-owner',
      accessType: 'private',
      createdAt: new Date('2025-01-01T00:00:00Z'),
    });

    const found = await request(e2e.server).get('/v1/realms/legacy-realm').set('Authorization', auth).expect(200);
    expect(found.body).toMatchObject({ name: 'Legacy realm', version: 0 });
    const updated = await request(e2e.server)
      .patch('/v1/realms/legacy-realm')
      .set('Authorization', auth)
      .send({ name: 'Versioned realm', version: 0 })
      .expect(200);
    expect(updated.body).toMatchObject({ version: 1 });
    const stored = await e2e.connection.collection('realms').findOne({ _id: 'legacy-realm' as never });
    expect(stored).toMatchObject({ version: 1 });
  });

  it('answers each error with its stable code', async () => {
    const auth = e2e.auth('owner');
    const missing = await request(e2e.server).get('/v1/realms/missing').set('Authorization', auth).expect(404);
    expect(missing.body).toMatchObject({ code: 'not-found' });

    const invalid = await request(e2e.server).post('/v1/realms').set('Authorization', auth).send({}).expect(400);
    expect(invalid.body).toMatchObject({ code: 'bad-request' });

    const realm = await createRealm();
    const forbidden = await request(e2e.server).get(`/v1/realms/${realm.id}`).set('Authorization', e2e.auth('other')).expect(403);
    expect(forbidden.body).toMatchObject({ code: 'forbidden' });

    const search = await request(e2e.server).get('/v1/realms?q=name==').set('Authorization', auth).expect(400);
    expect(search.body).toMatchObject({ code: 'invalid-search' });

    const unauthorized = await request(e2e.server).get('/v1/realms').expect(401);
    expect(unauthorized.body).toMatchObject({ code: 'unauthorized' });

    const trait = await request(e2e.server)
      .post('/v1/traits')
      .set('Authorization', auth)
      .send(traitBody({ name: '!!!' }))
      .expect(400);
    expect(trait.body).toMatchObject({ code: 'invalid-trait-name' });
  });

  it('reports a duplicate id as a duplicate-key conflict, also when two requests race', async () => {
    const auth = e2e.auth('owner');
    await request(e2e.server)
      .post('/v1/traits')
      .set('Authorization', auth)
      .send(traitBody({ name: 'Twice' }))
      .expect(201);
    const again = await request(e2e.server)
      .post('/v1/traits')
      .set('Authorization', auth)
      .send(traitBody({ name: 'Twice' }))
      .expect(409);
    expect(again.body).toMatchObject({ code: 'duplicate-key' });

    // Both pass the existence check; the unique _id rejects the second insert in the repository.
    const racing = await Promise.all(
      [1, 2].map(() =>
        request(e2e.server)
          .post('/v1/traits')
          .set('Authorization', auth)
          .send(traitBody({ name: 'Racing' })),
      ),
    );
    expect(racing.map(res => res.status).sort()).toEqual([201, 409]);
    expect(racing.find(res => res.status === 409)?.body).toMatchObject({ code: 'duplicate-key' });
  });
});
