import { injectable } from 'inversify';
import { CharacterSizeRepository } from '@domain/ports/character-size-repository';
import { CharacterSize } from '@domain/entities/character-size';
import { CHARACTER_SIZES } from '@shared/constants/character-sizes';
import { Page } from '@domain/entities/page';

@injectable()
export class InMemoryCharacterSizeRepository implements CharacterSizeRepository {
  private characterSizes: CharacterSize[] = [...CHARACTER_SIZES];

  async findById(id: string): Promise<CharacterSize | null> {
    const characterSize = this.characterSizes.find(cs => cs.id === id);
    return characterSize || null;
  }

  async find(): Promise<Page<CharacterSize>> {
    return {
      content: [...this.characterSizes],
      pagination: {
        page: 0,
        size: this.characterSizes.length,
        totalPages: 1,
        totalElements: this.characterSizes.length
      }
    };
  }
}

