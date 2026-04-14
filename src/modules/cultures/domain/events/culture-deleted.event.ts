import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { CultureProps } from '../aggregates/culture-props';

export class CultureDeletedEvent extends DomainEvent<CultureProps> {
  constructor(data: CultureProps) {
    super('deleted', data);
  }
}
