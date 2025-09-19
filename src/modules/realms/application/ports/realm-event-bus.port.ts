import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { RealmProps } from 'src/modules/realms/domain/aggregates/realm';

export interface RealmEventBusPort {
  publish(event: DomainEvent<RealmProps>): void;
}
