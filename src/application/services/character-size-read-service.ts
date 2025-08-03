import { injectable, inject } from 'inversify';
import { CharacterSizeRepository } from '@domain/ports/character-size-repository';
import { CharacterSize } from '@domain/entities/character-size';
import { NotFoundError } from '@domain/errors/errors';
import { Page } from '@domain/entities/page';

@injectable()
export class CharacterSizeService {
  constructor(
    @inject('CharacterSizeRepository') private characterSizeRepository: CharacterSizeRepository
  ) {}

  async findById(id: string): Promise<CharacterSize> {
    const characterSize = await this.characterSizeRepository.findById(id);
    if (!characterSize) {
      throw new NotFoundError('Character Size', id);
    }
    return characterSize;
  }

  async find(): Promise<Page<CharacterSize>> {
    return await this.characterSizeRepository.find();
  }
}
