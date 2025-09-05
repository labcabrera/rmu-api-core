import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';

import { AuthModule } from 'src/modules/auth/auth.module';
import { CoreModule } from '../core/core.module';
import { ManeuverController } from './infrastructure/controllers/maneuver.controller';
import { PercentManeuverService } from './domain/services/percent-maneuver.service';
import { PercentManeuverQueryHandler } from './application/commands/queries/percent-maneuver.query.handler';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule, CoreModule],
  controllers: [ManeuverController],
  providers: [PercentManeuverService, PercentManeuverQueryHandler],
})
export class ManeuversModule {}
