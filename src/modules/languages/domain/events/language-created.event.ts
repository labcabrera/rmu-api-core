import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { LanguageProps } from '../aggregates/language.props';

export class LanguageCreatedEvent extends DomainEvent<LanguageProps> {
  constructor(data: LanguageProps) {
    super('created', data);
  }
}
