import { injectable } from 'inversify';
import { CharacterSizeRepository } from '@domain/ports/CharacterSizeRepository';
import { CharacterSize, AttackEffects } from '@domain/entities/CharacterSize';
import { CHARACTER_SIZES } from '@shared/constants/character-sizes';

@injectable()
export class InMemoryCharacterSizeRepository implements CharacterSizeRepository {
  private characterSizes: CharacterSize[] = [...CHARACTER_SIZES];

  async findById(id: string): Promise<CharacterSize | null> {
    const characterSize = this.characterSizes.find(cs => cs.id === id);
    return characterSize || null;
  }

  async findAll(): Promise<CharacterSize[]> {
    return [...this.characterSizes];
  }

  async create(characterSize: CharacterSize): Promise<CharacterSize> {
    // Check if character size already exists
    const existingIndex = this.characterSizes.findIndex(cs => cs.id === characterSize.id);
    if (existingIndex !== -1) {
      throw new Error(`Character size with id ${characterSize.id} already exists`);
    }

    this.characterSizes.push(characterSize);
    return characterSize;
  }

  async update(id: string, characterSizeUpdate: Partial<CharacterSize>): Promise<CharacterSize | null> {
    const index = this.characterSizes.findIndex(cs => cs.id === id);
    if (index === -1) {
      return null;
    }

    this.characterSizes[index] = { ...this.characterSizes[index], ...characterSizeUpdate };
    return this.characterSizes[index];
  }

  async deleteById(id: string): Promise<boolean> {
    const index = this.characterSizes.findIndex(cs => cs.id === id);
    if (index === -1) {
      return false;
    }

    this.characterSizes.splice(index, 1);
    return true;
  }

  async calculateAttackEffects(attackerSizeId: string, defenderSizeId: string): Promise<AttackEffects | null> {
    const attacker = await this.findById(attackerSizeId);
    const defender = await this.findById(defenderSizeId);

    if (!attacker || !defender) {
      return null;
    }

    return {
      hitMultiplier: attacker.hitMultiplier,
      criticalTypeModifier: attacker.index - defender.index
    };
  }
}
