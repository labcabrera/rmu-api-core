import { CharacterSize, AttackEffects } from '@domain/entities/CharacterSize';

export interface CharacterSizeRepository {
  findById(id: string): Promise<CharacterSize | null>;
  findAll(): Promise<CharacterSize[]>;
  create(characterSize: CharacterSize): Promise<CharacterSize>;
  update(id: string, characterSize: Partial<CharacterSize>): Promise<CharacterSize | null>;
  deleteById(id: string): Promise<boolean>;
  calculateAttackEffects(attackerSizeId: string, defenderSizeId: string): Promise<AttackEffects | null>;
}
