import type { AbsoluteManeuverResult } from './absolute-maneuver-result.vo.js';
import type { Translations } from './translations.vo.js';

export class AbsoluteManeuverTable {
  constructor(
    public readonly name: string,
    public readonly table: { min: number | null; max: number | null; result: AbsoluteManeuverResult }[],
    public readonly unusualEvent: string,
    public readonly unusualEventTranslations?: Translations,
  ) {}
}
