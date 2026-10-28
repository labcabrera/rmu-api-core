import { beforeEach, describe, expect, it } from 'vitest';
import { Trait } from '../../../../src/modules/traits/domain/aggregates/trait.js';
import type { TraitProps } from '../../../../src/modules/traits/domain/aggregates/trait-props.js';
import { TraitGuardAdapter } from '../../../../src/modules/traits/infrastructure/security/trait-guard.adapter.js';
import type { TraitGuardPort } from '../../../../src/modules/traits/application/ports/trait-guard.port.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateTraitHandler } from '../../../../src/modules/traits/application/cqrs/handlers/create-trait.handler.js';
import { CreateTraitCommand } from '../../../../src/modules/traits/application/cqrs/commands/create-trait.command.js';
import { UpdateTraitHandler } from '../../../../src/modules/traits/application/cqrs/handlers/update-trait.handler.js';
import { UpdateTraitCommand } from '../../../../src/modules/traits/application/cqrs/commands/update-trait.command.js';
import { DeleteTraitHandler } from '../../../../src/modules/traits/application/cqrs/handlers/delete-trait.handler.js';
import { DeleteTraitCommand } from '../../../../src/modules/traits/application/cqrs/commands/delete-trait.command.js';
import { InMemoryRepository } from '../../support/in-memory.repository.js';
import { RecordingEventPublisher } from '../../support/recording-event-publisher.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';
import { GetTraitHandler } from '../../../../src/modules/traits/application/cqrs/handlers/get-trait.handler.js';
import { GetTraitQuery } from '../../../../src/modules/traits/application/cqrs/queries/get-trait.query.js';
import { GetTraitsHandler } from '../../../../src/modules/traits/application/cqrs/handlers/get-traits.handler.js';
import { GetTraitsQuery } from '../../../../src/modules/traits/application/cqrs/queries/get-traits.query.js';
import { QueryCriteria } from '../../../../src/modules/shared/application/criteria/query-criteria.js';

const trait = (overrides: Partial<TraitProps> = {}) =>
  Trait.fromProps({
    id: 'night-vision',
    name: 'Night Vision',
    category: 'senses',
    isTalent: true,
    specialization: null,
    isTierBased: false,
    maxTier: undefined,
    adquisitionCost: 10,
    tierCost: undefined,
    description: undefined,
    owner: OWNER.id,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: undefined,
    ...overrides,
  });

