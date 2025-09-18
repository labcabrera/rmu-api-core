import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Trait } from '../aggregates/trait';

export class TraitCreatedEvent extends DomainEvent<Trait> {
  constructor(data: Trait) {
    super('created', data);
  }
}
