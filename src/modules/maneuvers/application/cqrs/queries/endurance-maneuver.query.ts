export class EnduranceManeuverQuery {
  constructor(
    public readonly roll: number,
    public readonly unusualEvent: boolean,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
