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
    baseListLimit: null,
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
    const command = (
      id: string,
      user: { id: string; roles: readonly string[] },
      entitySource?: 'system' | 'user',
      baseListLimit?: number | null,
    ) =>
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
        entitySource,
        baseListLimit,
      );

    // Spec 063: the source comes from the request, `user` by default, also for an admin (it used to follow the role).
    it.each([
      ['a user', OWNER, undefined, 'user'],
      ['a user', OWNER, 'user', 'user'],
      ['an admin', ADMIN, undefined, 'user'],
      ['an admin', ADMIN, 'system', 'system'],
    ] as const)('lets %s create the profession, owned by them, asking for %s and storing %s', async (_, user, asked, entitySource) => {
      const created = await new CreateProfessionHandler(professions, guard, events).execute(command('mage', user, asked));

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
      expect(events.topics).toEqual(['profession.created']);
    });

    it.each([
      [undefined, null],
      [null, null],
      [6, 6],
    ] as const)('stores a base list limit of %s as %s (spec 064)', async (asked, stored) => {
      const created = await new CreateProfessionHandler(professions, guard, events).execute(command('mage', OWNER, undefined, asked));
      expect(created.baseListLimit).toBe(stored);
    });

    it('forbids a non-admin to create a system profession', async () => {
      await expect(new CreateProfessionHandler(professions, guard, events).execute(command('mage', OWNER, 'system'))).rejects.toMatchObject(
        {
          statusCode: 403,
          code: 'system-entity-admin-only',
        },
      );
      expect(professions.items.has('mage')).toBe(false);
      expect(events.topics).toEqual([]);
    });

    it('forbids a user without the user or admin role', async () => {
      await expect(new CreateProfessionHandler(professions, guard, events).execute(command('mage', NO_ROLES))).rejects.toThrow(
        ForbiddenError,
      );
      expect(professions.items.has('mage')).toBe(false);
      expect(events.topics).toEqual([]);
    });

    it('rejects an id that already exists', async () => {
      await expect(new CreateProfessionHandler(professions, guard, events).execute(command('fighter', OWNER))).rejects.toThrow(
        ConflictError,
      );
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
      const updated = await new UpdateProfessionHandler(professions, guard, events).execute(command('fighter', user));

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
      expect(events.topics).toEqual(['profession.updated']);
      expect(events.published[0].event.data).toMatchObject({ id: 'fighter', archetype: 'hybrid' });
    });

    it('neither writes nor publishes an update that changes nothing', async () => {
      const unchanged = new UpdateProfessionCommand(
        'fighter',
        'non-spellcaster',
        undefined,
        undefined,
        undefined,
        undefined,
        'A fighter',
        undefined,
        undefined,
        OWNER.id,
        [...OWNER.roles],
      );

      const result = await new UpdateProfessionHandler(professions, guard, events).execute(unchanged);

      expect(result.updatedAt).toBeUndefined();
      expect(events.topics).toEqual([]);
    });

    it('sets and removes the base list limit, and keeps it when the command leaves it out (spec 064)', async () => {
      const handler = new UpdateProfessionHandler(professions, guard, events);
      const limit = (baseListLimit: number | null | undefined) =>
        new UpdateProfessionCommand(
          'fighter',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          OWNER.id,
          [...OWNER.roles],
          undefined,
          undefined,
          baseListLimit,
        );

      expect((await handler.execute(limit(6))).baseListLimit).toBe(6);
      expect((await handler.execute(command('fighter', OWNER))).baseListLimit).toBe(6);
      expect((await handler.execute(limit(null))).baseListLimit).toBeNull();
      expect(events.topics).toEqual(['profession.updated', 'profession.updated', 'profession.updated']);
    });

    it('forbids another user', async () => {
      await expect(new UpdateProfessionHandler(professions, guard, events).execute(command('fighter', OTHER))).rejects.toThrow(
        ForbiddenError,
      );
      expect(professions.items.get('fighter')).toMatchObject({
        archetype: 'non-spellcaster',
        description: 'A fighter',
        updatedAt: undefined,
      });
    });

    it('lets only an admin change a system profession, and change the source', async () => {
      professions = new InMemoryRepository(profession({ entitySource: 'system' }));
      const handler = new UpdateProfessionHandler(professions, guard, events);

      await expect(handler.execute(command('fighter', OWNER))).rejects.toMatchObject({ code: 'system-entity-admin-only' });

      const toUser = new UpdateProfessionCommand(
        'fighter',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        ADMIN.id,
        [...ADMIN.roles],
        undefined,
        'user',
      );
      const updated = await handler.execute(toUser);
      expect(updated).toMatchObject({ entitySource: 'user', owner: OWNER.id });
    });

    it('forbids the owner to turn a profession into a system one', async () => {
      const toSystem = new UpdateProfessionCommand(
        'fighter',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        OWNER.id,
        [...OWNER.roles],
        undefined,
        'system',
      );
      await expect(new UpdateProfessionHandler(professions, guard, events).execute(toSystem)).rejects.toMatchObject({
        code: 'system-entity-admin-only',
      });
      expect(professions.items.get('fighter')?.entitySource).toBe('user');
    });

    it('fails on an unknown profession', async () => {
      await expect(new UpdateProfessionHandler(professions, guard, events).execute(command('missing', OWNER))).rejects.toThrow(
        NotFoundError,
      );
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

    it('forbids the owner to delete a system profession', async () => {
      professions = new InMemoryRepository(profession({ entitySource: 'system' }));
      const handler = new DeleteProfessionHandler(professions, guard, events);

      await expect(handler.execute(new DeleteProfessionCommand('fighter', OWNER.id, [...OWNER.roles]))).rejects.toMatchObject({
        code: 'system-entity-admin-only',
      });
      expect(professions.items.has('fighter')).toBe(true);
      await handler.execute(new DeleteProfessionCommand('fighter', ADMIN.id, [...ADMIN.roles]));
      expect(professions.items.has('fighter')).toBe(false);
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
