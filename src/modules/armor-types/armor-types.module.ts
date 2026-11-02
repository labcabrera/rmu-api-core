import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { InMemoryArmorTypeRepository } from './infrastructure/db/in-memory.armor-type.repository.js';
import { ArmorTypeController } from './interfaces/http/armor-type.controller.js';
import { ARMOR_TYPE_REPOSITORY } from './application/ports/armor-type-repository.port.js';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule, SharedModule],
  controllers: [ArmorTypeController],
  providers: [
    {
      provide: ARMOR_TYPE_REPOSITORY,
      useClass: InMemoryArmorTypeRepository,
    },
  ],
  exports: [ARMOR_TYPE_REPOSITORY],
})
export class ArmorTypesModule {}
