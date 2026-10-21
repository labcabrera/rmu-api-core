import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { RaceController } from './interfaces/http/race.controller.js';
import { KafkaRaceEventBusAdapter } from './infrastructure/messaging/kafka.race-event-bus.adapter.js';
import { MongoRaceRepository } from './infrastructure/db/mongo.race.repository.js';
import { RealmsModule } from '../realms/realms.module.js';
import { RaceModel, RaceSchema } from './infrastructure/persistence/models/race-model.js';
import { DeleteRaceHandler } from './application/cqrs/handlers/delete-race.handler.js';
import { UpdateRaceHandler } from './application/cqrs/handlers/update-race.handler.js';
import { CreateRaceHandler } from './application/cqrs/handlers/create-race.handler.js';
import { GetRaceHandler } from './application/cqrs/handlers/get-race.query.handler.js';
import { GetRacesHandler } from './application/cqrs/handlers/get-races.query.handler.js';
import { SharedModule } from '../shared/shared.module.js';
import { RaceGuardAdapter } from './infrastructure/security/race-guard.adapter.js';
import { AddRaceTraitHandler } from './application/cqrs/handlers/add-race-trait.handler.js';
import { DeleteRaceTraitHandler } from './application/cqrs/handlers/delete-race-trait.handler.js';
import { UpdateRaceRealmHandler } from './application/cqrs/handlers/update-race-realm.handler.js';
import { DeleteRacesByRealmHandler } from './application/cqrs/handlers/delete-races-by-realm.handler.js';
import { AddRaceSkillBonusHandler } from './application/cqrs/handlers/add-race-skill-bonus.handler.js';
import { DeleteRaceSkillBonusHandler } from './application/cqrs/handlers/delete-race-skill-bonus.handler.js';

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
    AddRaceTraitHandler,
    DeleteRaceTraitHandler,
    UpdateRaceRealmHandler,
    DeleteRacesByRealmHandler,
    AddRaceSkillBonusHandler,
    DeleteRaceSkillBonusHandler,
    {
      provide: 'RaceRepository',
      useClass: MongoRaceRepository,
    },
    {
      provide: 'RaceEventProducer',
      useClass: KafkaRaceEventBusAdapter,
    },
    {
      provide: 'RaceGuardPort',
      useClass: RaceGuardAdapter,
    },
  ],
  exports: ['RaceRepository'],
})
export class RacesModule {}
