import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { TraitProps } from 'src/modules/traits/domain/aggregates/trait';

export interface TraitEventBusPort {
  publish(event: DomainEvent<TraitProps>): void;
}
