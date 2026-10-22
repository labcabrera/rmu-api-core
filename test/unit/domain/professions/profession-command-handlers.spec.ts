import { beforeEach, describe, expect, it } from 'vitest';
import { Profession } from '../../../../src/modules/professions/domain/aggregates/profession.js';
import type { ProfessionProps } from '../../../../src/modules/professions/domain/aggregates/profession-props.js';
import type { ProfessionSkillCosts } from '../../../../src/modules/professions/domain/value-objects/profession-skill-cost.vo.js';
import { ProfessionGuardAdapter } from '../../../../src/modules/professions/infrastructure/security/profession-guard.adapter.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateProfessionHandler } from '../../../../src/modules/professions/application/cqrs/handlers/create-profession.handler.js';
import { CreateProfessionCommand } from '../../../../src/modules/professions/application/cqrs/commands/create-profession.command.js';
import { UpdateProfessionHandler } from '../../../../src/modules/professions/application/cqrs/handlers/update-profession.handler.js';
import { UpdateProfessionCommand } from '../../../../src/modules/professions/application/cqrs/commands/update-profession.command.js';
import { DeleteProfessionHandler } from '../../../../src/modules/professions/application/cqrs/handlers/delete-profession.handler.js';
import { DeleteProfessionCommand } from '../../../../src/modules/professions/application/cqrs/commands/delete-profession.command.js';
import { InMemoryRepository } from '../../support/in-memory.repository.js';
import { RecordingEventPublisher } from '../../support/recording-event-publisher.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';

const categories = [
  'animal',
  'awareness',
  'battle-expertise',
  'body-discipline',
  'brawn',
  'combat-expertise',
  'combat1',
  'combat2',
  'combat3',
  'combat4',
  'composition',
  'crafting',
  'delving',
  'environmental',
  'gymnastic',
  'lore',
  'magical-expertise',
  'medical',
  'mental-discipline',
  'movement',
  'performance-art',
  'power-manipulation',
  'science',
  'social',
  'spells-base-open',
  'spells-ritual-magic',
  'spells-closed',
  'spells-arcane',
  'spells-restricted',
  'subterfuge',
  'technical',
  'vocation',
] as const;

const skillCosts = (cost: number): ProfessionSkillCosts =>
  Object.fromEntries(categories.map(category => [category, [cost, cost + 1]])) as unknown as ProfessionSkillCosts;

const profession = (overrides: Partial<ProfessionProps> = {}) =>
  Profession.fromProps({
    id: 'fighter',
    archetype: 'non-spellcaster',
    availableRealmTypes: ['channeling', 'essence', 'mentalism'],
    fixedRealmTypes: [],
    skillCosts: skillCosts(2),
    professionalSkills: ['skill-1'],
    entitySource: 'user',
    description: 'A fighter',
    imageUrl: undefined,
    owner: OWNER.id,
    accessType: 'private',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: undefined,
    ...overrides,
  });

describe('profession command handlers', () => {
  let professions: InMemoryRepository<Profession>;
  let events: RecordingEventPublisher;
  const guard = new ProfessionGuardAdapter();

  beforeEach(() => {
    professions = new InMemoryRepository(profession());
    events = new RecordingEventPublisher();
  });

  describe('CreateProfessionHandler', () => {
    const command = (id: string, user: { id: string; roles: readonly string[] }) =>
      new CreateProfessionCommand(
        id,
        'pure-spellcaster',
        ['essence'],
        ['essence'],
        skillCosts(4),
        ['skill-2'],
        'A mage',
        'mage.png',
        'public',
        user.id,
        [...user.roles],
      );

    it.each([
      ['a user', OWNER, 'user'],
      ['an admin', ADMIN, 'system'],
    ])('lets %s create the profession, owned by them, with entity source %s', async (_, user, entitySource) => {
      const created = await new CreateProfessionHandler(professions, guard).execute(command('mage', user));

      expect(created).toMatchObject({
        id: 'mage',
        archetype: 'pure-spellcaster',
        availableRealmTypes: ['essence'],
        fixedRealmTypes: ['essence'],
        skillCosts: skillCosts(4),
        professionalSkills: ['skill-2'],
        entitySource,
        description: 'A mage',
        imageUrl: 'mage.png',
        owner: user.id,
        accessType: 'public',
        updatedAt: undefined,
      });
      expect(professions.items.get('mage')).toBe(created);
    });

    it('forbids a user without the user or admin role', async () => {
      await expect(new CreateProfessionHandler(professions, guard).execute(command('mage', NO_ROLES))).rejects.toThrow(ForbiddenError);
      expect(professions.items.has('mage')).toBe(false);
    });

    it('rejects an id that already exists', async () => {
      await expect(new CreateProfessionHandler(professions, guard).execute(command('fighter', OWNER))).rejects.toThrow(ConflictError);
      expect(professions.items.get('fighter')?.archetype).toBe('non-spellcaster');
    });
  });

  describe('UpdateProfessionHandler', () => {
    const command = (id: string, user: { id: string; roles: readonly string[] }) =>
      // Only the archetype and the description change: the other fields stay undefined.
      new UpdateProfessionCommand(id, 'hybrid', undefined, undefined, undefined, undefined, 'A paladin', undefined, undefined, user.id, [
        ...user.roles,
      ]);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s update the profession', async (_, user) => {
      const updated = await new UpdateProfessionHandler(professions, guard).execute(command('fighter', user));

      expect(updated).toMatchObject({
        id: 'fighter',
        archetype: 'hybrid',
        description: 'A paladin',
        availableRealmTypes: ['channeling', 'essence', 'mentalism'],
        professionalSkills: ['skill-1'],
        owner: OWNER.id,
        accessType: 'private',
        entitySource: 'user',
      });
      expect(updated.updatedAt).toBeInstanceOf(Date);
      expect(professions.items.get('fighter')).toBe(updated);
    });

    it('forbids another user', async () => {
      await expect(new UpdateProfessionHandler(professions, guard).execute(command('fighter', OTHER))).rejects.toThrow(ForbiddenError);
      expect(professions.items.get('fighter')).toMatchObject({
        archetype: 'non-spellcaster',
        description: 'A fighter',
        updatedAt: undefined,
      });
    });

    it('fails on an unknown profession', async () => {
      await expect(new UpdateProfessionHandler(professions, guard).execute(command('missing', OWNER))).rejects.toThrow(NotFoundError);
    });
  });

  describe('DeleteProfessionHandler', () => {
    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s delete the profession and publishes profession.deleted with its last state', async (_, user) => {
      await new DeleteProfessionHandler(professions, guard, events).execute(
        new DeleteProfessionCommand('fighter', user.id, [...user.roles]),
      );

      expect(professions.items.has('fighter')).toBe(false);
      expect(events.published.map(p => [p.topic, (p.event.data as ProfessionProps).id])).toEqual([['profession.deleted', 'fighter']]);
    });

    it('forbids another user', async () => {
      const handler = new DeleteProfessionHandler(professions, guard, events);

      await expect(handler.execute(new DeleteProfessionCommand('fighter', OTHER.id, [...OTHER.roles]))).rejects.toThrow(ForbiddenError);
      expect(professions.items.has('fighter')).toBe(true);
      expect(events.topics).toEqual([]);
    });

    it('fails on an unknown profession', async () => {
      const handler = new DeleteProfessionHandler(professions, guard, events);

      await expect(handler.execute(new DeleteProfessionCommand('missing', OWNER.id, [...OWNER.roles]))).rejects.toThrow(NotFoundError);
      expect(events.topics).toEqual([]);
    });
  });
});