describe('trait command handlers', () => {
  let traits: InMemoryRepository<Trait>;
  let events: RecordingEventPublisher;
  const guard: TraitGuardPort = new TraitGuardAdapter();

  beforeEach(() => {
    traits = new InMemoryRepository(trait());
    events = new RecordingEventPublisher();
  });

  describe('CreateTraitHandler', () => {
    const command = (name: string, user: { id: string; roles: readonly string[] } = OWNER) =>
      new CreateTraitCommand(name, 'combat', true, 'skill', true, 3, 20, 10, 'A trait', user.id, [...user.roles]);

    it('creates the trait with an id derived from its name, owned by the user, and publishes trait.created', async () => {
      const created = await new CreateTraitHandler(traits, guard, events).execute(command(' Blind Fighting! '));

      expect(created).toMatchObject({
        id: 'blind-fighting',
        name: ' Blind Fighting! ',
        category: 'combat',
        isTalent: true,
        specialization: 'skill',
        isTierBased: true,
        maxTier: 3,
        adquisitionCost: 20,
        tierCost: 10,
        description: 'A trait',
        owner: OWNER.id,
        updatedAt: undefined,
      });
      expect(traits.items.get('blind-fighting')).toBe(created);
      expect(events.topics).toEqual(['trait.created']);
    });

    it('rejects a name whose id already exists, without saving or publishing', async () => {
      await expect(new CreateTraitHandler(traits, guard, events).execute(command('Night Vision'))).rejects.toThrow(ConflictError);

      expect(traits.items.get('night-vision')?.category).toBe('senses');
      expect(events.topics).toEqual([]);
    });

    it('rejects a user without the player or admin role', async () => {
      await expect(new CreateTraitHandler(traits, guard, events).execute(command('Blind Fighting', NO_ROLES))).rejects.toThrow(
        ForbiddenError,
      );

      expect(traits.items.size).toBe(1);
      expect(events.topics).toEqual([]);
    });
  });

  describe('UpdateTraitHandler', () => {
    const command = (id: string, user: { id: string; roles: readonly string[] }) =>
      // Only the name and the cost change: the other fields stay undefined.
      new UpdateTraitCommand(id, 'Dark Vision', undefined, undefined, undefined, undefined, 15, undefined, undefined, undefined, user.id, [
        ...user.roles,
      ]);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s update the trait and publishes trait.updated', async (_, user) => {
      const updated = await new UpdateTraitHandler(traits, guard, events).execute(command('night-vision', user));

      expect(updated).toMatchObject({ id: 'night-vision', name: 'Dark Vision', adquisitionCost: 15, category: 'senses', isTalent: true });
      expect(updated.updatedAt).toBeInstanceOf(Date);
      expect(traits.items.get('night-vision')).toBe(updated);
      expect(events.topics).toEqual(['trait.updated']);
    });

    it('forbids another user', async () => {
      await expect(new UpdateTraitHandler(traits, guard, events).execute(command('night-vision', OTHER))).rejects.toThrow(ForbiddenError);

      expect(traits.items.get('night-vision')).toMatchObject({ name: 'Night Vision', adquisitionCost: 10, updatedAt: undefined });
      expect(events.topics).toEqual([]);
    });

    it('fails on an unknown trait', async () => {
      await expect(new UpdateTraitHandler(traits, guard, events).execute(command('missing', OWNER))).rejects.toThrow(NotFoundError);
      expect(events.topics).toEqual([]);
    });
  });

  describe('DeleteTraitHandler', () => {
    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s delete the trait and publishes trait.deleted with its last state', async (_, user) => {
      await new DeleteTraitHandler(traits, guard, events).execute(
        new DeleteTraitCommand('night-vision', undefined, user.id, [...user.roles]),
      );

      expect(traits.items.has('night-vision')).toBe(false);
      expect(events.published.map(p => [p.topic, (p.event.data as TraitProps).id])).toEqual([['trait.deleted', 'night-vision']]);
    });

    it('treats missing roles as none, so the owner can still delete', async () => {
      await new DeleteTraitHandler(traits, guard, events).execute(new DeleteTraitCommand('night-vision', undefined, OWNER.id, undefined));

      expect(traits.items.has('night-vision')).toBe(false);
      expect(events.topics).toEqual(['trait.deleted']);
    });

    it('forbids another user', async () => {
      const handler = new DeleteTraitHandler(traits, guard, events);

      await expect(handler.execute(new DeleteTraitCommand('night-vision', undefined, OTHER.id, [...OTHER.roles]))).rejects.toThrow(
        ForbiddenError,
      );
      expect(traits.items.has('night-vision')).toBe(true);
      expect(events.topics).toEqual([]);
    });

    it('fails on an unknown trait', async () => {
      const handler = new DeleteTraitHandler(traits, guard, events);

      await expect(handler.execute(new DeleteTraitCommand('missing', undefined, OWNER.id, [...OWNER.roles]))).rejects.toThrow(
        NotFoundError,
      );
      expect(events.topics).toEqual([]);
    });
  });

  describe('public reads', () => {
    it.each([
      ['the owner', OWNER],
      ['another user', OTHER],
      ['a user without roles', NO_ROLES],
      ['an admin', ADMIN],
    ])('lets %s read any trait', async (_, user) => {
      const found = await new GetTraitHandler(traits, guard).execute(new GetTraitQuery('night-vision', user.id, [...user.roles]));

      expect(found.id).toBe('night-vision');
    });

    it.each([
      ['another user', OTHER],
      ['an admin', ADMIN],
    ])('lists every trait for %s, without an owner filter', async (_, user) => {
      expect(guard.buildQueryPredicate(user.id, [...user.roles])).toEqual(QueryCriteria.empty());

      const page = await new GetTraitsHandler(traits, guard).execute(new GetTraitsQuery(undefined, 0, 10, user.id, [...user.roles]));
      expect(page.content.map(t => t.id)).toEqual(['night-vision']);
    });
  });
});
