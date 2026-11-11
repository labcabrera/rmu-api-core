import { Realm } from '../../domain/aggregates/realm.js';
import type { BaseRepository } from '../../../shared/application/ports/base-repository.port.js';
import type { QueryCriteria } from '../../../shared/application/criteria/query-criteria.js';

export const REALM_REPOSITORY = Symbol('RealmRepository');

export interface RealmRepository extends BaseRepository<Realm> {
  /** The realms with these ids that exist, in any order. */
  findByIds(ids: string[]): Promise<Realm[]>;

  /** The ids of the realms that match the access filter of a listing (spec 069): the realms a user reads. */
  findIdsMatching(filter: QueryCriteria): Promise<string[]>;

  /** The realms of `ownerId` shared with `userId` (spec 069, revocation when a friendship ends). */
  findOwnedSharedWith(ownerId: string, userId: string): Promise<Realm[]>;

  /** Writes the new name of a user in the realms shared with them. */
  renameShareUser(userId: string, name: string): Promise<void>;

  /** The realms that record a strategic game (spec 071): one, or more while the game moves to another realm. */
  findByGameId(gameId: string): Promise<Realm[]>;
}
