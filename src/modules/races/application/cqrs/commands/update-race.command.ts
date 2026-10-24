import { RaceResistances } from '../../../domain/value-objects/race-resistances.vo.js';
import { RaceStats } from '../../../domain/value-objects/race-stats.vo.js';
import type { SexBasedAttribute } from '../../../domain/value-objects/sex-based-attribute.vo.js';
import { RaceTrait } from '../../../domain/value-objects/race-trait.vo.js';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

export class UpdateRaceCommand extends AuthenticatedCommand {
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
    public readonly talents: string[] | undefined,
    public readonly traits: RaceTrait[] | undefined,
    public readonly defaultLanguage: string | undefined,
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    userId: string,
    roles: string[],
    /** The version the client read; undefined skips the concurrency check. */
    public readonly expectedVersion?: number,
  ) {
    super(userId, roles);
  }
}
