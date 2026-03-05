export class AddRaceTraitCommand {
  constructor(
    public readonly raceId: string,
    public readonly traitId: string,
    public readonly modifier: string | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
