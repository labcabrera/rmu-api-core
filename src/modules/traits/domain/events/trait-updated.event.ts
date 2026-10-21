import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { TraitProps } from '../aggregates/trait-props.js';

export class TraitUpdatedEvent extends DomainEvent<TraitProps> {
  constructor(data: TraitProps) {
    super('updated', data);
  }
}
