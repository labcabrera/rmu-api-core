import { describe, expect, it, jest } from '@jest/globals';
import { CultureViewService } from '../../../../src/modules/cultures/application/services/culture-view.service';
import { Culture } from '../../../../src/modules/cultures/domain/aggregates/culture';
import { CultureSkillRank } from '../../../../src/modules/cultures/domain/value-objects/culture-skill-rank';
import { Skill } from '../../../../src/modules/skills/domain/aggregates/skill';
import type { SkillRepository } from '../../../../src/modules/skills/application/ports/skill-repository';

const makeSkill = (id: string, categoryId: string) =>
  Skill.fromProps({ id, categoryId, bonus: [], specialization: null, owner: 'owner', accessType: 'public', createdAt: new Date() });

const catalog = new Map([
  ['skill-a', makeSkill('skill-a', 'combat-training')],
  ['skill-b', makeSkill('skill-b', 'lore')],
]);

const makeCulture = (skillRanks: CultureSkillRank[]) =>
  Culture.fromProps({
    id: 'culture-1',
    name: 'Invented',
    description: null,
    imageUrl: null,
    owner: 'owner',
    accessType: 'public',
    skillRanks,
    createdAt: new Date(),
    updatedAt: null,
  });

describe('CultureViewService', () => {
  it('resolves skill categories once per skill and defaults unknown skills', async () => {
    const findById = jest.fn((id: string) => Promise.resolve(catalog.get(id) ?? null));
    const service = new CultureViewService({ findById } as unknown as SkillRepository);
    const first = makeCulture([
      CultureSkillRank.create({ type: 'skill', skillId: 'skill-a', ranks: 2 }), // 2 × 4
      CultureSkillRank.create({ type: 'skill', skillId: 'skill-unknown', ranks: 1 }), // 1 × 3
    ]);
    const second = makeCulture([
      CultureSkillRank.create({ type: 'skill-choice', skillIds: ['skill-a', 'skill-b'], ranks: 1 }), // 1 × 4
      CultureSkillRank.create({ type: 'languages', ranks: 3 }), // 3 × 1
    ]);

    const views = await service.toViews([first, second]);

    expect(views.map(v => v.developmentCost)).toEqual([11, 7]);
    expect(views[0].culture).toBe(first);
    expect(findById).toHaveBeenCalledTimes(3);
  });
});
