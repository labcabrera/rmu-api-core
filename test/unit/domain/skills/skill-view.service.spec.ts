import { describe, expect, it } from 'vitest';
import type { SkillCategoryRepository } from '../../../../src/modules/realms/application/ports/skill-category-repository.js';
import { SkillCategory } from '../../../../src/modules/skill-categories/domain/entities/skill-category.js';
import { SkillViewService } from '../../../../src/modules/skills/application/services/skill-view.service.js';
import { Skill } from '../../../../src/modules/skills/domain/aggregates/skill.js';

const categories = [
  new SkillCategory('category-a', [], null, { resultTable: 'table-a', movement: true }),
  new SkillCategory('category-b', []),
];

const repository = {
  findByIds: (ids: string[]) => Promise.resolve(categories.filter(category => ids.includes(category.id))),
} as unknown as SkillCategoryRepository;

const skill = (id: string, categoryId: string, maneuver?: Skill['maneuver']) =>
  Skill.create({ id, categoryId, bonus: [], specialization: null, owner: 'user-1', accessType: 'public', maneuver });

describe('SkillViewService', () => {
  const service = new SkillViewService(repository);

  it('resolves the effective profile of each skill from its category', async () => {
    const views = await service.toViews([
      skill('skill-a', 'category-a'),
      skill('skill-b', 'category-a', { movement: false, light: 'required' }),
      skill('skill-c', 'category-b'),
      skill('skill-d', 'missing-category', { defaultType: 'percent' }),
    ]);

    expect(views.map(view => view.maneuver)).toEqual([
      { defaultType: 'absolute', resultTable: 'table-a', movement: true, light: 'none' },
      { defaultType: 'absolute', resultTable: 'table-a', movement: false, light: 'required' },
      { defaultType: 'absolute', resultTable: 'generic', movement: false, light: 'none' },
      { defaultType: 'percent', resultTable: 'generic', movement: false, light: 'none' },
    ]);
  });

  it('keeps the own skill values on the aggregate', async () => {
    const view = await service.toView(skill('skill-b', 'category-a', { light: 'helpful' }));

    expect(view.skill.maneuver).toEqual({ light: 'helpful' });
    expect(view.maneuver.light).toBe('helpful');
  });
});
