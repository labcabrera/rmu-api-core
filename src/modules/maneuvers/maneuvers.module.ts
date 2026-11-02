import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { ManeuverController } from './interfaces/http/maneuver.controller.js';
import { PercentManeuverService } from './domain/services/percent-maneuver.service.js';
import { AbsoluteManeuverService } from './domain/services/absolute-maneuver.service.js';
import { PercentManeuverHandler } from './application/cqrs/handlers/percent-maneuver.handler.js';
import { AbsoluteManeuverHandler } from './application/cqrs/handlers/absolute-maneuver.handler.js';
import { EnduranceManeuverHandler } from './application/cqrs/handlers/endurance-maneuver.handler.js';
import { SharedModule } from '../shared/shared.module.js';
import { EnduranceManeuverService } from './domain/services/endurance-maneuver.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ManeuverTableModel, ManeuverTableSchema } from './infrastructure/persistence/models/maneuver-table.model.js';
import { MongoManeuverTableRepository } from './infrastructure/db/mongo.maneuver-table.repository.js';
import { AbsoluteManeuverTableProvider } from './application/services/absolute-maneuver-table.provider.js';
import { MANEUVER_TABLE_REPOSITORY } from './application/ports/maneuver-table-repository.port.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: ManeuverTableModel.name, schema: ManeuverTableSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [ManeuverController],
  providers: [
    AbsoluteManeuverService,
    AbsoluteManeuverTableProvider,
    PercentManeuverService,
    EnduranceManeuverService,
    PercentManeuverHandler,
    AbsoluteManeuverHandler,
    EnduranceManeuverHandler,
    {
      provide: MANEUVER_TABLE_REPOSITORY,
      useClass: MongoManeuverTableRepository,
    },
  ],
})
export class ManeuversModule {}
