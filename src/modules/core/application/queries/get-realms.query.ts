export class GetRealmsQuery {
  constructor(
    public readonly userId: string,
    public readonly rsql: string | undefined,
    public readonly page: number,
    public readonly size: number,
  ) {}
}
