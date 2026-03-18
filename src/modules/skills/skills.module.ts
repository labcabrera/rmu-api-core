import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SkillController } from './interfaces/http/skill.controller';
import { SharedModule } from '../shared/shared.module';
import { MongoSkillRepository } from './infrastructure/db/mongo.skill.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillModel, SkillSchema } from './infrastructure/persistence/models/skill.model';
import { CreateSkillHandler } from './application/cqrs/handlers/create-skill.handler';
import { GetSkillHandler } from './application/cqrs/handlers/get-skill.query.handler';
import { GetSkillsHandler } from './application/cqrs/handlers/get-skills.query.handler';
import { SkillGuardAdapter } from './infrastructure/security/skill-guard.adapter';
import { SkillCategoriesModule } from '../skill-categories/skill-categories.module';
import { UpdateSkillHandler } from './application/cqrs/handlers/update-skill.handler';
import { DeleteSkillHandler } from './application/cqrs/handlers/delete-skill.handler';

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
