import { TraitCategory } from 'src/modules/traits/domain/value-objects/trait-category.vo';

export class UpdateTraitCommand {
  constructor(
    public readonly id: string,
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
}
