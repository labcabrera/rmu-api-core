import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Realm } from '../aggregates/realm';

export class RealmDeletedEvent extends DomainEvent<Realm> {
  constructor(data: Realm) {
    super('deleted', data);
  }
}
