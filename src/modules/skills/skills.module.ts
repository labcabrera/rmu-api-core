import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SkillController } from './interfaces/http/skill.controller.js';
import { SharedModule } from '../shared/shared.module.js';
import { MongoSkillRepository } from './infrastructure/db/mongo.skill.repository.js';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillModel, SkillSchema } from './infrastructure/persistence/models/skill.model.js';
import { CreateSkillHandler } from './application/cqrs/handlers/create-skill.handler.js';
import { GetSkillHandler } from './application/cqrs/handlers/get-skill.query.handler.js';
import { GetSkillsHandler } from './application/cqrs/handlers/get-skills.query.handler.js';
import { SkillGuardAdapter } from './infrastructure/security/skill-guard.adapter.js';
import { SkillCategoriesModule } from '../skill-categories/skill-categories.module.js';
import { UpdateSkillHandler } from './application/cqrs/handlers/update-skill.handler.js';
import { SkillViewService } from './application/services/skill-view.service.js';
import { DeleteSkillHandler } from './application/cqrs/handlers/delete-skill.handler.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: SkillModel.name, schema: SkillSchema }]),
    AuthModule,
    SharedModule,
    SkillCategoriesModule,
  ],
  controllers: [SkillController],
  providers: [
    GetSkillHandler,
    GetSkillsHandler,
    CreateSkillHandler,
    UpdateSkillHandler,
    DeleteSkillHandler,
    SkillViewService,
    {
      provide: 'SkillRepository',
      useClass: MongoSkillRepository,
    },
    {
      provide: 'SkillGuardPort',
      useClass: SkillGuardAdapter,
    },
  ],
  exports: ['SkillRepository'],
})
export class SkillsModule {}
