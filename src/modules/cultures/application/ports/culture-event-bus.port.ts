import { DomainEvent } from '../../../shared/domain/events/domain-event';
import { CultureProps } from '../../domain/aggregates/culture-props';

export interface CultureEventBusPort {
  publish(event: DomainEvent<CultureProps>): void;
}
