import { DomainEvent } from './domain-event';
import { Realm } from '@domain/entities/realm';

export class RealmUpdatedEvent extends DomainEvent<Realm> {
  constructor(data: Realm) {
    super('RealmUpdatedEvent', data);
  }
}
