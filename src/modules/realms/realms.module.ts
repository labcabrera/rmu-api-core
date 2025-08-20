import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';

import { AuthModule } from 'src/modules/auth/auth.module';
import { MongoRealmRepository } from './infrastructure/persistence/repositories/mongo-realm.repository';
import { RealmController } from './infrastructure/controllers/realm.controller';
import { CreateRealmCommandHandler } from './application/commands/handlers/create-realm.command.handler';
import { UpdateRealmCommandHandler } from './application/commands/handlers/update-realm.command.handler';
import { DeleteRealmCommandHandler } from './application/commands/handlers/delete-realm.command.handler';
import { GetRealmsQueryHandler } from './application/queries/handlers/get-realms.query.handler';
import { GetRealmQueryHandler } from './application/queries/handlers/get-realm.query.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { RealmModel, RealmSchema } from './infrastructure/persistence/models/realm-model';
import { KafkaRealmProducerService } from './infrastructure/messaging/kafka-realm-producer.service';
import { CoreModule } from '../core/core.module';

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
