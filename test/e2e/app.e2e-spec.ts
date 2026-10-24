import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { AUDIENCE, ISSUER } from './support/jwks.js';
import { type E2eApp, startApp, USERS } from './support/app.js';

// What every endpoint shares: health, authentication against the local JWKS, the OpenAPI document and the HTTP
// headers. Each resource has its own file; the request limit and CORS origins are in http.e2e-spec.ts.
describe('AppModule (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  it('GET /v1/health is up without a token', async () => {
    const res = await request(e2e.server).get('/v1/health').expect(200);
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('accepts a valid token and maps its groups to roles', async () => {
    await request(e2e.server).get('/v1/realms').set('Authorization', e2e.auth('owner')).expect(200);
  });

  it.each([
    ['no token', undefined],
    ['a malformed token', 'Bearer not-a-jwt'],
    ['an expired token', { exp: Math.floor(Date.now() / 1000) - 60 }],
    ['a token from another issuer', { iss: `${ISSUER}-other` }],
    ['a token for another audience', { aud: `${AUDIENCE}-other` }],
  ])('rejects %s with 401', async (_, token) => {
    const call = request(e2e.server).get('/v1/races');
    if (typeof token === 'string') call.set('Authorization', token);
    else if (token) call.set('Authorization', `Bearer ${e2e.jwks.token({ ...USERS.owner, ...token })}`);
    const res = await call.expect(401);
    expect(res.body).toMatchObject({ statusCode: 401, error: 'UnauthorizedException', path: '/v1/races' });
  });

  it('every OpenAPI operation has a unique operationId', () => {
    const document = SwaggerModule.createDocument(e2e.app, new DocumentBuilder().build());
    const ids = Object.values(document.paths).flatMap(methods =>
      Object.values(methods as Record<string, { operationId?: string }>)
        .map(operation => operation?.operationId)
        .filter((id): id is string => typeof id === 'string'),
    );
    const duplicated = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(duplicated).toEqual([]);
  });

  it('rejects a page size above 100, and above 1000 in the catalogs', async () => {
    const auth = e2e.auth('admin');
    await request(e2e.server).get('/v1/races?size=100').set('Authorization', auth).expect(200);
    await request(e2e.server).get('/v1/races?size=101').set('Authorization', auth).expect(400);
    await request(e2e.server).get('/v1/races?size=0').set('Authorization', auth).expect(400);
    await request(e2e.server).get('/v1/races?page=-1').set('Authorization', auth).expect(400);
    for (const catalog of ['skills', 'skill-categories', 'enumerations', 'traits']) {
      await request(e2e.server).get(`/v1/${catalog}?size=1000`).set('Authorization', auth).expect(200);
      await request(e2e.server).get(`/v1/${catalog}?size=1001`).set('Authorization', auth).expect(400);
    }
  });

  it('rejects an invalid RSQL expression with 400', async () => {
    const auth = e2e.auth('admin');
    await request(e2e.server).get('/v1/realms?q=name==').set('Authorization', auth).expect(400);
    await request(e2e.server).get('/v1/realms?q=$where==1').set('Authorization', auth).expect(400);
  });

  it('answers with the helmet security headers and no CORS headers', async () => {
    const res = await request(e2e.server).get('/v1/health').set('Origin', 'http://evil.test').expect(200);
    expect(res.headers).toMatchObject({ 'x-content-type-options': 'nosniff', 'x-frame-options': 'SAMEORIGIN' });
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('answers an unknown route with 404 in the error format', async () => {
    const res = await request(e2e.server).get('/v1/unknown').set('Authorization', e2e.auth('admin')).expect(404);
    expect(res.body).toMatchObject({ statusCode: 404, path: '/v1/unknown' });
  });
});
