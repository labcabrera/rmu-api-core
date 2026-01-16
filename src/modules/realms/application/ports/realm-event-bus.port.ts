import { RealmProps } from 'src/modules/realms/domain/aggregates/realm';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';

export interface RealmEventBusPort {
  publish(event: DomainEvent<RealmProps>): void;
}
