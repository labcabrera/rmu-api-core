import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { TraitProps } from '../../domain/aggregates/trait-props';

export interface TraitEventBusPort {
  publish(event: DomainEvent<TraitProps>): void;
}
