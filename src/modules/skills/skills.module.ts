import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
// import { MongooseModule } from '@nestjs/mongoose';
import { SkillController } from './interfaces/http/skill.controller';
import { SharedModule } from '../shared/shared.module';
import { SkillCategoryController } from './interfaces/http/skill-categories.controller';
import { InMemorySkillCategoryRepository } from './infrastructure/db/in-memory-skill-category.repository';
import { InMemorySkillRepository } from './infrastructure/db/in-memory-skill.repository';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    // MongooseModule.forFeature([{ name: RealmModel.name, schema: RealmSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [SkillController, SkillCategoryController],
  providers: [
    {
      provide: 'SkillCategoryRepository',
      useClass: InMemorySkillCategoryRepository,
    },
    {
      provide: 'SkillRepository',
      useClass: InMemorySkillRepository,
    },
  ],
  exports: ['SkillRepository'],
})
export class SkillsModule {}
