import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ManeuverModifier } from '../../../../src/modules/maneuver-modifiers/domain/aggregates/maneuver-modifier.js';
import type { ManeuverModifierProps } from '../../../../src/modules/maneuver-modifiers/domain/aggregates/maneuver-modifier-props.js';
import type { ManeuverModifierRepository } from '../../../../src/modules/maneuver-modifiers/application/ports/maneuver-modifier-repository.port.js';
import { ManeuverModifierGuardAdapter } from '../../../../src/modules/maneuver-modifiers/infrastructure/security/maneuver-modifier-guard.adapter.js';
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateManeuverModifierHandler } from '../../../../src/modules/maneuver-modifiers/application/cqrs/handlers/create-maneuver-modifier.handler.js';
import { CreateManeuverModifierCommand } from '../../../../src/modules/maneuver-modifiers/application/cqrs/commands/create-maneuver-modifier.command.js';
import { UpdateManeuverModifierHandler } from '../../../../src/modules/maneuver-modifiers/application/cqrs/handlers/update-maneuver-modifier.handler.js';
import { UpdateManeuverModifierCommand } from '../../../../src/modules/maneuver-modifiers/application/cqrs/commands/update-maneuver-modifier.command.js';
import { DeleteManeuverModifierHandler } from '../../../../src/modules/maneuver-modifiers/application/cqrs/handlers/delete-maneuver-modifier.handler.js';
import { DeleteManeuverModifierCommand } from '../../../../src/modules/maneuver-modifiers/application/cqrs/commands/delete-maneuver-modifier.command.js';
import { InMemoryRepository } from '../../support/in-memory.repository.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';

class InMemoryManeuverModifierRepository extends InMemoryRepository<ManeuverModifier> implements ManeuverModifierRepository {
  /** Returns a copy, as a database would: the update handler changes the aggregate before checking the key. */
  override findById(id: string): Promise<ManeuverModifier | null> {
    const stored = this.items.get(id);
    return Promise.resolve(stored ? ManeuverModifier.fromProps(structuredClone(stored.getProps())) : null);
  }

  findByKey(key: string): Promise<ManeuverModifier | null> {
    return Promise.resolve([...this.items.values()].find(modifier => modifier.key === key) ?? null);
  }

  findApplicable(skillId: string | undefined, categoryId: string | undefined): Promise<ManeuverModifier[]> {
    return Promise.resolve([...this.items.values()].filter(modifier => modifier.appliesTo(skillId, categoryId)));
  }
}

type User = { id: string; roles: readonly string[] };

const modifier = (overrides: Partial<ManeuverModifierProps> = {}) =>
  ManeuverModifier.fromProps({
    id: 'mod-1',
    key: 'rope',
    scope: { skillIds: ['climbing'] },
    type: 'flag',
    value: 10,
    owner: OWNER.id,
    accessType: 'private',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: undefined,
    ...overrides,
  });

