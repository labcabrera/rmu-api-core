import { describe, expect, it } from 'vitest';
import { Skill } from '../../../../src/modules/skills/domain/aggregates/skill.js';
import type { SkillProps } from '../../../../src/modules/skills/domain/aggregates/skill-props.js';

const baseProps = (): SkillProps => ({
  id: 'skill-1',
  categoryId: 'athletic-brawn',
  bonus: ['strength'],
  specialization: null,
  owner: 'user-1',
  accessType: 'private',
  createdAt: new Date('2026-03-01T00:00:00.000Z'),
  updatedAt: undefined,
});

describe('Skill', () => {
  it('creates a skill using caller-provided identity and current creation date', () => {
    const skill = Skill.create({
      id: 'skill-2',
      categoryId: 'influence',
      bonus: ['presence', 'empathy'],
      specialization: 'skill-influence',
      owner: 'user-1',
      accessType: 'public',
    });

    expect(skill.getProps()).toMatchObject({
      id: 'skill-2',
      categoryId: 'influence',
      bonus: ['presence', 'empathy'],
      specialization: 'skill-influence',
      owner: 'user-1',
      accessType: 'public',
    });
    expect(skill.createdAt).toBeInstanceOf(Date);
    expect(skill.updatedAt).toBeUndefined();
  });

  it('rehydrates persisted props exactly', () => {
    const props = baseProps();

    const skill = Skill.fromProps(props);

    expect(skill.getProps()).toEqual(props);
  });

  it('updates mutable fields and preserves owner and createdAt', () => {
    const props = baseProps();
    const skill = Skill.fromProps(props);

    skill.update({
      categoryId: 'influence',
      bonus: ['presence'],
      specialization: 'skill-influence',
      accessType: 'public',
    });

    expect(skill.getProps()).toMatchObject({
      id: 'skill-1',
      categoryId: 'influence',
      bonus: ['presence'],
      specialization: 'skill-influence',
      owner: 'user-1',
      accessType: 'public',
      createdAt: props.createdAt,
    });
    expect(skill.updatedAt).toBeInstanceOf(Date);
  });

  it('reports no change when no provided field changes state', () => {
    const skill = Skill.fromProps(baseProps()).restoreVersion(0);
    const currentBonus = skill.bonus;

    skill.update({});
    skill.update({ categoryId: 'athletic-brawn', bonus: currentBonus });
    skill.update({ bonus: [...currentBonus] });
    expect(skill.hasChanges()).toBe(false);
  });
});

describe('Skill maneuver profile', () => {
  it('stores only the defined maneuver fields', () => {
    const skill = Skill.create({ ...baseProps(), maneuver: { light: 'required', movement: undefined } });

    expect(skill.maneuver).toEqual({ light: 'required' });
  });

  it('rejects invalid maneuver profiles', () => {
    expect(() => Skill.create({ ...baseProps(), maneuver: { actionPoints: { min: 4, max: 2 } } })).toThrow();
  });

  it('replaces and removes the maneuver profile on update', () => {
    const skill = Skill.fromProps({ ...baseProps(), maneuver: { light: 'helpful' } });

    skill.update({ maneuver: { movement: true } });
    expect(skill.maneuver).toEqual({ movement: true });

    skill.update({ maneuver: null });
    expect(skill.maneuver).toBeUndefined();
  });
});
