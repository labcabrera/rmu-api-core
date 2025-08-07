import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaProducerService } from './infrastructure/messaging/kafka-producer.service';
import { RealmController } from './infrastructure/controllers/realm.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { RealmModel, RealmSchema } from './infrastructure/persistence/models/realm-model';
import { RaceSchema } from './infrastructure/persistence/models/race-model';
import { RaceModel } from './infrastructure/persistence/models/race-model-old';
import { CreateRealmUseCase } from './application/use-cases/create-realm.usecase';
import { DeleteRealmUseCase } from './application/use-cases/delete-realm.usecase';
import { UpdateRealmUseCase } from './application/use-cases/update-realm.usecase';
import { CreateRaceUseCase } from './application/use-cases/create-race.usecase';
import { UpdateRaceUseCase } from './application/use-cases/update-race.usecase';
import { DeleteRaceUseCase } from './application/use-cases/delete-race.usecase';
import { MongoRaceRepository } from './infrastructure/persistence/repositories/mongo-race.repository';
import { MongoRealmRepository } from './infrastructure/persistence/repositories/mongo-realm.repository';
import { KafkaRealmProducerService } from './infrastructure/messaging/kafla-realm-producer.service';
import { KafkaRaceProducerService } from './infrastructure/messaging/kafla-race-producer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RealmModel.name, schema: RealmSchema },
      { name: RaceModel.name, schema: RaceSchema },
    ]),
    AuthModule,
  ],
  controllers: [RealmController],
  providers: [
    KafkaProducerService,
    CreateRealmUseCase,
    UpdateRealmUseCase,
    DeleteRealmUseCase,
    CreateRaceUseCase,
    UpdateRaceUseCase,
    DeleteRaceUseCase,
    {
      provide: 'RaceRepository',
      useClass: MongoRaceRepository,
    },
    {
      provide: 'RealmRepository',
      useClass: MongoRealmRepository,
    },
    {
      provide: 'RaceEventProducer',
      useClass: KafkaRaceProducerService,
    },
    {
      provide: 'RealmEventProducer',
      useClass: KafkaRealmProducerService,
    },
  ],
})
export class CoreModule {}
