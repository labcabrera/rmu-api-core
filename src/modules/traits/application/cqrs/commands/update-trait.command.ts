export class UpdateTraitCommand {
  constructor(
    public readonly id: string,
    public readonly isTalent: boolean | undefined,
    public readonly requiresSpecialization: boolean | undefined,
    public readonly isTierBased: boolean | undefined,
    public readonly maxTier: number | undefined,
    public readonly cost: number | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
