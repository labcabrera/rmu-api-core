import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Skill } from '../../../../src/modules/skills/domain/aggregates/skill.js';
import type { SkillProps } from '../../../../src/modules/skills/domain/aggregates/skill-props.js';
import { SkillGuardAdapter } from '../../../../src/modules/skills/infrastructure/security/skill-guard.adapter.js';
import { SkillViewService } from '../../../../src/modules/skills/application/services/skill-view.service.js';
import { SkillCategory } from '../../../../src/modules/skill-categories/domain/entities/skill-category.js';
import type { SkillCategoryRepository } from '../../../../src/modules/skill-categories/application/ports/skill-category-repository.port.js';
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateSkillHandler } from '../../../../src/modules/skills/application/cqrs/handlers/create-skill.handler.js';
import { CreateSkillCommand } from '../../../../src/modules/skills/application/cqrs/commands/create-skill.command.js';
import { UpdateSkillHandler } from '../../../../src/modules/skills/application/cqrs/handlers/update-skill.handler.js';
import { UpdateSkillCommand } from '../../../../src/modules/skills/application/cqrs/commands/update-skill.command.js';
import { DeleteSkillHandler } from '../../../../src/modules/skills/application/cqrs/handlers/delete-skill.handler.js';
import { DeleteSkillCommand } from '../../../../src/modules/skills/application/cqrs/commands/delete-skill.command.js';
import { InMemoryRepository } from '../../support/in-memory.repository.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';

class InMemorySkillCategoryRepository extends InMemoryRepository<SkillCategory> implements SkillCategoryRepository {
  findByIds(ids: string[]): Promise<SkillCategory[]> {
    return Promise.resolve([...this.items.values()].filter(category => ids.includes(category.id)));
  }
}

type User = { id: string; roles: readonly string[] };

const skill = (overrides: Partial<SkillProps> = {}) =>
  Skill.fromProps({
    id: 'climbing',
    categoryId: 'athletic',
    bonus: ['ag', 'st'],
    specialization: null,
    owner: OWNER.id,
    accessType: 'private',
    maneuver: undefined,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: undefined,
    ...overrides,
  });

describe('skill command handlers', () => {
  let skills: InMemoryRepository<Skill>;
  let categories: InMemorySkillCategoryRepository;
  let views: SkillViewService;
  const guard = new SkillGuardAdapter();

  beforeEach(() => {
    skills = new InMemoryRepository(skill());
    categories = new InMemorySkillCategoryRepository(
      new SkillCategory('athletic', ['ag'], null, { movement: true }),
      new SkillCategory('awareness', ['in']),
    );
    views = new SkillViewService(categories);
  });

  describe('CreateSkillHandler', () => {
    const command = (id: string, categoryId: string, user: User = OWNER) =>
      new CreateSkillCommand(id, categoryId, ['ag', 'qu'], null, 'public', { light: 'helpful' }, user.id, [...user.roles]);

    const handler = () => new CreateSkillHandler(skills, categories, guard, views);

    it('stores the skill owned by the user and returns it with the effective maneuver profile', async () => {
      const view = await handler().execute(command('swimming', 'athletic'));

      expect(view.skill).toMatchObject({
        id: 'swimming',
        categoryId: 'athletic',
        bonus: ['ag', 'qu'],
        owner: OWNER.id,
        accessType: 'public',
      });
      expect(view.maneuver).toEqual({ defaultType: 'absolute', resultTable: 'generic', movement: true, light: 'helpful' });
      expect(skills.items.get('swimming')).toBe(view.skill);
    });

    it('rejects a user without the player or admin role', async () => {
      await expect(handler().execute(command('swimming', 'athletic', NO_ROLES))).rejects.toThrow(ForbiddenError);
      expect(skills.items.has('swimming')).toBe(false);
    });

    it('rejects an id that already exists', async () => {
      await expect(handler().execute(command('climbing', 'awareness'))).rejects.toThrow(ConflictError);
      expect(skills.items.get('climbing')?.categoryId).toBe('athletic');
    });

    it('rejects an unknown skill category', async () => {
      await expect(handler().execute(command('swimming', 'missing'))).rejects.toThrow(ValidationError);
      expect(skills.items.has('swimming')).toBe(false);
    });
  });

  describe('UpdateSkillHandler', () => {
    const command = (id: string, user: User, changes: { categoryId?: string; accessType?: 'public' | 'private' } = {}) =>
      new UpdateSkillCommand(id, changes.categoryId, undefined, undefined, changes.accessType, undefined, user.id, [...user.roles]);

    const handler = () => new UpdateSkillHandler(skills, categories, guard, views);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s move the skill to another category and stores it', async (_, user) => {
      const view = await handler().execute(command('climbing', user, { categoryId: 'awareness' }));

      expect(view.skill.categoryId).toBe('awareness');
      expect(view.skill.updatedAt).toBeInstanceOf(Date);
      expect(view.maneuver.movement).toBe(false);
      expect(skills.items.get('climbing')?.categoryId).toBe('awareness');
    });

    it('returns the current skill without saving when nothing changes', async () => {
      const update = vi.spyOn(skills, 'update');

      const view = await handler().execute(command('climbing', OWNER, { categoryId: 'athletic', accessType: 'private' }));

      expect(update).not.toHaveBeenCalled();
      expect(view.skill).toBe(skills.items.get('climbing'));
      expect(view.skill.updatedAt).toBeUndefined();
      expect(view.maneuver.movement).toBe(true);
    });

    it('forbids another user', async () => {
      await expect(handler().execute(command('climbing', OTHER, { categoryId: 'awareness' }))).rejects.toThrow(ForbiddenError);
      expect(skills.items.get('climbing')?.categoryId).toBe('athletic');
    });

    it('rejects an unknown skill category', async () => {
      await expect(handler().execute(command('climbing', OWNER, { categoryId: 'missing' }))).rejects.toThrow(ValidationError);
      expect(skills.items.get('climbing')?.categoryId).toBe('athletic');
    });

    it('fails on an unknown skill', async () => {
      await expect(handler().execute(command('missing', OWNER, { categoryId: 'awareness' }))).rejects.toThrow(NotFoundError);
    });
  });

  describe('DeleteSkillHandler', () => {
    const handler = () => new DeleteSkillHandler(skills, guard);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s delete the skill', async (_, user) => {
      await handler().execute(new DeleteSkillCommand('climbing', user.id, [...user.roles]));

      expect(skills.items.has('climbing')).toBe(false);
    });

    it('forbids another user', async () => {
      await expect(handler().execute(new DeleteSkillCommand('climbing', OTHER.id, [...OTHER.roles]))).rejects.toThrow(ForbiddenError);
      expect(skills.items.has('climbing')).toBe(true);
    });

    it('fails on an unknown skill', async () => {
      await expect(handler().execute(new DeleteSkillCommand('missing', OWNER.id, [...OWNER.roles]))).rejects.toThrow(NotFoundError);
    });
  });
});
