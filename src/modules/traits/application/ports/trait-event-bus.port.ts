import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { TraitProps } from '../../domain/aggregates/trait-props.js';

export interface TraitEventBusPort {
  publish(event: DomainEvent<TraitProps>): void;
}
