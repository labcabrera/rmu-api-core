import { type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { KafkaProducerService } from '../../src/modules/shared/infrastructure/messaging/kafka-producer.service.js';
import { JwtAuthGuard } from '../../src/modules/shared/infrastructure/security/jwt-auth.guard.js';
import { configureHttp } from '../../src/bootstrap/http.js';
import type { KafkaContext } from '@nestjs/microservices';
import { KafkaRealmEventConsumer } from '../../src/modules/races/interfaces/messaging/kafka.realm-event-consumer.js';
import { DomainEvent } from '../../src/modules/shared/domain/events/domain-event.js';
import type { RealmProps } from '../../src/modules/realms/domain/aggregates/realm-props.js';

// Boots the whole AppModule against an in-memory Mongo. Kafka and Keycloak are replaced: the producer
// records the events and the guard maps fixed tokens to users. AppModule is imported after setting the
// environment, because ConfigModule.forRoot() reads it (and .env) when the module is evaluated.
type App = Parameters<typeof request>[0];

const TOKEN = 'e2e-token';
const USER = { id: 'e2e-user', roles: ['rmu-admin'] };
const PLAYER_TOKEN = 'e2e-player-token';
const PLAYER = { id: 'e2e-player', roles: ['rmu-user'] };
const OTHER_TOKEN = 'e2e-other-token';
const OTHER = { id: 'e2e-other', roles: ['rmu-user'] };
const USERS: Record<string, typeof USER> = {
  [`Bearer ${TOKEN}`]: USER,
  [`Bearer ${PLAYER_TOKEN}`]: PLAYER,
  [`Bearer ${OTHER_TOKEN}`]: OTHER,
};

const testGuard = {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, string>; user?: unknown }>();
    const user = USERS[req.headers.authorization];
    if (!user) throw new UnauthorizedException();
    req.user = user;
    return true;
  },
};

