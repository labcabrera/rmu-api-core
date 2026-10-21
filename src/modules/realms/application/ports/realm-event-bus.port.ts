import { DomainEvent } from '../../../shared/domain/events/domain-event';
import { RealmProps } from '../../domain/aggregates/realm-props';

export interface RealmEventBusPort {
  publish(event: DomainEvent<RealmProps>): void;
}
