import { RaceResistances } from 'src/modules/races/domain/value-objects/race-resistances.vo';
import { RaceStats } from 'src/modules/races/domain/value-objects/race-stats.vo';
import { SexBasedAttribute } from 'src/modules/races/domain/value-objects/sex-based-attribute.vo';
import { RaceTrait } from 'src/modules/races/domain/value-objects/race-trait.vo';
import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class CreateRaceCommand extends AuthenticatedCommand {
  constructor(
    public readonly name: string,
    public readonly archetype: string,
    public readonly realmId: string,
    public readonly sizeId: string,
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
    public readonly defaultLanguageId: string | null,
    public readonly talents: string[],
    public readonly traits: RaceTrait[],
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
