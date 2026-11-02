import { describe, expect, it } from 'vitest';
import {
  CULTURE_DEVELOPMENT_COST_BY_CATEGORY,
  DEFAULT_CULTURE_DEVELOPMENT_COST,
  cultureCategoryCost,
  cultureDevelopmentCost,
} from '../../../../src/modules/cultures/domain/services/culture-development-cost.js';
import { CultureSkillRank } from '../../../../src/modules/cultures/domain/value-objects/culture-skill-rank.js';

// Invented skills, mapped to categories of the cost table.
const skillCategories: Record<string, string> = {
  'skill-lore': 'lore',
  'skill-awareness': 'awareness',
  'skill-combat': 'combat-training',
  'skill-brawn': 'brawn',
  'skill-exotic': 'not-in-table',
};
const resolve = (skillId: string) => skillCategories[skillId];

describe('cultureDevelopmentCost', () => {
  it('uses the table and defaults unknown categories', () => {
    expect(cultureCategoryCost('lore')).toBe(CULTURE_DEVELOPMENT_COST_BY_CATEGORY.lore);
    expect(cultureCategoryCost('combat-training')).toBe(4);
    expect(cultureCategoryCost('not-in-table')).toBe(DEFAULT_CULTURE_DEVELOPMENT_COST);
    expect(cultureCategoryCost(undefined)).toBe(3);
  });

  it('costs each entry type as ranks × cost per rank', () => {
    const entries = [
      CultureSkillRank.create({ type: 'skill', skillId: 'skill-awareness', ranks: 2 }), // 2 × 2
      CultureSkillRank.create({ type: 'skill-choice', skillIds: ['skill-brawn', 'skill-combat'], ranks: 1 }), // 1 × max(3, 4)
      CultureSkillRank.create({ type: 'category-pool', categoryIds: ['lore', 'social', 'medical'], ranks: 2 }), // 2 × max(1, 2, 3)
      CultureSkillRank.create({ type: 'languages', ranks: 5 }), // 5 × lore (1)
      CultureSkillRank.create({ type: 'region', skillId: 'skill-lore', region: 'own', ranks: 3 }), // 3 × 1
    ];

    expect(cultureDevelopmentCost(entries, resolve)).toBe(4 + 4 + 6 + 5 + 3);
  });

  it('costs skills that cannot be resolved or have an unlisted category with the default', () => {
    const entries = [
      CultureSkillRank.create({ type: 'skill', skillId: 'skill-missing', ranks: 2 }),
      CultureSkillRank.create({ type: 'skill', skillId: 'skill-exotic', ranks: 1 }),
      CultureSkillRank.create({ type: 'skill-choice', skillIds: ['skill-missing', 'skill-lore'], ranks: 1 }),
    ];

    expect(cultureDevelopmentCost(entries, resolve)).toBe(2 * 3 + 1 * 3 + 1 * 3);
  });

  it('is 0 for a culture without entries', () => {
    expect(cultureDevelopmentCost([], resolve)).toBe(0);
  });
});
