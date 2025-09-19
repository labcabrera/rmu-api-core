export class CreateRealmCommand {
  constructor(
    public readonly name: string,
    public readonly shortDescription: string | undefined,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
