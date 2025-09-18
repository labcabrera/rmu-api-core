export class UpdateTraitCommand {
  constructor(
    public readonly id: string,
    public readonly cost: number | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
