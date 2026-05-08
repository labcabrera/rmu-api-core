import { Profession } from 'src/modules/professions/domain/aggregates/profession';
import { ProfessionProps } from 'src/modules/professions/domain/aggregates/profession-props';
import { ProfessionSkillCosts } from 'src/modules/professions/domain/value-objects/profession-skill-cost.vo';

const makeSkillCosts = (value: number[] = [2, 4]): ProfessionSkillCosts => ({
  animal: value,
  awareness: value,
  'battle-expertise': value,
  'body-discipline': value,
  brawn: value,
  'combat-expertise': value,
  combat1: value,
  combat2: value,
  combat3: value,
  combat4: value,
  composition: value,
  crafting: value,
  delving: value,
  environmental: value,
  gymnastic: value,
  lore: value,
  'magical-expertise': value,
  medical: value,
  'mental-discipline': value,
  movement: value,
  'performance-art': value,
  'power-manipulation': value,
  science: value,
  social: value,
  'spells-base-open': value,
  'spells-ritual-magic': value,
  'spells-closed': value,
  'spells-arcane': value,
  'spells-restricted': value,
  subterfuge: value,
  technical: value,
  vocation: value,
});

const makeProfessionProps = (overrides: Partial<ProfessionProps> = {}): ProfessionProps => ({
  id: 'profession-1',
  archetype: 'non-spellcaster',
  availableRealmTypes: ['channeling', 'essence'],
  fixedRealmTypes: ['channeling'],
  skillCosts: makeSkillCosts(),
  professionalSkills: ['skill-1'],
  entitySource: 'system',
  description: undefined,
  imageUrl: undefined,
  owner: 'owner-1',
  accessType: 'public',
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: undefined,
  ...overrides,
});

describe('Profession domain aggregate', () => {
  it('creates a profession using the provided id and no domain events', () => {
    const props = makeProfessionProps({ id: 'profession-created' });

    const profession = Profession.create(props);

    expect(profession.id).toBe('profession-created');
    expect(profession.createdAt).toBeInstanceOf(Date);
    expect(profession.updatedAt).toBeUndefined();
    expect(profession.getProps()).toMatchObject({
      id: 'profession-created',
      archetype: 'non-spellcaster',
      owner: 'owner-1',
      description: undefined,
      imageUrl: undefined,
    });
    expect(profession.getUncommittedEvents()).toEqual([]);
  });

  it('hydrates from props without changing dates or value objects', () => {
    const props = makeProfessionProps({ updatedAt: new Date('2025-02-01T00:00:00.000Z') });

    const profession = Profession.fromProps(props);

    expect(profession.getProps()).toEqual(props);
    expect(profession.getUncommittedEvents()).toEqual([]);
  });

  it('updates profession fields, nullable-like undefined fields and access type while preserving owner and id', () => {
    const profession = Profession.fromProps(makeProfessionProps({ owner: 'owner-1' }));
    const skillCosts = makeSkillCosts([0, 0]);

    profession.update({
      archetype: 'pure-spellcaster',
      availableRealmTypes: ['mentalism'],
      fixedRealmTypes: [],
      skillCosts,
      professionalSkills: [],
      entitySource: 'user',
      description: undefined,
      imageUrl: undefined,
      accessType: 'private',
    });

    expect(profession.getProps()).toMatchObject({
      id: 'profession-1',
      archetype: 'pure-spellcaster',
      availableRealmTypes: ['mentalism'],
      fixedRealmTypes: [],
      skillCosts,
      professionalSkills: [],
      entitySource: 'user',
      description: undefined,
      imageUrl: undefined,
      owner: 'owner-1',
      accessType: 'private',
    });
    expect(profession.updatedAt).toBeInstanceOf(Date);
    expect(profession.getUncommittedEvents()).toEqual([]);
  });

  it('preserves skill cost boundary arrays without coercion', () => {
    const costs = makeSkillCosts([0, -1, 99]);

    expect(costs.animal).toEqual([0, -1, 99]);
    expect(costs['spells-arcane']).toEqual([0, -1, 99]);
    expect(costs.vocation).toEqual([0, -1, 99]);
  });
});
