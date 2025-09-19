import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { LanguageProps } from 'src/modules/languages/domain/aggregates/language';

export interface LanguageEventBusPort {
  publish(event: DomainEvent<LanguageProps>): void;
}
