import { beforeEach, describe, expect, it } from 'vitest';
import { Race } from '../../../../src/modules/races/domain/aggregates/race.js';
import type { RaceProps } from '../../../../src/modules/races/domain/aggregates/race-props.js';
import type { RaceRepository } from '../../../../src/modules/races/application/ports/race-repository.port.js';
import { RaceResistances } from '../../../../src/modules/races/domain/value-objects/race-resistances.vo.js';
import { RaceGuardAdapter } from '../../../../src/modules/races/infrastructure/security/race-guard.adapter.js';
import { Realm } from '../../../../src/modules/realms/domain/aggregates/realm.js';
import type { RealmRepository } from '../../../../src/modules/realms/application/ports/realm-repository.port.js';
import type { AccessType } from '../../../../src/modules/shared/domain/entities/access-type.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../../src/modules/shared/domain/errors/errors.js';
import { CreateRaceHandler } from '../../../../src/modules/races/application/cqrs/handlers/create-race.handler.js';
import { CreateRaceCommand } from '../../../../src/modules/races/application/cqrs/commands/create-race.command.js';
import { UpdateRaceHandler } from '../../../../src/modules/races/application/cqrs/handlers/update-race.handler.js';
import { UpdateRaceCommand } from '../../../../src/modules/races/application/cqrs/commands/update-race.command.js';
import { DeleteRaceHandler } from '../../../../src/modules/races/application/cqrs/handlers/delete-race.handler.js';
import { DeleteRaceCommand } from '../../../../src/modules/races/application/cqrs/commands/delete-race.command.js';
import { AddRaceTraitHandler } from '../../../../src/modules/races/application/cqrs/handlers/add-race-trait.handler.js';
import { AddRaceTraitCommand } from '../../../../src/modules/races/application/cqrs/commands/add-race-trait.command.js';
import { DeleteRaceTraitHandler } from '../../../../src/modules/races/application/cqrs/handlers/delete-race-trait.handler.js';
import { DeleteRaceTraitCommand } from '../../../../src/modules/races/application/cqrs/commands/delete-race-trait.command.js';
import { AddRaceSkillBonusHandler } from '../../../../src/modules/races/application/cqrs/handlers/add-race-skill-bonus.handler.js';
import { AddRaceSkillBonusCommand } from '../../../../src/modules/races/application/cqrs/commands/add-race-skill-bonus.command.js';
import { DeleteRaceSkillBonusHandler } from '../../../../src/modules/races/application/cqrs/handlers/delete-race-skill-bonus.handler.js';
import { DeleteRaceSkillBonusCommand } from '../../../../src/modules/races/application/cqrs/commands/delete-race-skill-bonus.command.js';
import { SyncRaceRealmHandler } from '../../../../src/modules/races/application/cqrs/handlers/sync-race-realm.handler.js';
import { SyncRaceRealmCommand } from '../../../../src/modules/races/application/cqrs/commands/sync-race-realm.command.js';
import { DeleteRacesByRealmHandler } from '../../../../src/modules/races/application/cqrs/handlers/delete-races-by-realm.handler.js';
import { DeleteRacesByRealmCommand } from '../../../../src/modules/races/application/cqrs/commands/delete-races-by-realm.command.js';
import { InMemoryRepository } from '../../support/in-memory.repository.js';
import { RecordingEventPublisher } from '../../support/recording-event-publisher.js';
import { ADMIN, NO_ROLES, OTHER, OWNER } from '../../support/users.js';
import { RealmGuardAdapter } from '../../../../src/modules/realms/infrastructure/security/realm-guard.adapter.js';

class InMemoryRaceRepository extends InMemoryRepository<Race> implements RaceRepository {
  findByRealmId(realmId: string): Promise<Race[]> {
    return Promise.resolve([...this.items.values()].filter(race => race.realmId === realmId));
  }

  updateRealmInfo(realmId: string, _realmName: string, owner: string, accessType: AccessType): Promise<void> {
    for (const race of this.items.values()) {
      if (race.realmId === realmId) this.items.set(race.id, Race.fromProps({ ...race.getProps(), owner, accessType }));
    }
    return Promise.resolve();
  }
}

const sex = { male: 1, female: 1 };
const stats = { ag: 0, co: 0, em: 0, in: 0, me: 0, pr: 0, qu: 0, re: 0, sd: 0, st: 0 };

