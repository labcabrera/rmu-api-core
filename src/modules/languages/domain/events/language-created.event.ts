import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { LanguageProps } from '../aggregates/language';

export class LanguageCreatedEvent extends DomainEvent<LanguageProps> {
  constructor(data: LanguageProps) {
    super('created', data);
  }
}
