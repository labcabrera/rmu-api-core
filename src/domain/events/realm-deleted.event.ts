import { DomainEvent } from './domain-event';
import { Realm } from '../entities/realm';

export class RealmDeletedEvent implements DomainEvent {
  public readonly eventType = 'RealmDeletedEvent';
  public readonly occurredOn: Date;
  public readonly eventVersion = 1;

  constructor(
    public readonly aggregateId: string,
    public readonly realm: Realm,
    public readonly deletedBy: string,
    public readonly reason?: string
  ) {
    this.occurredOn = new Date();
  }

  public toJSON(): Record<string, any> {
    return {
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      eventVersion: this.eventVersion,
      occurredOn: this.occurredOn.toISOString(),
      payload: {
        realm: {
          id: this.realm.id,
          name: this.realm.name,
          description: this.realm.description,
          owner: this.realm.owner,
        },
        deletedBy: this.deletedBy,
        reason: this.reason,
      },
    };
  }
}
