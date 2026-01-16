import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SkillController } from './interfaces/http/skill.controller';
import { SharedModule } from '../shared/shared.module';
import { SkillCategoryController } from './interfaces/http/skill-categories.controller';
import { InMemorySkillRepository } from './infrastructure/db/in-memory-skill.repository';
import { MongoSkillCategoryRepository } from './infrastructure/db/mongo.skill-category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillCategoryModel, SkillCategorySchema } from './infrastructure/persistence/skill-category.model';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: SkillCategoryModel.name, schema: SkillCategorySchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [SkillController, SkillCategoryController],
  providers: [
    {
      provide: 'SkillCategoryRepository',
      useClass: MongoSkillCategoryRepository,
    },
    {
      provide: 'SkillRepository',
      useClass: InMemorySkillRepository,
    },
  ],
  exports: ['SkillRepository', 'SkillCategoryRepository'],
})
export class SkillsModule {}
