export class AddRaceTraitCommand {
  constructor(
    public readonly raceId: string,
    public readonly traitId: string,
    public readonly specialization: string | undefined,
    public readonly isTalent: boolean,
    public readonly tier: number | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
