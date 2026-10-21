import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { InMemoryArmorTypeRepository } from './infrastructure/db/in-memory-armor-type.repository';
import { ArmorTypeController } from './interfaces/http/armor-type.controller';

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
