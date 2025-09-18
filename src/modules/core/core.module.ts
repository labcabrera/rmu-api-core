import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from 'src/modules/auth/auth.module';
import { CharacterSizeController } from './interfaces/http/character-size.controller';
import { KafkaProducerService } from './infrastructure/messaging/kafka-producer.service';
import { InMemoryArmorTypeRepository } from './infrastructure/persistence/repositories/in-memory-armor-type.repository';
import { InMemoryCharacterSizeRepository } from './infrastructure/persistence/repositories/in-memory-character-size.repository';
import { InMemorySkillCategoryRepository } from './infrastructure/persistence/repositories/in-memory-skill-category.repository';
import { InMemorySkillRepository } from './infrastructure/persistence/repositories/in-memory-skill.repository';
import { ArmorTypeController } from './interfaces/http/armor-type.controller';
import { SkillCategoryController } from './interfaces/http/skill-categories.controller';
import { SkillController } from './interfaces/http/skill.controller';
import { HealthController } from './interfaces/http/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { RsqlParser } from './infrastructure/persistence/repositories/rsql-parser';

@Module({
  imports: [TerminusModule, CqrsModule, ConfigModule, AuthModule],
  controllers: [ArmorTypeController, CharacterSizeController, SkillCategoryController, SkillController, HealthController],
  providers: [
    RsqlParser,
    KafkaProducerService,
    {
      provide: 'ArmorTypeRepository',
      useClass: InMemoryArmorTypeRepository,
    },
    {
      provide: 'CharacterSizeRepository',
      useClass: InMemoryCharacterSizeRepository,
    },
    {
      provide: 'SkillCategoryRepository',
      useClass: InMemorySkillCategoryRepository,
    },
    {
      provide: 'SkillRepository',
      useClass: InMemorySkillRepository,
    },
  ],
  exports: [RsqlParser, KafkaProducerService],
})
export class CoreModule {}
