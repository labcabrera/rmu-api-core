import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MongoRealmRepository } from './infrastructure/db/mongo.realm.repository';
import { RealmController } from './interfaces/http/realm.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RealmModel, RealmSchema } from './infrastructure/persistence/models/realm-model';
import { KafkaRealmProducerService } from './infrastructure/messaging/kafka.realm-bus.adapter';
import { CreateRealmHandler } from './application/cqrs/handlers/create-realm.handler';
import { DeleteRealmHandler } from './application/cqrs/handlers/delete-realm.handler';
import { GetRealmHandler } from './application/cqrs/handlers/get-realm.handler';
import { GetRealmsHandler } from './application/cqrs/handlers/get-realms.handler';
import { UpdateRealmHandler } from './application/cqrs/handlers/update-realm.handler';
import { SharedModule } from '../shared/shared.module';
import { RealmGuardAdapter } from './infrastructure/security/realm-guard.adapter';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: RealmModel.name, schema: RealmSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [RealmController],
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
