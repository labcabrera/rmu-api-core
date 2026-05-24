import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { CreateEffectTypeHandler } from './application/cqrs/handlers/create-effect-type.handler';
import { DeleteEffectTypeHandler } from './application/cqrs/handlers/delete-effect-type.handler';
import { GetEffectTypeHandler } from './application/cqrs/handlers/get-effect-type.query.handler';
import { GetEffectTypesHandler } from './application/cqrs/handlers/get-effect-types.query.handler';
import { UpdateEffectTypeHandler } from './application/cqrs/handlers/update-effect-type.handler';
import { MongoEffectTypeRepository } from './infrastructure/db/mongo.effect-type.repository';
import { EffectTypeModel, EffectTypeSchema } from './infrastructure/persistence/models/effect-type.model';
import { EffectTypeGuardAdapter } from './infrastructure/security/effect-type-guard.adapter';
import { EffectTypeController } from './interfaces/http/effect-type.controller';

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
      provide: 'EffectTypeRepository',
      useClass: MongoEffectTypeRepository,
    },
    {
      provide: 'EffectTypeGuardPort',
      useClass: EffectTypeGuardAdapter,
    },
  ],
  exports: ['EffectTypeRepository'],
})
export class EffectTypesModule {}
