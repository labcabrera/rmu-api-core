import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ManeuverController } from './infrastructure/controllers/maneuver.controller';
import { PercentManeuverService } from './domain/services/percent-maneuvers/percent-maneuver.service';
import { AbsoluteManeuverService } from './domain/services/absolute-maneuvers/absolute-maneuver.service';
import { PercentManeuverHandler } from './application/cqrs/handlers/percent-maneuver.handler';
import { AbsoluteManeuverHandler } from './application/cqrs/handlers/absolute-maneuver.handler';
import { EnduranceManeuverHandler } from './application/cqrs/handlers/endurance-maneuver.handler';
import { SharedModule } from '../shared/shared.module';
import { EnduranceManeuverService } from './domain/services/endurance-maneuvers/endurance-maneuver.service';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule, SharedModule],
  controllers: [ManeuverController],
  providers: [
    AbsoluteManeuverService,
    PercentManeuverService,
    EnduranceManeuverService,
    PercentManeuverHandler,
    AbsoluteManeuverHandler,
    EnduranceManeuverHandler,
  ],
})
export class ManeuversModule {}
