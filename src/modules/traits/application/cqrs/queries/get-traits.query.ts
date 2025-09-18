export class GetTraitsQuery {
  constructor(
    public readonly rsql: string | undefined,
    public readonly page: number,
    public readonly size: number,
    public readonly userId: string,
  ) {}
}
