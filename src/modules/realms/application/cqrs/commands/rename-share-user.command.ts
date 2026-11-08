/** A user changed their name: the shares of realms that keep a copy of it follow. */
export class RenameShareUserCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
  ) {}
}
