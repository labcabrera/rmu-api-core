import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Realm } from '../../../realms/domain/entities/realm';

export class RealmCreatedEvent extends DomainEvent<Realm> {
  constructor(data: Realm) {
    super('RealmCreatedEvent', data);
  }
}
