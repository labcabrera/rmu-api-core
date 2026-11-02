import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { CreateEffectTypeHandler } from './application/cqrs/handlers/create-effect-type.handler.js';
import { DeleteEffectTypeHandler } from './application/cqrs/handlers/delete-effect-type.handler.js';
import { GetEffectTypeHandler } from './application/cqrs/handlers/get-effect-type.handler.js';
import { GetEffectTypesHandler } from './application/cqrs/handlers/get-effect-types.handler.js';
import { UpdateEffectTypeHandler } from './application/cqrs/handlers/update-effect-type.handler.js';
import { MongoEffectTypeRepository } from './infrastructure/db/mongo.effect-type.repository.js';
import { EffectTypeModel, EffectTypeSchema } from './infrastructure/persistence/models/effect-type.model.js';
import { EffectTypeGuardAdapter } from './infrastructure/security/effect-type-guard.adapter.js';
import { EffectTypeController } from './interfaces/http/effect-type.controller.js';
import { EFFECT_TYPE_GUARD } from './application/ports/effect-type-guard.port.js';
import { EFFECT_TYPE_REPOSITORY } from './application/ports/effect-type-repository.port.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: EffectTypeModel.name, schema: EffectTypeSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [EffectTypeController],
  providers: [
    CreateEffectTypeHandler,
    GetEffectTypeHandler,
    GetEffectTypesHandler,
    UpdateEffectTypeHandler,
    DeleteEffectTypeHandler,
    {
      provide: EFFECT_TYPE_REPOSITORY,
      useClass: MongoEffectTypeRepository,
    },
    {
      provide: EFFECT_TYPE_GUARD,
      useClass: EffectTypeGuardAdapter,
    },
  ],
  exports: [EFFECT_TYPE_REPOSITORY],
})
export class EffectTypesModule {}
