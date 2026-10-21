import { describe, expect, it } from 'vitest';
import { CultureSkillRank, CultureSkillRankProps } from '../../../../src/modules/cultures/domain/value-objects/culture-skill-rank';
import { ValidationError } from '../../../../src/modules/shared/domain/errors/errors';

const create = (props: Partial<CultureSkillRankProps>) => () => CultureSkillRank.create({ ranks: 1, ...props } as CultureSkillRankProps);

describe('CultureSkillRank value object', () => {
  it.each<[string, CultureSkillRankProps]>([
    ['skill', { type: 'skill', skillId: 'skill-a', ranks: 2 }],
    ['skill with specialization', { type: 'skill', skillId: 'skill-a', specialization: 'spec-a', ranks: 1 }],
    ['skill-choice', { type: 'skill-choice', skillIds: ['skill-a', 'skill-b'], maxRanksPerSkill: 2, ranks: 3 }],
    ['category-pool', { type: 'category-pool', categoryIds: ['cat-a', 'cat-b'], maxRanksPerSkill: 2, ranks: 4 }],
    ['languages', { type: 'languages', ranks: 5 }],
    ['own region', { type: 'region', skillId: 'skill-a', region: 'own', ranks: 3 }],
    ['neighboring region', { type: 'region', skillId: 'skill-a', region: 'neighboring', ranks: 1 }],
  ])('accepts a valid %s entry', (_, props) => {
    expect(CultureSkillRank.create(props)).toMatchObject(props);
  });

  it('rejects an unknown type', () => {
    expect(create({ type: 'other' as CultureSkillRankProps['type'] })).toThrow(ValidationError);
  });

  it.each([0, -1, 1.5])('rejects %p ranks', ranks => {
    expect(create({ type: 'languages', ranks })).toThrow(ValidationError);
  });

  it.each([0, -2, 1.5])('rejects maxRanksPerSkill %p', maxRanksPerSkill => {
    expect(create({ type: 'languages', maxRanksPerSkill })).toThrow(ValidationError);
  });

  it("requires skillId in 'skill' and rejects fields of other types", () => {
    expect(create({ type: 'skill' })).toThrow(ValidationError);
    expect(create({ type: 'skill', skillId: 'skill-a', categoryIds: ['cat-a'] })).toThrow(ValidationError);
    expect(create({ type: 'skill', skillId: 'skill-a', region: 'own' })).toThrow(ValidationError);
  });

  it("requires a non-empty skillIds in 'skill-choice'", () => {
    expect(create({ type: 'skill-choice' })).toThrow(ValidationError);
    expect(create({ type: 'skill-choice', skillIds: [] })).toThrow(ValidationError);
    expect(create({ type: 'skill-choice', skillIds: ['skill-a'], skillId: 'skill-b' })).toThrow(ValidationError);
  });

  it("requires a non-empty categoryIds in 'category-pool'", () => {
    expect(create({ type: 'category-pool' })).toThrow(ValidationError);
    expect(create({ type: 'category-pool', categoryIds: [] })).toThrow(ValidationError);
    expect(create({ type: 'category-pool', categoryIds: ['cat-a'], skillIds: ['skill-a'] })).toThrow(ValidationError);
  });

  it("rejects skill, category and region fields in 'languages'", () => {
    expect(create({ type: 'languages', skillId: 'skill-a' })).toThrow(ValidationError);
    expect(create({ type: 'languages', skillIds: ['skill-a'] })).toThrow(ValidationError);
    expect(create({ type: 'languages', categoryIds: ['cat-a'] })).toThrow(ValidationError);
    expect(create({ type: 'languages', region: 'own' })).toThrow(ValidationError);
    expect(create({ type: 'languages', specialization: 'spec-a' })).toThrow(ValidationError);
  });

  it("requires skillId and a known region in 'region'", () => {
    expect(create({ type: 'region', region: 'own' })).toThrow(ValidationError);
    expect(create({ type: 'region', skillId: 'skill-a' })).toThrow(ValidationError);
    expect(create({ type: 'region', skillId: 'skill-a', region: 'far' as CultureSkillRankProps['region'] })).toThrow(ValidationError);
  });

  it('rehydrates stored data without validating it and drops null fields', () => {
    const rank = CultureSkillRank.fromProps({ type: 'skill', skillId: 'skill-a', specialization: null as unknown as string, ranks: 0 });

    expect(rank.ranks).toBe(0);
    expect(rank.specialization).toBeUndefined();
  });
});
