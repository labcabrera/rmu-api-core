import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { GetPoisonTablesHandler } from './application/cqrs/handlers/get-poison-tables.handler.js';
import { POISON_TABLES_REPOSITORY } from './application/ports/poison-tables-repository.port.js';
import { MongoPoisonTablesRepository } from './infrastructure/db/mongo.poison-tables.repository.js';
import { PoisonTablesModel, PoisonTablesSchema } from './infrastructure/persistence/models/poison-tables.model.js';
import { PoisonTablesController } from './interfaces/http/poison-tables.controller.js';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: PoisonTablesModel.name, schema: PoisonTablesSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [PoisonTablesController],
  providers: [GetPoisonTablesHandler, { provide: POISON_TABLES_REPOSITORY, useClass: MongoPoisonTablesRepository }],
})
export class PoisonTablesModule {}
