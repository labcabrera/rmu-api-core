import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { TraitCategory } from '../../../domain/value-objects/trait-category.vo.js';
import type { TraitDetails } from '../../../domain/value-objects/trait-details.vo.js';
import type { TraitSpecialization } from '../../../domain/value-objects/trait-specialization.vo.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export class CreateTraitCommand extends AuthenticatedCommand {
  public constructor(
    public readonly name: string,
    public readonly category: TraitCategory,
    public readonly isTalent: boolean,
    public readonly specialization: TraitSpecialization | null,
    public readonly isTierBased: boolean,
    public readonly maxTier: number | undefined,
    public readonly adquisitionCost: number,
    public readonly tierCost: number | undefined,
    public readonly description: string | undefined,
    userId: string,
    roles: string[],
    public readonly details: TraitDetails = {},
    /** Spec 063: only an admin asks for `system`; undefined is `user` on create and no change on update. */
    public readonly entitySource?: EntitySource,
  ) {
    super(userId, roles);
  }
}
