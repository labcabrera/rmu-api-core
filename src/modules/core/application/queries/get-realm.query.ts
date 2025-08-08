export class GetRealmQuery {
  constructor(
    public readonly userId: string,
    public readonly id: string,
  ) {}
}
