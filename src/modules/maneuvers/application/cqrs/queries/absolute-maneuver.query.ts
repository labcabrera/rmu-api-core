import { ManeuverTableType } from 'src/modules/maneuvers/domain/value-objects/maneuver-table.vo';

export class AbsoluteManeuverQuery {
  constructor(
    public readonly roll: number,
    public readonly table: ManeuverTableType | undefined,
    public readonly unusualEvent: boolean,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
