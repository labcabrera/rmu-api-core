import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { LanguageProps } from '../../domain/aggregates/language.props';

export interface LanguageEventBusPort {
  publish(event: DomainEvent<LanguageProps>): void;
}
