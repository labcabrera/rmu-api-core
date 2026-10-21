import { describe, expect, it } from 'vitest';
import { MongoCultureRepository } from '../../../../src/modules/cultures/infrastructure/db/mongo.culture.repository';
import { CultureSkillRank } from '../../../../src/modules/cultures/domain/value-objects/culture-skill-rank';

describe('MongoCultureRepository.mapSkillRanks', () => {
  it("maps the old fixedSkillRanks to 'skill' entries when skillRanks is absent", () => {
    const ranks = MongoCultureRepository.mapSkillRanks({
      fixedSkillRanks: [
        { skillId: 'skill-a', specialization: null, ranks: 2 },
        { skillId: 'skill-b', specialization: 'spec-b', ranks: 1 },
      ],
    });

    expect(ranks).toEqual([
      CultureSkillRank.fromProps({ type: 'skill', skillId: 'skill-a', ranks: 2 }),
      CultureSkillRank.fromProps({ type: 'skill', skillId: 'skill-b', specialization: 'spec-b', ranks: 1 }),
    ]);
    expect(ranks[0].specialization).toBeUndefined();
  });

  it('prefers skillRanks over the old field', () => {
    const ranks = MongoCultureRepository.mapSkillRanks({
      skillRanks: [
        { type: 'category-pool', categoryIds: ['cat-a'], ranks: 3, maxRanksPerSkill: 2 },
        { type: 'region', skillId: 'skill-r', region: 'neighboring', ranks: 1 },
      ],
      fixedSkillRanks: [{ skillId: 'skill-a', specialization: null, ranks: 2 }],
    });

    expect(ranks).toEqual([
      CultureSkillRank.fromProps({ type: 'category-pool', categoryIds: ['cat-a'], ranks: 3, maxRanksPerSkill: 2 }),
      CultureSkillRank.fromProps({ type: 'region', skillId: 'skill-r', region: 'neighboring', ranks: 1 }),
    ]);
  });

  it('keeps an explicit empty skillRanks and returns [] when there is no data', () => {
    expect(
      MongoCultureRepository.mapSkillRanks({ skillRanks: [], fixedSkillRanks: [{ skillId: 'x', specialization: null, ranks: 1 }] }),
    ).toEqual([]);
    expect(MongoCultureRepository.mapSkillRanks({})).toEqual([]);
  });
});
