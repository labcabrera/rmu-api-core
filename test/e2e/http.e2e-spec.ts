import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { configureHttp } from '../../src/bootstrap/http.js';
import { configureOpenApi } from '../../src/bootstrap/openapi.js';
import { KafkaProducerService } from '../../src/modules/shared/infrastructure/messaging/kafka-producer.service.js';

// The HTTP hardening of spec 018 with a low request limit and one CORS origin. It boots its own app: the limit and
// the origins are read when the modules are created.
type App = Parameters<typeof request>[0];

describe('HTTP hardening (e2e)', () => {
  let mongo: MongoMemoryServer;
  let app: NestExpressApplication;
  let server: App;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    Object.assign(process.env, {
      RMU_MONGO_CORE_URI: mongo.getUri('rmu-core-e2e-http'),
      RMU_IAM_JWK_URI: 'http://localhost/certs',
      RMU_IAM_ISSUER_URI: 'http://localhost/sso/realms/rmu',
      RMU_IAM_AUDIENCE: 'rmu-api',
      RMU_KAFKA_BROKERS: 'localhost:9092',
      RMU_KAFKA_CLIENT_ID: 'rmu-api-core-e2e',
      RMU_THROTTLE_LIMIT: '3',
      RMU_CORS_ORIGINS: 'http://app.test, http://other.test',
    });

    const { AppModule } = await import('../../src/app.module.js');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(KafkaProducerService)
      .useValue({ emit: () => Promise.resolve() })
      .compile();
    app = moduleRef.createNestApplication<NestExpressApplication>({ logger: ['error'] });
    configureHttp(app);
    configureOpenApi(app);
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app?.close();
    await mongo?.stop();
  });

  it('answers CORS only for the configured origins', async () => {
    const allowed = await request(server).get('/v1/health').set('Origin', 'http://other.test').expect(200);
    expect(allowed.headers['access-control-allow-origin']).toBe('http://other.test');
    const denied = await request(server).get('/v1/health').set('Origin', 'http://evil.test').expect(200);
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('serves the Swagger UI without a Content-Security-Policy, and the API with one', async () => {
    const docs = await request(server).get('/api-docs/').expect(200);
    expect(docs.text).toContain('swagger-ui');
    expect(docs.headers['content-security-policy']).toBeUndefined();
    expect(docs.headers['x-content-type-options']).toBe('nosniff');
  });

  it('never limits the health check', async () => {
    for (let i = 0; i < 5; i++) await request(server).get('/v1/health').expect(200);
  });

  it('limits the requests of a client and tells it when to retry', async () => {
    // The guard counts the request before the JWT check, so unauthenticated calls count too.
    for (let i = 0; i < 3; i++) await request(server).get('/v1/realms').expect(401);
    const limited = await request(server).get('/v1/realms').expect(429);
    expect(limited.headers['retry-after']).toBeDefined();
    expect(limited.body).toMatchObject({ statusCode: 429, path: '/v1/realms' });
  });

  it('counts each client by the address the proxy forwards', async () => {
    await request(server).get('/v1/realms').set('X-Forwarded-For', '203.0.113.7').expect(401);
  });
});
