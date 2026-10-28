import request from 'supertest';
import { type E2eApp, startApp } from './support/app.js';
import { effectTypeBody, realmBody } from './support/fixtures.js';

// Spec 044, fallo 10: the validation pipe no longer converts the body before validating it, and the query and route
// values are converted explicitly (page, size, roll, unusualEvent, the armor type id).
describe('Explicit conversion (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  describe('body', () => {
    it('answers 400 to a number in a string field instead of storing it as text', async () => {
      const res = await request(e2e.server)
        .post('/v1/realms')
        .set('Authorization', e2e.auth('owner'))
        .send(realmBody({ name: 42 }))
        .expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, path: '/v1/realms' });
    });

    it.each(['true', 'false', 'maybe'])('answers 400 to the string %s in a boolean field', async value => {
      await request(e2e.server)
        .post('/v1/effect-types')
        .set('Authorization', e2e.auth('owner'))
        .send(effectTypeBody('e2e-conversion', { isStackable: value }))
        .expect(400);
    });
  });

  describe('query', () => {
    it('pages a listing from the query string', async () => {
      const auth = e2e.auth('owner');
      for (let i = 0; i < 3; i++) {
        await request(e2e.server)
          .post('/v1/realms')
          .set('Authorization', auth)
          .send(realmBody({ name: `E2E paged ${i}` }))
          .expect(201);
      }
      const first = await request(e2e.server).get('/v1/realms?page=0&size=20').set('Authorization', auth).expect(200);
      expect(first.body).toMatchObject({ pagination: { page: 0, size: 20, totalElements: 3 } });
      expect((first.body as { content: unknown[] }).content).toHaveLength(3);
      const second = await request(e2e.server).get('/v1/realms?page=1&size=2').set('Authorization', auth).expect(200);
      expect(second.body).toMatchObject({ pagination: { page: 1, size: 2, totalElements: 3 } });
      expect((second.body as { content: unknown[] }).content).toHaveLength(1);
    });

    it('pages a catalog beyond the listing maximum', async () => {
      const res = await request(e2e.server).get('/v1/skills?page=0&size=1000').set('Authorization', e2e.auth('owner')).expect(200);
      expect(res.body).toMatchObject({ pagination: { page: 0, size: 1000 } });
    });

    it.each(['page=abc', 'size=1.5'])('answers 400 to a non-integer %s', async query => {
      await request(e2e.server).get(`/v1/realms?${query}`).set('Authorization', e2e.auth('owner')).expect(400);
    });

    it('reads unusualEvent as a boolean, false by default', async () => {
      const auth = e2e.auth('owner');
      const plain = await request(e2e.server).get('/v1/maneuvers/absolute?roll=50').set('Authorization', auth).expect(200);
      expect((plain.body as { unusualEvent?: string }).unusualEvent).toBeUndefined();
      const explicitFalse = await request(e2e.server)
        .get('/v1/maneuvers/absolute?roll=50&unusualEvent=false')
        .set('Authorization', auth)
        .expect(200);
      expect((explicitFalse.body as { unusualEvent?: string }).unusualEvent).toBeUndefined();
      const unusual = await request(e2e.server)
        .get('/v1/maneuvers/absolute?roll=50&unusualEvent=true')
        .set('Authorization', auth)
        .expect(200);
      expect((unusual.body as { unusualEvent?: string }).unusualEvent).toEqual(expect.any(String));
      await request(e2e.server).get('/v1/maneuvers/endurance?roll=50&unusualEvent=true').set('Authorization', auth).expect(200);
    });

    it.each(['maybe', '1', ''])('answers 400 to unusualEvent=%s', async value => {
      await request(e2e.server)
        .get(`/v1/maneuvers/endurance?roll=50&unusualEvent=${value}`)
        .set('Authorization', e2e.auth('owner'))
        .expect(400);
    });
  });

  describe('route', () => {
    it('answers 400 to a non-integer armor type id', async () => {
      await request(e2e.server).get('/v1/armor-types/plate').set('Authorization', e2e.auth('owner')).expect(400);
    });
  });
});
