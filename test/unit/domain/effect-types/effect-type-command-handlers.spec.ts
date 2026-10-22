import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EffectType } from '../../../../src/modules/effect-types/domain/aggregates/effect-type.js';
import type { EffectTypeProps } from '../../../../src/modules/effect-types/domain/aggregates/effect-type-props.js';
import { EffectTypeGuardAdapter } from '../../../../src/modules/effect-types/infrastructure/security/effect-type-guard.adapter.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateEffectTypeHandler } from '../../../../src/modules/effect-types/application/cqrs/handlers/create-effect-type.handler.js';
import { CreateEffectTypeCommand } from '../../../../src/modules/effect-types/application/cqrs/commands/create-effect-type.command.js';
import { UpdateEffectTypeHandler } from '../../../../src/modules/effect-types/application/cqrs/handlers/update-effect-type.handler.js';
import { UpdateEffectTypeCommand } from '../../../../src/modules/effect-types/application/cqrs/commands/update-effect-type.command.js';
import { DeleteEffectTypeHandler } from '../../../../src/modules/effect-types/application/cqrs/handlers/delete-effect-type.handler.js';
import { DeleteEffectTypeCommand } from '../../../../src/modules/effect-types/application/cqrs/commands/delete-effect-type.command.js';
import { InMemoryRepository } from '../../support/in-memory.repository.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';

type User = { id: string; roles: readonly string[] };

const effectType = (overrides: Partial<EffectTypeProps> = {}) =>
  EffectType.fromProps({
    id: 'stunned',
    isPersistent: false,
    isStackable: true,
    value: 'forbidden',
    modifier: 'optional',
    rounds: 'required',
    text: 'forbidden',
    location: 'forbidden',
    delay: 'optional',
    owner: OWNER.id,
    accessType: 'private',
    entitySource: 'system',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: undefined,
    ...overrides,
  });

describe('effect type command handlers', () => {
  let effectTypes: InMemoryRepository<EffectType>;
  const guard = new EffectTypeGuardAdapter();

  beforeEach(() => {
    effectTypes = new InMemoryRepository(effectType());
  });

  describe('CreateEffectTypeHandler', () => {
    const command = (id: string, user: User = OWNER) =>
      new CreateEffectTypeCommand(
        id,
        true,
        false,
        'required',
        'forbidden',
        'optional',
        'forbidden',
        'required',
        'forbidden',
        'public',
        user.id,
        [...user.roles],
      );

    const handler = () => new CreateEffectTypeHandler(effectTypes, guard);

    it('stores a user effect type owned by the user', async () => {
      const created = await handler().execute(command('bleeding'));

      expect(created).toMatchObject({
        id: 'bleeding',
        isPersistent: true,
        isStackable: false,
        value: 'required',
        location: 'required',
        owner: OWNER.id,
        accessType: 'public',
        entitySource: 'user',
      });
      expect(effectTypes.items.get('bleeding')).toBe(created);
    });

    it('rejects an id that already exists', async () => {
      await expect(handler().execute(command('stunned'))).rejects.toThrow(ConflictError);
      expect(effectTypes.items.get('stunned')?.isPersistent).toBe(false);
    });

    it('rejects a user without the player or admin role', async () => {
      await expect(handler().execute(command('bleeding', NO_ROLES))).rejects.toThrow(ForbiddenError);
      expect(effectTypes.items.has('bleeding')).toBe(false);
    });
  });

  describe('UpdateEffectTypeHandler', () => {
    const command = (id: string, user: User, changes: { isPersistent?: boolean; isStackable?: boolean } = {}) =>
      new UpdateEffectTypeCommand(
        id,
        changes.isPersistent,
        changes.isStackable,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        user.id,
        [...user.roles],
      );

    const handler = () => new UpdateEffectTypeHandler(effectTypes, guard);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s update the effect type and stores it', async (_, user) => {
      const updated = await handler().execute(command('stunned', user, { isPersistent: true }));

      expect(updated).toMatchObject({ isPersistent: true, isStackable: true, rounds: 'required' });
      expect(updated.updatedAt).toBeInstanceOf(Date);
      expect(effectTypes.items.get('stunned')?.isPersistent).toBe(true);
    });

    it('returns the current effect type without saving when nothing changes', async () => {
      const update = vi.spyOn(effectTypes, 'update');

      const result = await handler().execute(command('stunned', OWNER, { isPersistent: false, isStackable: true }));

      expect(update).not.toHaveBeenCalled();
      expect(result).toBe(effectTypes.items.get('stunned'));
      expect(result.updatedAt).toBeUndefined();
    });

    it('forbids another user', async () => {
      await expect(handler().execute(command('stunned', OTHER, { isPersistent: true }))).rejects.toThrow(ForbiddenError);
      expect(effectTypes.items.get('stunned')?.isPersistent).toBe(false);
    });

    it('fails on an unknown effect type', async () => {
      await expect(handler().execute(command('missing', OWNER, { isPersistent: true }))).rejects.toThrow(NotFoundError);
    });
  });

  describe('DeleteEffectTypeHandler', () => {
    const handler = () => new DeleteEffectTypeHandler(effectTypes, guard);

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s delete the effect type and returns its last state', async (_, user) => {
      const deleted = await handler().execute(new DeleteEffectTypeCommand('stunned', user.id, [...user.roles]));

      expect(deleted.id).toBe('stunned');
      expect(effectTypes.items.has('stunned')).toBe(false);
    });

    it('forbids another user', async () => {
      await expect(handler().execute(new DeleteEffectTypeCommand('stunned', OTHER.id, [...OTHER.roles]))).rejects.toThrow(ForbiddenError);
      expect(effectTypes.items.has('stunned')).toBe(true);
    });

    it('fails on an unknown effect type', async () => {
      await expect(handler().execute(new DeleteEffectTypeCommand('missing', OWNER.id, [...OWNER.roles]))).rejects.toThrow(NotFoundError);
    });
  });
});
