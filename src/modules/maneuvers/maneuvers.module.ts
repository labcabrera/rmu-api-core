import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module';
import { ManeuverController } from './interfaces/http/maneuver.controller';
import { PercentManeuverService } from './domain/services/percent-maneuver.service';
import { AbsoluteManeuverService } from './domain/services/absolute-maneuver.service';
import { PercentManeuverHandler } from './application/cqrs/handlers/percent-maneuver.handler';
import { AbsoluteManeuverHandler } from './application/cqrs/handlers/absolute-maneuver.handler';
import { EnduranceManeuverHandler } from './application/cqrs/handlers/endurance-maneuver.handler';
import { SharedModule } from '../shared/shared.module';
import { EnduranceManeuverService } from './domain/services/endurance-maneuver.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ManeuverTableModel, ManeuverTableSchema } from './infrastructure/persistence/models/maneuver-table.model';
import { MongoManeuverTableRepository } from './infrastructure/db/mongo.maneuver-table.repository';
import { AbsoluteManeuverTableProvider } from './application/services/absolute-maneuver-table.provider';

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
      provide: 'ManeuverTableRepository',
      useClass: MongoManeuverTableRepository,
    },
  ],
})
export class ManeuversModule {}
