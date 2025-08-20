import { Race } from 'src/modules/races/domain/entities/race';

export interface RaceEventProducer {
  created(entity: Race): Promise<void>;
  updated(entity: Race): Promise<void>;
  deleted(entity: Race): Promise<void>;
}
