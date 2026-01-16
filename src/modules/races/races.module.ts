import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../auth/auth.module';
import { RaceController } from './interfaces/http/race.controller';
import { KafkaRaceEventBusAdapter } from './infrastructure/messaging/kafka.race-event-bus.adapter';
import { MongoRaceRepository } from './infrastructure/db/mongo.race.repository';
import { RealmsModule } from '../realms/realms.module';
import { RaceModel, RaceSchema } from './infrastructure/persistence/models/race-model';
import { DeleteRaceHandler } from './application/cqrs/handlers/delete-race.handler';
import { UpdateRaceHandler } from './application/cqrs/handlers/update-race.handler';
import { CreateRaceHandler } from './application/cqrs/handlers/create-race.handler';
import { GetRaceHandler } from './application/cqrs/handlers/get-race.query.handler';
import { GetRacesHandler } from './application/cqrs/handlers/get-races.query.handler';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: RaceModel.name, schema: RaceSchema }]),
    AuthModule,
    SharedModule,
    RealmsModule,
  ],
  controllers: [RaceController],
  providers: [
    GetRaceHandler,
    GetRacesHandler,
    CreateRaceHandler,
    UpdateRaceHandler,
    DeleteRaceHandler,
    {
      provide: 'RaceRepository',
      useClass: MongoRaceRepository,
    },
    {
      provide: 'RaceEventProducer',
      useClass: KafkaRaceEventBusAdapter,
    },
  ],
  exports: ['RaceRepository'],
})
export class RacesModule {}
