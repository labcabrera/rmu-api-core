import { Skill } from 'src/modules/skills/domain/aggregates/skill';
import { SkillProps } from 'src/modules/skills/domain/aggregates/skill-props';
import { NotModifiedError } from 'src/modules/shared/domain/errors/errors';

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

  it('throws NotModifiedError when no provided field changes state', () => {
    const skill = Skill.fromProps(baseProps());
    const currentBonus = skill.bonus;

    expect(() => skill.update({})).toThrow(NotModifiedError);
    expect(() => skill.update({ categoryId: 'athletic-brawn', bonus: currentBonus })).toThrow('Skill not modified');
  });
});
