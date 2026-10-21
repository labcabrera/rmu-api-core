import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { RaceProps } from '../../domain/aggregates/race-props.js';

export interface RaceEventBusPort {
  publish(event: DomainEvent<RaceProps>): void;
}
