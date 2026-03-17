import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../auth/auth.module';
import { CharacterSizeController } from './interfaces/http/character-size.controller';
import { InMemoryCharacterSizeRepository } from './infrastructure/db/in-memory-character-size.repository';
import { SharedModule } from '../shared/shared.module';

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
