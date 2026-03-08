export class RaceTrait {
  constructor(
    public readonly id: string,
    public readonly traitId: string,
    public readonly specialization: string | undefined,
    public readonly isTalent: boolean,
    public readonly tier: number | undefined,
    public readonly description: string | undefined,
  ) {}
}
