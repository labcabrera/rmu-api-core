import { TraitProps } from 'src/modules/traits/domain/aggregates/trait';
import { TraitCategory } from 'src/modules/traits/domain/value-objects/trait-category.vo';
import { TraitSpecialization } from 'src/modules/traits/domain/value-objects/trait-specialization.vo';

export class CreateTraitCommand {
  private constructor(
    public readonly name: string,
    public readonly category: TraitCategory,
    public readonly isTalent: boolean,
    public readonly specialization: TraitSpecialization,
    public readonly isTierBased: boolean,
    public readonly maxTier: number | undefined,
    public readonly adquisitionCost: number,
    public readonly tierCost: number | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}

  static create(props: Omit<TraitProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>, userId: string, roles: string[]): CreateTraitCommand {
    return new CreateTraitCommand(
      props.name,
      props.category,
      props.isTalent,
      props.specialization,
      props.isTierBased,
      props.maxTier,
      props.adquisitionCost,
      props.tierCost,
      props.description,
      userId,
      roles,
    );
  }
}
