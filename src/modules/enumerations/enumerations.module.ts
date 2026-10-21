import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { EnumerationController } from './interfaces/http/enumeration.controller.js';
import { SharedModule } from '../shared/shared.module.js';
import { MongoEnumerationRepository } from './infrastructure/db/mongo.enumeration.repository.js';
import { MongooseModule } from '@nestjs/mongoose';
import { GetEnumerationHandler } from './application/cqrs/handlers/get-enumeration.query.handler.js';
import { EnumerationGuardAdapter } from './infrastructure/security/enumeration-guard.adapter.js';
import { EnumerationModel, EnumerationSchema } from './infrastructure/persistence/models/enumeration.model.js';
import { CreateEnumerationHandler } from './application/cqrs/handlers/create-enumeration.handler.js';
import { UpdateEnumerationHandler } from './application/cqrs/handlers/update-enumeration.handler.js';
import { GetEnumerationsHandler } from './application/cqrs/handlers/get-enumerations.query.handler.js';
import { DeleteEnumerationHandler } from './application/cqrs/handlers/delete-enumeration.handler.js';
import { EnumerationCategoryController } from './interfaces/http/enumeration-category.controller.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: EnumerationModel.name, schema: EnumerationSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [EnumerationController, EnumerationCategoryController],
  providers: [
    CreateEnumerationHandler,
    GetEnumerationHandler,
    GetEnumerationsHandler,
    UpdateEnumerationHandler,
    DeleteEnumerationHandler,
    {
      provide: 'EnumerationRepository',
      useClass: MongoEnumerationRepository,
    },
    {
      provide: 'EnumerationGuardPort',
      useClass: EnumerationGuardAdapter,
    },
  ],
  exports: ['EnumerationRepository'],
})
export class EnumerationsModule {}
