import { RaceResistances } from '../../domain/value-objects/race-resistances.vo';
import { RaceStats } from '../../domain/value-objects/race-stats.vo';
import { SexBasedAttribute } from '../../domain/value-objects/sex-based-attribute.vo';

export class UpdateRaceCommand {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly realmId: string | undefined,
    public readonly size: string | undefined,
    public readonly stats: RaceStats | undefined,
    public readonly resistances: RaceResistances | undefined,
    public readonly averageHeight: SexBasedAttribute | undefined,
    public readonly averageWeight: SexBasedAttribute | undefined,
    public readonly strideBonus: number | undefined,
    public readonly enduranceBonus: number | undefined,
    public readonly recoveryMultiplier: number | undefined,
    public readonly baseHits: number | undefined,
    public readonly bonusDevPoints: number | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[] | undefined,
  ) {}
}
