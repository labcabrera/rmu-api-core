import { describe, expect, it } from '@jest/globals';
import { NotModifiedError } from 'src/modules/shared/domain/errors/errors';
import { EffectType } from 'src/modules/effect-types/domain/aggregates/effect-type';

describe('EffectType', () => {
  it('creates an effect type with caller-defined id', () => {
    const effectType = EffectType.create({
      id: 'bleeding',
      isPersistent: true,
      value: 'required',
      modifier: 'optional',
      rounds: 'required',
      text: 'optional',
      location: 'forbidden',
      delay: 'forbidden',
      owner: 'user-1',
      accessType: 'public',
      entitySource: 'user',
    });

    expect(effectType.id).toBe('bleeding');
    expect(effectType.isPersistent).toBe(true);
    expect(effectType.value).toBe('required');
    expect(effectType.createdAt).toBeInstanceOf(Date);
  });

  it('updates boolean and requirement properties', () => {
    const effectType = EffectType.create({
      id: 'stunned',
      isPersistent: true,
      value: 'forbidden',
      modifier: 'optional',
      rounds: 'required',
      text: 'optional',
      location: 'forbidden',
      delay: 'forbidden',
      owner: 'user-1',
      accessType: 'private',
      entitySource: 'user',
    });

    effectType.update({
      isPersistent: false,
      value: 'optional',
      accessType: 'public',
    });

    expect(effectType.isPersistent).toBe(false);
    expect(effectType.value).toBe('optional');
    expect(effectType.accessType).toBe('public');
    expect(effectType.updatedAt).toBeInstanceOf(Date);
  });

  it('throws when update has no effective changes', () => {
    const effectType = EffectType.create({
      id: 'prone',
      isPersistent: false,
      value: 'forbidden',
      modifier: 'forbidden',
      rounds: 'forbidden',
      text: 'optional',
      location: 'forbidden',
      delay: 'forbidden',
      owner: 'user-1',
      accessType: 'public',
      entitySource: 'user',
    });

    expect(() => effectType.update({ isPersistent: false })).toThrow(NotModifiedError);
  });
});
