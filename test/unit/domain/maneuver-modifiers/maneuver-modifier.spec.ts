import { describe, expect, it } from '@jest/globals';
import { ManeuverModifier } from 'src/modules/maneuver-modifiers/domain/aggregates/maneuver-modifier';
import { ManeuverModifierDefinition } from 'src/modules/maneuver-modifiers/domain/aggregates/maneuver-modifier-props';
import { ValidationError } from 'src/modules/shared/domain/errors/errors';

const create = (definition: Partial<ManeuverModifierDefinition>) =>
  ManeuverModifier.create({
    key: 'test-modifier',
    scope: { skillIds: ['skill-a'] },
    type: 'flag',
    value: 5,
    ...definition,
    owner: 'user-1',
    accessType: 'public',
  });

describe('ManeuverModifier', () => {
  it('creates a flag modifier with a generated id', () => {
    const modifier = create({});

    expect(modifier.id).toEqual(expect.any(String));
    expect(modifier.getProps()).toMatchObject({ key: 'test-modifier', type: 'flag', value: 5, owner: 'user-1', accessType: 'public' });
  });

  it('requires a scope with at least one skill or category', () => {
    expect(() => create({ scope: {} })).toThrow(ValidationError);
    expect(() => create({ scope: { skillIds: [], categoryIds: [] } })).toThrow(ValidationError);
    expect(() => create({ scope: { categoryIds: ['category-a'] } })).not.toThrow();
  });

  it('requires a key', () => {
    expect(() => create({ key: '  ' })).toThrow(ValidationError);
  });

  it('validates flag modifiers', () => {
    expect(() => create({ type: 'flag', value: undefined })).toThrow('needs a value');
  });

  it('validates choice modifiers', () => {
    expect(() => create({ type: 'choice', options: [] })).toThrow('at least one option');
    expect(() =>
      create({
        type: 'choice',
        options: [
          { key: 'a', value: 1 },
          { key: 'a', value: 2 },
        ],
      }),
    ).toThrow('duplicated option keys');
    expect(
      create({
        type: 'choice',
        options: [
          { key: 'a', value: 1 },
          { key: 'b', value: -2 },
        ],
      }).options,
    ).toHaveLength(2);
  });

  it('validates number modifiers', () => {
    expect(() => create({ type: 'number', perUnit: undefined })).toThrow('needs perUnit');
    expect(() => create({ type: 'number', perUnit: -3, min: 4, max: 1 })).toThrow('min greater than max');
    expect(create({ type: 'number', perUnit: -3, min: 0, max: 4 }).getProps()).toMatchObject({ perUnit: -3, min: 0, max: 4 });
  });

  it('drops the fields that do not apply to the type', () => {
    const modifier = create({ type: 'number', value: 7, options: [{ key: 'a', value: 1 }], perUnit: 2 });

    expect(modifier.value).toBeUndefined();
    expect(modifier.options).toBeUndefined();
    expect(modifier.perUnit).toBe(2);
  });

  it('applies to the skills and categories of its scope', () => {
    const modifier = create({ scope: { skillIds: ['skill-a'], categoryIds: ['category-a'] } });

    expect(modifier.appliesTo('skill-a')).toBe(true);
    expect(modifier.appliesTo('skill-b', 'category-a')).toBe(true);
    expect(modifier.appliesTo('skill-b', 'category-b')).toBe(false);
    expect(modifier.appliesTo(undefined, undefined)).toBe(false);
  });

  it('revalidates the merged definition on update', () => {
    const modifier = create({});

    expect(() => modifier.update({ type: 'choice' })).toThrow(ValidationError);

    modifier.update({ type: 'choice', options: [{ key: 'a', value: 3 }], accessType: 'private' });
    expect(modifier.type).toBe('choice');
    expect(modifier.value).toBeUndefined();
    expect(modifier.options).toEqual([{ key: 'a', value: 3 }]);
    expect(modifier.accessType).toBe('private');
    expect(modifier.updatedAt).toBeInstanceOf(Date);
  });
});
