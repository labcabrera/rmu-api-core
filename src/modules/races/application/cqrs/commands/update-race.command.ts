import { RaceResistances } from 'src/modules/races/domain/value-objects/race-resistances.vo';
import { RaceStats } from 'src/modules/races/domain/value-objects/race-stats.vo';
import { SexBasedAttribute } from 'src/modules/races/domain/value-objects/sex-based-attribute.vo';

export class UpdateRaceCommand {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly archetype: string | undefined,
    public readonly sizeId: string | undefined,
    public readonly stats: RaceStats | undefined,
    public readonly resistances: RaceResistances | undefined,
    public readonly averageHeight: SexBasedAttribute | undefined,
    public readonly averageWeight: SexBasedAttribute | undefined,
    public readonly strideBonus: number | undefined,
    public readonly enduranceBonus: number | undefined,
    public readonly recoveryMultiplier: number | undefined,
    public readonly baseHits: number | undefined,
    public readonly baseDevPoints: number | undefined,
    public readonly baseAt: number | undefined,
    public readonly defaultLanguage: string | undefined,
    public readonly talents: string[] | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[] | undefined,
  ) {}
}
