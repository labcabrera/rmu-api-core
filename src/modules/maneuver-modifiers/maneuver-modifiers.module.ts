import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../shared/infrastructure/security/auth.module';
import { SharedModule } from '../shared/shared.module';
import { SkillsModule } from '../skills/skills.module';
import { CreateManeuverModifierHandler } from './application/cqrs/handlers/create-maneuver-modifier.handler';
import { DeleteManeuverModifierHandler } from './application/cqrs/handlers/delete-maneuver-modifier.handler';
import { FindApplicableManeuverModifiersHandler } from './application/cqrs/handlers/find-applicable-maneuver-modifiers.handler';
import { GetManeuverModifierHandler } from './application/cqrs/handlers/get-maneuver-modifier.handler';
import { GetManeuverModifiersHandler } from './application/cqrs/handlers/get-maneuver-modifiers.handler';
import { UpdateManeuverModifierHandler } from './application/cqrs/handlers/update-maneuver-modifier.handler';
import { MongoManeuverModifierRepository } from './infrastructure/db/mongo.maneuver-modifier.repository';
import { ManeuverModifierModel, ManeuverModifierSchema } from './infrastructure/persistence/models/maneuver-modifier.model';
import { ManeuverModifierGuardAdapter } from './infrastructure/security/maneuver-modifier-guard.adapter';
import { ManeuverModifierController } from './interfaces/http/maneuver-modifier.controller';

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
    { provide: 'ManeuverModifierRepository', useClass: MongoManeuverModifierRepository },
    { provide: 'ManeuverModifierGuardPort', useClass: ManeuverModifierGuardAdapter },
  ],
})
export class ManeuverModifiersModule {}
