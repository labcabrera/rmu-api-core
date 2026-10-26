import type { ManeuverEffect } from './maneuver-effect.vo.js';
import type { ResultCode } from './maneuver-result.vo.js';
import type { Translations } from './translations.vo.js';

export interface AbsoluteManeuverResult {
  result: ResultCode;
  message: string;
  messageTranslations?: Translations;
  effects?: ManeuverEffect[];
  penaltyUntilAbsoluteSuccess?: number;
  bonusUntilAbsoluteFailure?: number;
  /** Unusual event text of the table, only when the roll was an unusual event. */
  unusualEvent?: string;
  unusualEventTranslations?: Translations;
}
