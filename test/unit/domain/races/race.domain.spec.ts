import { describe, it, expect } from '@jest/globals';
import { Race } from 'src/modules/races/domain/aggregates/race';
import { RaceProps } from 'src/modules/races/domain/aggregates/race-props';
import { RaceCreatedEvent } from 'src/modules/races/domain/events/race-created.event';
import { RaceUpdatedEvent } from 'src/modules/races/domain/events/race-updated.event';
import { RaceResistances } from 'src/modules/races/domain/value-objects/race-resistances.vo';
import { RaceSkillBonus } from 'src/modules/races/domain/value-objects/race-skill-bonus.vo';
import { RaceStats } from 'src/modules/races/domain/value-objects/race-stats.vo';
import { RaceTrait } from 'src/modules/races/domain/value-objects/race-trait.vo';

const makeStats = (overrides: Partial<RaceStats> = {}): RaceStats => ({
  ag: 0,
  co: 1,
  em: 2,
  in: 3,
  me: 4,
  pr: 5,
  qu: 6,
  re: 7,
  sd: 8,
  st: 9,
  ...overrides,
});

const makeRaceProps = (overrides: Partial<RaceProps> = {}): RaceProps => ({
  id: 'race-1',
  name: 'Human',
  archetype: 'humanoid',
  realmId: 'realm-1',
  sizeId: 'medium',
  stats: makeStats(),
  resistances: new RaceResistances(0, 1, 2, 3, 4, 5, 6),
  averageHeight: { male: 180, female: 165 },
  averageWeight: { male: 82, female: 64 },
  strideBonus: 0,
  enduranceBonus: 1,
  recoveryMultiplier: 1,
  baseHits: 50,
  baseDevPoints: 50,
  baseAt: 1,
  defaultLanguage: null,
  talents: ['adaptable'],
  traits: [new RaceTrait('race-trait-1', 'trait-1', undefined, false, undefined, undefined)],
  skillBonuses: [new RaceSkillBonus('skill-1', null, 5)],
  description: null,
  imageUrl: null,
  owner: 'owner-1',
  accessType: 'public',
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: null,
  ...overrides,
});

describe('Race domain aggregate', () => {
  it('creates a race with generated identity, nullable fields and a creation event', () => {
    const props = makeRaceProps({ id: 'ignored' });

    const race = Race.create(props);

    expect(race.id).toEqual(expect.any(String));
    expect(race.id).not.toBe('ignored');
    expect(race.name).toBe('Human');
    expect(race.defaultLanguage).toBeNull();
    expect(race.description).toBeNull();
    expect(race.imageUrl).toBeNull();
    expect(race.createdAt).toBeInstanceOf(Date);
    expect(race.updatedAt).toBeNull();
    expect(race.getUncommittedEvents()).toHaveLength(1);
    expect(race.getUncommittedEvents()[0]).toBeInstanceOf(RaceCreatedEvent);
    expect(race.getUncommittedEvents()[0]).toMatchObject({
      eventType: 'created',
      eventVersion: '1',
      producer: 'rmu-api-core',
      data: race.getProps(),
    });
  });

  it('hydrates from props without emitting domain events', () => {
    const props = makeRaceProps({ updatedAt: new Date('2025-02-01T00:00:00.000Z') });

    const race = Race.fromProps(props);

    expect(race.getProps()).toEqual(props);
    expect(race.getUncommittedEvents()).toEqual([]);
  });

  it('updates scalar, nullable and value object fields while preserving owner and creation data', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const race = Race.fromProps(makeRaceProps({ createdAt, owner: 'owner-1' }));
    const newStats = makeStats({ ag: 10, st: 20 });
    const newResistances = new RaceResistances(6, 5, 4, 3, 2, 1, 0);
    const newTraits = [new RaceTrait('race-trait-2', 'trait-2', 'night', true, 2, 'darkvision')];

    race.update({
      name: 'High Human',
      archetype: 'variant',
      sizeId: 'large',
      stats: newStats,
      resistances: newResistances,
      averageHeight: { male: 190, female: 175 },
      averageWeight: { male: 90, female: 70 },
      strideBonus: 0,
      enduranceBonus: 0,
      recoveryMultiplier: 0,
      baseHits: 0,
      baseDevPoints: 0,
      baseAt: 0,
      defaultLanguage: null,
      talents: [],
      traits: newTraits,
      description: null,
      imageUrl: null,
    });

    expect(race.getProps()).toMatchObject({
      name: 'High Human',
      archetype: 'variant',
      sizeId: 'large',
      stats: newStats,
      resistances: newResistances,
      averageHeight: { male: 190, female: 175 },
      averageWeight: { male: 90, female: 70 },
      strideBonus: 0,
      enduranceBonus: 0,
      recoveryMultiplier: 0,
      baseHits: 0,
      baseDevPoints: 0,
      baseAt: 0,
      defaultLanguage: null,
      talents: [],
      traits: newTraits,
      description: null,
      imageUrl: null,
      owner: 'owner-1',
      createdAt,
    });
    expect(race.updatedAt).toBeInstanceOf(Date);
    expect(race.getUncommittedEvents()).toHaveLength(1);
    expect(race.getUncommittedEvents()[0]).toBeInstanceOf(RaceUpdatedEvent);
  });

  it('adds and removes traits as rich value objects and emits update events', () => {
    const race = Race.fromProps(makeRaceProps({ traits: [] }));

    race.addTrait('trait-1', 'forest', true, 3, 'woods affinity');

    expect(race.traits).toHaveLength(1);
    expect(race.traits[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        traitId: 'trait-1',
        specialization: 'forest',
        isTalent: true,
        tier: 3,
        description: 'woods affinity',
      }),
    );

    race.removeTrait(race.traits[0].id);

    expect(race.traits).toEqual([]);
    expect(race.getUncommittedEvents()).toEqual([expect.any(RaceUpdatedEvent), expect.any(RaceUpdatedEvent), expect.any(RaceUpdatedEvent)]);
  });

  it('upserts and deletes skill bonuses by skill and nullable specialization', () => {
    const race = Race.fromProps(makeRaceProps({ skillBonuses: [] }));

    race.addSkillBonus('skill-1', null, 5);
    race.addSkillBonus('skill-1', null, 10);
    race.addSkillBonus('skill-1', 'bows', 15);
    race.removeSkillBonus('skill-1', null);

    expect(race.skillBonuses).toEqual([new RaceSkillBonus('skill-1', 'bows', 15)]);
    expect(race.getUncommittedEvents()).toEqual([
      expect.any(RaceUpdatedEvent),
      expect.any(RaceUpdatedEvent),
      expect.any(RaceUpdatedEvent),
      expect.any(RaceUpdatedEvent),
    ]);
  });

  it('keeps value object boundary values without coercion', () => {
    const resistances = new RaceResistances(0, -1, 2, -3, 4, -5, 6);
    const skillBonus = new RaceSkillBonus('skill-1', null, 0);
    const trait = new RaceTrait('id-1', 'trait-1', undefined, false, undefined, undefined);

    expect(resistances).toMatchObject({ channeling: 0, mentalism: -1, physical: -3 });
    expect(skillBonus).toEqual({ skillId: 'skill-1', specialization: null, bonus: 0 });
    expect(trait).toEqual({
      id: 'id-1',
      traitId: 'trait-1',
      specialization: undefined,
      isTalent: false,
      tier: undefined,
      description: undefined,
    });
  });
});
