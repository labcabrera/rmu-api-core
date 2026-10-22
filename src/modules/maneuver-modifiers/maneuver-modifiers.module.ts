import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { SkillsModule } from '../skills/skills.module.js';
import { CreateManeuverModifierHandler } from './application/cqrs/handlers/create-maneuver-modifier.handler.js';
import { DeleteManeuverModifierHandler } from './application/cqrs/handlers/delete-maneuver-modifier.handler.js';
import { FindApplicableManeuverModifiersHandler } from './application/cqrs/handlers/find-applicable-maneuver-modifiers.handler.js';
import { GetManeuverModifierHandler } from './application/cqrs/handlers/get-maneuver-modifier.handler.js';
import { GetManeuverModifiersHandler } from './application/cqrs/handlers/get-maneuver-modifiers.handler.js';
import { UpdateManeuverModifierHandler } from './application/cqrs/handlers/update-maneuver-modifier.handler.js';
import { MongoManeuverModifierRepository } from './infrastructure/db/mongo.maneuver-modifier.repository.js';
import { ManeuverModifierModel, ManeuverModifierSchema } from './infrastructure/persistence/models/maneuver-modifier.model.js';
import { ManeuverModifierGuardAdapter } from './infrastructure/security/maneuver-modifier-guard.adapter.js';
import { ManeuverModifierController } from './interfaces/http/maneuver-modifier.controller.js';
import { MANEUVER_MODIFIER_GUARD } from './application/ports/maneuver-modifier-guard.port.js';
import { MANEUVER_MODIFIER_REPOSITORY } from './application/ports/maneuver-modifier-repository.port.js';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: ManeuverModifierModel.name, schema: ManeuverModifierSchema }]),
    AuthModule,
    SharedModule,
    SkillsModule,
  ],
  controllers: [ManeuverModifierController],
  providers: [
    GetManeuverModifierHandler,
    GetManeuverModifiersHandler,
    FindApplicableManeuverModifiersHandler,
    CreateManeuverModifierHandler,
    UpdateManeuverModifierHandler,
    DeleteManeuverModifierHandler,
    { provide: MANEUVER_MODIFIER_REPOSITORY, useClass: MongoManeuverModifierRepository },
    { provide: MANEUVER_MODIFIER_GUARD, useClass: ManeuverModifierGuardAdapter },
  ],
})
export class ManeuverModifiersModule {}
