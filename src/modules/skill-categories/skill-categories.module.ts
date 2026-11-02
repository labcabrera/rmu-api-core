import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { CreateSkillCategoryHandler } from './application/cqrs/handlers/create-skill-category.handler.js';
import { GetSkillCategoriesHandler } from './application/cqrs/handlers/get-skill-categories.handler.js';
import { GetSkillCategoryHandler } from './application/cqrs/handlers/get-skill-category.handler.js';
import { MongoSkillCategoryRepository } from './infrastructure/db/mongo.skill-category.repository.js';
import { SkillCategoryModel, SkillCategorySchema } from './infrastructure/persistence/models/skill-category.model.js';
import { SkillCategoryController } from './interfaces/http/skill-categories.controller.js';
import { SKILL_CATEGORY_REPOSITORY } from './application/ports/skill-category-repository.port.js';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: SkillCategoryModel.name, schema: SkillCategorySchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [SkillCategoryController],
  providers: [
    CreateSkillCategoryHandler,
    GetSkillCategoryHandler,
    GetSkillCategoriesHandler,
    {
      provide: SKILL_CATEGORY_REPOSITORY,
      useClass: MongoSkillCategoryRepository,
    },
  ],
  exports: [SKILL_CATEGORY_REPOSITORY],
})
export class SkillCategoriesModule {}
