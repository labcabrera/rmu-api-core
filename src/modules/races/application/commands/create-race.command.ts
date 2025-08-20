import { RaceStatBonus, RaceResistances, SexBasedAttribute } from 'src/modules/races/domain/entities/race';

export class CreateRaceCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly realm: string,
    public readonly size: string,
    public readonly defaultStatBonus: RaceStatBonus,
    public readonly resistances: RaceResistances,
    public readonly averageHeight: SexBasedAttribute,
    public readonly averageWeight: SexBasedAttribute,
    public readonly strideBonus: number,
    public readonly enduranceBonus: number,
    public readonly recoveryMultiplier: number,
    public readonly baseHits: number,
    public readonly bonusDevPoints: number,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles?: string[],
  ) {}
}
