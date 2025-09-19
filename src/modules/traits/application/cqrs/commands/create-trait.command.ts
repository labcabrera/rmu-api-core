import { TraitProps } from 'src/modules/traits/domain/aggregates/trait';
import { TraitCategory } from 'src/modules/traits/domain/value-objects/trait-category.vo';

export class CreateTraitCommand {
  private constructor(
    public readonly name: string,
    public readonly category: TraitCategory,
    public readonly isTalent: boolean,
    public readonly requiresSpecialization: boolean,
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
      props.requiresSpecialization,
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
