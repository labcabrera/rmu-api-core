import { beforeEach, describe, expect, it } from 'vitest';
import { SkillCategory } from '../../../../src/modules/skill-categories/domain/entities/skill-category.js';
import type { SkillCategoryRepository } from '../../../../src/modules/skill-categories/application/ports/skill-category-repository.port.js';
import type { ManeuverProfile } from '../../../../src/modules/skill-categories/domain/value-objects/maneuver-profile.vo.js';
import { ConflictError, ForbiddenError, ValidationError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateSkillCategoryHandler } from '../../../../src/modules/skill-categories/application/cqrs/handlers/create-skill-category.handler.js';
import { CreateSkillCategoryCommand } from '../../../../src/modules/skill-categories/application/cqrs/commands/create-skill-category.command.js';
import { InMemoryRepository } from '../../support/in-memory.repository.js';
import { ADMIN, OWNER } from '../../support/users.js';

class InMemorySkillCategoryRepository extends InMemoryRepository<SkillCategory> implements SkillCategoryRepository {
  findByIds(ids: string[]): Promise<SkillCategory[]> {
    return Promise.resolve([...this.items.values()].filter(category => ids.includes(category.id)));
  }
}

describe('skill category command handlers', () => {
  let categories: InMemorySkillCategoryRepository;

  beforeEach(() => {
    categories = new InMemorySkillCategoryRepository(new SkillCategory('brawn', ['st', 'co']));
  });

  describe('CreateSkillCategoryHandler', () => {
    const command = (
      id: string,
      maneuver: ManeuverProfile | undefined,
      realmBonus: number | null = 5,
      user: { id: string; roles: readonly string[] } = ADMIN,
    ) => new CreateSkillCategoryCommand(id, ['pr', 'em'], realmBonus, maneuver, user.id, [...user.roles]);

    it('forbids a user who is not an admin', async () => {
      await expect(new CreateSkillCategoryHandler(categories).execute(command('social', undefined, 5, OWNER))).rejects.toThrow(
        ForbiddenError,
      );
      expect(categories.items.has('social')).toBe(false);
    });

    it('creates the skill category with a normalized maneuver profile', async () => {
      const maneuver: ManeuverProfile = { defaultType: 'percent', resultTable: '', light: 'helpful', actionPoints: { min: 1, max: 2 } };

      const created = await new CreateSkillCategoryHandler(categories).execute(command('social', maneuver));

      expect(created).toEqual(
        new SkillCategory('social', ['pr', 'em'], 5, { defaultType: 'percent', light: 'helpful', actionPoints: { min: 1, max: 2 } }),
      );
      expect(categories.items.get('social')).toBe(created);
    });

    it('stores no maneuver profile and a null realm bonus when none are given', async () => {
      const created = await new CreateSkillCategoryHandler(categories).execute(command('lore', {}, null));

      expect(created.realmBonus).toBeNull();
      expect(created.maneuver).toBeUndefined();
      expect(categories.items.get('lore')).toBe(created);
    });

    it('rejects an id that already exists', async () => {
      await expect(new CreateSkillCategoryHandler(categories).execute(command('brawn', undefined))).rejects.toThrow(ConflictError);
      expect(categories.items.get('brawn')?.bonus).toEqual(['st', 'co']);
    });

    it.each([
      ['an unknown maneuver type', { defaultType: 'other' } as unknown as ManeuverProfile],
      ['an unknown light usage', { light: 'bright' } as unknown as ManeuverProfile],
      ['action points with max below min', { actionPoints: { min: 3, max: 2 } }],
      ['negative action points', { actionPoints: { min: -1, max: 2 } }],
      ['non-integer action points', { actionPoints: { min: 0.5, max: 2 } }],
    ])('rejects %s without saving', async (_, maneuver: ManeuverProfile) => {
      await expect(new CreateSkillCategoryHandler(categories).execute(command('social', maneuver))).rejects.toThrow(ValidationError);
      expect(categories.items.has('social')).toBe(false);
    });
  });
});
