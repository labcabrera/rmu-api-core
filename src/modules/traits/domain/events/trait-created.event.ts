import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { TraitProps } from '../aggregates/trait';

export class TraitCreatedEvent extends DomainEvent<TraitProps> {
  constructor(data: TraitProps) {
    super('created', data);
  }
}
