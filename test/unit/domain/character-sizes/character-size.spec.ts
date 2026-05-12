import { describe, expect, it } from '@jest/globals';
import { CHARACTER_SIZES } from 'src/modules/shared/domain/entities/character-size';

describe('CHARACTER_SIZES', () => {
  it('defines a complete ordered catalog with unique ids and names', () => {
    expect(CHARACTER_SIZES.map(size => size.id)).toEqual([
      'minuscule',
      'diminutive',
      'tiny',
      'small',
      'medium',
      'big',
      'large',
      'huge',
      'gigantic',
      'enormous',
    ]);
    expect(new Set(CHARACTER_SIZES.map(size => size.id)).size).toBe(CHARACTER_SIZES.length);
    expect(new Set(CHARACTER_SIZES.map(size => size.name)).size).toBe(CHARACTER_SIZES.length);
  });

  it('keeps hit multipliers increasing from smallest to largest size', () => {
    const multipliers = CHARACTER_SIZES.map(size => size.hitMultiplier);

    for (let index = 1; index < multipliers.length; index += 1) {
      expect(multipliers[index]).toBeGreaterThan(multipliers[index - 1]);
    }
  });
});
