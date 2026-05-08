import { Trait } from 'src/modules/traits/domain/aggregates/trait';
import { TraitProps } from 'src/modules/traits/domain/aggregates/trait-props';
import { TraitCreatedEvent } from 'src/modules/traits/domain/events/trait-created.event';
import { TraitUpdatedEvent } from 'src/modules/traits/domain/events/trait-updated.event';

const makeTraitProps = (overrides: Partial<TraitProps> = {}): TraitProps => ({
  id: 'trait-1',
  name: 'Night Vision',
  category: 'senses',
  isTalent: false,
  specialization: null,
  isTierBased: false,
  maxTier: undefined,
  adquisitionCost: 10,
  tierCost: undefined,
  description: undefined,
  owner: 'owner-1',
  createdAt: new Date('2025-01-01T00:00:00.000Z'),
  updatedAt: undefined,
  ...overrides,
});

describe('Trait domain aggregate', () => {
  it('creates a trait with slug id, optional fields and a creation event', () => {
    const trait = Trait.create({
      name: '  Night Vision!  ',
      category: 'senses',
      isTalent: true,
      specialization: 'sense',
      isTierBased: true,
      maxTier: 3,
      adquisitionCost: 0,
      tierCost: 0,
      description: undefined,
      owner: 'owner-1',
    });

    expect(trait.id).toBe('night-vision');
    expect(trait.name).toBe('  Night Vision!  ');
    expect(trait.adquisitionCost).toBe(0);
    expect(trait.tierCost).toBe(0);
    expect(trait.description).toBeUndefined();
    expect(trait.createdAt).toBeInstanceOf(Date);
    expect(trait.updatedAt).toBeUndefined();
    expect(trait.getUncommittedEvents()).toEqual([expect.any(TraitCreatedEvent)]);
    expect(trait.getUncommittedEvents()[0]).toMatchObject({
      eventType: 'created',
      data: trait.getProps(),
    });
  });

  it('hydrates from props without domain events', () => {
    const props = makeTraitProps({ updatedAt: new Date('2025-02-01T00:00:00.000Z') });

    const trait = Trait.fromProps(props);

    expect(trait.getProps()).toEqual(props);
    expect(trait.getUncommittedEvents()).toEqual([]);
  });

  it('updates mutable fields, including false, null and zero values', () => {
    const trait = Trait.fromProps(
      makeTraitProps({
        isTalent: true,
        specialization: 'skill',
        isTierBased: true,
        maxTier: 5,
        adquisitionCost: 10,
        tierCost: 2,
        description: 'old',
      }),
    );

    trait.update({
      name: 'Nocturnal Sight',
      category: 'racial',
      isTalent: false,
      specialization: null,
      isTierBased: false,
      maxTier: 0,
      adquisitionCost: 0,
      tierCost: 0,
      description: 'updated',
    });

    expect(trait.getProps()).toMatchObject({
      id: 'trait-1',
      name: 'Nocturnal Sight',
      category: 'racial',
      isTalent: false,
      specialization: null,
      isTierBased: false,
      maxTier: 0,
      adquisitionCost: 0,
      tierCost: 0,
      description: 'updated',
      owner: 'owner-1',
    });
    expect(trait.updatedAt).toBeInstanceOf(Date);
    expect(trait.getUncommittedEvents()).toEqual([expect.any(TraitUpdatedEvent)]);
  });

  it('does not clear optional tier fields when update omits them', () => {
    const trait = Trait.fromProps(
      makeTraitProps({
        maxTier: 3,
        tierCost: 4,
        description: 'tiered',
      }),
    );

    trait.update({ name: 'Still Tiered' });

    expect(trait.maxTier).toBe(3);
    expect(trait.tierCost).toBe(4);
    expect(trait.description).toBe('tiered');
  });
});
