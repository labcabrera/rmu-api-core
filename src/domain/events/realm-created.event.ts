import { DomainEvent } from './domain-event';
import { Realm } from '@domain/entities/realm';

export class RealmCreatedEvent implements DomainEvent {
  public readonly eventType = 'RealmCreatedEvent';
  public readonly eventVersion = 1;
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly realm: Realm,
    public readonly createdBy: string
  ) {
    this.occurredOn = new Date();
  }

  toJSON(): object {
    return {
      realmId: this.aggregateId,
      realmName: this.realm.name,
      description: this.realm.description,
      createdBy: this.createdBy,
      owner: this.realm.owner,
      createdAt: this.realm.createdAt,
    };
  }
}
