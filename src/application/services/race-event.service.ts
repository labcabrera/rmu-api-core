import { Race } from '@domain/entities/race';

/**
 * Service for handling race-specific domain events
 */
export interface RaceEventService {
  /**
   * Handle race created event
   */
  created(race: Race, username: string): Promise<void>;

  /**
   * Handle race updated event
   */
  updated(race: Race, username: string, changes?: Partial<Race>): Promise<void>;

  /**
   * Handle race deleted event
   */
  deleted(raceId: string, race: Race, username: string, reason?: string): Promise<void>;
}
