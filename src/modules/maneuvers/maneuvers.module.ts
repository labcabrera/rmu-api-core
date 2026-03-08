import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ManeuverController } from './infrastructure/controllers/maneuver.controller';
import { PercentManeuverService } from './domain/services/percent-maneuver.service';
import { AbsoluteManeuverService } from './domain/services/absolute-maneuver.service';
import { PercentManeuverHandler } from './application/cqrs/handlers/percent-maneuver.handler';
import { AbsoluteManeuverHandler } from './application/cqrs/handlers/absolute-maneuver.handler';
import { EnduranceManeuverHandler } from './application/cqrs/handlers/endurance-maneuver.handler';
import { EnduranceManeuverService } from './domain/services/endurance-maneuver.service';
import { AnimalManeuverService } from './domain/services/animal-maneuver.service';
import { AwarenessManeuverService } from './domain/services/awareness-maneuver.service';
import { AdrenalManeuverService } from './domain/services/adrenal-maneuver.service';
import { CraftingManeuverService } from './domain/services/crafting-maneuver.service';
import { GymnasticManeuverService } from './domain/services/gymnastic-maneuver.service';
import { SharedModule } from '../shared/shared.module';
import { CompositionManeuverService } from './domain/services/composition-maneuver.service';
import { LoreManeuverService } from './domain/services/lore-maneuver.service';
import { MedicalManeuverService } from './domain/services/medical-maneuver.service';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule, SharedModule],
  controllers: [ManeuverController],
  providers: [
    AbsoluteManeuverService,
    AdrenalManeuverService,
    AnimalManeuverService,
    AwarenessManeuverService,
    CompositionManeuverService,
    CraftingManeuverService,
    EnduranceManeuverService,
    GymnasticManeuverService,
    LoreManeuverService,
    MedicalManeuverService,
    PercentManeuverService,
    PercentManeuverHandler,
    AbsoluteManeuverHandler,
    EnduranceManeuverHandler,
  ],
})
export class ManeuversModule {}
