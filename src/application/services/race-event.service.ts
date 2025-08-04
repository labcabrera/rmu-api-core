import { Race } from '@domain/entities/race';

export interface RaceEventService {
  created(race: Race, username: string): Promise<void>;

  updated(race: Race, username: string, changes?: Partial<Race>): Promise<void>;

  deleted(raceId: string, race: Race, username: string, reason?: string): Promise<void>;
}
