import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Realm } from '../aggregates/realm';

export class RealmUpdatedEvent extends DomainEvent<Realm> {
  constructor(data: Realm) {
    super('updated', data);
  }
}
