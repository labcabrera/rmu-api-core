import { DomainEvent } from './domain-event';
import { Race } from '@domain/entities/race';

export class RaceCreatedEvent extends DomainEvent<Race> {
  constructor(data: Race) {
    super('RaceCreatedEvent', data);
  }
}
