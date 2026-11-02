import { ValidationError } from '../../../shared/domain/errors/errors.js';

export const MANEUVER_TYPES = ['absolute', 'percent'] as const;
export type ManeuverType = (typeof MANEUVER_TYPES)[number];

export const MANEUVER_LIGHT_USAGES = ['none', 'helpful', 'required', 'hiding'] as const;
export type ManeuverLightUsage = (typeof MANEUVER_LIGHT_USAGES)[number];

/**
 * How the maneuver result is read: `standard` with the absolute `resultTable` or the percent table; `morale` with the
 * morale and rally tables of /v1/psychology-tables (Leadership); `price` as an opposed percent maneuver whose result is
 * a price, with no criticals (Trading haggling).
 */
export const MANEUVER_RESULT_KINDS = ['standard', 'morale', 'price'] as const;
export type ManeuverResultKind = (typeof MANEUVER_RESULT_KINDS)[number];

export interface ManeuverActionPoints {
  min: number;
  max: number;
}

/**
 * Maneuver profile as stored on a skill category or a skill. Every field is optional: a skill only
 * stores the fields that override its category.
 */
export interface ManeuverProfile {
  defaultType?: ManeuverType;
  resultTable?: string;
  resultKind?: ManeuverResultKind;
  movement?: boolean;
  light?: ManeuverLightUsage;
  actionPoints?: ManeuverActionPoints;
}

/** Profile after merging category and skill values and applying the defaults. */
export interface EffectiveManeuverProfile {
  defaultType: ManeuverType;
  resultTable: string;
  resultKind: ManeuverResultKind;
  movement: boolean;
  light: ManeuverLightUsage;
  actionPoints?: ManeuverActionPoints;
}

export const DEFAULT_MANEUVER_PROFILE: EffectiveManeuverProfile = {
  defaultType: 'absolute',
  resultTable: 'generic',
  resultKind: 'standard',
  movement: false,
  light: 'none',
};

export const ManeuverProfiles = {
  /** Drops undefined/null fields so that only explicit values are stored and merged. */
  normalize(profile: ManeuverProfile | null | undefined): ManeuverProfile | undefined {
    if (!profile) return undefined;
    const result: ManeuverProfile = {};
    if (profile.defaultType != null) result.defaultType = profile.defaultType;
    if (profile.resultTable != null && profile.resultTable !== '') result.resultTable = profile.resultTable;
    if (profile.resultKind != null) result.resultKind = profile.resultKind;
    if (profile.movement != null) result.movement = profile.movement;
    if (profile.light != null) result.light = profile.light;
    if (profile.actionPoints != null) result.actionPoints = { min: profile.actionPoints.min, max: profile.actionPoints.max };
    return Object.keys(result).length > 0 ? result : undefined;
  },

  validate(profile: ManeuverProfile | null | undefined): void {
    if (!profile) return;
    if (profile.defaultType != null && !MANEUVER_TYPES.includes(profile.defaultType)) {
      throw new ValidationError(`Invalid maneuver type ${String(profile.defaultType)}`);
    }
    if (profile.resultKind != null && !MANEUVER_RESULT_KINDS.includes(profile.resultKind)) {
      throw new ValidationError(`Invalid maneuver result kind ${String(profile.resultKind)}`);
    }
    if (profile.light != null && !MANEUVER_LIGHT_USAGES.includes(profile.light)) {
      throw new ValidationError(`Invalid maneuver light usage ${String(profile.light)}`);
    }
    if (profile.actionPoints != null) {
      const { min, max } = profile.actionPoints;
      if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || max < min) {
        throw new ValidationError('Maneuver action points must be integers with 0 <= min <= max');
      }
    }
  },

  /** Category profile, overridden field by field by the skill profile, with defaults for the rest. */
  resolve(category?: ManeuverProfile | null, skill?: ManeuverProfile | null): EffectiveManeuverProfile {
    const merged: ManeuverProfile = { ...ManeuverProfiles.normalize(category), ...ManeuverProfiles.normalize(skill) };
    const effective: EffectiveManeuverProfile = {
      defaultType: merged.defaultType ?? DEFAULT_MANEUVER_PROFILE.defaultType,
      resultTable: merged.resultTable ?? DEFAULT_MANEUVER_PROFILE.resultTable,
      resultKind: merged.resultKind ?? DEFAULT_MANEUVER_PROFILE.resultKind,
      movement: merged.movement ?? DEFAULT_MANEUVER_PROFILE.movement,
      light: merged.light ?? DEFAULT_MANEUVER_PROFILE.light,
    };
    if (merged.actionPoints) effective.actionPoints = { ...merged.actionPoints };
    return effective;
  },
};
