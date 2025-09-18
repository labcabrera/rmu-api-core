export class CreateRealmCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
