export class GetProfessionsQuery {
  constructor(
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
