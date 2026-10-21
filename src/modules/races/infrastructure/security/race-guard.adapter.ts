import type { RaceGuardPort } from '../../application/ports/race-guard.port.js';
import { Race } from '../../domain/aggregates/race.js';
import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';

export class RaceGuardAdapter extends BaseEntityGuard<Race> implements RaceGuardPort {}
