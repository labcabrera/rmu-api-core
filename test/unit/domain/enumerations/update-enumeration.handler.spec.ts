import { describe, expect, it, vi } from 'vitest';
import { UpdateEnumerationHandler } from '../../../../src/modules/enumerations/application/cqrs/handlers/update-enumeration.handler.js';
import { UpdateEnumerationCommand } from '../../../../src/modules/enumerations/application/cqrs/commands/update-enumeration.command.js';
import type { EnumerationRepository } from '../../../../src/modules/enumerations/application/ports/enumeration-repository.port.js';
import type { EnumerationGuardPort } from '../../../../src/modules/enumerations/application/ports/enumeration-guard.port.js';
import { Enumeration } from '../../../../src/modules/enumerations/domain/aggregates/enumeration.js';
import { ConflictError } from '../../../../src/modules/shared/domain/errors/errors.js';

const westron = () =>
  Enumeration.fromProps({
    id: 'enum-1',
    key: 'westron',
    category: 'language',
    realmId: null,
    description: null,
    imageUrl: null,
    owner: 'user-1',
    accessType: 'private',
    entitySource: 'user',
    createdAt: new Date('2026-02-01T00:00:00.000Z'),
    updatedAt: undefined,
  });

const command = (changes: { key?: string; realmId?: string; description?: string | null }) =>
  new UpdateEnumerationCommand('enum-1', changes.key, undefined, changes.realmId, changes.description, undefined, undefined, 'user-1', [
    'rmu-user',
  ]);

const setup = (existing: Enumeration[] = []) => {
  const repository = {
    // Loaded as the repository does: with its version, so hasChanges() compares with it.
    findById: vi.fn(() => Promise.resolve(westron().restoreVersion(0))),
    findByKeyCategoryAndRealm: vi.fn((key: string, category: string, realmId: string | null) =>
      Promise.resolve(existing.find(e => e.key === key && e.category === category && e.realmId === realmId) ?? null),
    ),
    update: vi.fn((entity: Enumeration) => Promise.resolve(entity)),
  };
  const guard = { checkUpdate: vi.fn() };
  const handler = new UpdateEnumerationHandler(repository as unknown as EnumerationRepository, guard as unknown as EnumerationGuardPort);
  return { handler, repository };
};

describe('UpdateEnumerationHandler', () => {
  it('returns the current enumeration without saving when nothing changes', async () => {
    const { handler, repository } = setup();

    const result = await handler.execute(command({ key: 'westron' }));

    expect(result.key).toBe('westron');
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('does not check for a conflict when key, category and realm stay the same', async () => {
    const { handler, repository } = setup([westron()]);

    await handler.execute(command({ description: 'Common speech' }));

    expect(repository.findByKeyCategoryAndRealm).not.toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledOnce();
  });

  it('rejects a key that another enumeration of the same category and realm has', async () => {
    const quenya = Enumeration.fromProps({ ...westron().getProps(), id: 'enum-2', key: 'quenya' });
    const { handler, repository } = setup([quenya]);

    await expect(handler.execute(command({ key: 'quenya' }))).rejects.toThrow(ConflictError);
    expect(repository.findByKeyCategoryAndRealm).toHaveBeenCalledWith('quenya', 'language', null);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('allows a key that only exists in another realm', async () => {
    const quenya = Enumeration.fromProps({ ...westron().getProps(), id: 'enum-2', key: 'quenya', realmId: 'realm-1' });
    const { handler, repository } = setup([quenya]);

    const updated = await handler.execute(command({ key: 'quenya' }));

    expect(updated.key).toBe('quenya');
    expect(repository.update).toHaveBeenCalledOnce();
  });

  it('checks the realm it moves to', async () => {
    const inRealm = Enumeration.fromProps({ ...westron().getProps(), id: 'enum-2', realmId: 'realm-1' });
    const { handler, repository } = setup([inRealm]);

    await expect(handler.execute(command({ realmId: 'realm-1' }))).rejects.toThrow(ConflictError);
    expect(repository.findByKeyCategoryAndRealm).toHaveBeenCalledWith('westron', 'language', 'realm-1');
  });
});
