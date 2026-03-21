import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { TraitCategory } from 'src/modules/traits/domain/value-objects/trait-category.vo';
import { TraitSpecialization } from 'src/modules/traits/domain/value-objects/trait-specialization.vo';

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
  ) {
    super(userId, roles);
  }
}
