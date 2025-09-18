import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MongoRealmRepository } from './infrastructure/db/mongo-realm.repository';
import { RealmController } from './interfaces/http/realm.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RealmModel, RealmSchema } from './infrastructure/persistence/models/realm-model';
import { KafkaRealmProducerService } from './infrastructure/messaging/kafka.realm-bus.adapter';
import { CoreModule } from '../core/core.module';
import { CreateRealmCommandHandler } from './application/cqrs/handlers/create-realm.command.handler';
import { DeleteRealmCommandHandler } from './application/cqrs/handlers/delete-realm.command.handler';
import { GetRealmQueryHandler } from './application/cqrs/handlers/get-realm.query.handler';
import { GetRealmsQueryHandler } from './application/cqrs/handlers/get-realms.query.handler';
import { UpdateRealmCommandHandler } from './application/cqrs/handlers/update-realm.command.handler';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: RealmModel.name, schema: RealmSchema }]),
    AuthModule,
    CoreModule,
  ],
  controllers: [RealmController],
  providers: [
    GetRealmQueryHandler,
    GetRealmsQueryHandler,
    CreateRealmCommandHandler,
    UpdateRealmCommandHandler,
    DeleteRealmCommandHandler,
    {
      provide: 'RealmRepository',
      useClass: MongoRealmRepository,
    },
    {
      provide: 'RealmEventProducer',
      useClass: KafkaRealmProducerService,
    },
  ],
  exports: ['RealmRepository'],
})
export class RealmsModule {}
