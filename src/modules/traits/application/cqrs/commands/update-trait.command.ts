import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { TraitCategory } from '../../../domain/value-objects/trait-category.vo.js';
import type { TraitSpecialization } from '../../../domain/value-objects/trait-specialization.vo.js';

export class UpdateTraitCommand extends AuthenticatedCommand {
  public constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly category: TraitCategory | undefined,
    public readonly isTalent: boolean | undefined,
    public readonly specialization: TraitSpecialization | null | undefined,
    public readonly isTierBased: boolean | undefined,
    public readonly adquisitionCost: number | undefined,
    public readonly tierCost: number | undefined,
    public readonly maxTier: number | undefined,
    public readonly description: string | undefined,
    userId: string,
    roles: string[],
    /** The version the client read; undefined skips the concurrency check. */
    public readonly expectedVersion?: number,
  ) {
    super(userId, roles);
  }
}
