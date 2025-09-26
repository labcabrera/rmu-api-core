import { ResultCode } from './maneuver-result.vo';

export interface EnduranceManeuverResult {
  result: ResultCode;
  message: string;
  fatigue: number;
  hitPoints: number;
  bonus: number;
}
