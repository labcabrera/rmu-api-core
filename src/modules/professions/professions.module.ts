import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ProfessionController } from './interfaces/http/profession.controller';
import { GetProfessionHandler } from './application/cqrs/handlers/get-profession.handler';
import { GetProfessionsHandler } from './application/cqrs/handlers/get-professions.handler';
import { MongoProfessionRepository } from './infrastructure/db/mongo.profession.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionModel, ProfessionSchema } from './infrastructure/persistence/models/profession-model';
import { SharedModule } from '../shared/shared.module';
import { CreateProfessionHandler } from './application/cqrs/handlers/create-profession.handler';
import { ProfessionGuardAdapter } from './infrastructure/security/profession-guard.adapter';
import { DeleteProfessionHandler } from './application/cqrs/handlers/delete-profession.handler';
import { UpdateProfessionHandler } from './application/cqrs/handlers/update-profession.handler';

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
