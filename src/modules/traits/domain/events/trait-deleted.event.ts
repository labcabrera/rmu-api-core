import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { TraitProps } from '../aggregates/trait-props.js';

export class TraitDeletedEvent extends DomainEvent<TraitProps> {
  constructor(data: TraitProps) {
    super('deleted', data);
  }
}