const race = (overrides: Partial<RaceProps> = {}) =>
  Race.fromProps({
    id: 'race-1',
    name: 'Human',
    archetype: 'human',
    realmId: 'realm-1',
    sizeId: 'medium',
    stats,
    resistances: new RaceResistances(0, 0, 0, 0, 0, 0, 0),
    averageHeight: sex,
    averageWeight: sex,
    strideBonus: 0,
    enduranceBonus: 0,
    recoveryMultiplier: 1,
    baseHits: 10,
    baseDevPoints: 60,
    baseAt: 1,
    talents: [],
    traits: [],
    skillBonuses: [],
    defaultLanguage: null,
    description: null,
    imageUrl: null,
    owner: OWNER.id,
    accessType: 'private',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: null,
    ...overrides,
  });

const realm = Realm.fromProps({
  id: 'realm-1',
  name: 'Middle-earth',
  magicPresence: 'limited',
  shortDescription: undefined,
  description: undefined,
  imageUrl: undefined,
  owner: OWNER.id,
  accessType: 'private',
  generic: false,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: undefined,
});

describe('race command handlers', () => {
  let races: InMemoryRaceRepository;
  let realms: InMemoryRepository<Realm>;
  let events: RecordingEventPublisher;
  const guard = new RaceGuardAdapter();

  beforeEach(() => {
    races = new InMemoryRaceRepository(race());
    realms = new InMemoryRepository(realm);
    events = new RecordingEventPublisher();
  });

  const realmRepository = () => realms as unknown as RealmRepository;

  describe('CreateRaceHandler', () => {
    const command = (realmId: string, user: { id: string; roles: readonly string[] } = OWNER) =>
      new CreateRaceCommand(
        'Elf',
        'elf',
        realmId,
        'medium',
        stats,
        new RaceResistances(0, 0, 0, 0, 0, 0, 0),
        sex,
        sex,
        0,
        0,
        1,
        10,
        60,
        1,
        [],
        [],
        null,
        null,
        null,
        user.id,
        [...user.roles],
      );

    const handler = () => new CreateRaceHandler(races, realmRepository(), guard, new RealmGuardAdapter(), events);

    it('creates the race with the realm access type, owned by the user, and publishes race.created', async () => {
      const created = await handler().execute(command('realm-1'));

      expect(created).toMatchObject({ name: 'Elf', realmId: 'realm-1', owner: OWNER.id, accessType: 'private' });
      expect(races.items.get(created.id)).toBe(created);
      expect(events.topics).toEqual(['race.created']);
    });

    it('lets an admin create a race in the realm of another user', async () => {
      const created = await handler().execute(command('realm-1', ADMIN));

      expect(created).toMatchObject({ realmId: 'realm-1', owner: ADMIN.id });
      expect(events.topics).toEqual(['race.created']);
    });

    it('rejects an unknown realm', async () => {
      await expect(handler().execute(command('missing'))).rejects.toThrow(ValidationError);
      expect(events.topics).toEqual([]);
    });

    it('rejects a user without the player or admin role', async () => {
      await expect(handler().execute(command('realm-1', NO_ROLES))).rejects.toThrow(ForbiddenError);
      expect(races.items.size).toBe(1);
      expect(events.topics).toEqual([]);
    });

    it.each(['private', 'public'] as const)('rejects another user in a %s realm of the owner', async accessType => {
      realms.items.set('realm-1', Realm.fromProps({ ...realm.getProps(), accessType }));

      await expect(handler().execute(command('realm-1', OTHER))).rejects.toThrow(ForbiddenError);
      expect(races.items.size).toBe(1);
      expect(events.topics).toEqual([]);
    });
  });

  describe('UpdateRaceHandler', () => {
    const command = (id: string, user: { id: string; roles: readonly string[] }) =>
      // Only the name changes: the other 17 fields stay undefined.
      new UpdateRaceCommand(
        id,
        'High Elf',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
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

    it.each([
      ['the owner', OWNER],
      ['an admin', ADMIN],
    ])('lets %s update the race and publishes race.updated', async (_, user) => {
      const updated = await new UpdateRaceHandler(races, guard, events).execute(command('race-1', user));

      expect(updated.name).toBe('High Elf');
      expect(events.topics).toEqual(['race.updated']);
    });

    it('forbids another user', async () => {
      await expect(new UpdateRaceHandler(races, guard, events).execute(command('race-1', OTHER))).rejects.toThrow(ForbiddenError);
      expect(races.items.get('race-1')?.name).toBe('Human');
      expect(events.topics).toEqual([]);
    });

    it('fails on an unknown race', async () => {
      await expect(new UpdateRaceHandler(races, guard, events).execute(command('missing', OWNER))).rejects.toThrow(NotFoundError);
    });
  });

  describe('DeleteRaceHandler', () => {
    it('deletes the race and publishes race.deleted with its last state', async () => {
      await new DeleteRaceHandler(races, guard, events).execute(new DeleteRaceCommand('race-1', OWNER.id, [...OWNER.roles]));

      expect(races.items.has('race-1')).toBe(false);
      expect(events.published.map(p => [p.topic, (p.event.data as RaceProps).id])).toEqual([['race.deleted', 'race-1']]);
    });

    it('forbids another user', async () => {
      const handler = new DeleteRaceHandler(races, guard, events);
      await expect(handler.execute(new DeleteRaceCommand('race-1', OTHER.id, [...OTHER.roles]))).rejects.toThrow(ForbiddenError);
      expect(races.items.has('race-1')).toBe(true);
    });
  });

  describe('traits and skill bonuses', () => {
    it('adds and removes a trait, publishing race.updated each time', async () => {
      const added = await new AddRaceTraitHandler(races, guard, events).execute(
        new AddRaceTraitCommand('race-1', 'trait-1', undefined, false, undefined, undefined, OWNER.id, [...OWNER.roles]),
      );
      const traitId = added.traits[0].id;

      const removed = await new DeleteRaceTraitHandler(races, guard, events).execute(
        new DeleteRaceTraitCommand('race-1', traitId, OWNER.id, [...OWNER.roles]),
      );

      expect(removed.traits).toEqual([]);
      expect(events.topics).toEqual(['race.updated', 'race.updated']);
    });

    it('adds and removes a skill bonus', async () => {
      await new AddRaceSkillBonusHandler(races, guard, events).execute(
        new AddRaceSkillBonusCommand('race-1', 'skill-1', null, 5, OWNER.id, [...OWNER.roles]),
      );
      const removed = await new DeleteRaceSkillBonusHandler(races, guard, events).execute(
        new DeleteRaceSkillBonusCommand('race-1', 'skill-1', null, OWNER.id, [...OWNER.roles]),
      );

      expect(removed.skillBonuses).toEqual([]);
      expect(events.topics).toEqual(['race.updated', 'race.updated']);
    });

    it('forbids another user to change the traits', async () => {
      const handler = new AddRaceTraitHandler(races, guard, events);
      const command = new AddRaceTraitCommand('race-1', 'trait-1', undefined, false, undefined, undefined, OTHER.id, [...OTHER.roles]);

      await expect(handler.execute(command)).rejects.toThrow(ForbiddenError);
    });

    it('fails to remove a trait the race does not have, without publishing', async () => {
      const handler = new DeleteRaceTraitHandler(races, guard, events);

      await expect(handler.execute(new DeleteRaceTraitCommand('race-1', 'missing', OWNER.id, [...OWNER.roles]))).rejects.toThrow(
        NotFoundError,
      );
      expect(events.topics).toEqual([]);
    });
  });

  describe('realm events', () => {
    it('copies the owner and access type of the realm to its races', async () => {
      races = new InMemoryRaceRepository(race(), race({ id: 'race-2', realmId: 'realm-2' }));

      await new SyncRaceRealmHandler(races).execute(new SyncRaceRealmCommand('realm-1', 'Middle-earth', 'new-owner', 'public'));

      expect(races.items.get('race-1')).toMatchObject({ owner: 'new-owner', accessType: 'public' });
      expect(races.items.get('race-2')).toMatchObject({ owner: OWNER.id, accessType: 'private' });
    });

    it('deletes the races of a deleted realm, once', async () => {
      races = new InMemoryRaceRepository(race(), race({ id: 'race-2' }), race({ id: 'race-3', realmId: 'realm-2' }));
      const handler = new DeleteRacesByRealmHandler(races, events);

      await handler.execute(new DeleteRacesByRealmCommand('realm-1'));
      await handler.execute(new DeleteRacesByRealmCommand('realm-1'));

      expect([...races.items.keys()]).toEqual(['race-3']);
      expect(events.topics).toEqual(['race.deleted', 'race.deleted']);
    });
  });
});
