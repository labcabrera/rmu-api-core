import { beforeEach, describe, expect, it } from 'vitest';
import { Culture } from '../../../../src/modules/cultures/domain/aggregates/culture.js';
import type { CultureProps } from '../../../../src/modules/cultures/domain/aggregates/culture-props.js';
import { CultureSkillRank, type CultureSkillRankProps } from '../../../../src/modules/cultures/domain/value-objects/culture-skill-rank.js';
import { CultureGuardAdapter } from '../../../../src/modules/cultures/infrastructure/security/culture-guard.adapter.js';
import { CultureViewService } from '../../../../src/modules/cultures/application/services/culture-view.service.js';
import { Skill } from '../../../../src/modules/skills/domain/aggregates/skill.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateCultureHandler } from '../../../../src/modules/cultures/application/cqrs/handlers/create-culture.handler.js';
import { CreateCultureCommand } from '../../../../src/modules/cultures/application/cqrs/commands/create-culture.command.js';
import { UpdateCultureHandler } from '../../../../src/modules/cultures/application/cqrs/handlers/update-culture.handler.js';
import { UpdateCultureCommand } from '../../../../src/modules/cultures/application/cqrs/commands/update-culture.command.js';
import { DeleteCultureHandler } from '../../../../src/modules/cultures/application/cqrs/handlers/delete-culture.handler.js';
import { DeleteCultureCommand } from '../../../../src/modules/cultures/application/cqrs/commands/delete-culture.command.js';
import { AddCultureSkillRankHandler } from '../../../../src/modules/cultures/application/cqrs/handlers/add-culture-skill-rank.handler.js';
import { AddCultureSkillRankCommand } from '../../../../src/modules/cultures/application/cqrs/commands/add-culture-skill-rank.command.js';
import { DeleteCultureSkillRankHandler } from '../../../../src/modules/cultures/application/cqrs/handlers/delete-culture-skill-rank.handler.js';
import { DeleteCultureSkillRankCommand } from '../../../../src/modules/cultures/application/cqrs/commands/delete-culture-skill-rank.command.js';
import { InMemoryRepository } from '../../support/in-memory.repository.js';
import { RecordingEventPublisher } from '../../support/recording-event-publisher.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';

type User = { id: string; roles: readonly string[] };

const skillRank = (props: CultureSkillRankProps) => CultureSkillRank.create(props);

const culture = (overrides: Partial<CultureProps> = {}) =>
  Culture.fromProps({
    id: 'culture-1',
    name: 'Invented',
    description: null,
    imageUrl: null,
    owner: OWNER.id,
    accessType: 'private',
    skillRanks: [skillRank({ type: 'skill', skillId: 'skill-a', ranks: 2 }), skillRank({ type: 'languages', ranks: 3 })],
    languages: ['common'],
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: null,
    ...overrides,
  });

// skill-a is in a category that costs 4 per rank; skills outside the catalog cost 3 and languages 1.
const skills = new InMemoryRepository(
  Skill.fromProps({
    id: 'skill-a',
    categoryId: 'combat-training',
    bonus: [],
    specialization: null,
    owner: OWNER.id,
    accessType: 'public',
    createdAt: new Date(),
  }),
);
const viewService = new CultureViewService(skills);

