import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Race } from '../aggregates/race';

export class RaceCreatedEvent extends DomainEvent<Race> {
  constructor(data: Race) {
    super('created', data);
  }
}
