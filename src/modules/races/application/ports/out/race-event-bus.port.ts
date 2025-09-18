import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Race } from 'src/modules/races/domain/aggregates/race';

export interface RaceEventBusPort {
  publish(event: DomainEvent<Race>): void;
}
