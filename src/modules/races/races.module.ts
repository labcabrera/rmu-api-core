import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../auth/auth.module';

import { RaceController } from './infrastructure/controllers/race.controller';
import { KafkaRaceProducerService } from './infrastructure/messaging/kafka-race-producer.service';
import { MongoRaceRepository } from './infrastructure/persistence/repositories/mongo-race.repository';
import { CreateRaceCommandHandler } from './application/commands/handlers/create-race.command.handler';
import { DeleteRaceCommandHandler } from './application/commands/handlers/delete-race.command.handler';
import { UpdateRaceCommandHandler } from './application/commands/handlers/update-race.command.handler';
import { RealmsModule } from '../realms/realms.module';
import { CoreModule } from '../core/core.module';
import { RaceModel, RaceSchema } from './infrastructure/persistence/models/race-model';
import { GetRaceQueryHandler } from './application/queries/handlers/get-race.query.handler';
import { GetRacesQueryHandler } from './application/queries/handlers/get-races.query.handler';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: RaceModel.name, schema: RaceSchema }]),
    AuthModule,
    CoreModule,
    RealmsModule,
  ],
  controllers: [RaceController],
  providers: [
    GetRaceQueryHandler,
    GetRacesQueryHandler,
    CreateRaceCommandHandler,
    UpdateRaceCommandHandler,
    DeleteRaceCommandHandler,
    {
      provide: 'RaceRepository',
      useClass: MongoRaceRepository,
    },
    {
      provide: 'RaceEventProducer',
      useClass: KafkaRaceProducerService,
    },
  ],
  exports: ['RaceRepository'],
})
export class RacesModule {}
