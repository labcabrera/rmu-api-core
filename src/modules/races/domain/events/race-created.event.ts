import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { RaceProps } from '../aggregates/race';

export class RaceCreatedEvent extends DomainEvent<RaceProps> {
  constructor(data: RaceProps) {
    super('created', data);
  }
}
