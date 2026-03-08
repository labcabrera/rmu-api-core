import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SkillController } from './interfaces/http/skill.controller';
import { SharedModule } from '../shared/shared.module';
import { SkillCategoryController } from './interfaces/http/skill-categories.controller';
import { MongoSkillCategoryRepository } from './infrastructure/db/mongo.skill-category.repository';
import { MongoSkillRepository } from './infrastructure/db/mongo.skill.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillCategoryModel, SkillCategorySchema } from './infrastructure/persistence/skill-category.model';
import { SkillModel, SkillSchema } from './infrastructure/persistence/skill.model';
import { CreateSkillCategoryHandler } from './application/cqrs/handlers/create-skill-category.handler';
import { GetSkillCategoriesHandler } from './application/cqrs/handlers/get-races.query.handler';
import { GetSkillCategoryHandler } from './application/cqrs/handlers/get-skill-category.query.handler';
import { CreateSkillHandler } from './application/cqrs/handlers/create-skill.handler';
import { GetSkillHandler } from './application/cqrs/handlers/get-skill.query.handler';
import { GetSkillsHandler } from './application/cqrs/handlers/get-skills.query.handler';
import { SkillGuardAdapter } from './infrastructure/security/SkillGuardAdapter';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: SkillCategoryModel.name, schema: SkillCategorySchema }]),
    MongooseModule.forFeature([{ name: SkillModel.name, schema: SkillSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [SkillController, SkillCategoryController],
  providers: [
    CreateSkillCategoryHandler,
    GetSkillCategoryHandler,
    GetSkillCategoriesHandler,
    CreateSkillHandler,
    GetSkillHandler,
    GetSkillsHandler,
    {
      provide: 'SkillCategoryRepository',
      useClass: MongoSkillCategoryRepository,
    },
    {
      provide: 'SkillRepository',
      useClass: MongoSkillRepository,
    },
    {
      provide: 'SkillGuardPort',
      useClass: SkillGuardAdapter,
    },
  ],
  exports: ['SkillRepository', 'SkillCategoryRepository'],
})
export class SkillsModule {}
