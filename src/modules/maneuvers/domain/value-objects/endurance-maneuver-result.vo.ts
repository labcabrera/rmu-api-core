import type { ResultCode } from './maneuver-result.vo.js';
import type { Translations } from './translations.vo.js';

export interface EnduranceManeuverResult {
  result: ResultCode;
  message: string;
  messageTranslations?: Translations;
  fatigue: number;
  hitPoints: number;
  bonus: number;
}
