import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';

import { AuthModule } from 'src/modules/auth/auth.module';
import { CoreModule } from '../core/core.module';
import { ManeuverController } from './infrastructure/controllers/maneuver.controller';
import { PercentManeuverService } from './domain/services/percent-maneuver.service';
import { PercentManeuverQueryHandler } from './application/queries/handlers/percent-maneuver.query.handler';
import { AbsoluteManeuverQueryHandler } from './application/queries/handlers/absolute-maneuver.query.handler';
import { AbsoluteManeuverService } from './domain/services/absolute-maneuver.service';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule, CoreModule],
  controllers: [ManeuverController],
  providers: [PercentManeuverService, AbsoluteManeuverService, PercentManeuverQueryHandler, AbsoluteManeuverQueryHandler],
})
export class ManeuversModule {}
