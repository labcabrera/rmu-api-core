import { RaceProps } from 'src/modules/races/domain/aggregates/race';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';

export interface RaceEventBusPort {
  publish(event: DomainEvent<RaceProps>): void;
}
