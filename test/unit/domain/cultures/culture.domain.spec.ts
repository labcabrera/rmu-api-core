import { describe, expect, it } from 'vitest';
import { Culture } from '../../../../src/modules/cultures/domain/aggregates/culture.js';
import type { CultureProps } from '../../../../src/modules/cultures/domain/aggregates/culture-props.js';
import { CultureCreatedEvent } from '../../../../src/modules/cultures/domain/events/culture-created.event.js';
import { CultureUpdatedEvent } from '../../../../src/modules/cultures/domain/events/culture-updated.event.js';
import { CultureSkillRank } from '../../../../src/modules/cultures/domain/value-objects/culture-skill-rank.js';
import { NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';

const skill = (skillId: string, ranks: number, specialization?: string) =>
  CultureSkillRank.create({ type: 'skill', skillId, specialization, ranks });

const makeCultureProps = (overrides: Partial<CultureProps> = {}): CultureProps => ({
  id: 'culture-1',
  name: 'Nomad',
  description: null,
  imageUrl: null,
  owner: 'owner-1',
  accessType: 'private',
  skillRanks: [skill('skill-1', 2)],
  languages: undefined,
  suggestedCrafts: undefined,
  suggestedVocations: undefined,
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: null,
  ...overrides,
});

describe('Culture domain aggregate', () => {
  it('creates a culture with default skill ranks and a creation event', () => {
    const culture = Culture.create({
      name: 'Urban',
      description: null,
      imageUrl: null,
      owner: 'owner-1',
      accessType: 'public',
      skillRanks: undefined as unknown as CultureSkillRank[],
    });

    expect(culture.id).toEqual(expect.any(String));
    expect(culture.skillRanks).toEqual([]);
    expect(culture.createdAt).toBeInstanceOf(Date);
    expect(culture.updatedAt).toBeNull();
    expect(culture.getUncommittedEvents()).toEqual([expect.any(CultureCreatedEvent)]);
    expect(culture.getUncommittedEvents()[0]).toMatchObject({
      eventType: 'created',
      data: culture.getProps(),
    });
  });

  it('hydrates from props without domain events', () => {
    const props = makeCultureProps({
      languages: ['lang-a'],
      suggestedCrafts: 'any craft',
      suggestedVocations: 'any vocation',
      updatedAt: new Date('2025-02-01T00:00:00.000Z'),
    });

    const culture = Culture.fromProps(props);

    expect(culture.getProps()).toEqual(props);
    expect(culture.getUncommittedEvents()).toEqual([]);
  });

  it('updates text, nullable media, skill ranks, access type and the new fields while preserving owner', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const culture = Culture.fromProps(makeCultureProps({ createdAt, owner: 'owner-1' }));
    const skillRanks = [skill('skill-2', 1, 'desert')];

    culture.update({
      name: 'Desert Nomad',
      description: null,
      imageUrl: null,
      skillRanks,
      languages: ['lang-a', 'lang-b'],
      suggestedCrafts: 'crafts',
      suggestedVocations: 'vocations',
      accessType: 'public',
    });

    expect(culture.getProps()).toMatchObject({
      name: 'Desert Nomad',
      description: null,
      imageUrl: null,
      skillRanks,
      languages: ['lang-a', 'lang-b'],
      suggestedCrafts: 'crafts',
      suggestedVocations: 'vocations',
      owner: 'owner-1',
      accessType: 'public',
      createdAt,
    });
    expect(culture.updatedAt).toBeInstanceOf(Date);
    expect(culture.getUncommittedEvents()).toEqual([expect.any(CultureUpdatedEvent)]);
  });

  it('appends skill ranks and deletes them by position', () => {
    const culture = Culture.fromProps(makeCultureProps({ skillRanks: [] }));
    const first = skill('skill-1', 1);
    const pool = CultureSkillRank.create({ type: 'category-pool', categoryIds: ['cat-a'], ranks: 3 });
    const languages = CultureSkillRank.create({ type: 'languages', ranks: 4 });

    culture.addSkillRank(first);
    culture.addSkillRank(pool);
    culture.addSkillRank(languages);
    expect(culture.skillRanks).toEqual([first, pool, languages]);

    culture.deleteSkillRank(1);

    expect(culture.skillRanks).toEqual([first, languages]);
    expect(culture.getUncommittedEvents()).toEqual([
      expect.any(CultureUpdatedEvent),
      expect.any(CultureUpdatedEvent),
      expect.any(CultureUpdatedEvent),
      expect.any(CultureUpdatedEvent),
    ]);
  });

  it('rejects deleting a skill rank position that does not exist', () => {
    const culture = Culture.fromProps(makeCultureProps());

    expect(() => culture.deleteSkillRank(1)).toThrow(NotFoundError);
    expect(() => culture.deleteSkillRank(-1)).toThrow(NotFoundError);
    expect(culture.skillRanks).toHaveLength(1);
  });

  it('stores the languages and the skill specializations as normalized keys (spec 050)', () => {
    const culture = Culture.fromProps(makeCultureProps());

    culture.update({ languages: ['Black Speech', 'black-speech', 'Adûnaic'] });

    expect(culture.languages).toEqual(['black-speech', 'adunaic']);
    expect(skill('language-spoken', 2, 'Orcish tongues').specialization).toBe('orcish-tongues');
  });
});
