import { injectable, inject } from 'inversify';
import { TYPES } from '@shared/types/container';
import { CharacterSizeRepository } from '@domain/ports/character-size-repository';
import { CharacterSize } from '@domain/entities/character-size';
import { NotFoundError } from '@shared/errors';

@injectable()
export class CharacterSizeService {
  constructor(
    @inject(TYPES.CharacterSizeRepository) private characterSizeRepository: CharacterSizeRepository
  ) {}

  async findById(id: string): Promise<CharacterSize> {
    const characterSize = await this.characterSizeRepository.findById(id);
    if (!characterSize) {
      throw new NotFoundError(`Character size with id ${id} not found`);
    }
    return characterSize;
  }

  async findAll(): Promise<CharacterSize[]> {
    return await this.characterSizeRepository.findAll();
  }
}
