import { RaceResistances, RaceStatBonus, SexBasedAttribute } from '../../domain/entities/race';

export interface UpdateRaceCommand {
  id: string;
  name?: string;
  realm?: string;
  size?: string;
  defaultStatBonus: RaceStatBonus;
  resistances?: RaceResistances;
  averageHeight?: SexBasedAttribute;
  averageWeight?: SexBasedAttribute;
  strideBonus?: number;
  enduranceBonus?: number;
  recoveryMultiplier?: number;
  baseHits?: number;
  bonusDevPoints?: number;
  description?: string;
  username: string;
}
