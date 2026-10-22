import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { CharacterSizeController } from './interfaces/http/character-size.controller.js';
import { InMemoryCharacterSizeRepository } from './infrastructure/db/in-memory.character-size.repository.js';
import { SharedModule } from '../shared/shared.module.js';
import { CHARACTER_SIZE_REPOSITORY } from './application/ports/character-size-repository.port.js';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule, SharedModule],
  controllers: [CharacterSizeController],
  providers: [
    {
      provide: CHARACTER_SIZE_REPOSITORY,
      useClass: InMemoryCharacterSizeRepository,
    },
  ],
  exports: [CHARACTER_SIZE_REPOSITORY],
})
export class CharacterSizesModule {}