describe('maneuver modifier command handlers', () => {
  let modifiers: InMemoryManeuverModifierRepository;
  const guard = new ManeuverModifierGuardAdapter();

  beforeEach(() => {
    modifiers = new InMemoryManeuverModifierRepository(modifier(), modifier({ id: 'mod-2', key: 'slope', value: -20 }));
  });

  describe('CreateManeuverModifierHandler', () => {
    const command = (key: string, user: User = OWNER) =>
      new CreateManeuverModifierCommand(
        { key, scope: { categoryIds: ['athletic', 'athletic'] }, type: 'number', perUnit: -5, min: 0, max: 4, value: 99 },
        'public',
        user.id,
        [...user.roles],
      );

    const handler = () => new CreateManeuverModifierHandler(modifiers, guard);

    it('stores the normalized modifier owned by the user', async () => {
      const created = await handler().execute(command('  wind  '));

      expect(created.getDefinition()).toEqual({
        key: 'wind',
        scope: { categoryIds: ['athletic'] },
        type: 'number',
        perUnit: -5,
        min: 0,
        max: 4,
        value: undefined,
        options: undefined,
        description: undefined,
      });
      expect(created).toMatchObject({ owner: OWNER.id, accessType: 'public' });
      expect(modifiers.items.get(created.id)).toBe(created);
    });

    it('rejects a key that already exists', async () => {
      await expect(handler().execute(command('rope'))).rejects.toThrow(ConflictError);
      expect(modifiers.items.size).toBe(2);
    });

    it('rejects an invalid definition', async () => {
      const invalid = new CreateManeuverModifierCommand({ key: 'wind', scope: {}, type: 'flag', value: 5 }, 'public', OWNER.id, [
        ...OWNER.roles,
      ]);

      await expect(handler().execute(invalid)).rejects.toThrow(ValidationError);
      expect(modifiers.items.size).toBe(2);
    });

    it('rejects a user without the player or admin role', async () => {
      await expect(handler().execute(command('wind', NO_ROLES))).rejects.toThrow(ForbiddenError);
      expect(modifiers.items.size).toBe(2);
    });
  });

  describe('UpdateManeuverModifierHandler', () => {
    const handler = () => new UpdateManeuverModifierHandler(modifiers, guard);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s update the modifier and stores it', async (_, user) => {
      const updated = await handler().execute(
        new UpdateManeuverModifierCommand('mod-1', { value: 15, accessType: 'public' }, user.id, [...user.roles]),
      );

      expect(updated).toMatchObject({ key: 'rope', value: 15, accessType: 'public' });
      expect(updated.updatedAt).toBeInstanceOf(Date);
      expect(modifiers.items.get('mod-1')?.value).toBe(15);
    });

    it('keeps its own key without reporting a conflict', async () => {
      const updated = await handler().execute(
        new UpdateManeuverModifierCommand('mod-1', { key: 'rope', description: 'A good rope' }, OWNER.id, [...OWNER.roles]),
      );

      expect(updated).toMatchObject({ key: 'rope', description: 'A good rope' });
    });

    it('rejects the key of another modifier without saving', async () => {
      const update = vi.spyOn(modifiers, 'update');

      await expect(
        handler().execute(new UpdateManeuverModifierCommand('mod-1', { key: 'slope' }, OWNER.id, [...OWNER.roles])),
      ).rejects.toThrow(ConflictError);
      expect(update).not.toHaveBeenCalled();
    });

    it('rejects changes that leave an invalid definition without saving', async () => {
      const update = vi.spyOn(modifiers, 'update');

      await expect(
        handler().execute(new UpdateManeuverModifierCommand('mod-1', { type: 'choice' }, OWNER.id, [...OWNER.roles])),
      ).rejects.toThrow(ValidationError);
      expect(update).not.toHaveBeenCalled();
      expect(modifiers.items.get('mod-1')?.type).toBe('flag');
    });

    it('forbids another user', async () => {
      await expect(
        handler().execute(new UpdateManeuverModifierCommand('mod-1', { value: 15 }, OTHER.id, [...OTHER.roles])),
      ).rejects.toThrow(ForbiddenError);
      expect(modifiers.items.get('mod-1')?.value).toBe(10);
    });

    it('fails on an unknown modifier', async () => {
      await expect(
        handler().execute(new UpdateManeuverModifierCommand('missing', { value: 15 }, OWNER.id, [...OWNER.roles])),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('DeleteManeuverModifierHandler', () => {
    const handler = () => new DeleteManeuverModifierHandler(modifiers, guard);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s delete the modifier', async (_, user) => {
      await handler().execute(new DeleteManeuverModifierCommand('mod-1', user.id, [...user.roles]));

      expect([...modifiers.items.keys()]).toEqual(['mod-2']);
    });

    it('forbids another user', async () => {
      await expect(handler().execute(new DeleteManeuverModifierCommand('mod-1', OTHER.id, [...OTHER.roles]))).rejects.toThrow(
        ForbiddenError,
      );
      expect(modifiers.items.has('mod-1')).toBe(true);
    });

    it('fails on an unknown modifier', async () => {
      await expect(handler().execute(new DeleteManeuverModifierCommand('missing', OWNER.id, [...OWNER.roles]))).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
