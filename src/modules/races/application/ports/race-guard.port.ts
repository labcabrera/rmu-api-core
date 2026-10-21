import type { EntityGuard } from '../../../shared/application/ports/entity-guard.js';
import { Race } from '../../domain/aggregates/race.js';

export type RaceGuardPort = EntityGuard<Race>;
