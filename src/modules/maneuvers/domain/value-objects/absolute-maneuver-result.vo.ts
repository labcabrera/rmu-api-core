import { ResultCode } from './maneuver-result.vo';

export interface AbsoluteManeuverResult {
  result: ResultCode;
  message: string;
  penaltyUntilAbsoluteSuccess?: number;
  bonusUntilAbsoluteFailure?: number;
}