describe('culture command handlers', () => {
  let cultures: InMemoryRepository<Culture>;
  let events: RecordingEventPublisher;
  const guard = new CultureGuardAdapter();

  beforeEach(() => {
    cultures = new InMemoryRepository(culture());
    events = new RecordingEventPublisher();
  });

  const unchanged = () => {
    const stored = cultures.items.get('culture-1');
    expect(stored).toMatchObject({ name: 'Invented', updatedAt: null });
    expect(stored?.skillRanks).toHaveLength(2);
    expect(events.topics).toEqual([]);
  };

  describe('CreateCultureHandler', () => {
    const command = (user: User, skillRanks?: CultureSkillRankProps[]) =>
      new CreateCultureCommand(
        'Mountain folk',
        'Highlanders',
        'mountain.png',
        'public',
        skillRanks,
        ['dwarvish'],
        'Mining',
        'Smith',
        user.id,
        [...user.roles],
      );

    it.each([
      ['a user', OWNER],
      ['an admin', ADMIN],
    ])('lets %s create a culture owned by them, publishes culture.created and returns the view', async (_, user) => {
      const handler = new CreateCultureHandler(cultures, guard, events, viewService);
      const view = await handler.execute(
        command(user, [
          { type: 'skill', skillId: 'skill-a', ranks: 1 },
          { type: 'skill', skillId: 'skill-unknown', ranks: 2 },
        ]),
      );

      const created = view.culture;
      expect(created).toMatchObject({
        name: 'Mountain folk',
        description: 'Highlanders',
        imageUrl: 'mountain.png',
        accessType: 'public',
        owner: user.id,
        languages: ['dwarvish'],
        suggestedCrafts: 'Mining',
        suggestedVocations: 'Smith',
        updatedAt: null,
      });
      expect(created.skillRanks.map(s => [s.type, s.skillId, s.ranks])).toEqual([
        ['skill', 'skill-a', 1],
        ['skill', 'skill-unknown', 2],
      ]);
      expect(view.developmentCost).toBe(1 * 4 + 2 * 3);
      expect(cultures.items.get(created.id)).toBe(created);
      expect(events.topics).toEqual(['culture.created']);
      expect((events.published[0].event.data as CultureProps).id).toBe(created.id);
    });

    it('creates a culture without skill ranks when the command has none', async () => {
      const view = await new CreateCultureHandler(cultures, guard, events, viewService).execute(command(OWNER));

      expect(view.culture.skillRanks).toEqual([]);
      expect(view.developmentCost).toBe(0);
      expect(events.topics).toEqual(['culture.created']);
    });

    it('forbids a user without roles', async () => {
      const handler = new CreateCultureHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command(NO_ROLES))).rejects.toThrow(ForbiddenError);
      expect([...cultures.items.keys()]).toEqual(['culture-1']);
      expect(events.topics).toEqual([]);
    });

    it('rejects an invalid skill rank without storing or publishing', async () => {
      const handler = new CreateCultureHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command(OWNER, [{ type: 'skill', ranks: 1 }]))).rejects.toThrow(ValidationError);
      expect([...cultures.items.keys()]).toEqual(['culture-1']);
      expect(events.topics).toEqual([]);
    });
  });

  describe('UpdateCultureHandler', () => {
    const command = (id: string, user: User, skillRanks?: CultureSkillRankProps[]) =>
      new UpdateCultureCommand(
        id,
        'Hill folk',
        'Lowlanders',
        'hill.png',
        undefined,
        skillRanks,
        ['westron'],
        'Farming',
        'Farmer',
        user.id,
        [...user.roles],
      );

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s update the culture and publishes culture.updated', async (_, user) => {
      const handler = new UpdateCultureHandler(cultures, guard, events, viewService);
      const view = await handler.execute(
        command('culture-1', user, [{ type: 'skill-choice', skillIds: ['skill-a', 'skill-b'], ranks: 2 }]),
      );

      expect(view.culture).toMatchObject({
        id: 'culture-1',
        name: 'Hill folk',
        description: 'Lowlanders',
        imageUrl: 'hill.png',
        owner: OWNER.id,
        languages: ['westron'],
        suggestedCrafts: 'Farming',
        suggestedVocations: 'Farmer',
      });
      expect(view.culture.updatedAt).toBeInstanceOf(Date);
      expect(view.culture.skillRanks.map(s => [s.type, s.skillIds, s.ranks])).toEqual([['skill-choice', ['skill-a', 'skill-b'], 2]]);
      expect(view.developmentCost).toBe(2 * 4);
      expect(cultures.items.get('culture-1')).toBe(view.culture);
      expect(events.topics).toEqual(['culture.updated']);
    });

    it('keeps the skill ranks when the command leaves them undefined', async () => {
      const view = await new UpdateCultureHandler(cultures, guard, events, viewService).execute(command('culture-1', OWNER));

      expect(view.culture.skillRanks).toHaveLength(2);
      expect(view.developmentCost).toBe(2 * 4 + 3 * 1);
      expect(events.topics).toEqual(['culture.updated']);
    });

    it('forbids another user', async () => {
      const handler = new UpdateCultureHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command('culture-1', OTHER))).rejects.toThrow(ForbiddenError);
      unchanged();
    });

    it('rejects an invalid skill rank without changing or publishing', async () => {
      const handler = new UpdateCultureHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command('culture-1', OWNER, [{ type: 'languages', ranks: 0 }]))).rejects.toThrow(ValidationError);
      unchanged();
    });

    it('fails on an unknown culture', async () => {
      const handler = new UpdateCultureHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command('missing', OWNER))).rejects.toThrow(NotFoundError);
      expect(events.topics).toEqual([]);
    });
  });

  describe('DeleteCultureHandler', () => {
    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s delete the culture and publishes culture.deleted with its last state', async (_, user) => {
      const handler = new DeleteCultureHandler(cultures, guard, events);
      const result = await handler.execute(new DeleteCultureCommand('culture-1', user.id, [...user.roles]));

      expect(result).toBeUndefined();
      expect(cultures.items.has('culture-1')).toBe(false);
      expect(events.published.map(p => [p.topic, (p.event.data as CultureProps).id])).toEqual([['culture.deleted', 'culture-1']]);
    });

    it('forbids another user', async () => {
      const handler = new DeleteCultureHandler(cultures, guard, events);

      await expect(handler.execute(new DeleteCultureCommand('culture-1', OTHER.id, [...OTHER.roles]))).rejects.toThrow(ForbiddenError);
      expect(cultures.items.has('culture-1')).toBe(true);
      expect(events.topics).toEqual([]);
    });

    it('fails on an unknown culture', async () => {
      const handler = new DeleteCultureHandler(cultures, guard, events);

      await expect(handler.execute(new DeleteCultureCommand('missing', OWNER.id, [...OWNER.roles]))).rejects.toThrow(NotFoundError);
      expect(events.topics).toEqual([]);
    });
  });

  describe('AddCultureSkillRankHandler', () => {
    const command = (
      cultureId: string,
      user: User,
      rank: CultureSkillRankProps = { type: 'region', skillId: 'skill-r', region: 'own', ranks: 1 },
    ) => new AddCultureSkillRankCommand(cultureId, rank, user.id, [...user.roles]);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s append a skill rank and publishes culture.updated', async (_, user) => {
      const view = await new AddCultureSkillRankHandler(cultures, guard, events, viewService).execute(command('culture-1', user));

      expect(view.culture.skillRanks.map(s => s.type)).toEqual(['skill', 'languages', 'region']);
      expect(view.culture.skillRanks[2]).toMatchObject({ skillId: 'skill-r', region: 'own', ranks: 1 });
      expect(view.culture.updatedAt).toBeInstanceOf(Date);
      expect(view.developmentCost).toBe(2 * 4 + 3 * 1 + 1 * 3);
      expect(cultures.items.get('culture-1')).toBe(view.culture);
      expect(events.topics).toEqual(['culture.updated']);
    });

    it('forbids another user', async () => {
      const handler = new AddCultureSkillRankHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command('culture-1', OTHER))).rejects.toThrow(ForbiddenError);
      unchanged();
    });

    it('rejects an invalid skill rank without changing or publishing', async () => {
      const handler = new AddCultureSkillRankHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command('culture-1', OWNER, { type: 'region', skillId: 'skill-r', ranks: 1 }))).rejects.toThrow(
        ValidationError,
      );
      unchanged();
    });

    it('fails on an unknown culture', async () => {
      const handler = new AddCultureSkillRankHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command('missing', OWNER))).rejects.toThrow(NotFoundError);
      expect(events.topics).toEqual([]);
    });
  });

  describe('DeleteCultureSkillRankHandler', () => {
    const command = (cultureId: string, index: number, user: User) =>
      new DeleteCultureSkillRankCommand(cultureId, index, user.id, [...user.roles]);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s remove the skill rank at an index and publishes culture.updated', async (_, user) => {
      const view = await new DeleteCultureSkillRankHandler(cultures, guard, events, viewService).execute(command('culture-1', 0, user));

      expect(view.culture.skillRanks.map(s => [s.type, s.ranks])).toEqual([['languages', 3]]);
      expect(view.culture.updatedAt).toBeInstanceOf(Date);
      expect(view.developmentCost).toBe(3 * 1);
      expect(cultures.items.get('culture-1')).toBe(view.culture);
      expect(events.topics).toEqual(['culture.updated']);
    });

    it('forbids another user', async () => {
      const handler = new DeleteCultureSkillRankHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command('culture-1', 0, OTHER))).rejects.toThrow(ForbiddenError);
      unchanged();
    });

    it.each([-1, 2, 0.5])('fails on the out-of-range index %s without changing or publishing', async index => {
      const handler = new DeleteCultureSkillRankHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command('culture-1', index, OWNER))).rejects.toThrow(NotFoundError);
      unchanged();
    });

    it('fails on an unknown culture', async () => {
      const handler = new DeleteCultureSkillRankHandler(cultures, guard, events, viewService);

      await expect(handler.execute(command('missing', 0, OWNER))).rejects.toThrow(NotFoundError);
      expect(events.topics).toEqual([]);
    });
  });
});
