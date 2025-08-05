import { DomainEvent } from './domain-event';
import { Race } from '@domain/entities/race';

export class RaceDeletedEvent extends DomainEvent<Race> {
  constructor(data: Race) {
    super('RaceDeletedEvent', data);
  }
}
