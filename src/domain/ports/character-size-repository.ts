import { CharacterSize, AttackEffects } from '@domain/entities/character-size';

export interface CharacterSizeRepository {
  findById(id: string): Promise<CharacterSize | null>;
  findAll(): Promise<CharacterSize[]>;
  calculateAttackEffects(attackerSizeId: string, defenderSizeId: string): Promise<AttackEffects | null>;
}
