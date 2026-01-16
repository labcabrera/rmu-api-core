import { LanguageProps } from 'src/modules/languages/domain/aggregates/language';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';

export interface LanguageEventBusPort {
  publish(event: DomainEvent<LanguageProps>): void;
}
