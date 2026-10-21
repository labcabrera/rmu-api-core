import { describe, expect, it } from '@jest/globals';
import { ValidationError } from 'src/modules/shared/domain/errors/errors';
import { ManeuverProfiles } from 'src/modules/skill-categories/domain/value-objects/maneuver-profile.vo';

describe('ManeuverProfiles', () => {
  it('applies the defaults when neither category nor skill define a profile', () => {
    expect(ManeuverProfiles.resolve(undefined, undefined)).toEqual({
      defaultType: 'absolute',
      resultTable: 'generic',
      movement: false,
      light: 'none',
    });
  });

  it('inherits the category profile', () => {
    const effective = ManeuverProfiles.resolve({ resultTable: 'table-a', movement: true, actionPoints: { min: 1, max: 3 } }, undefined);

    expect(effective).toEqual({
      defaultType: 'absolute',
      resultTable: 'table-a',
      movement: true,
      light: 'none',
      actionPoints: { min: 1, max: 3 },
    });
  });

  it('overrides the category field by field with the skill values', () => {
    const effective = ManeuverProfiles.resolve(
      { defaultType: 'percent', resultTable: 'table-a', movement: true, light: 'helpful' },
      { movement: false, light: 'required', actionPoints: { min: 0, max: 2 } },
    );

    expect(effective).toEqual({
      defaultType: 'percent',
      resultTable: 'table-a',
      movement: false,
      light: 'required',
      actionPoints: { min: 0, max: 2 },
    });
  });

  it('ignores null and undefined skill values', () => {
    const effective = ManeuverProfiles.resolve({ light: 'helpful' }, { light: undefined, resultTable: null as unknown as string });

    expect(effective.light).toBe('helpful');
    expect(effective.resultTable).toBe('generic');
  });

  it('normalizes empty profiles to undefined', () => {
    expect(ManeuverProfiles.normalize({})).toBeUndefined();
    expect(ManeuverProfiles.normalize(null)).toBeUndefined();
    expect(ManeuverProfiles.normalize({ movement: false })).toEqual({ movement: false });
  });

  it('validates enums and action point ranges', () => {
    expect(() => ManeuverProfiles.validate({ defaultType: 'other' as never })).toThrow(ValidationError);
    expect(() => ManeuverProfiles.validate({ light: 'dark' as never })).toThrow(ValidationError);
    expect(() => ManeuverProfiles.validate({ actionPoints: { min: 3, max: 1 } })).toThrow(ValidationError);
    expect(() => ManeuverProfiles.validate({ actionPoints: { min: -1, max: 1 } })).toThrow(ValidationError);
    expect(() => ManeuverProfiles.validate({ actionPoints: { min: 1, max: 1 }, light: 'helpful' })).not.toThrow();
  });
});