describe('AppModule (e2e)', () => {
  let mongo: MongoMemoryServer;
  let app: NestExpressApplication;
  let server: App;
  const events: { topic: string; message: unknown }[] = [];

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    Object.assign(process.env, {
      RMU_MONGO_CORE_URI: mongo.getUri('rmu-core-e2e'),
      RMU_IAM_JWK_URI: 'http://localhost/certs',
      RMU_IAM_ISSUER_URI: 'http://localhost/sso/realms/rmu',
      RMU_IAM_AUDIENCE: 'rmu-api',
      RMU_KAFKA_BROKERS: 'localhost:9092',
      RMU_KAFKA_CLIENT_ID: 'rmu-api-core-e2e',
      RMU_THROTTLE_LIMIT: '0',
    });

    const { AppModule } = await import('../../src/app.module.js');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(KafkaProducerService)
      .useValue({ emit: (topic: string, message: unknown) => Promise.resolve(void events.push({ topic, message })) })
      .overrideGuard(JwtAuthGuard)
      .useValue(testGuard)
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>({ logger: ['error', 'warn'] });
    configureHttp(app);
    await app.init();
    server = app.getHttpServer();
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
    const res = await request(server).get('/v1/races').expect(401);
    expect(res.body).toMatchObject({ statusCode: 401, error: 'UnauthorizedException', path: '/v1/races' });
  });

  it('every OpenAPI operation has a unique operationId', () => {
    const document = SwaggerModule.createDocument(app, new DocumentBuilder().build());
    const ids = Object.values(document.paths).flatMap(methods =>
      Object.values(methods as Record<string, { operationId?: string }>)
        .map(operation => operation?.operationId)
        .filter((id): id is string => typeof id === 'string'),
    );
    const duplicated = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(duplicated).toEqual([]);
  });

  it('GET /v1/races rejects a page size above 100, and the catalogs one above 1000', async () => {
    const auth = `Bearer ${TOKEN}`;
    await request(server).get('/v1/races?size=100').set('Authorization', auth).expect(200);
    await request(server).get('/v1/races?size=101').set('Authorization', auth).expect(400);
    for (const catalog of ['skills', 'skill-categories', 'enumerations', 'traits']) {
      await request(server).get(`/v1/${catalog}?size=1000`).set('Authorization', auth).expect(200);
      await request(server).get(`/v1/${catalog}?size=1001`).set('Authorization', auth).expect(400);
    }
  });

  it('answers with the helmet security headers and no CORS headers', async () => {
    const res = await request(server).get('/v1/health').set('Origin', 'http://evil.test').expect(200);
    expect(res.headers).toMatchObject({ 'x-content-type-options': 'nosniff', 'x-frame-options': 'SAMEORIGIN' });
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('GET /v1/races returns an empty page', async () => {
    const res = await request(server).get('/v1/races').set('Authorization', `Bearer ${TOKEN}`).expect(200);
    const page = res.body as { content: unknown[]; pagination: { totalElements: number } };
    expect(page.content).toEqual([]);
    expect(page.pagination.totalElements).toBe(0);
  });

  it('POST /v1/realms validates the body', async () => {
    const res = await request(server).post('/v1/realms').set('Authorization', `Bearer ${TOKEN}`).send({}).expect(400);
    expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/realms' });
    expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
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

  const createRealm = async (auth: string, name: string) => {
    const res = await request(server)
      .post('/v1/realms')
      .set('Authorization', auth)
      .send({ name, magicPresence: 'none', accessType: 'private' })
      .expect(201);
    return res.body as RealmProps;
  };

  it('PATCH /v1/realms clears the optional texts with an empty string or null', async () => {
    const auth = `Bearer ${TOKEN}`;
    const realm = await createRealm(auth, 'Described realm');
    await request(server)
      .patch(`/v1/realms/${realm.id}`)
      .set('Authorization', auth)
      .send({ shortDescription: 'Short', description: 'Long' })
      .expect(200);

    await request(server)
      .patch(`/v1/realms/${realm.id}`)
      .set('Authorization', auth)
      .send({ shortDescription: '', description: null })
      .expect(200);
    const found = await request(server).get(`/v1/realms/${realm.id}`).set('Authorization', auth).expect(200);
    expect(found.body).not.toHaveProperty('shortDescription');
    expect(found.body).not.toHaveProperty('description');

    await request(server).patch(`/v1/realms/${realm.id}`).set('Authorization', auth).send({ name: '' }).expect(400);
    await request(server).patch(`/v1/realms/${realm.id}`).set('Authorization', auth).send({ name: null }).expect(400);
  });

  const createRace = async (auth: string, realmId: string) => {
    const sex = { male: 1, female: 1 };
    const res = await request(server)
      .post('/v1/races')
      .set('Authorization', auth)
      .send({
        name: 'Player race',
        archetype: 'human',
        realmId,
        sizeId: 'medium',
        stats: { ag: 0, co: 0, em: 0, in: 0, me: 0, pr: 0, qu: 0, re: 0, sd: 0, st: 0 },
        resistances: { channeling: 0, disease: 0, essence: 0, fear: 0, mentalism: 0, physical: 0, poison: 0 },
        averageHeight: sex,
        averageWeight: sex,
        strideBonus: 0,
        enduranceBonus: 0,
        recoveryMultiplier: 1,
        baseHits: 10,
        baseDevPoints: 60,
        baseAt: 1,
        talents: [],
        traits: [],
      })
      .expect(201);
    return res.body as { id: string; accessType: string };
  };

  it('a non-admin owner can delete their own race', async () => {
    const auth = `Bearer ${PLAYER_TOKEN}`;
    const realm = await createRealm(auth, 'Player realm');
    const race = await createRace(auth, realm.id);

    await request(server).delete(`/v1/races/${race.id}`).set('Authorization', auth).expect(204);
  });

  describe('permissions', () => {
    const admin = `Bearer ${TOKEN}`;
    const owner = `Bearer ${PLAYER_TOKEN}`;
    const other = `Bearer ${OTHER_TOKEN}`;
    const ids = (body: unknown) => (body as { content: { id: string }[] }).content.map(item => item.id);

    it('a private realm and its races are visible and editable only by their owner and admins', async () => {
      const realm = await createRealm(owner, 'Private realm');
      const race = await createRace(owner, realm.id);

      for (const [path, patch] of [
        [`/v1/realms/${realm.id}`, { name: 'Renamed realm' }],
        [`/v1/races/${race.id}`, { name: 'Renamed race' }],
      ] as const) {
        await request(server).get(path).set('Authorization', owner).expect(200);
        await request(server).get(path).set('Authorization', admin).expect(200);
        await request(server).get(path).set('Authorization', other).expect(403);
        await request(server).patch(path).set('Authorization', other).send(patch).expect(403);
        await request(server).delete(path).set('Authorization', other).expect(403);
        await request(server).patch(path).set('Authorization', owner).send(patch).expect(200);
        await request(server).patch(path).set('Authorization', admin).send(patch).expect(200);
      }

      const realmsOfOther = await request(server).get('/v1/realms?size=100').set('Authorization', other).expect(200);
      const racesOfOther = await request(server).get('/v1/races?size=100').set('Authorization', other).expect(200);
      expect(ids(realmsOfOther.body)).not.toContain(realm.id);
      expect(ids(racesOfOther.body)).not.toContain(race.id);
      const racesOfAdmin = await request(server).get('/v1/races?size=100').set('Authorization', admin).expect(200);
      expect(ids(racesOfAdmin.body)).toContain(race.id);

      await request(server).delete(`/v1/races/${race.id}`).set('Authorization', admin).expect(204);
      await request(server).delete(`/v1/realms/${realm.id}`).set('Authorization', owner).expect(204);
    });

    it('a public realm is visible to everyone but editable only by its owner and admins', async () => {
      const realm = await createRealm(owner, 'Public realm');
      await request(server).patch(`/v1/realms/${realm.id}`).set('Authorization', owner).send({ accessType: 'public' }).expect(200);

      await request(server).get(`/v1/realms/${realm.id}`).set('Authorization', other).expect(200);
      const listed = await request(server).get('/v1/realms?size=100').set('Authorization', other).expect(200);
      expect(ids(listed.body)).toContain(realm.id);
      await request(server).patch(`/v1/realms/${realm.id}`).set('Authorization', other).send({ name: 'Taken' }).expect(403);
      await request(server).delete(`/v1/realms/${realm.id}`).set('Authorization', other).expect(403);
      await request(server).delete(`/v1/realms/${realm.id}`).set('Authorization', admin).expect(204);
    });
  });

  it('the realm event consumer keeps the races of a realm in step', async () => {
    const auth = `Bearer ${PLAYER_TOKEN}`;
    const realm = await createRealm(auth, 'Synced realm');
    const race = await createRace(auth, realm.id);
    const consumer = app.get(KafkaRealmEventConsumer);
    const context = { getTopic: () => 'internal.rmu-core.realm.e2e.v1' } as KafkaContext;

    await consumer.handleRealmUpdated(new DomainEvent('updated', { ...realm, accessType: 'public' }), context);
    const synced = await request(server).get(`/v1/races/${race.id}`).set('Authorization', auth).expect(200);
    expect(synced.body).toMatchObject({ accessType: 'public' });

    events.length = 0;
    await consumer.handleRealmDeleted(new DomainEvent('deleted', realm), context);
    await request(server).get(`/v1/races/${race.id}`).set('Authorization', auth).expect(404);
    expect(events.map(e => e.topic)).toEqual(['internal.rmu-core.race.deleted.v1']);

    // Redelivery finds nothing left to delete.
    await consumer.handleRealmDeleted(new DomainEvent('deleted', realm), context);
    expect(events).toHaveLength(1);
  });
});
