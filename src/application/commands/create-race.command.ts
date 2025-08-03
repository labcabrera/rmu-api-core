import { RaceResistances, RaceStatBonus, SexBasedAttribute } from '@domain/entities/race';
import { AuthenticatedCommand } from './authenticated-command';

export interface CreateRaceCommand extends AuthenticatedCommand {
  readonly id: string;
  readonly name: string;
  readonly realm: string;
  readonly size?: string;
  readonly defaultStatBonus: RaceStatBonus;
  readonly resistances?: RaceResistances;
  readonly averageHeight?: SexBasedAttribute;
  readonly averageWeight?: SexBasedAttribute;
  readonly strideBonus?: number;
  readonly enduranceBonus?: number;
  readonly recoveryMultiplier?: number;
  readonly baseHits?: number;
  readonly bonusDevPoints?: number;
  readonly description?: string;
}
