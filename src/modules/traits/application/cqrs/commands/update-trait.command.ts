import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { TraitCategory } from 'src/modules/traits/domain/value-objects/trait-category.vo';
import { TraitSpecialization } from 'src/modules/traits/domain/value-objects/trait-specialization.vo';

export class UpdateTraitCommand extends AuthenticatedCommand {
  public constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly category: TraitCategory | undefined,
    public readonly isTalent: boolean | undefined,
    public readonly specialization: TraitSpecialization | undefined,
    public readonly isTierBased: boolean | undefined,
    public readonly adquisitionCost: number | undefined,
    public readonly tierCost: number | undefined,
    public readonly maxTier: number | undefined,
    public readonly description: string | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
