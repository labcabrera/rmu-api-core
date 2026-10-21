import { RaceGuardPort } from '../../application/ports/race-guard.port';
import { Race } from '../../domain/aggregates/race';
import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard';

export class RaceGuardAdapter extends BaseEntityGuard<Race> implements RaceGuardPort {}
