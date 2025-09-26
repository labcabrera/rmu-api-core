export class AbsoluteManeuverQuery {
  constructor(
    public readonly roll: number,
    public readonly table: string | undefined,
    public readonly unusualEvent: boolean,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
