import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { RaceProps } from '../aggregates/race';

export class RaceDeletedEvent extends DomainEvent<RaceProps> {
  constructor(data: RaceProps) {
    super('deleted', data);
  }
}
