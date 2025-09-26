import { ResultCode } from './maneuver-result.vo';

export interface EnduranceResult {
  result: ResultCode;
  message: string;
  fatigue: number;
  hitPoints: number;
  bonus: number;
}
