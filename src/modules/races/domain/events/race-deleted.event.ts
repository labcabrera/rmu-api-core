import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Race } from '../aggregates/race';

export class RaceDeletedEvent extends DomainEvent<Race> {
  constructor(data: Race) {
    super('deleted', data);
  }
}
