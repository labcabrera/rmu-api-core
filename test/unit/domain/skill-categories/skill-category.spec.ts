import { describe, expect, it } from '@jest/globals';
import { SkillCategory } from 'src/modules/skill-categories/domain/entities/skill-category';

describe('SkillCategory', () => {
  it('keeps identifier, bonuses and optional realm bonus', () => {
    const category = new SkillCategory('influence', ['presence', 'empathy'], 5);

    expect(category.id).toBe('influence');
    expect(category.bonus).toEqual(['presence', 'empathy']);
    expect(category.realmBonus).toBe(5);
  });

  it('defaults realm bonus to null', () => {
    const category = new SkillCategory('athletic-brawn', ['strength']);

    expect(category.realmBonus).toBeNull();
  });
});
