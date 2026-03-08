export class ActorRoundEffect {
  constructor(
    public readonly status: string,
    public value: number | undefined,
    public rounds: number | undefined,
  ) {}
}
