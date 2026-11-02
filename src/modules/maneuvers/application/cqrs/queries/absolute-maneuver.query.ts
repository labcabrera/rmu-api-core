export class AbsoluteManeuverQuery {
  constructor(
    public readonly roll: number,
    /** Code table name (see ManeuverTableType) or a table stored in maneuver-tables. */
    public readonly table: string | undefined,
    public readonly unusualEvent: boolean,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
