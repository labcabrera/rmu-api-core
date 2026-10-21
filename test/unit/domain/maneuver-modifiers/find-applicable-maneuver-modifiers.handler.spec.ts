import { describe, expect, it } from '@jest/globals';
import { FindApplicableManeuverModifiersHandler } from 'src/modules/maneuver-modifiers/application/cqrs/handlers/find-applicable-maneuver-modifiers.handler';
import { FindApplicableManeuverModifiersQuery } from 'src/modules/maneuver-modifiers/application/cqrs/queries/find-applicable-maneuver-modifiers.query';
import type { ManeuverModifierRepository } from 'src/modules/maneuver-modifiers/application/ports/maneuver-modifier-repository';
import { ManeuverModifier } from 'src/modules/maneuver-modifiers/domain/aggregates/maneuver-modifier';
import { ManeuverModifierGuardAdapter } from 'src/modules/maneuver-modifiers/infrastructure/security/maneuver-modifier-guard.adapter';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import type { SkillRepository } from 'src/modules/skills/application/ports/skill-repository';
import { Skill } from 'src/modules/skills/domain/aggregates/skill';

const modifier = (key: string, scope: { skillIds?: string[]; categoryIds?: string[] }, accessType: 'public' | 'private' = 'public') =>
  ManeuverModifier.create({ key, scope, type: 'flag', value: 1, owner: 'owner-1', accessType });

const modifiers = [
  modifier('m-skill', { skillIds: ['skill-a'] }),
  modifier('m-category', { categoryIds: ['category-a'] }),
  modifier('m-other', { skillIds: ['skill-b'], categoryIds: ['category-b'] }),
  modifier('m-private', { categoryIds: ['category-a'] }, 'private'),
];

const modifierRepository = {
  findApplicable: (skillId: string | undefined, categoryId: string | undefined) =>
    Promise.resolve(modifiers.filter(m => m.appliesTo(skillId, categoryId) && m.accessType === 'public')),
} as unknown as ManeuverModifierRepository;

const skillRepository = {
  findById: (id: string) =>
    Promise.resolve(
      id === 'skill-a'
        ? Skill.create({ id, categoryId: 'category-a', bonus: [], specialization: null, owner: 'owner-1', accessType: 'public' })
        : null,
    ),
} as unknown as SkillRepository;

describe('FindApplicableManeuverModifiersHandler', () => {
  const handler = new FindApplicableManeuverModifiersHandler(modifierRepository, new ManeuverModifierGuardAdapter(), skillRepository);

  it('returns the modifiers of the skill and of its category', async () => {
    const result = await handler.execute(new FindApplicableManeuverModifiersQuery('skill-a', undefined, 'user-1', []));

    expect(result.map(m => m.key)).toEqual(['m-skill', 'm-category']);
  });

  it('returns only the category modifiers when filtering by category', async () => {
    const result = await handler.execute(new FindApplicableManeuverModifiersQuery(undefined, 'category-b', 'user-1', []));

    expect(result.map(m => m.key)).toEqual(['m-other']);
  });

  it('does not look the skill up when the category is given', async () => {
    const result = await handler.execute(new FindApplicableManeuverModifiersQuery('unknown-skill', 'category-a', 'user-1', []));

    expect(result.map(m => m.key)).toEqual(['m-category']);
  });

  it('fails when the skill does not exist', async () => {
    await expect(handler.execute(new FindApplicableManeuverModifiersQuery('unknown-skill', undefined, 'user-1', []))).rejects.toThrow(
      NotFoundError,
    );
  });
});
