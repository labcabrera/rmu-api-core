import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { GetSkillDifficultiesHandler } from './application/cqrs/handlers/get-skill-difficulties.handler.js';
import { GetSkillDifficultyHandler } from './application/cqrs/handlers/get-skill-difficulty.handler.js';
import { SKILL_DIFFICULTY_REPOSITORY } from './application/ports/skill-difficulty-repository.port.js';
import { MongoSkillDifficultyRepository } from './infrastructure/db/mongo.skill-difficulty.repository.js';
import { SkillDifficultyModel, SkillDifficultySchema } from './infrastructure/persistence/models/skill-difficulty.model.js';
import { SkillDifficultyController } from './interfaces/http/skill-difficulty.controller.js';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: SkillDifficultyModel.name, schema: SkillDifficultySchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [SkillDifficultyController],
  providers: [
    GetSkillDifficultyHandler,
    GetSkillDifficultiesHandler,
    {
      provide: SKILL_DIFFICULTY_REPOSITORY,
      useClass: MongoSkillDifficultyRepository,
    },
  ],
})
export class SkillDifficultiesModule {}
