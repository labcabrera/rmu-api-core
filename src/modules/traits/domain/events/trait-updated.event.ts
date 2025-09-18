import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { TraitProps } from '../aggregates/trait';

export class TraitUpdatedEvent extends DomainEvent<TraitProps> {
  constructor(data: TraitProps) {
    super('updated', data);
  }
}
