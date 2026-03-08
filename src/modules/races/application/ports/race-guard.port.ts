import { Race } from '../../domain/aggregates/race';

export interface RaceGuardPort {
  checkCreate(userId: string, roles: string[]);
  checkUpdate(race: Race, userId: string, roles: string[]);
}
