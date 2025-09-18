import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Race } from '../aggregates/race';

export class RaceUpdatedEvent extends DomainEvent<Race> {
  constructor(data: Race) {
    super('updated', data);
  }
}
