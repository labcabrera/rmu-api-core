import { RaceResistances } from '../../domain/value-objects/race-resistances.vo';
import { SexBasedAttribute } from '../../domain/value-objects/sex-based-attribute.vo';
import { RaceStats } from '../../infrastructure/persistence/models/race-model-childs';

export class CreateRaceCommand {
  constructor(
    public readonly name: string,
    public readonly realmId: string,
    public readonly size: string,
    public readonly stats: RaceStats,
    public readonly resistances: RaceResistances,
    public readonly averageHeight: SexBasedAttribute,
    public readonly averageWeight: SexBasedAttribute,
    public readonly strideBonus: number,
    public readonly enduranceBonus: number,
    public readonly recoveryMultiplier: number,
    public readonly baseHits: number,
    public readonly baseDevPoints: number,
    public readonly baseAt: number,
    public readonly defaultLanguage: string | undefined,
    public readonly talents: string[],
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles?: string[],
  ) {}
}
