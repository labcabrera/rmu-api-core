import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ProfessionController } from './interfaces/http/profession.controller';
import { GetProfessionHandler } from './application/cqrs/handlers/get-profession.handler';
import { GetProfessionsHandler } from './application/cqrs/handlers/get-professions.handler';
import { MongoProfessionRepository } from './intrastructure/db/mongo.profession.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionModel, ProfessionSchema } from './intrastructure/persistence/models/profession-model';
import { SharedModule } from '../shared/shared.module';
import { CreateProfessionHandler } from './application/cqrs/handlers/create-profession.handler';
import { ProfessionGuardAdapter } from './intrastructure/security/profession-guar.addapter';

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
