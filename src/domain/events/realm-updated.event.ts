import { DomainEvent } from './domain-event';
import { Realm } from '@domain/entities/realm';

export class RealmUpdatedEvent implements DomainEvent {
  public readonly eventType = 'RealmUpdatedEvent';
  public readonly eventVersion = 1;
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly realm: Realm,
    public readonly updatedBy: string,
    public readonly changes?: Partial<Realm>
  ) {
    this.occurredOn = new Date();
  }

  toJSON(): object {
    return {
      realmId: this.aggregateId,
      realmName: this.realm.name,
      description: this.realm.description,
      updatedBy: this.updatedBy,
      owner: this.realm.owner,
      updatedAt: this.realm.updatedAt,
      changes: this.changes || {}
    };
  }
}
