import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { ProfessionController } from './interfaces/http/profession.controller.js';
import { GetProfessionHandler } from './application/cqrs/handlers/get-profession.handler.js';
import { GetProfessionsHandler } from './application/cqrs/handlers/get-professions.handler.js';
import { MongoProfessionRepository } from './infrastructure/db/mongo.profession.repository.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionModel, ProfessionSchema } from './infrastructure/persistence/models/profession-model.js';
import { SharedModule } from '../shared/shared.module.js';
import { CreateProfessionHandler } from './application/cqrs/handlers/create-profession.handler.js';
import { ProfessionGuardAdapter } from './infrastructure/security/profession-guard.adapter.js';
import { DeleteProfessionHandler } from './application/cqrs/handlers/delete-profession.handler.js';
import { UpdateProfessionHandler } from './application/cqrs/handlers/update-profession.handler.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: ProfessionModel.name, schema: ProfessionSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [ProfessionController],
  providers: [
    GetProfessionHandler,
    GetProfessionsHandler,
    CreateProfessionHandler,
    UpdateProfessionHandler,
    DeleteProfessionHandler,
    {
      provide: 'ProfessionRepository',
      useClass: MongoProfessionRepository,
    },
    {
      provide: 'ProfessionGuardPort',
      useClass: ProfessionGuardAdapter,
    },
  ],
})
export class ProfessionsModule {}
