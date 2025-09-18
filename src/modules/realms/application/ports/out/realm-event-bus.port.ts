import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';

export interface RealmEventBusPort {
  publish(event: DomainEvent<Realm>): void;

  updated(entity: Realm): Promise<void>;
  created(entity: Realm): Promise<void>;
  deleted(entity: Realm): Promise<void>;
}
