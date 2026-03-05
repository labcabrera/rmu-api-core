export class DeleteRaceTraitCommand {
  constructor(
    public readonly raceId: string,
    public readonly traitId: string,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
