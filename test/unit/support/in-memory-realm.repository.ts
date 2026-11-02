import type { RealmRepository } from '../../../src/modules/realms/application/ports/realm-repository.port.js';
import { Realm } from '../../../src/modules/realms/domain/aggregates/realm.js';
import type { QueryCriteria } from '../../../src/modules/shared/application/criteria/query-criteria.js';
import { InMemoryRepository } from './in-memory.repository.js';

/** The value of a dotted path; through an array it collects the values of its items (as Mongo matches them). */
const valuesAt = (source: unknown, path: string[]): unknown[] => {
  if (path.length === 0) return Array.isArray(source) ? source : [source];
  if (Array.isArray(source)) return source.flatMap(item => valuesAt(item, path));
  if (source === null || source === undefined) return [undefined];
  return valuesAt((source as Record<string, unknown>)[path[0]], path.slice(1));
};

/** Evaluates a QueryCriteria on the props of an aggregate, as the Mongo mapper would. */
export const matchesCriteria = (props: object, criteria: QueryCriteria): boolean => {
  switch (criteria.type) {
    case 'empty':
      return true;
    case 'eq':
      return valuesAt(props, criteria.field.split('.')).some(value => (value ?? null) === criteria.value);
    case 'in':
      return valuesAt(props, criteria.field.split('.')).some(value => criteria.values.includes((value ?? null) as never));
    case 'anyOf':
      return criteria.criteria.some(item => matchesCriteria(props, item));
    case 'allOf':
      return criteria.criteria.every(item => matchesCriteria(props, item));
  }
};

export class InMemoryRealmRepository extends InMemoryRepository<Realm> implements RealmRepository {
  findByIds(ids: string[]): Promise<Realm[]> {
    return Promise.resolve(ids.map(id => this.items.get(id)).filter((realm): realm is Realm => !!realm));
  }

  findIdsMatching(filter: QueryCriteria): Promise<string[]> {
    return Promise.resolve([...this.items.values()].filter(realm => matchesCriteria(realm.getProps(), filter)).map(realm => realm.id));
  }

  findOwnedSharedWith(ownerId: string, userId: string): Promise<Realm[]> {
    return Promise.resolve(
      [...this.items.values()].filter(realm => realm.owner === ownerId && realm.shares.some(s => s.userId === userId)),
    );
  }
}
