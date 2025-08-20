import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Race } from '../../../races/domain/entities/race';

export class RaceCreatedEvent extends DomainEvent<Race> {
  constructor(data: Race) {
    super('RaceCreatedEvent', data);
  }
}
