import { injectable, inject } from 'inversify';
import { TYPES } from '@shared/types/container';
import { CharacterSizeRepository } from '@domain/ports/CharacterSizeRepository';
import { CharacterSize, CharacterSizeCreateRequest, CharacterSizeUpdateRequest, AttackEffects } from '@domain/entities/CharacterSize';
import { NotFoundError, ConflictError } from '@shared/errors';

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

  async create(request: CharacterSizeCreateRequest): Promise<CharacterSize> {
    // Check if character size with same id already exists
    const existingCharacterSize = await this.characterSizeRepository.findById(request.id);
    if (existingCharacterSize) {
      throw new ConflictError(`Character size with id ${request.id} already exists`);
    }

    const characterSize: CharacterSize = {
      id: request.id,
      index: request.index,
      name: request.name,
      hitMultiplier: request.hitMultiplier
    };

    return await this.characterSizeRepository.create(characterSize);
  }

  async update(id: string, request: CharacterSizeUpdateRequest): Promise<CharacterSize> {
    const existingCharacterSize = await this.characterSizeRepository.findById(id);
    if (!existingCharacterSize) {
      throw new NotFoundError(`Character size with id ${id} not found`);
    }

    const updatedCharacterSize = await this.characterSizeRepository.update(id, request);
    if (!updatedCharacterSize) {
      throw new NotFoundError(`Character size with id ${id} not found`);
    }

    return updatedCharacterSize;
  }

  async deleteById(id: string): Promise<void> {
    const characterSize = await this.characterSizeRepository.findById(id);
    if (!characterSize) {
      throw new NotFoundError(`Character size with id ${id} not found`);
    }

    const deleted = await this.characterSizeRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError(`Character size with id ${id} not found`);
    }
  }

  async findAttackEffects(attackerSizeId: string, defenderSizeId: string): Promise<AttackEffects> {
    const attackEffects = await this.characterSizeRepository.calculateAttackEffects(attackerSizeId, defenderSizeId);
    if (!attackEffects) {
      throw new NotFoundError(`Could not calculate attack effects for attacker ${attackerSizeId} and defender ${defenderSizeId}`);
    }
    return attackEffects;
  }
}
