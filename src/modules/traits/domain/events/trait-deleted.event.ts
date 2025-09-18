import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { TraitProps } from '../aggregates/trait';

export class TraitDeletedEvent extends DomainEvent<TraitProps> {
  constructor(data: TraitProps) {
    super('deleted', data);
  }
}
