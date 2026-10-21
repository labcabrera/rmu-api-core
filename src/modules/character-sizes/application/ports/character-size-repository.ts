import type { CharacterSize } from '../../../shared/domain/entities/character-size.js';

export interface CharacterSizeRepository {
  findById(id: string): CharacterSize | null;
  find(): CharacterSize[];
}
