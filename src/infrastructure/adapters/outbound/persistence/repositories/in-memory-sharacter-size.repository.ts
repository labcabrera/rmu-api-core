import { injectable } from 'inversify';
import { CharacterSizeRepository } from '@domain/ports/character-size-repository';
import { CHARACTER_SIZES, CharacterSize } from '@domain/entities/character-size';
import { Page } from '@domain/entities/page';

@injectable()
export class InMemoryCharacterSizeRepository implements CharacterSizeRepository {

  async findById(id: string): Promise<CharacterSize | null> {
    const characterSize = CHARACTER_SIZES.find(cs => cs.id === id);
    return characterSize || null;
  }

  async find(): Promise<Page<CharacterSize>> {
    return {
      content: CHARACTER_SIZES,
      pagination: {
        page: 0,
        size: CHARACTER_SIZES.length,
        totalPages: 1,
        totalElements: CHARACTER_SIZES.length,
      },
    };
  }
}
