import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoTraitRepository } from './infrastructure/db/mongo.trait.repository.js';
import { TraitController } from './interfaces/http/trait.controller.js';
import { CreateTraitHandler } from './application/cqrs/handlers/create-trait.handler.js';
import { DeleteTraitHandler } from './application/cqrs/handlers/delete-trait.handler.js';
import { GetTraitsHandler } from './application/cqrs/handlers/get-traits.handler.js';
import { GetTraitHandler } from './application/cqrs/handlers/get-trait.handler.js';
import { UpdateTraitHandler } from './application/cqrs/handlers/update-trait.handler.js';
import { TraitModel, TraitSchema } from './infrastructure/persistence/models/trait-model.js';
import { SharedModule } from '../shared/shared.module.js';
import { TraitGuardAdapter } from './infrastructure/security/trait-guard.adapter.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: TraitModel.name, schema: TraitSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [TraitController],
  providers: [
    GetTraitHandler,
    GetTraitsHandler,
    CreateTraitHandler,
    UpdateTraitHandler,
    DeleteTraitHandler,
    {
      provide: 'TraitRepository',
      useClass: MongoTraitRepository,
    },
    {
      provide: 'TraitGuardPort',
      useClass: TraitGuardAdapter,
    },
  ],
  exports: ['TraitRepository'],
})
export class TraitsModule {}
