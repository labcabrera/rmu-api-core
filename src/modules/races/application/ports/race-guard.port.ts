import type { RealmChildGuard } from '../../../shared/application/ports/realm-child-guard.port.js';
import { Race } from '../../domain/aggregates/race.js';

export const RACE_GUARD = Symbol('RaceGuardPort');

/** A race follows the access of its realm (spec 069). */
export type RaceGuardPort = RealmChildGuard<Race>;
