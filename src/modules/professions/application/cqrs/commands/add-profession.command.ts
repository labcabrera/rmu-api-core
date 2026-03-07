export class AddProfessionCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
