export class PercentManeuverQuery {
  constructor(
    public readonly roll: number,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
