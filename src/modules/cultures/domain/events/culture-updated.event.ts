import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { CultureProps } from '../aggregates/culture-props';

export class CultureUpdatedEvent extends DomainEvent<CultureProps> {
  constructor(data: CultureProps) {
    super('updated', data);
  }
}
