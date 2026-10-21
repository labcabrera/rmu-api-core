import type { ManeuverEffect } from './maneuver-effect.vo.js';
import type { ResultCode } from './maneuver-result.vo.js';

export interface AbsoluteManeuverResult {
  result: ResultCode;
  message: string;
  effects?: ManeuverEffect[];
  penaltyUntilAbsoluteSuccess?: number;
  bonusUntilAbsoluteFailure?: number;
  /** Unusual event text of the table, only when the roll was an unusual event. */
  unusualEvent?: string;
}
