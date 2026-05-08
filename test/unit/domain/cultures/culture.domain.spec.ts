import { describe, expect, it } from '@jest/globals';
import { Culture } from 'src/modules/cultures/domain/aggregates/culture';
import { CultureProps } from 'src/modules/cultures/domain/aggregates/culture-props';
import { CultureCreatedEvent } from 'src/modules/cultures/domain/events/culture-created.event';
import { CultureUpdatedEvent } from 'src/modules/cultures/domain/events/culture-updated.event';
import { CultureSkillRank } from 'src/modules/cultures/domain/value-objects/culture-skill-rank';

const makeCultureProps = (overrides: Partial<CultureProps> = {}): CultureProps => ({
  id: 'culture-1',
  name: 'Nomad',
  description: null,
  imageUrl: null,
  owner: 'owner-1',
  accessType: 'private',
  fixedSkillRanks: [new CultureSkillRank('skill-1', null, 2)],
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: null,
  ...overrides,
});

describe('Culture domain aggregate', () => {
  it('creates a culture with default fixed ranks and a creation event', () => {
    const culture = Culture.create({
      name: 'Urban',
      description: null,
      imageUrl: null,
      owner: 'owner-1',
      accessType: 'public',
      fixedSkillRanks: undefined,
    });

    expect(culture.id).toEqual(expect.any(String));
    expect(culture.fixedSkillRanks).toEqual([]);
    expect(culture.createdAt).toBeInstanceOf(Date);
    expect(culture.updatedAt).toBeNull();
    expect(culture.getUncommittedEvents()).toEqual([expect.any(CultureCreatedEvent)]);
    expect(culture.getUncommittedEvents()[0]).toMatchObject({
      eventType: 'created',
      data: culture.getProps(),
    });
  });

  it('hydrates from props without domain events', () => {
    const props = makeCultureProps({ updatedAt: new Date('2025-02-01T00:00:00.000Z') });

    const culture = Culture.fromProps(props);

    expect(culture.getProps()).toEqual(props);
    expect(culture.getUncommittedEvents()).toEqual([]);
  });

  it('updates text, nullable media and fixed ranks while preserving owner', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const culture = Culture.fromProps(makeCultureProps({ createdAt, owner: 'owner-1' }));
    const fixedSkillRanks = [new CultureSkillRank('skill-2', 'desert', 0)];

    culture.update({
      name: 'Desert Nomad',
      description: null,
      imageUrl: null,
      fixedSkillRanks,
      accessType: 'public',
    });

    expect(culture.getProps()).toMatchObject({
      name: 'Desert Nomad',
      description: null,
      imageUrl: null,
      fixedSkillRanks,
      owner: 'owner-1',
      accessType: 'private',
      createdAt,
    });
    expect(culture.updatedAt).toBeInstanceOf(Date);
    expect(culture.getUncommittedEvents()).toEqual([expect.any(CultureUpdatedEvent)]);
  });

  it('finds, adds, updates and deletes fixed skill ranks by nullable specialization', () => {
    const culture = Culture.fromProps(makeCultureProps({ fixedSkillRanks: [] }));

    culture.addFixedSkillRank('skill-1', null, 1);
    culture.addFixedSkillRank('skill-1', null, 3);
    culture.addFixedSkillRank('skill-1', 'urban', 2);

    expect(culture.findFixedSkillRank('skill-1', null)).toEqual(new CultureSkillRank('skill-1', null, 3));
    expect(culture.findFixedSkillRank('skill-1', 'urban')).toEqual(new CultureSkillRank('skill-1', 'urban', 2));

    culture.deleteFixedSkillRank('skill-1', null);

    expect(culture.fixedSkillRanks).toEqual([new CultureSkillRank('skill-1', 'urban', 2)]);
    expect(culture.getUncommittedEvents()).toEqual([
      expect.any(CultureUpdatedEvent),
      expect.any(CultureUpdatedEvent),
      expect.any(CultureUpdatedEvent),
      expect.any(CultureUpdatedEvent),
    ]);
  });

  it('keeps CultureSkillRank boundary values without coercion', () => {
    const zeroRank = new CultureSkillRank('skill-1', null, 0);
    const negativeRank = new CultureSkillRank('skill-2', 'rare', -1);

    expect(zeroRank).toEqual({ skillId: 'skill-1', specialization: null, ranks: 0 });
    expect(negativeRank).toEqual({ skillId: 'skill-2', specialization: 'rare', ranks: -1 });
  });
});
