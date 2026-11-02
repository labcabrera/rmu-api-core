import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { MongoRealmRepository } from './infrastructure/db/mongo.realm.repository.js';
import { RealmController } from './interfaces/http/realm.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { RealmModel, RealmSchema } from './infrastructure/persistence/models/realm.model.js';
import { CreateRealmHandler } from './application/cqrs/handlers/create-realm.handler.js';
import { DeleteRealmHandler } from './application/cqrs/handlers/delete-realm.handler.js';
import { GetRealmHandler } from './application/cqrs/handlers/get-realm.handler.js';
import { GetRealmsHandler } from './application/cqrs/handlers/get-realms.handler.js';
import { UpdateRealmHandler } from './application/cqrs/handlers/update-realm.handler.js';
import { SharedModule } from '../shared/shared.module.js';
import { RealmGuardAdapter } from './infrastructure/security/realm-guard.adapter.js';
import { REALM_GUARD } from './application/ports/realm-guard.port.js';
import { REALM_REPOSITORY } from './application/ports/realm-repository.port.js';
import { REALM_RACE_QUERY } from './application/ports/realm-race-query.port.js';
import { MongoRealmRaceQueryAdapter } from './infrastructure/db/mongo.realm-race-query.adapter.js';
import { REALM_ACCESS } from './application/ports/realm-access.port.js';
import { RealmAccessService } from './application/services/realm-access.service.js';
import { ShareRealmHandler } from './application/cqrs/handlers/share-realm.handler.js';
import { UnshareRealmHandler } from './application/cqrs/handlers/unshare-realm.handler.js';
import { RevokeSharesBetweenUsersHandler } from './application/cqrs/handlers/revoke-shares-between-users.handler.js';
import { GetRealmSharesHandler } from './application/cqrs/handlers/get-realm-shares.handler.js';
import { FRIENDSHIP_PORT } from './application/ports/friendship.port.js';
import { ApiFriendshipAdapter } from './infrastructure/api-clients/api.friendship.adapter.js';
import { KafkaFriendshipEventConsumer } from './interfaces/messaging/kafka.friendship-event-consumer.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: RealmModel.name, schema: RealmSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [RealmController, KafkaFriendshipEventConsumer],
  providers: [
    GetRealmHandler,
    GetRealmsHandler,
    CreateRealmHandler,
    UpdateRealmHandler,
    DeleteRealmHandler,
    ShareRealmHandler,
    UnshareRealmHandler,
    RevokeSharesBetweenUsersHandler,
    GetRealmSharesHandler,
    {
      provide: FRIENDSHIP_PORT,
      useClass: ApiFriendshipAdapter,
    },
    {
      provide: REALM_REPOSITORY,
      useClass: MongoRealmRepository,
    },
    {
      provide: REALM_GUARD,
      useClass: RealmGuardAdapter,
    },
    {
      provide: REALM_ACCESS,
      useClass: RealmAccessService,
    },
    {
      provide: REALM_RACE_QUERY,
      useClass: MongoRealmRaceQueryAdapter,
    },
  ],
  exports: [REALM_REPOSITORY, REALM_GUARD, REALM_ACCESS],
})
export class RealmsModule {}
