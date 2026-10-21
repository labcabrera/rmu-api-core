import { RaceResistances } from '../../../domain/value-objects/race-resistances.vo.js';
import { RaceStats } from '../../../domain/value-objects/race-stats.vo.js';
import type { SexBasedAttribute } from '../../../domain/value-objects/sex-based-attribute.vo.js';
import { RaceTrait } from '../../../domain/value-objects/race-trait.vo.js';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

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
    public readonly talents: string[],
    public readonly traits: RaceTrait[],
    public readonly defaultLanguage: string | null,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
