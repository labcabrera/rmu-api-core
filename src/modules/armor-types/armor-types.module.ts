import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { InMemoryArmorTypeRepository } from './infrastructure/db/in-memory-armor-type.repository.js';
import { ArmorTypeController } from './interfaces/http/armor-type.controller.js';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule, SharedModule],
  controllers: [ArmorTypeController],
  providers: [
    {
      provide: 'ArmorTypeRepository',
      useClass: InMemoryArmorTypeRepository,
    },
  ],
  exports: ['ArmorTypeRepository'],
})
export class ArmorTypesModule {}
