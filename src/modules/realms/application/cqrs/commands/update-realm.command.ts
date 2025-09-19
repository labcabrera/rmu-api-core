export class UpdateRealmCommand {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly shortDescription: string | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
