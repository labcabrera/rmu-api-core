import request from 'supertest';
import { configureOpenApi } from '../../src/bootstrap/openapi.js';
import { type E2eApp, startApp } from './support/app.js';

// The HTTP hardening of spec 018 with a low request limit and two CORS origins, in its own app: the limit and the
// origins are read when the modules are created.
describe('HTTP hardening (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp({ RMU_THROTTLE_LIMIT: '3', RMU_CORS_ORIGINS: 'http://app.test, http://other.test' }, configureOpenApi);
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  it('answers CORS only for the configured origins', async () => {
    const allowed = await request(e2e.server).get('/v1/health').set('Origin', 'http://other.test').expect(200);
    expect(allowed.headers['access-control-allow-origin']).toBe('http://other.test');
    const denied = await request(e2e.server).get('/v1/health').set('Origin', 'http://evil.test').expect(200);
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('serves the Swagger UI without a Content-Security-Policy, and the API with one', async () => {
    const docs = await request(e2e.server).get('/api-docs/').expect(200);
    expect(docs.text).toContain('swagger-ui');
    expect(docs.headers['content-security-policy']).toBeUndefined();
    expect(docs.headers['x-content-type-options']).toBe('nosniff');
    const api = await request(e2e.server).get('/v1/health').expect(200);
    expect(api.headers['content-security-policy']).toBeDefined();
  });

  it('never limits the health check', async () => {
    for (let i = 0; i < 5; i++) await request(e2e.server).get('/v1/health').expect(200);
  });

  it('limits the requests of a client and tells it when to retry', async () => {
    // The limit is checked before the token, so a client with a valid token is limited the same way.
    const auth = e2e.auth('owner');
    for (let i = 0; i < 3; i++) await request(e2e.server).get('/v1/realms').set('Authorization', auth).expect(200);
    const limited = await request(e2e.server).get('/v1/realms').set('Authorization', auth).expect(429);
    expect(limited.headers['retry-after']).toBeDefined();
    expect(limited.body).toMatchObject({ statusCode: 429, path: '/v1/realms' });
  });

  it('counts each client by the address the proxy forwards', async () => {
    await request(e2e.server).get('/v1/realms').set('Authorization', e2e.auth('owner')).set('X-Forwarded-For', '203.0.113.7').expect(200);
  });
});
