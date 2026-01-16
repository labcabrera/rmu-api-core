import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { LanguageProps } from '../aggregates/language';

export class LanguageUpdatedEvent extends DomainEvent<LanguageProps> {
  constructor(data: LanguageProps) {
    super('updated', data);
  }
}
