import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { CreateSkillCategoryHandler } from './application/cqrs/handlers/create-skill-category.handler';
import { GetSkillCategoriesHandler } from './application/cqrs/handlers/get-skill-categories.handler';
import { GetSkillCategoryHandler } from './application/cqrs/handlers/get-skill-category.query.handler';
import { MongoSkillCategoryRepository } from './infrastructure/db/mongo.skill-category.repository';
import { SkillCategoryModel, SkillCategorySchema } from './infrastructure/persistence/models/skill-category.model';
import { SkillCategoryController } from './interfaces/http/skill-categories.controller';

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
      provide: 'SkillCategoryRepository',
      useClass: MongoSkillCategoryRepository,
    },
  ],
  exports: ['SkillCategoryRepository'],
})
export class SkillCategoriesModule {}
