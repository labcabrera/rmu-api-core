import { CharacterSize } from 'src/modules/core/domain/entities/character-size';
import { Page } from 'src/modules/core/domain/entities/page';

export interface CharacterSizeRepository {
  findById(id: string): CharacterSize | null;
  find(): Page<CharacterSize>;
}
