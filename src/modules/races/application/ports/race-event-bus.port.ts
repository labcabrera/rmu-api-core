import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { RaceProps } from '../../domain/aggregates/race-props';

export interface RaceEventBusPort {
  publish(event: DomainEvent<RaceProps>): void;
}
