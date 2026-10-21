import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../shared/infrastructure/security/auth.module';
import { SharedModule } from '../shared/shared.module';
import { GetHealingTablesHandler } from './application/cqrs/handlers/get-healing-tables.handler';
import { MongoHealingTablesRepository } from './infrastructure/db/mongo.healing-tables.repository';
import { HealingTablesModel, HealingTablesSchema } from './infrastructure/persistence/models/healing-tables.model';
import { HealingTablesController } from './interfaces/http/healing-tables.controller';

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
