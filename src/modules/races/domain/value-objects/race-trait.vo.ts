export class RaceTrait {
  constructor(
    public readonly id: string,
    public readonly traitId: string,
    public readonly modifier: string | undefined,
    public readonly description: string | undefined,
  ) {}
}
