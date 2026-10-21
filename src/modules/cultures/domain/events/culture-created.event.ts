import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { CultureProps } from '../aggregates/culture-props.js';

export class CultureCreatedEvent extends DomainEvent<CultureProps> {
  constructor(data: CultureProps) {
    super('created', data);
  }
}
