import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
// import { MongooseModule } from '@nestjs/mongoose';
import { SkillController } from './interfaces/http/skill.controller';
import { CoreModule } from '../shared/core.module';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    // MongooseModule.forFeature([{ name: RealmModel.name, schema: RealmSchema }]),
    AuthModule,
    CoreModule,
  ],
  controllers: [SkillController],
  providers: [
    // GetSkillHandler,
    // GetSkillsHandler,
    // CreateSkillHandler,
    // UpdateSkillHandler,
    // DeleteSkillHandler,
    // {
    //   provide: 'SkillRepository',
    //   useClass: MongoSkillRepository,
    // },
    // {
    //   provide: 'SkillEventProducer',
    //   useClass: KafkaSkillProducerService,
    // },
  ],
  exports: ['SkillRepository'],
})
export class SkillsModule {}
