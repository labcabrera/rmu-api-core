import type { AccessLevel, AccessSubject } from '../../../shared/domain/services/entity-access.js';

export const REALM_ACCESS = Symbol('RealmAccessPort');

/** An entity that hangs from a realm (spec 069): a race, or an enumeration that may be global (no realm). */
export type RealmChild = AccessSubject & { realmId?: string | null };

/** The access of a user to the realms and to what hangs from them (spec 069, decisions 1 and 8). */
export interface RealmAccessPort {
  /** The level on a realm; `none` when it does not exist. */
  levelOf(realmId: string, userId: string, roles: string[]): Promise<AccessLevel>;

  /** The level on a child: the one on its realm (at most write; read for a system child), or its own without realm. */
  childLevel(child: RealmChild, userId: string, roles: string[]): Promise<AccessLevel>;

  /** childLevel of several children, with one read of their realms. */
  childLevels(children: RealmChild[], userId: string, roles: string[]): Promise<AccessLevel[]>;

  /** The ids of the realms the user reads; null for an admin, who reads all of them. */
  readableRealmIds(userId: string, roles: string[]): Promise<string[] | null>;
}
