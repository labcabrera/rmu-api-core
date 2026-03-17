import { Injectable } from '@nestjs/common';
import { CharacterSizeRepository } from '../../application/ports/character-size-repository';
import { CharacterSize, CHARACTER_SIZES } from '../../../shared/domain/entities/character-size';

@Injectable()
export class InMemoryCharacterSizeRepository implements CharacterSizeRepository {
  findById(id: string): CharacterSize | null {
    const characterSize = CHARACTER_SIZES.find((cs) => cs.id === id);
    return characterSize || null;
  }

  find(): CharacterSize[] {
    return CHARACTER_SIZES;
  }
}
