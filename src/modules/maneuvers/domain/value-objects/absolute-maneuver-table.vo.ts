import { AbsoluteManeuverResult } from './absolute-maneuver-result.vo';

export class AbsoluteManeuverTable {
  constructor(
    public readonly name,
    public readonly table: { min: number | null; max: number | null; result: AbsoluteManeuverResult }[],
    public readonly unusualEvent: string,
  ) {}
}
