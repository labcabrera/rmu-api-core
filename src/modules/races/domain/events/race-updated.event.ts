import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { RaceProps } from '../aggregates/race';

export class RaceUpdatedEvent extends DomainEvent<RaceProps> {
  constructor(data: RaceProps) {
    super('updated', data);
  }
}
