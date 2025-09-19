export class CreateTraitCommand {
  constructor(
    public readonly id: string,
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
