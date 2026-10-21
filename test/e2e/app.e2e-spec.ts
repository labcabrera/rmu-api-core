import { ExecutionContext, INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import type { App } from 'supertest/types';
import { KafkaProducerService } from '../../src/modules/shared/infrastructure/messaging/kafka-producer.service';
import { JwtAuthGuard } from '../../src/modules/shared/infrastructure/security/jwt-auth.guard';
import { DomainExceptionFilter } from '../../src/modules/shared/interfaces/http/domain-exception.filter';

// Boots the whole AppModule against an in-memory Mongo. Kafka and Keycloak are replaced: the producer
// records the events and the guard accepts a fixed token. AppModule is imported after setting the
// environment, because ConfigModule.forRoot() reads it (and .env) when the module is evaluated.
const TOKEN = 'e2e-token';
const USER = { id: 'e2e-user', roles: ['rmu-admin'] };

const testGuard = {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, string>; user?: unknown }>();
    if (req.headers.authorization !== `Bearer ${TOKEN}`) throw new UnauthorizedException();
    req.user = USER;
    return true;
  },
};

describe('AppModule (e2e)', () => {
  let mongo: MongoMemoryServer;
  let app: INestApplication;
  let server: App;
  const events: { topic: string; message: unknown }[] = [];

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    Object.assign(process.env, {
      RMU_MONGO_CORE_URI: mongo.getUri('rmu-core-e2e'),
      RMU_IAM_JWK_URI: 'http://localhost/certs',
      RMU_IAM_ISSUER_URI: 'http://localhost/sso/realms/rmu',
      RMU_IAM_AUDIENCE: 'rmu-api',
      RMU_IAM_TOKEN_URI: 'http://localhost/token',
      RMU_IAM_CLIENT_ID: 'rmu-client',
      RMU_IAM_CLIENT_SECRET: 'e2e',
      RMU_KAFKA_BROKERS: 'localhost:9092',
      RMU_KAFKA_CLIENT_ID: 'rmu-api-core-e2e',
    });

    const { AppModule } = await import('../../src/app.module.js');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(KafkaProducerService)
      .useValue({ emit: (topic: string, message: unknown) => Promise.resolve(void events.push({ topic, message })) })
      .overrideGuard(JwtAuthGuard)
      .useValue(testGuard)
      .compile();

    app = moduleRef.createNestApplication({ logger: ['error', 'warn'] });
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, whitelist: true }));
    app.useGlobalFilters(new DomainExceptionFilter());
    await app.init();
    server = app.getHttpServer() as App;
  });

  afterAll(async () => {
    await app?.close();
    await mongo?.stop();
  });

  it('GET /v1/health is up', async () => {
    const res = await request(server).get('/v1/health').expect(200);
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('GET /v1/races without a token is 401', async () => {
    await request(server).get('/v1/races').expect(401);
  });

  it('GET /v1/races returns an empty page', async () => {
    const res = await request(server).get('/v1/races').set('Authorization', `Bearer ${TOKEN}`).expect(200);
    const page = res.body as { content: unknown[]; pagination: { totalElements: number } };
    expect(page.content).toEqual([]);
    expect(page.pagination.totalElements).toBe(0);
  });

  it('POST /v1/realms validates the body', async () => {
    await request(server).post('/v1/realms').set('Authorization', `Bearer ${TOKEN}`).send({}).expect(400);
  });

  it('POST /v1/realms persists the realm and emits an event', async () => {
    const auth = `Bearer ${TOKEN}`;
    const created = await request(server)
      .post('/v1/realms')
      .set('Authorization', auth)
      .send({ name: 'E2E realm', magicPresence: 'limited', accessType: 'private' })
      .expect(201);
    const realm = created.body as { id: string };
    expect(realm).toMatchObject({ name: 'E2E realm', owner: USER.id });

    const found = await request(server).get(`/v1/realms/${realm.id}`).set('Authorization', auth).expect(200);
    expect(found.body).toMatchObject({ id: realm.id, magicPresence: 'limited' });
    expect(events.length).toBeGreaterThan(0);
  });
});
