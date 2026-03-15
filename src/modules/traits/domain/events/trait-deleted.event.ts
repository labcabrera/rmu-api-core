import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { TraitProps } from '../aggregates/trait-props';

export class TraitDeletedEvent extends DomainEvent<TraitProps> {
  constructor(data: TraitProps) {
    super('deleted', data);
  }
}
