import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { RealmsModule } from '../realms/realms.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { CultureModel, CultureSchema } from './infrastructure/persistence/models/culture.model.js';
import { CultureController } from './interfaces/http/culture.controller.js';
import { CultureGuardAdapter } from './infrastructure/security/culture-guard.adapter.js';
import { GetCultureHandler } from './application/cqrs/handlers/get-culture.handler.js';
import { GetCulturesHandler } from './application/cqrs/handlers/get-cultures.handler.js';
import { CreateCultureHandler } from './application/cqrs/handlers/create-culture.handler.js';
import { UpdateCultureHandler } from './application/cqrs/handlers/update-culture.handler.js';
import { DeleteCultureHandler } from './application/cqrs/handlers/delete-culture.handler.js';
import { MongoCultureRepository } from './infrastructure/db/mongo.culture.repository.js';
import { AddCultureSkillRankHandler } from './application/cqrs/handlers/add-culture-skill-rank.handler.js';
import { DeleteCultureSkillRankHandler } from './application/cqrs/handlers/delete-culture-skill-rank.handler.js';
import { CultureViewService } from './application/services/culture-view.service.js';
import { SkillsModule } from '../skills/skills.module.js';
import { CULTURE_GUARD } from './application/ports/culture-guard.port.js';
import { CULTURE_REPOSITORY } from './application/ports/culture-repository.port.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: CultureModel.name, schema: CultureSchema }]),
    AuthModule,
    SharedModule,
    RealmsModule,
    SkillsModule,
  ],
  controllers: [CultureController],
  providers: [
    GetCultureHandler,
    GetCulturesHandler,
    CreateCultureHandler,
    UpdateCultureHandler,
    DeleteCultureHandler,
    AddCultureSkillRankHandler,
    DeleteCultureSkillRankHandler,
    CultureViewService,
    {
      provide: CULTURE_REPOSITORY,
      useClass: MongoCultureRepository,
    },
    {
      provide: CULTURE_GUARD,
      useClass: CultureGuardAdapter,
    },
  ],
  exports: [CULTURE_REPOSITORY],
})
export class CulturesModule {}
