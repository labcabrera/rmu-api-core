import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { MongoRealmRepository } from './infrastructure/db/mongo.realm.repository.js';
import { RealmController } from './interfaces/http/realm.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { RealmModel, RealmSchema } from './infrastructure/persistence/models/realm-model.js';
import { KafkaRealmProducerService } from './infrastructure/messaging/kafka.realm-bus.adapter.js';
import { CreateRealmHandler } from './application/cqrs/handlers/create-realm.handler.js';
import { DeleteRealmHandler } from './application/cqrs/handlers/delete-realm.handler.js';
import { GetRealmHandler } from './application/cqrs/handlers/get-realm.handler.js';
import { GetRealmsHandler } from './application/cqrs/handlers/get-realms.handler.js';
import { UpdateRealmHandler } from './application/cqrs/handlers/update-realm.handler.js';
import { SharedModule } from '../shared/shared.module.js';
import { RealmGuardAdapter } from './infrastructure/security/realm-guard.adapter.js';
import { KafkaRealmEventConsumer } from './interfaces/messaging/kafka.realm-event-consumer.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: RealmModel.name, schema: RealmSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [RealmController, KafkaRealmEventConsumer],
  providers: [
    GetRealmHandler,
    GetRealmsHandler,
    CreateRealmHandler,
    UpdateRealmHandler,
    DeleteRealmHandler,
    {
      provide: 'RealmRepository',
      useClass: MongoRealmRepository,
    },
    {
      provide: 'RealmEventProducer',
      useClass: KafkaRealmProducerService,
    },
    {
      provide: 'RealmGuardPort',
      useClass: RealmGuardAdapter,
    },
  ],
  exports: ['RealmRepository'],
})
export class RealmsModule {}
