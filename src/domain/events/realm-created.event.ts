import { DomainEvent } from './domain-event';
import { Realm } from '@domain/entities/realm';

export class RealmCreatedEvent extends DomainEvent<Realm> {
  constructor(data: Realm) {
    super('RealmCreatedEvent', data);
  }
}
