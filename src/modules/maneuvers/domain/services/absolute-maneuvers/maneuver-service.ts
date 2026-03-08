import { AbsoluteManeuverResult } from '../../value-objects/absolute-maneuver-result.vo';

export interface ManeuverService {
  execute(roll: number, unusualEvent: boolean): AbsoluteManeuverResult;
}
