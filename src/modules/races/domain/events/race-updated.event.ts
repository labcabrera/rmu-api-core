import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Race } from '../../../races/domain/entities/race';

export class RaceUpdatedEvent extends DomainEvent<Race> {
  constructor(data: Race) {
    super('RaceUpdatedEvent', data);
  }
}
