import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { LanguageProps } from '../aggregates/language';

export class LanguageDeletedEvent extends DomainEvent<LanguageProps> {
  constructor(data: LanguageProps) {
    super('deleted', data);
  }
}
