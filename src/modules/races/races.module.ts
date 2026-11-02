import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { RaceController } from './interfaces/http/race.controller.js';
import { MongoRaceRepository } from './infrastructure/db/mongo.race.repository.js';
import { RealmsModule } from '../realms/realms.module.js';
import { RaceModel, RaceSchema } from './infrastructure/persistence/models/race.model.js';
import { DeleteRaceHandler } from './application/cqrs/handlers/delete-race.handler.js';
import { UpdateRaceHandler } from './application/cqrs/handlers/update-race.handler.js';
import { CreateRaceHandler } from './application/cqrs/handlers/create-race.handler.js';
import { GetRaceHandler } from './application/cqrs/handlers/get-race.handler.js';
import { GetRacesHandler } from './application/cqrs/handlers/get-races.handler.js';
import { SharedModule } from '../shared/shared.module.js';
import { RaceGuardAdapter } from './infrastructure/security/race-guard.adapter.js';
import { AddRaceTraitHandler } from './application/cqrs/handlers/add-race-trait.handler.js';
import { DeleteRaceTraitHandler } from './application/cqrs/handlers/delete-race-trait.handler.js';
import { SyncRaceRealmHandler } from './application/cqrs/handlers/sync-race-realm.handler.js';
import { KafkaRealmEventConsumer } from './interfaces/messaging/kafka.realm-event-consumer.js';
import { DeleteRacesByRealmHandler } from './application/cqrs/handlers/delete-races-by-realm.handler.js';
import { AddRaceSkillBonusHandler } from './application/cqrs/handlers/add-race-skill-bonus.handler.js';
import { DeleteRaceSkillBonusHandler } from './application/cqrs/handlers/delete-race-skill-bonus.handler.js';
import { RACE_GUARD } from './application/ports/race-guard.port.js';
import { RACE_REPOSITORY } from './application/ports/race-repository.port.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: RaceModel.name, schema: RaceSchema }]),
    AuthModule,
    SharedModule,
    RealmsModule,
  ],
  controllers: [RaceController, KafkaRealmEventConsumer],
  providers: [
    GetRaceHandler,
    GetRacesHandler,
    CreateRaceHandler,
    UpdateRaceHandler,
    DeleteRaceHandler,
    AddRaceTraitHandler,
    DeleteRaceTraitHandler,
    SyncRaceRealmHandler,
    DeleteRacesByRealmHandler,
    AddRaceSkillBonusHandler,
    DeleteRaceSkillBonusHandler,
    {
      provide: RACE_REPOSITORY,
      useClass: MongoRaceRepository,
    },
    {
      provide: RACE_GUARD,
      useClass: RaceGuardAdapter,
    },
  ],
  exports: [RACE_REPOSITORY],
})
export class RacesModule {}
