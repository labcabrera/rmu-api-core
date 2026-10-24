import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { GetPsychologyTablesHandler } from './application/cqrs/handlers/get-psychology-tables.handler.js';
import { PSYCHOLOGY_TABLES_REPOSITORY } from './application/ports/psychology-tables-repository.port.js';
import { MongoPsychologyTablesRepository } from './infrastructure/db/mongo.psychology-tables.repository.js';
import { PsychologyTablesModel, PsychologyTablesSchema } from './infrastructure/persistence/models/psychology-tables.model.js';
import { PsychologyTablesController } from './interfaces/http/psychology-tables.controller.js';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: PsychologyTablesModel.name, schema: PsychologyTablesSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [PsychologyTablesController],
  providers: [
    GetPsychologyTablesHandler,
    {
      provide: PSYCHOLOGY_TABLES_REPOSITORY,
      useClass: MongoPsychologyTablesRepository,
    },
  ],
})
export class PsychologyTablesModule {}
