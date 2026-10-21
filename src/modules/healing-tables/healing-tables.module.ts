import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { GetHealingTablesHandler } from './application/cqrs/handlers/get-healing-tables.handler.js';
import { MongoHealingTablesRepository } from './infrastructure/db/mongo.healing-tables.repository.js';
import { HealingTablesModel, HealingTablesSchema } from './infrastructure/persistence/models/healing-tables.model.js';
import { HealingTablesController } from './interfaces/http/healing-tables.controller.js';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: HealingTablesModel.name, schema: HealingTablesSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [HealingTablesController],
  providers: [
    GetHealingTablesHandler,
    {
      provide: 'HealingTablesRepository',
      useClass: MongoHealingTablesRepository,
    },
  ],
})
export class HealingTablesModule {}
