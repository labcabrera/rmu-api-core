import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { CultureProps } from '../../domain/aggregates/culture-props.js';

export interface CultureEventBusPort {
  publish(event: DomainEvent<CultureProps>): void;
}
