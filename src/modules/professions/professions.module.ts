import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';

import { AuthModule } from 'src/modules/auth/auth.module';
import { ProfessionController } from './intrastructure/controllers/profession.controller';
import { InMemoryProfessionRepository } from './intrastructure/persistence/in-memory-profession-repository';
import { GetProfessionQueryHandler } from './application/queries/handlers/get-profession.query.handler';
import { GetProfessionsQueryHandler } from './application/queries/handlers/get-professions.query.handler';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule],
  controllers: [ProfessionController],
  providers: [
    GetProfessionQueryHandler,
    GetProfessionsQueryHandler,
    {
      provide: 'ProfessionRepository',
      useClass: InMemoryProfessionRepository,
    },
  ],
})
export class ProfessionsModule {}
