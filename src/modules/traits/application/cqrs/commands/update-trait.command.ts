import { TraitProps } from 'src/modules/traits/domain/aggregates/trait';
import { TraitCategory } from 'src/modules/traits/domain/value-objects/trait-category.vo';

export class UpdateTraitCommand {
  private constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly category: TraitCategory | undefined,
    public readonly isTalent: boolean | undefined,
    public readonly requiresSpecialization: boolean | undefined,
    public readonly isTierBased: boolean | undefined,
    public readonly adquisitionCost: number | undefined,
    public readonly tierCost: number | undefined,
    public readonly maxTier: number | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}

  static create(id: string, props: Partial<Omit<TraitProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>, userId: string, roles: string[]) {
    return new UpdateTraitCommand(
      id,
      props.name,
      props.category,
      props.isTalent,
      props.requiresSpecialization,
      props.isTierBased,
      props.adquisitionCost,
      props.tierCost,
      props.maxTier,
      props.description,
      userId,
      roles,
    );
  }
}
