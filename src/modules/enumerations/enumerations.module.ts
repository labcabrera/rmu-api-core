import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EnumerationController } from './interfaces/http/enumeration.controller';
import { SharedModule } from '../shared/shared.module';
import { MongoEnumerationRepository } from './infrastructure/db/mongo.enumeration.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { GetEnumerationHandler } from './application/cqrs/handlers/get-enumeration.query.handler';
import { EnumerationGuardAdapter } from './infrastructure/security/enumeration-guard.adapter';
import { EnumerationModel, EnumerationSchema } from './infrastructure/persistence/models/enumeration.model';
import { CreateEnumerationHandler } from './application/cqrs/handlers/create-enumeration.handler';
import { UpdateEnumerationHandler } from './application/cqrs/handlers/update-enumeration.handler';
import { GetEnumerationsHandler } from './application/cqrs/handlers/get-enumerations.query.handler';
import { DeleteEnumerationHandler } from './application/cqrs/handlers/delete-enumeration.handler';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: EnumerationModel.name, schema: EnumerationSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [EnumerationController],
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
