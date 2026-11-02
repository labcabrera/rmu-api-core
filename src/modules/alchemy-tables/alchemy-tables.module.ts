import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { GetAlchemyTablesHandler } from './application/cqrs/handlers/get-alchemy-tables.handler.js';
import { ALCHEMY_TABLES_REPOSITORY } from './application/ports/alchemy-tables-repository.port.js';
import { MongoAlchemyTablesRepository } from './infrastructure/db/mongo.alchemy-tables.repository.js';
import { AlchemyTablesModel, AlchemyTablesSchema } from './infrastructure/persistence/models/alchemy-tables.model.js';
import { AlchemyTablesController } from './interfaces/http/alchemy-tables.controller.js';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: AlchemyTablesModel.name, schema: AlchemyTablesSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [AlchemyTablesController],
  providers: [GetAlchemyTablesHandler, { provide: ALCHEMY_TABLES_REPOSITORY, useClass: MongoAlchemyTablesRepository }],
})
export class AlchemyTablesModule {}
