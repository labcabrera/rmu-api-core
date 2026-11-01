export class GetAlchemyTablesQuery {
  constructor(
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
