import { CharacterSize } from '@domain/entities/character-size';
import { Page } from '@domain/entities/page';

export interface CharacterSizeRepository {
  findById(id: string): Promise<CharacterSize | null>;
  find(): Promise<Page<CharacterSize>>;
}
