import type { ResultCode } from './maneuver-result.vo.js';

export interface EnduranceManeuverResult {
  result: ResultCode;
  message: string;
  fatigue: number;
  hitPoints: number;
  bonus: number;
}
