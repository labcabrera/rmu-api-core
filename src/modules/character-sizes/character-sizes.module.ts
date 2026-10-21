import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { CharacterSizeController } from './interfaces/http/character-size.controller.js';
import { InMemoryCharacterSizeRepository } from './infrastructure/db/in-memory-character-size.repository.js';
import { SharedModule } from '../shared/shared.module.js';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule, SharedModule],
  controllers: [CharacterSizeController],
  providers: [
    {
      provide: 'CharacterSizeRepository',
      useClass: InMemoryCharacterSizeRepository,
    },
  ],
  exports: ['CharacterSizeRepository'],
})
export class CharacterSizesModule {}
