import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { Race } from '../../domain/aggregates/race.js';

export const RACE_GUARD = Symbol('RaceGuardPort');

export type RaceGuardPort = EntityGuard<Race>;
