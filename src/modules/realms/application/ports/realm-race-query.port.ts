export const REALM_RACE_QUERY = Symbol('RealmRaceQueryPort');

/**
 * What the realms module needs to know about the races of a realm (spec 063). The races module imports this one, so
 * the realms module cannot import it back: the adapter reads the `races` collection directly.
 */
export interface RealmRaceQueryPort {
  /** How many races of the realm are rulebook content (`entitySource: 'system'`). */
  countSystemRaces(realmId: string): Promise<number>;
}
