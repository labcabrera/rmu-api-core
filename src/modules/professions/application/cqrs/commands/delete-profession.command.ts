export class DeleteProfessionCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
