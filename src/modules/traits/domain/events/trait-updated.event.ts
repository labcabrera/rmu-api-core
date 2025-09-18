import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Trait } from '../aggregates/trait';

export class TraitUpdatedEvent extends DomainEvent<Trait> {
  constructor(data: Trait) {
    super('updated', data);
  }
}
