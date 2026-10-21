import { ManeuverEffect } from './maneuver-effect.vo';
import { ResultCode } from './maneuver-result.vo';

export interface AbsoluteManeuverResult {
  result: ResultCode;
  message: string;
  effects?: ManeuverEffect[];
  penaltyUntilAbsoluteSuccess?: number;
  bonusUntilAbsoluteFailure?: number;
  /** Unusual event text of the table, only when the roll was an unusual event. */
  unusualEvent?: string;
}
