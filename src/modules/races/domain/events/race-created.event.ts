import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { RaceProps } from '../aggregates/race-props.js';

export class RaceCreatedEvent extends DomainEvent<RaceProps> {
  constructor(data: RaceProps) {
    super('created', data);
  }
}
