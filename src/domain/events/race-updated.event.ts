import { DomainEvent } from './domain-event';
import { Race } from '@domain/entities/race';

export class RaceUpdatedEvent extends DomainEvent<Race> {
  constructor(data: Race) {
    super('RaceUpdatedEvent', data);
  }
}
