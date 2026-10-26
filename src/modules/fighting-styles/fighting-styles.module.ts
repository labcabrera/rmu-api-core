import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { GetFightingStylesHandler } from './application/cqrs/handlers/get-fighting-styles.handler.js';
import { FIGHTING_STYLES_REPOSITORY } from './application/ports/fighting-styles-repository.port.js';
import { MongoFightingStylesRepository } from './infrastructure/db/mongo.fighting-styles.repository.js';
import { FightingStylesModel, FightingStylesSchema } from './infrastructure/persistence/models/fighting-styles.model.js';
import { FightingStylesController } from './interfaces/http/fighting-styles.controller.js';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: FightingStylesModel.name, schema: FightingStylesSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [FightingStylesController],
  providers: [
    GetFightingStylesHandler,
    {
      provide: FIGHTING_STYLES_REPOSITORY,
      useClass: MongoFightingStylesRepository,
    },
  ],
})
export class FightingStylesModule {}
