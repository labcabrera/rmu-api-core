import { TraitCategory } from 'src/modules/traits/domain/value-objects/trait-category.vo';

export class CreateTraitCommand {
  constructor(
    public readonly id: string,
    public readonly category: TraitCategory,
    public readonly isTalent: boolean,
    public readonly requiresSpecialization: boolean,
    public readonly isTierBased: boolean,
    public readonly maxTier: number | undefined,
    public readonly cost: number | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
