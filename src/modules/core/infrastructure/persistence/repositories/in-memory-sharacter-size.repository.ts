import { Injectable } from '@nestjs/common';
import { CharacterSizeRepository } from 'src/modules/core/application/ports/outbound/character-size-repository';
import { CharacterSize, CHARACTER_SIZES } from 'src/modules/core/domain/entities/character-size';
import { Page } from 'src/modules/core/domain/entities/page';

@Injectable()
export class InMemoryCharacterSizeRepository implements CharacterSizeRepository {
  findById(id: string): CharacterSize | null {
    const characterSize = CHARACTER_SIZES.find((cs) => cs.id === id);
    return characterSize || null;
  }

  find(): Page<CharacterSize> {
    return new Page<CharacterSize>(CHARACTER_SIZES, 0, CHARACTER_SIZES.length, CHARACTER_SIZES.length);
  }
}
