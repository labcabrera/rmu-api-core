import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { TraitProps } from '../aggregates/trait-props.js';

export class TraitCreatedEvent extends DomainEvent<TraitProps> {
  constructor(data: TraitProps) {
    super('created', data);
  }
}
