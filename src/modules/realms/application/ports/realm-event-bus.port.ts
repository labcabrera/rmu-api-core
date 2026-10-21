import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { RealmProps } from '../../domain/aggregates/realm-props.js';

export interface RealmEventBusPort {
  publish(event: DomainEvent<RealmProps>): void;
}
