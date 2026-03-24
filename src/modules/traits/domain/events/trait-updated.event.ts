import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { TraitProps } from '../aggregates/trait-props';

export class TraitUpdatedEvent extends DomainEvent<TraitProps> {
  constructor(data: TraitProps) {
    super('updated', data);
  }
}
