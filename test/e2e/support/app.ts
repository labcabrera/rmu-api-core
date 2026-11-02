import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import request from 'supertest';
import { configureHttp } from '../../../src/bootstrap/http.js';
import { KafkaProducerService } from '../../../src/modules/shared/infrastructure/messaging/kafka-producer.service.js';
import { AUDIENCE, ISSUER, LocalJwks } from './jwks.js';

export type Server = Parameters<typeof request>[0];

/** The users of the suite, by the Keycloak groups in their token. */
export const USERS = {
  admin: { sub: 'e2e-admin', groups: ['rmu-admin'] },
  owner: { sub: 'e2e-owner', groups: ['rmu-user'] },
  other: { sub: 'e2e-other', groups: ['rmu-user'] },
  coreLaw: { sub: 'e2e-core-law', groups: ['rmu-user', 'rmu-core-law'] },
  noRole: { sub: 'e2e-guest', groups: [] as string[] },
} as const;

export type UserName = keyof typeof USERS;

export type E2eApp = {
  app: NestExpressApplication;
  server: Server;
  jwks: LocalJwks;
  /** The events the API published, as the Kafka producer received them. */
  events: { topic: string; message: unknown }[];
  /** `Bearer <token>` of one of the USERS. */
  auth: (user: UserName) => string;
  /** The Mongo connection, to insert or read documents directly. */
  connection: Connection;
  stop: () => Promise<void>;
};

/**
 * Boots the whole AppModule as main.ts does (configureHttp) against an in-memory Mongo and a local JWKS. Only the
 * Kafka producer is replaced. AppModule is imported after setting the environment, because ConfigModule.forRoot()
 * reads it (and .env) when the module is evaluated. Each spec file runs in its own process, so `env` overrides do
 * not leak into other files.
 */
export async function startApp(
  env: Record<string, string> = {},
  /** Extra setup before init, such as the OpenAPI routes. */
  setup: (app: NestExpressApplication) => void = () => undefined,
): Promise<E2eApp> {
  const mongo = await MongoMemoryServer.create();
  const jwks = new LocalJwks();
  await jwks.start();
  Object.assign(process.env, {
    RMU_MONGO_CORE_URI: mongo.getUri('rmu-core-e2e'),
    RMU_IAM_JWK_URI: jwks.uri,
    RMU_IAM_ISSUER_URI: ISSUER,
    RMU_IAM_AUDIENCE: AUDIENCE,
    RMU_KAFKA_BROKERS: 'localhost:9092',
    RMU_KAFKA_CLIENT_ID: 'rmu-api-core-e2e',
    RMU_THROTTLE_LIMIT: '0',
    RMU_CORS_ORIGINS: '',
    ...env,
  });

  const events: E2eApp['events'] = [];
  const { AppModule } = await import('../../../src/app.module.js');
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(KafkaProducerService)
    .useValue({ emit: (topic: string, message: unknown) => Promise.resolve(void events.push({ topic, message })) })
    .compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>({ logger: ['error'] });
  configureHttp(app);
  setup(app);
  await app.init();

  return {
    app,
    server: app.getHttpServer() as Server,
    jwks,
    events,
    auth: user => `Bearer ${jwks.token(USERS[user])}`,
    connection: app.get<Connection>(getConnectionToken()),
    stop: async () => {
      await app.close();
      await jwks.stop();
      await mongo.stop();
    },
  };
}

/** The ids of a page response. */
export const ids = (body: unknown) => (body as { content: { id: string }[] }).content.map(item => item.id);

/** The topics published since the last call, emptying the list. */
export const takeTopics = (events: E2eApp['events']) => events.splice(0).map(event => event.topic);
