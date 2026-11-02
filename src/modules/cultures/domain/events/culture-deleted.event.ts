import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { CultureProps } from '../aggregates/culture-props.js';

export class CultureDeletedEvent extends DomainEvent<CultureProps> {
  constructor(data: CultureProps) {
    super('deleted', data);
  }
}
