import { CharacterSize } from '../../../shared/domain/entities/character-size';

export interface CharacterSizeRepository {
  findById(id: string): CharacterSize | null;
  find(): CharacterSize[];
}
