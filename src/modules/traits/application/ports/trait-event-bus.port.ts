import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';

export interface TraitEventBusPort {
  publish(event: DomainEvent<Trait>): void;
}
