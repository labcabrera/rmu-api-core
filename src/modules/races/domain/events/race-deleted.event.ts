import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Race } from '../../../races/domain/entities/race';

export class RaceDeletedEvent extends DomainEvent<Race> {
  constructor(data: Race) {
    super('RaceDeletedEvent', data);
  }
}
